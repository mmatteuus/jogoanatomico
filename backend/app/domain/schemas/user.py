from __future__ import annotations

import uuid
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.domain.models.user import ProfileType, UserRole
from .common import IdentifierModel, ORMModel


class UserBase(BaseModel):
    display_name: str
    profile_type: ProfileType
    role: UserRole = UserRole.student
    xp: int = 0
    streak: int = 0
    energy: int = 5
    elo_rating: int = 1200
    preferences: dict = Field(default_factory=dict)


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    display_name: str
    profile_type: ProfileType


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    preferences: Optional[dict] = None
    energy: Optional[int] = Field(default=None, ge=0)


class UserRead(IdentifierModel, UserBase):
    email: Optional[EmailStr]


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class AuthCredentials(BaseModel):
    email: EmailStr
    password: str


class PreferenceUpdateRequest(BaseModel):
    dark_mode: Optional[bool] = None
    language: Optional[str] = None
    notifications: Optional[bool] = None


class ProfileSummary(BaseModel):
    user: UserRead
    systems_progress: dict[str, float]
    daily_missions_completed: int
    weekly_missions_completed: int
