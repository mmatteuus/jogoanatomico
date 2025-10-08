from __future__ import annotations

import json

import pytest
from openapi_spec_validator import validate


@pytest.mark.asyncio
async def test_openapi_contract(client):
    response = await client.get("/v1/openapi.json")
    assert response.status_code == 200
    spec = response.json()
    validate(spec)
