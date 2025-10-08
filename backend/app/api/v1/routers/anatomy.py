from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.dependencies import get_current_user, get_db_session, require_roles
from app.domain.models import UserRole
from app.domain.schemas.anatomy import AnatomyLayerRead, AnatomyStructureCreate, AnatomyStructureRead
from app.domain.services import anatomy as anatomy_service
from app.infrastructure.storage.local import save_file

router = APIRouter(prefix="/anatomy", tags=["anatomy"])


@router.get("/structures", response_model=list[AnatomyStructureRead])
async def list_structures(
    system: str | None = None,
    q: str | None = None,
    session: AsyncSession = Depends(get_db_session),
    _: object = Depends(get_current_user),
):
    structures = await anatomy_service.list_structures(session, system, q)
    return [AnatomyStructureRead.model_validate(structure) for structure in structures]


@router.get("/structures/{structure_id}", response_model=AnatomyStructureRead)
async def get_structure(
    structure_id: uuid.UUID,
    session: AsyncSession = Depends(get_db_session),
    _: object = Depends(get_current_user),
):
    structure = await anatomy_service.get_structure(session, structure_id)
    if not structure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Structure not found")
    return AnatomyStructureRead.model_validate(structure)


@router.get("/structures/{structure_id}/layers", response_model=list[AnatomyLayerRead])
async def get_layers(
    structure_id: uuid.UUID,
    session: AsyncSession = Depends(get_db_session),
    _: object = Depends(get_current_user),
):
    layers = await anatomy_service.get_layers(session, structure_id)
    return [
        AnatomyLayerRead(
            id=layer.id,
            created_at=layer.created_at,
            updated_at=layer.updated_at,
            structure_id=str(layer.structure_id),
            name=layer.name,
            visible=layer.visible,
        )
        for layer in layers
    ]


@router.post(
    "/structures",
    response_model=AnatomyStructureRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_structure(
    payload: AnatomyStructureCreate,
    session: AsyncSession = Depends(get_db_session),
    _: object = Depends(require_roles(UserRole.teacher, UserRole.admin)),
):
    structure = await anatomy_service.create_structure(session, payload)
    return AnatomyStructureRead.model_validate(structure)


@router.post("/assets", status_code=status.HTTP_201_CREATED)
async def upload_asset(
    file: UploadFile,
    _: object = Depends(require_roles(UserRole.teacher, UserRole.admin)),
):
    path = await save_file(file, folder="anatomy")
    return {"path": path}
