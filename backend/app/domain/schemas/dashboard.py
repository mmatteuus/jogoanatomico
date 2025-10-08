from __future__ import annotations

from datetime import datetime
from typing import Dict, List

from pydantic import BaseModel

from app.domain.models.progress import AnatomySystem


class DailyMissionSummary(BaseModel):
    mission_id: str
    title: str
    progress: int
    target: int
    xp_reward: int
    expires_at: datetime | None


class SystemProgressSummary(BaseModel):
    system: AnatomySystem
    completion_rate: float


class DashboardSummary(BaseModel):
    xp: int
    streak: int
    energy: int
    elo_rating: int
    missions: List[DailyMissionSummary]
    systems: List[SystemProgressSummary]
    active_campaign: dict | None
