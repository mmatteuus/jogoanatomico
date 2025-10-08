from __future__ import annotations

from app.core.security import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token


def test_token_roundtrip():
    access = create_access_token("user-id")
    refresh = create_refresh_token("user-id")

    assert decode_access_token(access) == "user-id"
    assert decode_refresh_token(refresh) == "user-id"
