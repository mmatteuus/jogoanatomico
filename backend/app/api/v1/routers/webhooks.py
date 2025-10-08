from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.dependencies import get_current_user, get_db_session, require_roles
from app.domain.models import UserRole
from app.domain.schemas.webhook import WebhookDelivery, WebhookRead, WebhookSubscription
from app.domain.services import webhooks as webhook_service

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("", response_model=WebhookRead, status_code=status.HTTP_201_CREATED)
async def create_webhook(
    payload: WebhookSubscription,
    session: AsyncSession = Depends(get_db_session),
    _: object = Depends(require_roles(UserRole.teacher, UserRole.admin)),
):
    subscription = await webhook_service.create_subscription(session, payload)
    return WebhookRead.model_validate(subscription)


@router.get("", response_model=list[WebhookRead])
async def list_webhooks(
    event: str | None = None,
    session: AsyncSession = Depends(get_db_session),
    _: object = Depends(require_roles(UserRole.teacher, UserRole.admin)),
):
    subscriptions = await webhook_service.list_subscriptions(session, event)
    return [WebhookRead.model_validate(subscription) for subscription in subscriptions]


@router.post("/test", status_code=status.HTTP_202_ACCEPTED)
async def test_webhook(
    payload: WebhookDelivery,
    session: AsyncSession = Depends(get_db_session),
    _: object = Depends(require_roles(UserRole.teacher, UserRole.admin)),
):
    subscriptions = await webhook_service.list_subscriptions(session, payload.event)
    for subscription in subscriptions:
        await webhook_service.dispatch_webhook(subscription, payload.payload)
    return {"delivered": len(subscriptions)}
