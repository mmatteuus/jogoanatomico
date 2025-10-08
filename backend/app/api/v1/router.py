from __future__ import annotations

from fastapi import APIRouter

from .routers import (
    anatomy,
    auth,
    campaigns,
    classrooms,
    dashboard,
    health,
    leaderboard,
    missions,
    quizzes,
    users,
    webhooks,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(dashboard.router)
api_router.include_router(missions.router)
api_router.include_router(campaigns.router)
api_router.include_router(quizzes.router)
api_router.include_router(leaderboard.router)
api_router.include_router(anatomy.router)
api_router.include_router(classrooms.router)
api_router.include_router(webhooks.router)
