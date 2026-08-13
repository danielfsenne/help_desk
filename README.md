# Help Desk

Sistema de chamados (help desk) com 3 perfis de usuário: **ADMIN**, **ATENDENTE** e **CLIENTE**.

## Stack

- **Backend:** Java 17, Spring Boot, Spring Web, Spring Data JPA, Spring Security, Bean Validation, PostgreSQL, Maven
- **Frontend:** React, TypeScript, Axios, React Router

## Estrutura

```
help_desk/
├── backend/    # API REST em Spring Boot
└── frontend/   # SPA em React
```

## Produção

- **Frontend:** https://help-desk-pearl-beta.vercel.app (Vercel)
- **Backend:** https://help-desk-b35f.onrender.com (Render, free tier — hiberna após inatividade, primeira requisição pode demorar ~1 min)
- **Banco:** PostgreSQL gerenciado (Neon)

### Variáveis de ambiente

**Backend (Render):**
| Variável | Descrição |
|---|---|
| `DATABASE_URL` | JDBC URL do Postgres, ex: `jdbc:postgresql://host/db?sslmode=require` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciais do banco |
| `JWT_SECRET` | Segredo para assinatura dos tokens JWT |
| `CORS_ALLOWED_ORIGINS` | Origens liberadas para CORS (URL do frontend) |
| `PORT` | Definida automaticamente pelo Render |

**Frontend (Vercel):**
| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL da API backend, ex: `https://help-desk-b35f.onrender.com/api` |

> Observação: no free tier do Render o filesystem é efêmero — anexos enviados (`FILE_UPLOAD_DIR`) são perdidos a cada redeploy/restart do serviço.

## Roadmap

### V1 — MVP
- [x] Cadastro e login
- [x] Criar chamado
- [x] Listar/visualizar chamados
- [x] Alterar status
- [x] Comentários
- [x] Categorias e prioridade

### V2
- [x] JWT + RBAC
- [x] Atribuição de atendente
- [x] Dashboard, filtros e busca
- [x] Anexos

### V3
- [x] SLA
- [x] Notificações
- [x] Relatórios e auditoria
