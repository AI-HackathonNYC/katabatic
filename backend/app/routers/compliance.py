"""GENIUS Act compliance API endpoints."""

from fastapi import APIRouter, HTTPException

from app.models.reserve import ReserveData
from app.services.compliance import GENIUS_ACT_REQUIREMENTS, check_compliance

router = APIRouter(prefix="/api/compliance", tags=["compliance"])


@router.post("/check")
async def compliance_check(reserve: ReserveData):
    """Check a reserve report against all 7 GENIUS Act requirements.

    Accepts a ReserveData JSON body and returns a ComplianceResult with:
    - score: 0–100 percentage of requirements met
    - compliant: true only if all 7 requirements pass
    - checks: per-requirement pass/fail with explanatory details
    - recommendations: actionable list for any failing requirements

    USDC (genius_act_attestation source) will pass most checks.
    USDT (pdf_attestation, opaque counterparties) will fail several.
    """
    from main import envelope

    try:
        result = await check_compliance(reserve)
        return envelope(data=result.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/requirements")
async def get_requirements():
    """Return the full list of GENIUS Act requirements checked by this service.

    Each entry maps a requirement ID to its plain-English description.
    """
    from main import envelope

    return envelope(
        data=[
            {"requirement": req_id, "description": description}
            for req_id, description in GENIUS_ACT_REQUIREMENTS.items()
        ]
    )
