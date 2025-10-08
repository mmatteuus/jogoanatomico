# Changelog

## 0.2.0 - 2024-05-27
- Suporte oficial ao MySQL remoto com detecção automática de drivers async/sync
- Docker Compose atualizado para MySQL 8 e script de instalação `install_mysql_schema.py`
- Documentação ajustada para refletir a integração com Stack Auth e banco MySQL

## 0.1.0 - 2024-05-06
- Arquitetura FastAPI com domínio completo (auth, missões, campanhas, quizzes, leaderboard, anatomia, webhooks, classrooms)
- Autenticação JWT com refresh token e RBAC
- Observabilidade com métricas, logs estruturados e tracing OTLP
- Migrations Alembic + scripts de export OpenAPI
- Testes unitários, integração e contrato com CI GitHub Actions
- Dockerfile e docker-compose com banco relacional, Redis e OTLP collector
