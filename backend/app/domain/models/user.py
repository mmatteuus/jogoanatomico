import enum
import uuid
from typing import Optional

from sqlalchemy import Column
from sqlalchemy.orm import Mapped
from sqlalchemy.types import JSON
from sqlmodel import Field, Relationship

from .base import BaseSQLModel


class UserRole(str, enum.Enum):
    student = "student"
    professional = "professional"
    teacher = "teacher"
    admin = "admin"


class ProfileType(str, enum.Enum):
    student = "student"
    professional = "professional"
    professor = "professor"
    guest = "guest"


class User(BaseSQLModel, table=True):
    __tablename__ = "users"

    email: Optional[str] = Field(default=None, unique=True, index=True)
    hashed_password: str = Field(nullable=False)
    display_name: str = Field(nullable=False, index=True)
    role: UserRole = Field(default=UserRole.student, nullable=False, index=True)
    profile_type: ProfileType = Field(default=ProfileType.student, nullable=False)
    xp: int = Field(default=0, nullable=False)
    streak: int = Field(default=0, nullable=False)
    energy: int = Field(default=5, nullable=False)
    elo_rating: int = Field(default=1200, nullable=False)
    preferences: dict = Field(sa_column=Column(JSON, nullable=False, server_default="{}"))
    organization_id: Optional[uuid.UUID] = Field(default=None, foreign_key="organizations.id")

    progress_records: Mapped[list["UserSystemProgress"]] = Relationship(back_populates="user")
    missions: Mapped[list["MissionProgress"]] = Relationship(back_populates="user")
    classrooms: Mapped[list["ClassroomMembership"]] = Relationship(back_populates="user")


from .progress import UserSystemProgress  # noqa: E402
from .mission import MissionProgress  # noqa: E402
from .organization import ClassroomMembership  # noqa: E402
