"""GENIUS Act compliance checking service.

Validates a stablecoin issuer's reserve report against the 7 core requirements
of the GENIUS Act (Jul 2025), which mandates standardized reserve disclosure for
all Permitted Payment Stablecoin Issuers (PPSIs).

Usage:
    from app.services.compliance import check_compliance
    result = await check_compliance(reserve_data)
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.reserve import ReserveData

# ---------------------------------------------------------------------------
# GENIUS Act requirement registry
# ---------------------------------------------------------------------------
GENIUS_ACT_REQUIREMENTS: dict[str, str] = {
    "xbrl_format": "Reserve report must be in XBRL format (not PDF-only)",
    "update_frequency": "Reports must be updated at least monthly",
    "asset_disclosure": "Each reserve asset class must be disclosed individually",
    "custodian_disclosure": "All custodian banks must be named with percentages",
    "maturity_disclosure": "Weighted average maturity must be reported",
    "liquidity_coverage": "Liquid assets must cover at least 100% of outstanding tokens",
    "audit_attestation": "Independent auditor attestation required quarterly",
}

# Liquid asset classes for the liquidity coverage check
_LIQUID_ASSET_CLASSES = {"t_bills", "money_market", "mmf", "demand_deposits", "repo"}
