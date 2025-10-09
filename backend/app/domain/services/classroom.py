from __future__ import annotations

import secrets
import string
import uuid
from typing import List

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.domain.models import Classroom, ClassroomMembership, User


def _generate_invite_code(length: int = 8) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


async def create_classroom(
    session: AsyncSession, owner: User, name: str, organization_id: uuid.UUID | None
) -> Classroom:
    classroom = Classroom(
        name=name,
        organization_id=organization_id or owner.organization_id,
        invite_code=_generate_invite_code(),
    )
    session.add(classroom)
    await session.flush()

    membership = ClassroomMembership(
        classroom_id=classroom.id,
        user_id=owner.id,
        role="teacher",
    )
    session.add(membership)
    await session.commit()
    await session.refresh(classroom)
    return classroom


async def enroll_with_code(session: AsyncSession, user: User, invite_code: str) -> Classroom:
    result = await session.exec(select(Classroom).where(Classroom.invite_code == invite_code))
    classroom = result.first()
    if not classroom:
        raise ValueError("Invalid invite code")

    existing = await session.exec(
        select(ClassroomMembership).where(
            ClassroomMembership.classroom_id == classroom.id,
            ClassroomMembership.user_id == user.id,
        )
    )
    if existing.first():
        return classroom

    membership = ClassroomMembership(
        classroom_id=classroom.id,
        user_id=user.id,
        role="student",
    )
    session.add(membership)
    await session.commit()
    await session.refresh(classroom)
    return classroom


async def list_students(session: AsyncSession, classroom_id: uuid.UUID) -> List[User]:
    result = await session.exec(
        select(User)
        .join(ClassroomMembership)
        .where(ClassroomMembership.classroom_id == classroom_id)
        .where(ClassroomMembership.role == "student")
    )
    return result.all()


async def get_classroom(session: AsyncSession, classroom_id: uuid.UUID) -> Classroom | None:
    result = await session.exec(select(Classroom).where(Classroom.id == classroom_id))
    return result.first()
