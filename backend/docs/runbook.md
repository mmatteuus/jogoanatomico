# Runbook - Anatomy Pro API

## Health Checks
- Liveness: `GET /v1/health/live`
- Readiness: `GET /v1/health/ready`
- Metricas: `GET /metrics`

## Rotina de operacao
1. Confirme variaveis em `.env` (vide `.env.example`).
2. Execute `alembic upgrade head` apos cada deploy.
3. Monitore logs JSON no stdout.
4. Acompanhe metricas: taxa HTTP 5xx e `http_request_duration_seconds` p95.
5. Tracing disponivel via OTLP Collector (Jaeger, Tempo, etc.).

## Incidentes comuns
- **Banco indisponivel**: testar `mysql -h 186.209.113.112 -u tecc3463_jogoanatomia -p`; restaurar backup e rodar `alembic current` para conferir schema.
- **Acesso negado**: revisar lista de IPs em *Remote MySQL* no cPanel e credenciais no `.env`.
- **Rate limiting**: ajustar `RATE_LIMIT_PER_MINUTE` e limpar chaves `rate:*` no Redis.
- **Webhooks falhando**: inspecione logs (`logger=audit`) e reenvie via `POST /v1/webhooks/test`.
- **Metricas ausentes**: verifique o collector OTLP; se indisponivel, use logs como fallback.

## Rollback
1. Descubra a revisao atual com `alembic current`.
2. Rode `alembic downgrade <tag>`.
3. Volte a imagem/container anterior.

## Backups
- MySQL: `mysqldump --single-transaction --routines tecc3463_jogoanatomia` diariamente para storage externo.
- Redis: habilite `appendonly yes` em producao para garantir persistencia.

## SLOs sugeridos
- Disponibilidade: 99,5%
- Latencia p95: < 300 ms para `/dashboard/summary` e `/quizzes/sessions`
- Erros 5xx: < 1% das requisicoes
