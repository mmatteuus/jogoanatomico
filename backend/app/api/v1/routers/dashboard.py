from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.dependencies import get_current_user, get_db_session
from app.domain.schemas.dashboard import DashboardSummary, DailyMissionSummary, SystemProgressSummary
from app.domain.services import missions as mission_service
from app.domain.services import progress as progress_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
) -> DashboardSummary:
    missions = await mission_service.get_active_missions(session, current_user)
    systems = await progress_service.get_system_progress(session, current_user)

    mission_payload = [
        DailyMissionSummary(
            mission_id=str(progress.mission_id),
            title=progress.mission.title,
            progress=progress.progress,
            target=progress.mission.target,
            xp_reward=progress.mission.xp_reward,
            expires_at=progress.expires_at,
        )
        for progress in missions
    ]

    system_payload = [
        SystemProgressSummary(system=record.system, completion_rate=record.completion_rate)
        for record in systems
    ]

    return DashboardSummary(
        xp=current_user.xp,
        streak=current_user.streak,
        energy=current_user.energy,
        elo_rating=current_user.elo_rating,
        missions=mission_payload,
        systems=system_payload,
        active_campaign=None,
    )
