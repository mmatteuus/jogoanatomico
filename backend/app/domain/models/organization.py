from __future__ import annotations

import uuid

from sqlmodel import Field, Relationship

from .base import BaseSQLModel


class Organization(BaseSQLModel, table=True):
    __tablename__ = "organizations"

    name: str = Field(nullable=False, unique=True)
    kind: str = Field(default="school", nullable=False)

    classrooms: list["Classroom"] = Relationship(back_populates="organization")


class Classroom(BaseSQLModel, table=True):
    __tablename__ = "classrooms"

    organization_id: uuid.UUID = Field(foreign_key="organizations.id", nullable=False)
    name: str = Field(nullable=False)
    invite_code: str = Field(nullable=False, unique=True, index=True)

    organization: Organization = Relationship(back_populates="classrooms")
    memberships: list["ClassroomMembership"] = Relationship(back_populates="classroom")


class ClassroomMembership(BaseSQLModel, table=True):
    __tablename__ = "classroom_memberships"

    classroom_id: uuid.UUID = Field(foreign_key="classrooms.id", nullable=False)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    role: str = Field(default="student", nullable=False)

    classroom: Classroom = Relationship(back_populates="memberships")
    user: "User" = Relationship(back_populates="classrooms")


from .user import User  # noqa: E402
