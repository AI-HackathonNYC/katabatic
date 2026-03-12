"""Stress score API endpoints."""

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/stress-scores", tags=["scores"])


@router.get("/")
async def get_all_stress_scores():
    """Return stress scores for all tracked stablecoins."""
    from main import envelope, scoring_engine

    if scoring_engine is None:
        raise HTTPException(status_code=503, detail="Scoring engine not initialized")

    results = await scoring_engine.compute_all_scores()
    return envelope(data=[r.model_dump() for r in results])


@router.get("/{stablecoin}")
async def get_stress_score(stablecoin: str):
    """Return detailed stress score for a single stablecoin."""
    from main import envelope, scoring_engine

    if scoring_engine is None:
        raise HTTPException(status_code=503, detail="Scoring engine not initialized")

    try:
        result = await scoring_engine.compute_stress_score(stablecoin.upper())
        return envelope(data=result.model_dump())
    except (ValueError, FileNotFoundError) as e:
        raise HTTPException(status_code=404, detail=str(e))
