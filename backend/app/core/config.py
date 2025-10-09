from __future__ import annotations

from functools import lru_cache
from typing import Any, ClassVar, List, Literal, Sequence

from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL, make_url


class FeatureFlags(BaseModel):
    osce: bool = Field(default=True, description="Enable OSCE clinical mode")
    srs: bool = Field(default=True, description="Enable spaced repetition system")
    leaderboard_webhooks: bool = Field(default=True, description="Allow leaderboard webhooks")
    enable_audit_log: bool = Field(default=True, description="Enable audit logging")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), env_file_encoding="utf-8")

    app_name: str = Field(default="AnatomyProAPI", alias="APP_NAME")
    api_v1_str: str = Field(default="/v1", alias="API_V1_STR")
    project_env: Literal["local", "test", "development", "staging", "production"] = Field(
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
    sync_database_url: str | None = Field(default=None, alias="SYNC_DATABASE_URL")

    stack_project_id: str | None = Field(default=None, alias="STACK_PROJECT_ID")
    stack_jwks_url: str | None = Field(default=None, alias="STACK_JWKS_URL")
    stack_allowed_audiences: Sequence[str] = Field(
        default_factory=list, alias="STACK_ALLOWED_AUDIENCES"
    )
    stack_allowed_issuers: Sequence[str] = Field(
        default_factory=list, alias="STACK_ALLOWED_ISSUERS"
    )

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

    _async_driver: ClassVar[str] = "mysql+asyncmy"
    _sync_driver: ClassVar[str] = "mysql+pymysql"

    @staticmethod
    def _ensure_driver(url: str, driver: str) -> str:
        sa_url: URL = make_url(url)
        backend = sa_url.get_backend_name()
        target_backend = driver.split("+", 1)[0]
        if backend != target_backend:
            return url
        if sa_url.drivername == driver:
            return url
        sa_url = sa_url.set(drivername=driver)
        return sa_url.render_as_string(hide_password=False)

    @property
    def async_database_url(self) -> str:
        return self._ensure_driver(self.database_url, self._async_driver)

    @property
    def sync_database_url_value(self) -> str:
        return self.sync_database_url or self.database_url

    @property
    def sync_database_url_with_driver(self) -> str:
        return self._ensure_driver(self.sync_database_url_value, self._sync_driver)

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

        if isinstance(self.stack_allowed_audiences, str):
            audiences = [aud.strip() for aud in self.stack_allowed_audiences.split(",") if aud.strip()]
            object.__setattr__(self, "stack_allowed_audiences", audiences)

        if isinstance(self.stack_allowed_issuers, str):
            issuers = [iss.strip() for iss in self.stack_allowed_issuers.split(",") if iss.strip()]
            object.__setattr__(self, "stack_allowed_issuers", issuers)

        if not self.stack_allowed_audiences and self.stack_project_id:
            object.__setattr__(self, "stack_allowed_audiences", [self.stack_project_id])


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
