# Anatomy Pro API

Plataforma backend escalável para suportar o jogo educativo Anatomy Pro. A API é construída com FastAPI, segue princípios 12-Factor e expõe contratos REST documentados via OpenAPI 3.1.

## Visão Geral

- **Linguagem**: Python 3.11 / FastAPI
- **Banco**: PostgreSQL 16 (migrations via Alembic)
- **Cache/Mensageria**: Redis para rate limiting e cache
- **Observabilidade**: Logs estruturados, métricas Prometheus, tracing OTLP
- **Autenticação**: JWT com refresh token, RBAC (student, professional, teacher, admin)
- **Domínio**: usuários, progressão por sistemas, missões, campanhas, quizzes, rankings, assets anatômicos, salas de aula e webhooks

## Como rodar localmente

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install .[dev]
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Ou utilize o Docker Compose:

```bash
cd backend
docker compose up --build
```

A API estará disponível em `http://localhost:8000`. O Swagger UI pode ser acessado em `http://localhost:8000/docs`.

## Integração com banco Neon

- Solicite no painel Neon uma connection string para o projeto (ex.: `postgresql://...neon.tech/neondb?sslmode=require`).
- No arquivo `.env`, informe `DATABASE_URL` com a string recebida. O serviço converte automaticamente para o driver assíncrono `asyncpg` e configura `pool_pre_ping` e `NullPool` para respeitar os limites serverless do Neon.
- O `sslmode=require` é reconhecido e mapeado para conexões TLS (`ssl=True`). Caso deseje uma string diferente para o Alembic, defina `SYNC_DATABASE_URL`; se omitido, o mesmo valor de `DATABASE_URL` é reutilizado com o driver `psycopg`.
- Para ambientes que utilizam o Stack Auth, configure também:
  - `STACK_PROJECT_ID`
  - `STACK_JWKS_URL` (por exemplo `https://api.stack-auth.com/api/v1/projects/<id>/.well-known/jwks.json`)
  - `STACK_ALLOWED_AUDIENCES` e `STACK_ALLOWED_ISSUERS` caso seja necessário restringir a validação.

> **Importante**: nunca versione secrets reais. Utilize `.env.local` ou variáveis de ambiente seguras nos ambientes gerenciados.

## Estrutura do Projeto

- `app/core`: configuração, segurança, eventos
- `app/domain`: modelos, esquemas e serviços
- `app/api`: routers versionados, dependências e middlewares
- `app/infrastructure`: banco, cache, jobs, observabilidade, storage
- `migrations`: gerenciamento de schema com Alembic
- `tests`: unitários, integração e contrato
- `scripts/export_openapi.py`: gera o `openapi.yaml`

## Fluxo de Desenvolvimento

1. Defina variáveis em `.env` (baseado em `.env.example`).
2. Execute `alembic upgrade head` para preparar o banco.
3. Rode `ruff check app`, `mypy app` e `pytest` antes de enviar PR.
4. Gere o contrato com `python scripts/export_openapi.py`.

## Testes

```bash
cd backend
pytest --asyncio-mode=auto --cov=app
```

Os testes de integração usam SQLite assíncrono para velocidade, mantendo compatibilidade com PostgreSQL via Alembic.

## Observabilidade

- Métricas expostas em `/metrics`
- Traces enviados via OTLP (collector configurado em `docker-compose.yml`)
- Logs estruturados com `structlog`

## Segurança

- Rate limiting com Redis
- Auditoria básica via `AuditLogger`
- Webhooks com assinatura HMAC (`X-Anatomy-Signature`)
- Lista de verificações OWASP ASVS nível 2 no arquivo `docs/security-checklist.md`

## Deploy

O pipeline GitHub Actions (`.github/workflows/ci.yml`) executa lint, type-check, testes, cobertura e validação do contrato OpenAPI. A imagem Docker pode ser publicada a partir do `Dockerfile` oficial.

## Melhorias Futuras

- Implementar fila para envio assíncrono de webhooks e notificações
- Adicionar trilhas de auditoria persistentes e dashboards Grafana pré-configurados
- Introduzir verificação de integridade de assets 3D e CDN para distribuição

Desenvolvido por MtsFerreira
