# Runbook - Anatomy Pro API

## Health Checks
- **Liveness**: `GET /v1/health/live`
- **Readiness**: `GET /v1/health/ready`
- **Métricas**: `GET /metrics`

## Rotina de Operação
1. Garantir variáveis de ambiente configuradas (consultar `.env.example`).
2. Executar `alembic upgrade head` após deploys.
3. Monitorar logs estruturados (JSON) enviados para stdout.
4. Acompanhar métricas básicas: taxa de erro HTTP 5xx, latência p95 (`http_request_duration_seconds`).
5. Traces disponíveis via OTLP Collector (Jaeger/Grafana Tempo).

## Resposta a Incidentes
- **Falha no banco**: verificar container `mysql`; restaurar backup; executar `alembic current` para checar versão.
- **Rate limiting excessivo**: ajustar `RATE_LIMIT_PER_MINUTE` e limpar chaves Redis `rate:*`.
- **Webhooks falhando**: consultar logs com `logger=audit` e reprocessar via `POST /v1/webhooks/test`.
- **Métricas ausentes**: confirmar serviço OTLP em execução; fallback para logs.

## Rollback
1. Identificar versão do schema com `alembic current`.
2. Rodar `alembic downgrade <tag>` para reverter.
3. Redeploy da imagem anterior.

## Backups
- MySQL: snapshots diários (não automatizados neste repo, recomendação: `mysqldump` + storage cifrado).
- Redis: ajustar `appendonly yes` em produção.

## SLAs/SLOs recomendados
- Disponibilidade API: 99.5%
- Latência p95: < 300ms para endpoints críticos (`/dashboard/summary`, `/quizzes/sessions`).
- Erro 5xx: < 1% das requisições.
