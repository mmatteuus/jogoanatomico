from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.common.rate_limit import rate_limiter
from app.api.dependencies import get_current_user, get_db_session
from app.core.security import create_access_token, create_refresh_token, decode_refresh_token
from app.domain.schemas.user import (
    AuthCredentials,
    TokenRefreshRequest,
    TokenResponse,
    UserCreate,
    UserRead,
)
from app.domain.services import missions as mission_service
from app.domain.services import progress as progress_service
from app.domain.services import users as user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    payload: UserCreate,
    session: AsyncSession = Depends(get_db_session),
):
    try:
        user = await user_service.create_user(session, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    await progress_service.ensure_system_progress(session, user)
    await mission_service.seed_default_missions(session, user)
    return UserRead.model_validate(user)


@router.post("/login", response_model=TokenResponse, dependencies=[Depends(rate_limiter)])
async def login(
    credentials: AuthCredentials,
    session: AsyncSession = Depends(get_db_session),
):
    user = await user_service.authenticate_user(session, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/token", response_model=TokenResponse)
async def token_exchange(
    form: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_db_session),
):
    user = await user_service.authenticate_user(session, form.username, form.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    payload: TokenRefreshRequest,
    session: AsyncSession = Depends(get_db_session),
):
    subject = decode_refresh_token(payload.refresh_token)
    if not subject:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    user = await user_service.get_user_by_id(session, uuid.UUID(subject))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(_: str = Depends(get_current_user)) -> None:
    return None
