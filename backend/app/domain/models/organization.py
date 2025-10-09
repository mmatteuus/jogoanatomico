import uuid
from typing import List

from sqlalchemy.orm import Mapped
from sqlmodel import Field, Relationship

from .base import BaseSQLModel


class Organization(BaseSQLModel, table=True):
    __tablename__ = "organizations"

    name: str = Field(nullable=False, unique=True)
    kind: str = Field(default="school", nullable=False)

    classrooms: Mapped[list["Classroom"]] = Relationship(back_populates="organization")


class Classroom(BaseSQLModel, table=True):
    __tablename__ = "classrooms"

    organization_id: uuid.UUID = Field(foreign_key="organizations.id", nullable=False)
    name: str = Field(nullable=False)
    invite_code: str = Field(nullable=False, unique=True, index=True)

    organization: Mapped["Organization"] = Relationship(back_populates="classrooms")
    memberships: Mapped[list["ClassroomMembership"]] = Relationship(back_populates="classroom")


class ClassroomMembership(BaseSQLModel, table=True):
    __tablename__ = "classroom_memberships"

    classroom_id: uuid.UUID = Field(foreign_key="classrooms.id", nullable=False)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    role: str = Field(default="student", nullable=False)

    classroom: Mapped["Classroom"] = Relationship(back_populates="memberships")
    user: Mapped["User"] = Relationship(back_populates="classrooms")


from .user import User  # noqa: E402
