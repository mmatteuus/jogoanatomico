from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.dependencies import get_current_user, get_db_session
from app.domain.schemas.mission import MissionProgressRead, MissionProgressUpdate, MissionRead
from app.domain.services import missions as mission_service

router = APIRouter(prefix="/missions", tags=["missions"])


@router.get("/daily", response_model=list[MissionProgressRead])
async def list_daily_missions(
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    missions = await mission_service.get_active_missions(session, current_user)
    return [
        MissionProgressRead(
            id=progress.id,
            created_at=progress.created_at,
            updated_at=progress.updated_at,
            mission=MissionRead.model_validate(progress.mission),
            progress=progress.progress,
            status=progress.status,
            expires_at=progress.expires_at,
        )
        for progress in missions
    ]


@router.post("/{mission_id}/progress", response_model=MissionProgressRead)
async def update_mission_progress(
    mission_id: uuid.UUID,
    payload: MissionProgressUpdate,
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    try:
        progress = await mission_service.increment_progress(
            session, current_user, mission_id, payload.increment
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return MissionProgressRead(
        id=progress.id,
        created_at=progress.created_at,
        updated_at=progress.updated_at,
        mission=MissionRead.model_validate(progress.mission),
        progress=progress.progress,
        status=progress.status,
        expires_at=progress.expires_at,
    )
