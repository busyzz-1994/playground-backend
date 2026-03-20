# Copilot Instructions

## Architecture

Express 5 + TypeScript + Prisma 7 + PostgreSQL backend. All routes are under `/api`.

```
Request → app.ts (express.json, cookieParser) → /api router
  → [auth middleware] → Controller → Service → Prisma (db.ts) → PostgreSQL
                                                   ↓
                                             errorHandler (last middleware)
```

Key directories:

- [src/controllers/](src/controllers/) — HTTP handlers (validate → delegate → respond)
- [src/services/](src/services/) — data access via Prisma (pure functions)
- [src/schemas/](src/schemas/) — Zod schemas + inferred types
- [src/routes/](src/routes/) — route registration
- [src/middlewares/](src/middlewares/) — `auth` (JWT cookie) and `errorHandler`
- [src/generated/prisma/](src/generated/prisma/) — generated Prisma client (do not edit)

## Code Style

- **Strict TypeScript** (`"strict": true`, target ES2020, commonjs modules)
- **Controller pattern**: validate with Zod `safeParse` → call service → return `{ code, message, data }` JSON envelope → `next(err)` for unexpected errors
- **Service pattern**: pure async functions, import `prisma` from [src/db.ts](src/db.ts), never import prisma elsewhere
- **Validation**: Zod v4 schemas in `src/schemas/`, export inferred types via `z.infer<>` and use them as function argument types end-to-end
- **Password**: always hash with `bcrypt.hash(password, 10)` before storing; never return `password` field in responses (use `select` to exclude it)
- **Response shape**: `{ code: number, message: string, data?: unknown }` — see [src/controllers/user.controller.ts](src/controllers/user.controller.ts)

## Build and Test

```bash
pnpm install          # install dependencies
pnpm dev              # ts-node src/index.ts (port 4000)
pnpm build            # tsc → dist/
pnpm start            # node dist/index.js
pnpm db:migrate       # prisma migrate dev (create + apply migration)
pnpm db:generate      # prisma generate (regenerate client after schema change)
pnpm db:update        # migrate + generate in one step
pnpm db:studio        # open Prisma Studio
```

## Project Conventions

- **Auth**: JWT stored in `HttpOnly` cookie named `token`, signed with `JWT_SECRET`. The `auth` middleware attaches `{ userId, email }` to `req.user`. Protect routes by passing `auth` as middleware — see [src/routes/user.route.ts](src/routes/user.route.ts).
- **Pagination**: `page` (min 1) and `pageSize` (clamp 1–100) from query params — see `getUsers` in [src/services/user.service.ts](src/services/user.service.ts).
- **Prisma client**: imported from `./generated/prisma` (custom output path), instantiated once in [src/db.ts](src/db.ts) using `@prisma/adapter-pg`.
- **Schema changes**: edit `prisma/schema.prisma` → run `pnpm db:update` to migrate and regenerate the client.
- **Error handling**: unexpected errors are forwarded via `next(err)` and caught by [src/middlewares/errorHandler.ts](src/middlewares/errorHandler.ts), which returns `{ code: 500, message: "服务器内部错误" }`.

## Integration Points

- **PostgreSQL**: connection via `DATABASE_URL` env var, accessed through Prisma with the `@prisma/adapter-pg` driver adapter (no binary engine)
- **Environment variables required**: `DATABASE_URL`, `JWT_SECRET`; optional: `PORT` (default `4000`), `NODE_ENV`, `JWT_EXPIRES_IN` (default `"7d"`)
- **Prisma config**: [prisma.config.ts](prisma.config.ts) uses Prisma 7's `defineConfig` API

## Data Models

```
User  { id, userName, password, email (unique), createdAt, posts[] }
Post  { id, title, content?, published, createdAt, updatedAt, userId → User }
```
