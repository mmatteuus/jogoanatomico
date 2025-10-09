from __future__ import annotations

from datetime import date

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.domain.models import AnatomySystem, User, UserSystemProgress


async def ensure_system_progress(session: AsyncSession, user: User) -> None:
    result = await session.exec(select(UserSystemProgress).where(UserSystemProgress.user_id == user.id))
    existing = {record.system for record in result.all()}
    for system in AnatomySystem:
        if system not in existing:
            progress = UserSystemProgress(user_id=user.id, system=system, completion_rate=0.0)
            session.add(progress)
    await session.commit()


async def update_system_progress(
    session: AsyncSession, user: User, system: AnatomySystem, delta: float
) -> UserSystemProgress:
    result = await session.exec(
        select(UserSystemProgress).where(
            UserSystemProgress.user_id == user.id, UserSystemProgress.system == system
        )
    )
    record = result.first()
    if not record:
        record = UserSystemProgress(user_id=user.id, system=system, completion_rate=0.0)
    record.completion_rate = max(0.0, min(1.0, record.completion_rate + delta))
    record.last_interaction = date.today()
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record


async def get_system_progress(session: AsyncSession, user: User) -> list[UserSystemProgress]:
    result = await session.exec(select(UserSystemProgress).where(UserSystemProgress.user_id == user.id))
    return result.all()
