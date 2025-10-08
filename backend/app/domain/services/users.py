from __future__ import annotations

import uuid
from typing import Optional

from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.logging import audit_logger
from app.core.security import get_password_hash, verify_password
from app.domain.models import User, UserRole
from app.domain.schemas.user import UserCreate, UserUpdate

async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    result = await session.exec(select(User).where(User.email == email))
    return result.first()


async def create_user(session: AsyncSession, payload: UserCreate, role: UserRole | None = None) -> User:
    existing = await get_user_by_email(session, payload.email)
    if existing:
        raise ValueError("Email already registered")

    default_role = {
        "student": UserRole.student,
        "professional": UserRole.professional,
        "professor": UserRole.teacher,
        "guest": UserRole.student,
    }[payload.profile_type.value]

    user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        display_name=payload.display_name,
        profile_type=payload.profile_type,
        role=role or default_role,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    audit_logger.log("user_created", str(user.id), {"email": payload.email})
    return user


async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[User]:
    user = await get_user_by_email(session, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def update_user(session: AsyncSession, user: User, payload: UserUpdate) -> User:
    if payload.display_name is not None:
        user.display_name = payload.display_name
    if payload.preferences is not None:
        user.preferences = {**user.preferences, **payload.preferences}
    if payload.energy is not None:
        user.energy = payload.energy
    user.touch()
    session.add(user)
    await session.commit()
    await session.refresh(user)
    audit_logger.log("user_updated", str(user.id), {"fields": payload.model_dump(exclude_none=True)})
    return user


async def increment_user_xp(session: AsyncSession, user: User, xp: int) -> User:
    user.xp += xp
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def get_user_by_id(session: AsyncSession, user_id: uuid.UUID) -> Optional[User]:
    result = await session.exec(select(User).where(User.id == user_id))
    return result.first()
