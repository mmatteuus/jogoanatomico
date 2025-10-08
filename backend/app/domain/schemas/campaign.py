from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel

from app.domain.models.progress import CampaignProgressStatus
from .common import IdentifierModel


class CampaignLessonBase(BaseModel):
    order: int
    title: str
    content_url: str
    duration_minutes: int
    xp_reward: int


class CampaignLessonCreate(CampaignLessonBase):
    pass


class CampaignLessonRead(IdentifierModel, CampaignLessonBase):
    pass


class CampaignBase(BaseModel):
    title: str
    description: str
    anatomy_system: str
    recommended_level: int


class CampaignCreate(CampaignBase):
    lessons: List[CampaignLessonCreate]


class CampaignRead(IdentifierModel, CampaignBase):
    lessons: List[CampaignLessonRead]


class CampaignProgressRead(IdentifierModel):
    lesson_id: str
    status: CampaignProgressStatus
    score: Optional[float]


class CampaignProgressUpdate(BaseModel):
    status: CampaignProgressStatus
    score: Optional[float] = None
