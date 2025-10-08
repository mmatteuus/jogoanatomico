from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.dependencies import get_current_user, get_db_session, require_roles
from app.domain.models import UserRole
from app.domain.schemas.classroom import ClassroomCreate, ClassroomRead, ClassroomRoster, EnrollmentRequest
from app.domain.schemas.user import UserRead
from app.domain.services import classroom as classroom_service

router = APIRouter(prefix="/classrooms", tags=["classrooms"])


@router.post("", response_model=ClassroomRead, status_code=status.HTTP_201_CREATED)
async def create_classroom(
    payload: ClassroomCreate,
    session: AsyncSession = Depends(get_db_session),
    teacher=Depends(require_roles(UserRole.teacher, UserRole.admin)),
):
    classroom = await classroom_service.create_classroom(
        session, teacher, payload.name, payload.organization_id
    )
    return ClassroomRead(
        id=classroom.id,
        created_at=classroom.created_at,
        updated_at=classroom.updated_at,
        name=classroom.name,
        organization_id=str(classroom.organization_id) if classroom.organization_id else None,
        invite_code=classroom.invite_code,
    )


@router.post("/enroll", response_model=ClassroomRead)
async def enroll(
    payload: EnrollmentRequest,
    session: AsyncSession = Depends(get_db_session),
    current_user=Depends(get_current_user),
):
    try:
        classroom = await classroom_service.enroll_with_code(session, current_user, payload.invite_code)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return ClassroomRead(
        id=classroom.id,
        created_at=classroom.created_at,
        updated_at=classroom.updated_at,
        name=classroom.name,
        organization_id=str(classroom.organization_id) if classroom.organization_id else None,
        invite_code=classroom.invite_code,
    )


@router.get("/{classroom_id}/roster", response_model=ClassroomRoster)
async def get_roster(
    classroom_id: str,
    session: AsyncSession = Depends(get_db_session),
    _: object = Depends(require_roles(UserRole.teacher, UserRole.admin)),
):
    classroom_uuid = uuid.UUID(classroom_id)
    classroom = await classroom_service.get_classroom(session, classroom_uuid)
    if not classroom:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")
    students = await classroom_service.list_students(session, classroom_uuid)
    return ClassroomRoster(
        classroom=ClassroomRead.model_validate(classroom),
        students=[UserRead.model_validate(student) for student in students],
    )
