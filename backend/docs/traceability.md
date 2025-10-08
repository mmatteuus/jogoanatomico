# Tabela de Rastreabilidade

| Tela / Fluxo (Figma) | Caso de Uso | Endpoint / Evento | Entidades Impactadas |
|----------------------|-------------|-------------------|----------------------|
| Onboarding | Criar perfil inicial | `POST /v1/auth/register` | User, UserSystemProgress, MissionProgress |
| Home / Dashboard | Consultar resumo | `GET /v1/dashboard/summary` | User, MissionProgress |
| Missões Diárias | Atualizar progresso | `POST /v1/missions/{id}/progress` | MissionProgress, User |
| Modos de Jogo (Sprint/OSCE/SRS) | Iniciar sessão de quiz | `POST /v1/quizzes/sessions` | QuizSession, QuizQuestion |
| Quiz Resultado | Finalizar sessão | `POST /v1/quizzes/sessions/{id}/complete` | QuizSession |
| Campanha | Listar/seguir lições | `GET /v1/campaigns`, `POST /v1/campaigns/lessons/{id}/progress` | Campaign, CampaignProgress |
| Explorar 3D | Consultar estruturas | `GET /v1/anatomy/structures` | AnatomyStructure |
| Ranking | Ver leaderboard | `GET /v1/leaderboard` | LeaderboardSnapshot, User |
| Perfil | Atualizar preferências | `PATCH /v1/users/me`, `POST /v1/users/me/preferences` | User |
| Configurações | Alternar tema/notificações | `POST /v1/users/me/preferences` | User |
| Dashboard Professor | Gerenciar turma | `POST /v1/classrooms`, `GET /v1/classrooms/{id}/roster` | Classroom, ClassroomMembership |
| Webhooks | Integrações externas | `POST /v1/webhooks`, `POST /v1/webhooks/test` | WebhookSubscription |
| Upload de Assets | Enviar modelos 3D | `POST /v1/anatomy/assets` | AnatomyStructure |
