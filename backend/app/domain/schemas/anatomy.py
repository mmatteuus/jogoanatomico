from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field

from .common import IdentifierModel


class AnatomyStructureCreate(BaseModel):
    name: str
    latin_name: Optional[str]
    system: str
    region: str
    description: str
    tags: List[str] = Field(default_factory=list)
    asset_uri: Optional[str]


class AnatomyStructureRead(IdentifierModel, AnatomyStructureCreate):
    pass


class AnatomyLayerRead(IdentifierModel):
    structure_id: str
    name: str
    visible: bool
