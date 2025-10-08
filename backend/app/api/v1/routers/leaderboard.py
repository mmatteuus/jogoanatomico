from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.dependencies import get_current_user, get_db_session
from app.domain.models import LeaderboardScope
from app.domain.schemas.leaderboard import LeaderboardEntry, LeaderboardResponse
from app.domain.services import leaderboard as leaderboard_service

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("", response_model=LeaderboardResponse)
async def get_leaderboard(
    scope: LeaderboardScope = LeaderboardScope.global_scope,
    reference_id: str | None = None,
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    snapshot = await leaderboard_service.latest_snapshot(session, scope, reference_id)
    if not snapshot:
        snapshot = await leaderboard_service.build_leaderboard(session, scope, reference_id)
    entries = [LeaderboardEntry(**entry) for entry in snapshot.data.get("entries", [])]
    return LeaderboardResponse(
        scope=scope,
        entries=entries,
        generated_at=snapshot.generated_at.isoformat(),
    )
