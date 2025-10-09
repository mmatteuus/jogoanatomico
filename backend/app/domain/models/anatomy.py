
import uuid

from sqlalchemy import Column
from sqlalchemy.types import JSON
from sqlmodel import Field

from .base import BaseSQLModel


class AnatomyStructure(BaseSQLModel, table=True):
    __tablename__ = "anatomy_structures"

    name: str = Field(nullable=False, index=True)
    latin_name: str | None = Field(default=None)
    system: str = Field(nullable=False, index=True)
    region: str = Field(nullable=False, index=True)
    description: str = Field(nullable=False)
    tags: list[str] = Field(sa_column=Column(JSON, nullable=False, server_default="[]"))
    asset_uri: str | None = Field(default=None)


class AnatomyLayer(BaseSQLModel, table=True):
    __tablename__ = "anatomy_layers"

    structure_id: uuid.UUID = Field(foreign_key="anatomy_structures.id", nullable=False)
    name: str = Field(nullable=False)
    visible: bool = Field(default=True)

