from __future__ import annotations

import uuid
from datetime import datetime, timedelta
from typing import List

from sqlalchemy.orm import selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.domain.models import Mission, MissionFrequency, MissionProgress, MissionProgressStatus, User

RESET_DELTA = {
    MissionFrequency.daily: timedelta(days=1),
    MissionFrequency.weekly: timedelta(weeks=1),
}


async def get_active_missions(session: AsyncSession, user: User) -> List[MissionProgress]:
    result = await session.exec(
        select(MissionProgress)
        .where(MissionProgress.user_id == user.id)
        .options(selectinload(MissionProgress.mission))
        .join(Mission)
        .order_by(Mission.title)
    )
    missions = result.all()

    now = datetime.utcnow()
    for progress in missions:
        if progress.expires_at and progress.expires_at < now:
            progress.progress = 0
            progress.status = MissionProgressStatus.pending
            progress.expires_at = now + RESET_DELTA[progress.mission.frequency]
            session.add(progress)
    await session.commit()
    return missions


async def seed_default_missions(session: AsyncSession, user: User) -> List[MissionProgress]:
    existing = await get_active_missions(session, user)
    if existing:
        return existing

    defaults = [
        {
            "title": "Realize um Sprint",
            "description": "Conclua um sprint de 60 segundos",
            "xp_reward": 100,
            "target": 1,
            "frequency": MissionFrequency.daily,
            "category": "gameplay",
        },
        {
            "title": "Estude um Sistema",
            "description": "Complete uma licao da campanha",
            "xp_reward": 150,
            "target": 1,
            "frequency": MissionFrequency.daily,
            "category": "learning",
        },
        {
            "title": "Compartilhe com a turma",
            "description": "Envie feedback para sua turma",
            "xp_reward": 80,
            "target": 1,
            "frequency": MissionFrequency.weekly,
            "category": "community",
        },
    ]

    mission_progresses: List[MissionProgress] = []
    now = datetime.utcnow()
    for mission_data in defaults:
        existing_mission = await session.exec(
            select(Mission).where(Mission.title == mission_data["title"])
        )
        mission = existing_mission.first()
        if not mission:
            mission = Mission(**mission_data)
            session.add(mission)
            await session.flush()
        progress = MissionProgress(
            mission_id=mission.id,
            user_id=user.id,
            expires_at=now + RESET_DELTA[mission.frequency],
        )
        session.add(progress)
        mission_progresses.append(progress)
    await session.commit()
    for progress in mission_progresses:
        await session.refresh(progress)
    return mission_progresses


async def increment_progress(
    session: AsyncSession, user: User, mission_id: uuid.UUID, increment: int
) -> MissionProgress:
    result = await session.exec(
        select(MissionProgress).where(
            MissionProgress.user_id == user.id, MissionProgress.mission_id == mission_id
        ).options(selectinload(MissionProgress.mission))
    )
    progress = result.first()
    if not progress:
        raise ValueError("Mission not assigned to user")

    progress.progress = min(progress.progress + increment, progress.mission.target)
    if progress.progress >= progress.mission.target:
        progress.status = MissionProgressStatus.completed
    progress.touch()
    session.add(progress)
    await session.commit()
    await session.refresh(progress)
    return progress
