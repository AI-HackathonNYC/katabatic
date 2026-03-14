"""Real-time SSE streaming for live score updates."""

import asyncio
import json
from datetime import datetime, timezone
from typing import AsyncGenerator

from fastapi import APIRouter

router = APIRouter(tags=["streaming"])

# ---------------------------------------------------------------------------
# In-memory pub/sub — one asyncio.Queue per connected subscriber.
# publish_score_update() fans out to every queue; each SSE connection drains
# its own queue via score_event_generator().
# ---------------------------------------------------------------------------
score_subscribers: list[asyncio.Queue] = []


async def publish_score_update(update: dict) -> None:
    """Broadcast a score update to all active SSE subscribers.

    Called by the scoring engine after every scoring run.
    update must contain at least: stablecoin, score, level,
    latency_hours, coverage_ratio, timestamp.
    """
    for queue in score_subscribers:
        await queue.put(update)
