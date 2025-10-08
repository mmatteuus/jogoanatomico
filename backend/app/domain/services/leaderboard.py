from __future__ import annotations

from datetime import datetime
import uuid
from typing import List

from sqlalchemy import desc, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.domain.models import LeaderboardScope, LeaderboardSnapshot, User
from app.domain.schemas.leaderboard import LeaderboardEntry


async def build_leaderboard(
    session: AsyncSession,
    scope: LeaderboardScope,
    reference_id: str | None = None,
    limit: int = 20,
) -> LeaderboardSnapshot:
    query = select(User)
    reference_uuid = None
    if reference_id and scope in {LeaderboardScope.organization, LeaderboardScope.classroom}:
        reference_uuid = uuid.UUID(reference_id)
    if scope == LeaderboardScope.organization and reference_uuid:
        query = query.where(User.organization_id == reference_uuid)

    query = query.order_by(desc(User.xp)).limit(limit)

    result = await session.exec(query)
    users = result.all()

    entries: List[LeaderboardEntry] = []
    for index, user in enumerate(users, start=1):
        entries.append(
            LeaderboardEntry(
                user_id=str(user.id),
                display_name=user.display_name,
                xp=user.xp,
                streak=user.streak,
                rank=index,
                avatar=user.preferences.get("avatar"),
            )
        )

    snapshot = LeaderboardSnapshot(
        scope=scope,
        reference_id=reference_uuid,
        generated_at=datetime.utcnow(),
        data={"entries": [entry.model_dump() for entry in entries]},
    )
    session.add(snapshot)
    await session.commit()
    await session.refresh(snapshot)
    return snapshot


async def latest_snapshot(
    session: AsyncSession, scope: LeaderboardScope, reference_id: str | None = None
) -> LeaderboardSnapshot | None:
    query = (
        select(LeaderboardSnapshot)
        .where(LeaderboardSnapshot.scope == scope)
        .order_by(desc(LeaderboardSnapshot.generated_at))
    )
    if reference_id and scope in {LeaderboardScope.organization, LeaderboardScope.classroom}:
        query = query.where(LeaderboardSnapshot.reference_id == uuid.UUID(reference_id))
    result = await session.exec(query)
    return result.first()
