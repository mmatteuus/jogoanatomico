import enum
import uuid
from datetime import date

from sqlalchemy.orm import Mapped
from sqlmodel import Field, Relationship

from .base import BaseSQLModel


class AnatomySystem(str, enum.Enum):
    skeletal = "skeletal"
    muscular = "muscular"
    nervous = "nervous"
    vascular = "vascular"
    lymphatic = "lymphatic"
    respiratory = "respiratory"


class UserSystemProgress(BaseSQLModel, table=True):
    __tablename__ = "user_system_progress"

    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)
    system: AnatomySystem = Field(nullable=False, index=True)
    completion_rate: float = Field(default=0.0)
    last_interaction: date | None = Field(default=None)

    user: Mapped["User"] = Relationship(back_populates="progress_records")


class CampaignProgressStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"


class CampaignProgress(BaseSQLModel, table=True):
    __tablename__ = "campaign_progress"

    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)
    lesson_id: uuid.UUID = Field(foreign_key="campaign_lessons.id", nullable=False)
    status: CampaignProgressStatus = Field(default=CampaignProgressStatus.not_started)
    score: float | None = Field(default=None)

    lesson: Mapped["CampaignLesson"] = Relationship(back_populates="progress_entries")
    user: Mapped["User"] = Relationship()


class QuizMode(str, enum.Enum):
    sprint = "sprint"
    campaign = "campaign"
    osce = "osce"
    srs = "srs"


class QuizSession(BaseSQLModel, table=True):
    __tablename__ = "quiz_sessions"

    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)
    mode: QuizMode = Field(nullable=False, index=True)
    system: str | None = Field(default=None, index=True)
    score: float = Field(default=0.0)
    duration_seconds: int = Field(default=0)
    completed: bool = Field(default=False)

    attempts: Mapped[list["QuizAttempt"]] = Relationship(back_populates="session")
    user: Mapped["User"] = Relationship()


class QuizAttempt(BaseSQLModel, table=True):
    __tablename__ = "quiz_attempts"

    session_id: uuid.UUID = Field(foreign_key="quiz_sessions.id", nullable=False)
    question_id: uuid.UUID = Field(foreign_key="quiz_questions.id", nullable=False)
    selected_option_id: uuid.UUID | None = Field(default=None, foreign_key="quiz_options.id")
    is_correct: bool = Field(default=False)

    session: Mapped["QuizSession"] = Relationship(back_populates="attempts")
    question: Mapped["QuizQuestion"] = Relationship()


from .user import User  # noqa: E402  (circular references)
from .campaign import CampaignLesson  # noqa: E402
from .quiz import QuizQuestion  # noqa: E402
