# Decisões Arquiteturais

## FastAPI + SQLModel
- **Por quê**: produtividade elevada com tipagem forte, suporte a async e geração automática do contrato OpenAPI.
- **Trade-offs**: SQLModel ainda é jovem comparado a SQLAlchemy puro; mitigado mantendo migrations explícitas.

## MySQL + Redis
- **Por quê**: MySQL oferece replicação amplamente suportada no provedor atual e atende à modelagem relacional do jogo. Redis habilita rate limiting e cache distribuído.
- **Trade-offs**: Ajustes de compatibilidade (UUID, JSON) exigem migrations cuidadosas; docker-compose cobre desenvolvimento e CI.

## RBAC e JWT
- **Por quê**: Perfis diferentes (student, professional, teacher, admin) exigem segmentação de privilégios. JWT simplifica stateless auth.
- **Trade-offs**: Necessário refrescar tokens e proteger chaves; `.env.example` documenta.

## Observabilidade nativa
- **Por quê**: métricas Prometheus e tracing OTLP permitem SRE básico alinhado com SLAs.
- **Trade-offs**: Coletor OTLP aumenta complexidade, mas é opcional em desenvolvimento.

## Feature Flags
- **Por quê**: habilitar/desabilitar OSCE e SRS sem redeploy.
- **Trade-offs**: Flags são simples (env vars); evoluir para serviço dedicado se necessário.
