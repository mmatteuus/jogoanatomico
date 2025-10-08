from __future__ import annotations

from typing import Dict

from pydantic import BaseModel, Field, HttpUrl

from .common import IdentifierModel


class WebhookSubscription(BaseModel):
    target_url: HttpUrl
    secret: str | None = Field(default=None, min_length=16)
    event: str


class WebhookRead(IdentifierModel, WebhookSubscription):
    is_active: bool


class WebhookDelivery(BaseModel):
    event: str
    payload: Dict[str, object]
