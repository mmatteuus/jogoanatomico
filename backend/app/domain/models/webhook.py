from __future__ import annotations

from sqlmodel import Field

from .base import BaseSQLModel


class WebhookSubscription(BaseSQLModel, table=True):
    __tablename__ = "webhook_subscriptions"

    target_url: str = Field(nullable=False)
    secret: str = Field(nullable=False)
    event: str = Field(nullable=False, index=True)
    is_active: bool = Field(default=True)
