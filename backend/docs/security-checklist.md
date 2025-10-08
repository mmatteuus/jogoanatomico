# Checklist de Segurança (OWASP ASVS Nível 2)

| Item | Descrição | Status |
|------|-----------|--------|
| V2 | Autenticação forte com senhas hash (bcrypt) e política de token | ✅ |
| V2.3 | Refresh token com validade limitada | ✅ |
| V3 | RBAC aplicado nos endpoints sensíveis | ✅ |
| V4 | Proteção contra brute force (rate limiting Redis) | ✅ |
| V5 | Validação de entrada via Pydantic | ✅ |
| V6 | Codificação de saída consistente (FastAPI JSON) | ✅ |
| V7 | Gestão de segredos via variáveis de ambiente | ✅ |
| V8 | Logging seguro sem dados sensíveis | ✅ |
| V9 | Comunicações devem usar TLS (dependente do deploy) | ⚠️ (requer configuração do reverse proxy) |
| V10 | Política de CORS configurável | ✅ |
| V11 | Uploads salvos em storage isolado com validação básica | ✅ |
| V12 | Webhooks assinados com HMAC | ✅ |
