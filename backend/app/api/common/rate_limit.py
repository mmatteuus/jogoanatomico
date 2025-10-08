from __future__ import annotations

import time

from fastapi import HTTPException, Request, status

from app.core.config import settings
from app.infrastructure.cache.redis import get_client


async def rate_limiter(request: Request) -> None:
    client = await get_client()
    identifier = request.headers.get("x-user-id") or request.client.host
    key = f"rate:{identifier}:{int(time.time() // 60)}"
    current = await client.incr(key)
    if current == 1:
        await client.expire(key, 60)
    if current > settings.rate_limit_per_minute:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded",
        )
