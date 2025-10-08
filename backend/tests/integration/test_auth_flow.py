from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_register_and_login_flow(client):
    register_payload = {
        "email": "student@example.com",
        "password": "StrongPass123",
        "display_name": "Estudante",
        "profile_type": "student",
    }
    response = await client.post("/v1/auth/register", json=register_payload)
    assert response.status_code == 201
    user_data = response.json()
    assert user_data["email"] == "student@example.com"

    login_response = await client.post(
        "/v1/auth/login",
        json={"email": "student@example.com", "password": "StrongPass123"},
    )
    assert login_response.status_code == 200
    tokens = login_response.json()
    assert "access_token" in tokens

    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    me_response = await client.get("/v1/users/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["display_name"] == "Estudante"

    dashboard_response = await client.get("/v1/dashboard/summary", headers=headers)
    assert dashboard_response.status_code == 200
    summary = dashboard_response.json()
    assert summary["xp"] == 0
    assert isinstance(summary["missions"], list)
