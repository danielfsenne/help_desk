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

## Roadmap

### V1 — MVP
- [ ] Cadastro e login
- [ ] Criar chamado
- [ ] Listar/visualizar chamados
- [ ] Alterar status
- [ ] Comentários
- [ ] Categorias e prioridade

### V2
- [ ] JWT + RBAC
- [ ] Atribuição de atendente
- [ ] Dashboard, filtros e busca
- [ ] Anexos

### V3
- [ ] SLA
- [ ] Notificações
- [ ] Relatórios e auditoria
