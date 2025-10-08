from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.dependencies import get_current_user, get_db_session
from app.domain.schemas.user import PreferenceUpdateRequest, ProfileSummary, UserRead, UserUpdate
from app.domain.services import missions as mission_service
from app.domain.services import progress as progress_service
from app.domain.services import users as user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def read_current_user(current_user=Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


@router.patch("/me", response_model=UserRead)
async def update_current_user(
    payload: UserUpdate,
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    user = await user_service.update_user(session, current_user, payload)
    return UserRead.model_validate(user)


@router.post("/me/preferences", response_model=UserRead)
async def update_preferences(
    payload: PreferenceUpdateRequest,
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    update_payload = UserUpdate(preferences=payload.model_dump(exclude_none=True))
    user = await user_service.update_user(session, current_user, update_payload)
    return UserRead.model_validate(user)


@router.get("/me/summary", response_model=ProfileSummary)
async def get_profile_summary(
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    missions = await mission_service.get_active_missions(session, current_user)
    systems = await progress_service.get_system_progress(session, current_user)
    return ProfileSummary(
        user=UserRead.model_validate(current_user),
        systems_progress={record.system.value: record.completion_rate for record in systems},
        daily_missions_completed=sum(1 for mission in missions if mission.status.name == "completed"),
        weekly_missions_completed=sum(
            1
            for mission in missions
            if mission.mission.frequency.value == "weekly" and mission.status.name == "completed"
        ),
    )
