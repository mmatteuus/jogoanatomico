from __future__ import annotations

from typing import List

from pydantic import BaseModel

from .common import IdentifierModel
from .user import UserRead


class ClassroomCreate(BaseModel):
    name: str
    organization_id: str | None = None


class ClassroomRead(IdentifierModel):
    name: str
    organization_id: str | None
    invite_code: str


class EnrollmentRequest(BaseModel):
    invite_code: str


class ClassroomRoster(BaseModel):
    classroom: ClassroomRead
    students: List[UserRead]
