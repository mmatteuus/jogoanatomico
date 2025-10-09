from __future__ import annotations

import asyncio
from typing import Sequence

from sqlmodel import select

from app.core.config import settings
from app.domain.models import Campaign, CampaignLesson, DifficultyLevel, ProfileType, QuestionType, QuizOption, QuizQuestion, User, UserRole
from app.domain.services import missions as mission_service
from app.domain.services import progress as progress_service
from app.domain.services import users as user_service
from app.domain.schemas.user import UserCreate
from app.infrastructure.db.session import AsyncSessionLocal, init_models

CAMPAIGNS = [
    {
        "title": "Osteologia dos Membros Inferiores",
        "description": "Sequencia completa sobre ossos do quadril, coxa, perna e pe.",
        "anatomy_system": "skeletal",
        "recommended_level": 1,
        "lessons": [
            {
                "order": 1,
                "title": "Cintura Pelvica",
                "content_url": "https://www.tec63.com.br/conteudos/osteologia/cintura-pelvica",
                "duration_minutes": 15,
                "xp_reward": 120,
            },
            {
                "order": 2,
                "title": "Femur e Patela",
                "content_url": "https://www.tec63.com.br/conteudos/osteologia/femur-patela",
                "duration_minutes": 18,
                "xp_reward": 140,
            },
            {
                "order": 3,
                "title": "Tibia, Fibula e Tarso",
                "content_url": "https://www.tec63.com.br/conteudos/osteologia/tibia-fibula-tarso",
                "duration_minutes": 20,
                "xp_reward": 150,
            },
        ],
    },
    {
        "title": "Sistema Muscular do Ombro",
        "description": "Explora os principais musculos do cingulo do membro superior.",
        "anatomy_system": "muscular",
        "recommended_level": 2,
        "lessons": [
            {
                "order": 1,
                "title": "Manguito Rotador",
                "content_url": "https://www.tec63.com.br/conteudos/musculatura/manguito-rotador",
                "duration_minutes": 16,
                "xp_reward": 130,
            },
            {
                "order": 2,
                "title": "Musculatura Toracoapendicular",
                "content_url": "https://www.tec63.com.br/conteudos/musculatura/toracoapendicular",
                "duration_minutes": 14,
                "xp_reward": 110,
            },
        ],
    },
]

QUIZ_QUESTIONS = [
    {
        "prompt": "Qual osso articula-se com o acetabulo para formar a articulacao do quadril?",
        "anatomy_system": "skeletal",
        "difficulty": DifficultyLevel.easy,
        "options": [
            ("Femur", True),
            ("Tibia", False),
            ("Fibula", False),
            ("Ilio", False),
        ],
    },
    {
        "prompt": "Qual nervo e responsavel pela inervacao motora do musculo serratil anterior?",
        "anatomy_system": "nervous",
        "difficulty": DifficultyLevel.medium,
        "options": [
            ("Nervo Toracico Longo", True),
            ("Nervo Axilar", False),
            ("Nervo Toracodorsal", False),
            ("Nervo Circunflexo", False),
        ],
    },
    {
        "prompt": "Qual musculo realiza a abducao inicial do ombro (0o a 15o)?",
        "anatomy_system": "muscular",
        "difficulty": DifficultyLevel.easy,
        "options": [
            ("Supraespinal", True),
            ("Deltoide Anterior", False),
            ("Infraespinal", False),
            ("Redondo Maior", False),
        ],
    },
]


SAMPLE_USERS: Sequence[dict[str, str]] = (
    {
        "email": "professor@jogoanatomia.com",
        "password": "anatomia123",
        "display_name": "Prof. Camila Silva",
        "profile_type": ProfileType.professor,
        "role": UserRole.teacher,
    },
    {
        "email": "aluno@jogoanatomia.com",
        "password": "anatomia123",
        "display_name": "Aluno Demo",
        "profile_type": ProfileType.student,
        "role": UserRole.student,
    },
)


async def seed_campaigns(session):
    for campaign_data in CAMPAIGNS:
        existing = await session.exec(
            select(Campaign).where(Campaign.title == campaign_data["title"])
        )
        campaign = existing.first()
        if campaign:
            continue

        campaign = Campaign(
            title=campaign_data["title"],
            description=campaign_data["description"],
            anatomy_system=campaign_data["anatomy_system"],
            recommended_level=campaign_data["recommended_level"],
        )
        session.add(campaign)
        await session.flush()

        for lesson_data in campaign_data["lessons"]:
            lesson = CampaignLesson(
                campaign_id=campaign.id,
                order=lesson_data["order"],
                title=lesson_data["title"],
                content_url=lesson_data["content_url"],
                duration_minutes=lesson_data["duration_minutes"],
                xp_reward=lesson_data["xp_reward"],
            )
            session.add(lesson)

    await session.commit()


async def seed_quiz_questions(session):
    for item in QUIZ_QUESTIONS:
        existing = await session.exec(select(QuizQuestion).where(QuizQuestion.prompt == item["prompt"]))
        question = existing.first()
        if question:
            continue

        question = QuizQuestion(
            prompt=item["prompt"],
            anatomy_system=item["anatomy_system"],
            type=QuestionType.multiple_choice,
            difficulty=item["difficulty"],
        )
        session.add(question)
        await session.flush()

        for label, is_correct in item["options"]:
            option = QuizOption(question_id=question.id, label=label, is_correct=is_correct)
            session.add(option)

    await session.commit()


async def seed_users(session):
    for user_data in SAMPLE_USERS:
        existing = await session.exec(select(User).where(User.email == user_data["email"]))
        user = existing.first()
        if user:
            continue

        payload = UserCreate(
            email=user_data["email"],
            password=user_data["password"],
            display_name=user_data["display_name"],
            profile_type=user_data["profile_type"],
        )
        user = await user_service.create_user(session, payload, role=user_data["role"])
        await progress_service.ensure_system_progress(session, user)
        await mission_service.seed_default_missions(session, user)


async def main() -> None:
    print("Using database:", settings.sync_database_url_with_driver)
    await init_models()

    async with AsyncSessionLocal() as session:
        await seed_campaigns(session)
        await seed_quiz_questions(session)
        await seed_users(session)

    print("Seed completed.")


if __name__ == "__main__":
    asyncio.run(main())
