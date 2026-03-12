"""Weather alert API endpoints."""

from fastapi import APIRouter

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("/active")
async def get_active_weather():
    """Return active NOAA weather alerts for all states where counterparties are located."""
    from main import envelope, weather_provider, graph_service
    from app.services.registry import get_all_states

    states = get_all_states()
    all_alerts: dict = {}
    ops_impact: list = []

    for state in states:
        try:
            result = await weather_provider.resolve(f"alerts:{state}")
            if result.data and result.data.get("alert_count", 0) > 0:
                all_alerts[state] = {
                    "alerts": result.data["alerts"],
                    "alert_count": result.data["alert_count"],
                    "resolution_source": result.source,
                }
                # Check ops impact for severe alerts
                for alert in result.data["alerts"]:
                    if alert.get("severity") in ("Extreme", "Severe"):
                        affected = graph_service.get_ops_risk_by_state(state)
                        for item in affected:
                            if item not in ops_impact:
                                ops_impact.append(item)
        except Exception:
            continue

    return envelope(data={
        "weather_alerts": all_alerts,
        "ops_impact": ops_impact,
        "states_checked": list(states),
    })
