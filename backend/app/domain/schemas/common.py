from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class IdentifierModel(ORMModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class PaginatedResponse(BaseModel):
    total: int
    page: int
    size: int
