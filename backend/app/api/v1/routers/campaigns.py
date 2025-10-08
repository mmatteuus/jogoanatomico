from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.dependencies import get_current_user, get_db_session, require_roles
from app.domain.models import CampaignProgressStatus, UserRole
from app.domain.schemas.campaign import CampaignCreate, CampaignProgressUpdate, CampaignRead
from app.domain.services import campaigns as campaign_service

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("", response_model=list[CampaignRead])
async def list_campaigns(session: AsyncSession = Depends(get_db_session)):
    campaigns = await campaign_service.list_campaigns(session)
    return [CampaignRead.model_validate(campaign) for campaign in campaigns]


@router.post("", response_model=CampaignRead, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    payload: CampaignCreate,
    session: AsyncSession = Depends(get_db_session),
    _: object = Depends(require_roles(UserRole.teacher, UserRole.admin)),
):
    campaign = await campaign_service.create_campaign(session, payload)
    return CampaignRead.model_validate(campaign)


@router.post("/lessons/{lesson_id}/progress", status_code=status.HTTP_202_ACCEPTED)
async def update_lesson_progress(
    lesson_id: uuid.UUID,
    update: CampaignProgressUpdate,
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    progress = await campaign_service.record_lesson_progress(
        session, current_user, lesson_id, update.status, update.score
    )
    return {"status": progress.status, "score": progress.score}
