from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlmodel import Field, Relationship

from .base import BaseSQLModel


class MissionFrequency(str, enum.Enum):
    daily = "daily"
    weekly = "weekly"


class Mission(BaseSQLModel, table=True):
    __tablename__ = "missions"

    title: str = Field(nullable=False)
    description: str = Field(nullable=False)
    xp_reward: int = Field(default=50, nullable=False)
    target: int = Field(default=1, nullable=False)
    frequency: MissionFrequency = Field(default=MissionFrequency.daily, nullable=False)
    category: str = Field(default="general", nullable=False)

    progresses: list["MissionProgress"] = Relationship(back_populates="mission")


class MissionProgressStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"


class MissionProgress(BaseSQLModel, table=True):
    __tablename__ = "mission_progress"

    mission_id: uuid.UUID = Field(foreign_key="missions.id", nullable=False)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    progress: int = Field(default=0, nullable=False)
    status: MissionProgressStatus = Field(default=MissionProgressStatus.pending, nullable=False)
    expires_at: datetime | None = Field(default=None)

    mission: Mission = Relationship(back_populates="progresses")
    user: "User" = Relationship(back_populates="missions")


from .user import User  # noqa: E402
