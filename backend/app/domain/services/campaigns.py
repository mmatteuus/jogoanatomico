from __future__ import annotations

import uuid
from typing import List

from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.domain.models import Campaign, CampaignLesson, CampaignProgress, CampaignProgressStatus, User
from app.domain.schemas.campaign import CampaignCreate


async def list_campaigns(session: AsyncSession) -> List[Campaign]:
    result = await session.exec(select(Campaign))
    return result.unique().all()


async def get_campaign(session: AsyncSession, campaign_id: uuid.UUID) -> Campaign | None:
    result = await session.exec(select(Campaign).where(Campaign.id == campaign_id))
    campaign = result.first()
    if campaign:
        await session.refresh(campaign)
    return campaign


async def create_campaign(session: AsyncSession, payload: CampaignCreate) -> Campaign:
    campaign = Campaign(
        title=payload.title,
        description=payload.description,
        anatomy_system=payload.anatomy_system,
        recommended_level=payload.recommended_level,
    )
    session.add(campaign)
    await session.flush()

    for lesson_payload in payload.lessons:
        lesson = CampaignLesson(
            campaign_id=campaign.id,
            order=lesson_payload.order,
            title=lesson_payload.title,
            content_url=lesson_payload.content_url,
            duration_minutes=lesson_payload.duration_minutes,
            xp_reward=lesson_payload.xp_reward,
        )
        session.add(lesson)
    await session.commit()
    await session.refresh(campaign)
    return campaign


async def get_user_campaign_progress(
    session: AsyncSession, user: User, campaign: Campaign
) -> List[CampaignProgress]:
    result = await session.exec(
        select(CampaignProgress)
        .where(CampaignProgress.user_id == user.id)
        .join(CampaignLesson)
        .where(CampaignLesson.campaign_id == campaign.id)
    )
    progress = result.all()
    return progress


async def record_lesson_progress(
    session: AsyncSession,
    user: User,
    lesson_id: uuid.UUID,
    status: CampaignProgressStatus,
    score: float | None = None,
) -> CampaignProgress:
    result = await session.exec(
        select(CampaignProgress).where(
            CampaignProgress.user_id == user.id, CampaignProgress.lesson_id == lesson_id
        )
    )
    progress = result.first()
    if not progress:
        progress = CampaignProgress(user_id=user.id, lesson_id=lesson_id)

    progress.status = status
    progress.score = score
    progress.touch()

    session.add(progress)
    await session.commit()
    await session.refresh(progress)
    return progress
