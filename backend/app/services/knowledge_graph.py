"""Knowledge graph service — NetworkX graph mapping stablecoins to banks, data centers, and jurisdictions."""

import math
from typing import Optional

import networkx as nx

from app.models.reserve import ReserveData
from app.services.registry import DATA_CENTER_CORRIDORS


class KnowledgeGraphService:
    """Builds and queries the stablecoin → bank → data center → jurisdiction graph."""

    def __init__(self) -> None:
        self.graph = nx.DiGraph()

    def build_from_reserves(self, reserves: dict[str, ReserveData]) -> None:
        """Build graph from a dict of symbol → ReserveData."""
        self.graph.clear()

        # Add data center corridor nodes
        for corridor_id, info in DATA_CENTER_CORRIDORS.items():
            self.graph.add_node(
                f"dc:{corridor_id}",
                type="datacenter",
                name=info["name"],
                corridor_id=corridor_id,
                lat=info["lat"],
                lng=info["lng"],
                radius_km=info["radius_km"],
            )

        for symbol, reserve in reserves.items():
            # Add stablecoin node
            self.graph.add_node(
                f"coin:{symbol}",
                type="stablecoin",
                symbol=symbol,
                issuer=reserve.issuer,
                total_reserves=reserve.total_reserves,
                wam_days=reserve.weighted_avg_maturity_days,
            )

            for cp in reserve.counterparties:
                bank_id = f"bank:{cp.bank_name}"

                # Add bank node (update if already exists from another stablecoin)
                self.graph.add_node(
                    bank_id,
                    type="bank",
                    name=cp.bank_name,
                    city=cp.city,
                    state=cp.state,
                    lat=cp.lat,
                    lng=cp.lng,
                    fdic_cert=cp.fdic_cert,
                    fdic_ltv_ratio=cp.fdic_ltv_ratio,
                    liquidity_coverage=cp.liquidity_coverage,
                    maturity_days=cp.maturity_days,
                )

                # Edge: stablecoin → bank
                self.graph.add_edge(
                    f"coin:{symbol}",
                    bank_id,
                    type="holds_reserves_at",
                    percentage=cp.percentage,
                    asset_class=cp.asset_class,
                    maturity_days=cp.maturity_days,
                )

                # Edge: bank → data center corridor
                if cp.data_center_corridor:
                    dc_id = f"dc:{cp.data_center_corridor}"
                    if dc_id in self.graph:
                        self.graph.add_edge(
                            bank_id, dc_id, type="processes_ops_via"
                        )

                # Add state node and edge
                if cp.state and len(cp.state) <= 3:
                    state_id = f"state:{cp.state}"
                    self.graph.add_node(state_id, type="state", name=cp.state)
                    self.graph.add_edge(bank_id, state_id, type="located_in")

    def get_exposed_stablecoins(self, state: str) -> list[str]:
        """Return stablecoin symbols with counterparties in a given state."""
        exposed = []
        state_id = f"state:{state}"
        if state_id not in self.graph:
            return exposed

        # Find banks in this state
        banks_in_state = [
            src for src, dst, data in self.graph.edges(data=True)
            if dst == state_id and data.get("type") == "located_in"
        ]

        # Find stablecoins connected to those banks
        for bank_id in banks_in_state:
            for src, dst, data in self.graph.edges(data=True):
                if dst == bank_id and data.get("type") == "holds_reserves_at":
                    symbol = self.graph.nodes[src].get("symbol")
                    if symbol and symbol not in exposed:
                        exposed.append(symbol)
        return exposed

    def get_duration_risk(self, symbol: str) -> float:
        """Compute weighted average maturity across all counterparties for a stablecoin."""
        coin_id = f"coin:{symbol}"
        if coin_id not in self.graph:
            return 0.0

        total_weight = 0.0
        weighted_maturity = 0.0
        for _, dst, data in self.graph.edges(coin_id, data=True):
            if data.get("type") == "holds_reserves_at":
                pct = data.get("percentage", 0) / 100.0
                mat = data.get("maturity_days", 0)
                weighted_maturity += pct * mat
                total_weight += pct

        return weighted_maturity / total_weight if total_weight > 0 else 0.0

    def get_concentration_hhi(self, symbol: str) -> float:
        """Compute Herfindahl-Hirschman Index of counterparty concentration (0-10000)."""
        coin_id = f"coin:{symbol}"
        if coin_id not in self.graph:
            return 0.0

        shares = []
        for _, _, data in self.graph.edges(coin_id, data=True):
            if data.get("type") == "holds_reserves_at":
                shares.append(data.get("percentage", 0))

        if not shares:
            return 0.0

        return sum(s ** 2 for s in shares)

    def get_ops_risk_by_state(self, state: str) -> list[dict]:
        """Find data center corridors that could be affected by events in a state."""
        affected = []
        # Find banks in this state
        state_id = f"state:{state}"
        if state_id not in self.graph:
            return affected

        for src, dst, data in self.graph.edges(data=True):
            if dst == state_id and data.get("type") == "located_in":
                bank_id = src
                # Check if this bank has DC corridor edges
                for _, dc_dst, dc_data in self.graph.edges(bank_id, data=True):
                    if dc_data.get("type") == "processes_ops_via":
                        dc_node = self.graph.nodes[dc_dst]
                        affected.append({
                            "corridor_id": dc_node.get("corridor_id"),
                            "corridor_name": dc_node.get("name"),
                            "bank": self.graph.nodes[bank_id].get("name"),
                            "state": state,
                        })
        return affected

    def get_corridors_in_radius(self, lat: float, lng: float, radius_km: float) -> list[dict]:
        """Find data center corridors within radius of a point (e.g., storm center)."""
        affected = []
        for node_id, data in self.graph.nodes(data=True):
            if data.get("type") != "datacenter":
                continue
            dc_lat = data.get("lat", 0)
            dc_lng = data.get("lng", 0)
            dist = _haversine(lat, lng, dc_lat, dc_lng)
            if dist <= radius_km:
                affected.append({
                    "corridor_id": data.get("corridor_id"),
                    "name": data.get("name"),
                    "distance_km": round(dist, 1),
                })
        return affected

    def serialize(self) -> dict:
        """Serialize graph to JSON-compatible format for frontend."""
        nodes = []
        for node_id, data in self.graph.nodes(data=True):
            nodes.append({"id": node_id, **data})

        edges = []
        for src, dst, data in self.graph.edges(data=True):
            edges.append({"source": src, "target": dst, **data})

        return {"nodes": nodes, "edges": edges}


def _haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Compute distance in km between two lat/lng points."""
    R = 6371.0
    lat1_r, lat2_r = math.radians(lat1), math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_r) * math.cos(lat2_r) * math.sin(dlng / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
