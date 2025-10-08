from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.domain.models.mission import MissionFrequency, MissionProgressStatus
from .common import IdentifierModel


class MissionBase(BaseModel):
    title: str
    description: str
    xp_reward: int
    target: int
    frequency: MissionFrequency
    category: str


class MissionCreate(MissionBase):
    pass


class MissionRead(IdentifierModel, MissionBase):
    pass


class MissionProgressRead(IdentifierModel):
    mission: MissionRead
    progress: int
    status: MissionProgressStatus
    expires_at: Optional[datetime]


class MissionProgressUpdate(BaseModel):
    increment: int = 1
