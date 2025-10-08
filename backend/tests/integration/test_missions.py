from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_mission_progress_increment(client):
    await client.post(
        "/v1/auth/register",
        json={
            "email": "mission@example.com",
            "password": "StrongPass123",
            "display_name": "Mission User",
            "profile_type": "student",
        },
    )

    login_response = await client.post(
        "/v1/auth/login",
        json={"email": "mission@example.com", "password": "StrongPass123"},
    )
    tokens = login_response.json()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    missions_response = await client.get("/v1/missions/daily", headers=headers)
    assert missions_response.status_code == 200
    missions = missions_response.json()
    assert missions

    mission_id = missions[0]["mission"]["id"]
    progress_response = await client.post(
        f"/v1/missions/{mission_id}/progress",
        json={"increment": 1},
        headers=headers,
    )
    assert progress_response.status_code == 200
    progress_data = progress_response.json()
    assert progress_data["progress"] >= 1
