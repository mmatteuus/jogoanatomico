from __future__ import annotations

import hmac
import json
import secrets
from hashlib import sha256
from typing import Dict

import httpx
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.domain.models import WebhookSubscriptionModel
from app.domain.schemas.webhook import WebhookSubscription


async def create_subscription(
    session: AsyncSession, payload: WebhookSubscription
) -> WebhookSubscriptionModel:
    secret = payload.secret or secrets.token_hex(32)
    subscription = WebhookSubscriptionModel(
        target_url=str(payload.target_url),
        secret=secret,
        event=payload.event,
    )
    session.add(subscription)
    await session.commit()
    await session.refresh(subscription)
    return subscription


async def list_subscriptions(session: AsyncSession, event: str | None = None):
    statement = select(WebhookSubscriptionModel).where(WebhookSubscriptionModel.is_active.is_(True))
    if event:
        statement = statement.where(WebhookSubscriptionModel.event == event)
    result = await session.exec(statement)
    return result.all()


async def dispatch_webhook(subscription: WebhookSubscriptionModel, payload: Dict[str, object]) -> None:
    message = json.dumps(payload).encode("utf-8")
    signature = hmac.new(subscription.secret.encode("utf-8"), message, sha256).hexdigest()
    headers = {"X-Anatomy-Signature": signature, "Content-Type": "application/json"}
    async with httpx.AsyncClient(timeout=10) as client:
        await client.post(subscription.target_url, content=message, headers=headers)
