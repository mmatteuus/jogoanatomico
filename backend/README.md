# Anatomy Pro API

Backend platform que sustenta o **Jogo de Anatomia**. A API e escrita em FastAPI, segue praticas 12-Factor e expoe um contrato REST em OpenAPI 3.1.

## Visao Geral
- **Linguagem**: Python 3.11 / FastAPI  
- **Banco**: MySQL 8 (migrations Alembic)  
- **Cache & rate limiting**: Redis  
- **Observabilidade**: Prometheus, OTLP, logs estruturados  
- **Autenticacao**: JWT + refresh tokens, RBAC (student, professional, teacher, admin)  
- **Dominio**: usuarios, progresso por sistema, missoes, campanhas, quizzes, leaderboard, salas e webhooks

## Desenvolvimento local
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install .[dev]
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Ou via Docker Compose:
```bash
cd backend
docker compose up --build
```
API: `http://localhost:8000` - Swagger: `http://localhost:8000/docs`.

## Integracao com o MySQL remoto (Napoleon/cPanel)
- Host oficial: `186.209.113.112`
- Usuario/banco padrao: `tecc3463_jogoanatomia`
- Senha: `tecc3463_jogoanatomia`

Configure o `.env` com as URLs ja preparadas no `.env.example`:
```
DATABASE_URL=mysql+asyncmy://tecc3463_jogoanatomia:tecc3463_jogoanatomia@186.209.113.112:3306/tecc3463_jogoanatomia?charset=utf8mb4
SYNC_DATABASE_URL=mysql+pymysql://tecc3463_jogoanatomia:tecc3463_jogoanatomia@186.209.113.112:3306/tecc3463_jogoanatomia?charset=utf8mb4
```
Pre-requisitos no cPanel:
1. Em **Remote MySQL**, libere o IP do servidor/backend que fara a conexao.
2. Garanta que o usuario `tecc3463_jogoanatomia` possua privilegios no banco `tecc3463_jogoanatomia`.
3. A porta 3306 precisa estar liberada no firewall do seu ambiente.

### Scripts uteis
- `python scripts/install_schema.py` - aplica as migrations na instancia remota.
- `python scripts/seed_data.py` - popula campanhas, questoes e usuarios demo.

## Estrutura
- `app/core`: configuracao, seguranca, eventos
- `app/domain`: modelos SQLModel, schemas Pydantic e servicos
- `app/api`: routers versionados, dependencias, middlewares
- `app/infrastructure`: banco, cache, observabilidade, storage
- `migrations`: historico Alembic
- `scripts`: ferramentas auxiliares (OpenAPI, seeds, schema installer)
- `tests`: unitarios, integracao e contrato

## Fluxo de trabalho
1. Configure `.env` (baseado em `.env.example`).
2. Rode `alembic upgrade head` antes de subir o app.
3. Execute lint/typing/tests (`ruff`, `mypy`, `pytest`).
4. Gere o contrato com `python scripts/export_openapi.py` quando necessario.

## Testes
```bash
cd backend
pytest --asyncio-mode=auto --cov=app
```
Os testes usam SQLite assincrono para velocidade, mantendo compatibilidade de schema com MySQL.

## Observabilidade
- Metricas expostas em `/metrics`
- Tracing via OTLP (configuravel em `docker-compose.yml`)
- Logs estruturados com `structlog`

## Seguranca
- Rate limiting com Redis
- Audit log basico via `AuditLogger`
- Webhooks assinados (`X-Anatomy-Signature`)
- Checklist OWASP ASVS L2 em `docs/security-checklist.md`

## Deploy
CI executa lint, type-check, testes, cobertura e valida OpenAPI (`.github/workflows/ci.yml`). Use o `Dockerfile` oficial para gerar imagens de producao.

## Roadmap
- Fila para webhooks/notifications
- Auditing persistente + dashboards Grafana
- Verificacao de integridade para assets 3D/CDN

Desenvolvido por MtsFerreira
