import uuid
from typing import List

from sqlalchemy import Column, Integer
from sqlalchemy.orm import Mapped, selectinload
from sqlmodel import Field, Relationship

from .base import BaseSQLModel


class Campaign(BaseSQLModel, table=True):
    __tablename__ = "campaigns"

    title: str = Field(nullable=False, unique=True)
    description: str = Field(nullable=False)
    anatomy_system: str = Field(nullable=False, index=True)
    recommended_level: int = Field(default=1)

    lessons: Mapped[list["CampaignLesson"]] = Relationship(back_populates="campaign")


class CampaignLesson(BaseSQLModel, table=True):
    __tablename__ = "campaign_lessons"

    campaign_id: uuid.UUID = Field(foreign_key="campaigns.id", nullable=False)
    order: int = Field(sa_column=Column("lesson_order", Integer, nullable=False, index=True))
    title: str = Field(nullable=False)
    content_url: str = Field(nullable=False)
    duration_minutes: int = Field(default=10)
    xp_reward: int = Field(default=100)

    campaign: Mapped["Campaign"] = Relationship(back_populates="lessons")
    progress_entries: Mapped[list["CampaignProgress"]] = Relationship(back_populates="lesson")


from .progress import CampaignProgress  # noqa: E402
