
import enum
import uuid
from datetime import datetime

from sqlalchemy import Column
from sqlalchemy.types import JSON
from sqlmodel import Field

from .base import BaseSQLModel


class LeaderboardScope(str, enum.Enum):
    global_scope = "global"
    organization = "organization"
    classroom = "classroom"
    friends = "friends"


class LeaderboardSnapshot(BaseSQLModel, table=True):
    __tablename__ = "leaderboard_snapshots"

    scope: LeaderboardScope = Field(nullable=False, index=True)
    reference_id: uuid.UUID | None = Field(default=None, index=True)
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    data: dict = Field(sa_column=Column(JSON, nullable=False, server_default="{}"))
