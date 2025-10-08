from __future__ import annotations

import json
from typing import Any, Optional

import redis.asyncio as redis

from app.core.config import settings

_client: Optional[redis.Redis] = None


async def get_client() -> redis.Redis:
    global _client
    if _client is None:
        _client = redis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)
    return _client


async def set_json(key: str, value: Any, ttl_seconds: int | None = None) -> None:
    client = await get_client()
    data = json.dumps(value)
    if ttl_seconds:
        await client.setex(key, ttl_seconds, data)
    else:
        await client.set(key, data)


async def get_json(key: str) -> Any | None:
    client = await get_client()
    data = await client.get(key)
    return json.loads(data) if data else None
