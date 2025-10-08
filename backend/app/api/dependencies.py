from __future__ import annotations

import uuid
from typing import AsyncGenerator, Callable, Optional

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.core.security import decode_access_token
from app.domain.models import User, UserRole
from app.domain.services import users as user_service
from app.infrastructure.db.session import get_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_v1_str}/auth/token")


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_session():
        yield session


async def get_current_user(
    token: str = Security(oauth2_scheme), session: AsyncSession = Depends(get_db_session)
) -> User:
    subject = decode_access_token(token)
    if not subject:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await user_service.get_user_by_id(session, uuid.UUID(subject))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_roles(*roles: UserRole) -> Callable[[User], User]:
    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return user

    return checker
