# Inventory Management System

Enterprise-grade inventory management platform built as a **pnpm + Turborepo monorepo**.  
Designed as a production-style portfolio project: clean architecture, strong typing, and incremental feature delivery.

## Monorepo layout

```text
apps/
  api/          Express + TypeScript REST API
  web/          Next.js + React + Tailwind frontend
packages/
  types/        Shared TypeScript contracts (API envelopes, roles, …)
  ui/           Shared UI primitives
  configs/
    typescript/ Shared TSConfigs (strict mode)
    eslint/     Shared ESLint flat configs
```

## Stack

| Area    | Technology                                                             |
| ------- | ---------------------------------------------------------------------- |
| Tooling | pnpm workspaces, Turborepo, TypeScript strict, ESLint, Prettier, Husky |
| API     | Node.js, Express, Prisma (next), JWT + RBAC (next)                     |
| Web     | Next.js, React, TanStack Query (next), Axios (next), RHF + Zod (next)  |
| Data    | PostgreSQL (next)                                                      |

## Prerequisites

- Node.js **≥ 20**
- [pnpm](https://pnpm.io/) **9.x** (this repo pins `packageManager`)

## Getting started

```bash
# Install dependencies (from repo root)
pnpm install

# Copy env examples
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Run all apps in development
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000
- Health: http://localhost:4000/health

## Scripts

| Command          | Description                                     |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | Start all packages/apps in watch mode via Turbo |
| `pnpm build`     | Build the entire graph                          |
| `pnpm lint`      | Lint all workspaces                             |
| `pnpm typecheck` | Type-check all workspaces                       |
| `pnpm format`    | Format with Prettier                            |

## Architecture principles

- **Separation of concerns** — API layers (routes → controllers → services → repositories) arrive with domain features
- **Shared contracts** — `@ims/types` owns response envelopes so web and API never drift
- **Shared tooling** — one TypeScript/ESLint/Prettier standard across the monorepo
- **Incremental delivery** — features land one at a time with Conventional Commits

## Development workflow

1. Explain the next feature
2. Implement **only that feature**
3. Review, commit, confirm
4. Repeat

## License

Private / portfolio use.
