"""Knowledge graph API endpoint."""

from fastapi import APIRouter

router = APIRouter(prefix="/api/graph", tags=["graph"])


@router.get("/")
async def get_graph():
    """Return the full knowledge graph as serialized JSON."""
    from main import envelope, graph_service

    return envelope(data=graph_service.serialize())
