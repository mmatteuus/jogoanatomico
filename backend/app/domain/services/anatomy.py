from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.domain.models import AnatomyLayer, AnatomyStructure
from app.domain.schemas.anatomy import AnatomyStructureCreate


async def list_structures(session: AsyncSession, system: str | None = None, query: str | None = None):
    statement = select(AnatomyStructure)
    if system:
        statement = statement.where(AnatomyStructure.system == system)
    if query:
        statement = statement.where(AnatomyStructure.name.contains(query))
    result = await session.exec(statement)
    return result.all()


async def get_structure(session: AsyncSession, structure_id: uuid.UUID) -> AnatomyStructure | None:
    result = await session.exec(
        select(AnatomyStructure).where(AnatomyStructure.id == structure_id)
    )
    structure = result.first()
    return structure


async def create_structure(session: AsyncSession, payload: AnatomyStructureCreate) -> AnatomyStructure:
    structure = AnatomyStructure(**payload.model_dump())
    session.add(structure)
    await session.commit()
    await session.refresh(structure)
    return structure


async def get_layers(session: AsyncSession, structure_id: uuid.UUID):
    result = await session.exec(
        select(AnatomyLayer).where(AnatomyLayer.structure_id == structure_id)
    )
    return result.all()
