from __future__ import annotations

from functools import lru_cache
from typing import Any, List, Literal, Sequence

from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class FeatureFlags(BaseModel):
    osce: bool = Field(default=True, description="Enable OSCE clinical mode")
    srs: bool = Field(default=True, description="Enable spaced repetition system")
    leaderboard_webhooks: bool = Field(default=True, description="Allow leaderboard webhooks")
    enable_audit_log: bool = Field(default=True, description="Enable audit logging")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), env_file_encoding="utf-8")

    app_name: str = Field(default="AnatomyProAPI", alias="APP_NAME")
    api_v1_str: str = Field(default="/v1", alias="API_V1_STR")
    project_env: Literal["local", "development", "staging", "production"] = Field(
        default="local", alias="PROJECT_ENV"
    )

    # security
    secret_key: str = Field(alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_minutes: int = Field(default=4320, alias="REFRESH_TOKEN_EXPIRE_MINUTES")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    rate_limit_per_minute: int = Field(default=120, alias="RATE_LIMIT_PER_MINUTE")

    # database
    database_url: str = Field(alias="DATABASE_URL")
    sync_database_url: str = Field(alias="SYNC_DATABASE_URL")

    # cache
    redis_url: str = Field(alias="REDIS_URL")

    # pagination
    default_page_size: int = Field(default=20, alias="DEFAULT_PAGE_SIZE")
    max_page_size: int = Field(default=100, alias="MAX_PAGE_SIZE")

    # observability
    otel_exporter_otlp_endpoint: str = Field(alias="OTEL_EXPORTER_OTLP_ENDPOINT")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    cors_origins: Sequence[str] = Field(
        default_factory=lambda: ["*"], alias="CORS_ORIGINS"
    )

    feature_flag_osce: bool = Field(default=True, alias="FEATURE_FLAG_OSCE")
    feature_flag_srs: bool = Field(default=True, alias="FEATURE_FLAG_SRS")

    service_owners: List[str] = Field(
        default_factory=lambda: ["anatomy-platform@mtsferreira.dev"], alias="SERVICE_OWNERS"
    )

    @property
    def feature_flags(self) -> FeatureFlags:
        return FeatureFlags(
            osce=self.feature_flag_osce,
            srs=self.feature_flag_srs,
        )

    def model_post_init(self, __context: Any) -> None:  # type: ignore[override]
        if isinstance(self.cors_origins, str):
            origins = [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
            object.__setattr__(self, "cors_origins", origins)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
