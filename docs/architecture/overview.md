# Architecture Overview

> **Scope:** the repository as a whole — system shape, annotated tree, workspace boundaries,
> module responsibilities and the dependency rules between them.
> **Excludes:** the internals of each side ([frontend.md](frontend.md),
> [backend.md](backend.md), [database.md](../reference/database.md)) and file-placement conventions
> ([guides/development.md](../guides/development.md)).

---

## System shape

A **three-tier application in a single repository** with two independently installed
workspaces.

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                    │
│  React 19 SPA · Vite · styled-components · TanStack Query   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS · JSON · Bearer token
┌───────────────────────────▼─────────────────────────────────┐
│  API                                                        │
│  Node.js · Express 4 · JWT · Mongoose ODM                   │
│  helmet → cors → rate limit → routes → middleware           │
│         → controllers → services → models                   │
└───────────────────────────┬─────────────────────────────────┘
                            │ MongoDB wire protocol
┌───────────────────────────▼─────────────────────────────────┐
│  MongoDB — 11 collections, 13 declared indexes              │
└─────────────────────────────────────────────────────────────┘
```

There is **no root `package.json`** and no workspace manager. `backend/` and `client/` are
installed and scripted separately.

---

## Repository tree

```
bloghub/
│
├── backend/                       # Express API · CommonJS
│   ├── config/
│   │   ├── db.js                  # Mongoose connection, events, graceful shutdown
│   │   └── env.js                 # boot-time configuration validation
│   ├── controllers/               # 12 modules, one per resource
│   ├── middlewares/
│   │   ├── authenticateUser.js    # JWT verification + account check, optional auth, admin gate
│   │   ├── authorizeSelfOrAdmin.js# scopes a :userId route to its owner
│   │   ├── asyncHandler.js        # routes a rejected promise to the error middleware
│   │   ├── validate.js            # terminates a validator chain; validateObjectId
│   │   ├── upload.js              # avatar upload — memory storage, type and size limits
│   │   ├── errorHandler.js        # terminal error middleware, maps errors to statuses
│   │   └── logger.js              # morgan, format switched by NODE_ENV
│   ├── models/                    # 11 Mongoose schemas
│   ├── routes/                    # 12 routers
│   ├── services/                  # post, comment, account purge, trending scoring
│   ├── utils/                     # AppError, visitor keying
│   ├── validators/                # express-validator chains, one module per area
│   ├── tests/                     # jest + supertest against an in-memory MongoDB
│   ├── index.js                   # composition root
│   ├── seed.js                    # sample dataset, guarded against remote targets
│   ├── scripts/migrate.js         # non-destructive repair of an existing database
│   └── package.json
│
├── client/                        # React SPA · ES modules
│   ├── public/screenshots/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # Header, Footer, Layout, AdminLayout,
│   │   │   │                      #   WorkspaceLayout, PageShell, Editorial,
│   │   │   │                      #   ThemeToggle, SkipLink, ErrorBoundary
│   │   │   ├── marketing/         # landing-page-only sections
│   │   │   ├── posts/             # PostCard, AuthorByline, skeletons
│   │   │   ├── stats/             # ReadRateBar
│   │   │   └── ui/                # 21 token-driven primitives + barrel
│   │   ├── config/api.js          # the single Axios instance and interceptors
│   │   ├── context/AuthContext.jsx# authState singleton + provider + hook
│   │   ├── guards/                # ProtectedRoute, AdminRoute
│   │   ├── hooks/                 # useDebounced, useDraftRecovery, useCurrentUser, useReading
│   │   ├── pages/                 # 11 pages + admin/ (4 more)
│   │   ├── services/              # 10 API clients
│   │   ├── styles/                # ThemeProvider + theme/
│   │   ├── App.jsx                # route table, lazy loading
│   │   └── main.jsx               # provider tree
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── tsconfig.json              # ⚠ strict TS config in an all-JavaScript project
│   ├── vite.config.js
│   └── package.json
│
├── docs/
├── .github/workflows/ci.yml       # lint · format · test · build · audit
├── .gitattributes                 # `* text=auto eol=lf` — keeps CRLF out of the tree
├── .env                           # local secrets — git-ignored
├── .env.example
├── LICENSE
├── README.md
└── vercel.json
```

---

## Workspace boundaries

| Property      | `backend/`                  | `client/`                  |
| ------------- | --------------------------- | -------------------------- |
| Module system | CommonJS                    | ES modules                 |
| Language      | JavaScript                  | JavaScript + JSX           |
| Runtime       | Node.js 18+                 | Browser                    |
| Entry point   | `index.js`                  | `src/main.jsx`             |
| Build step    | None                        | Vite → `client/dist`       |
| Install       | `cd backend && npm install` | `cd client && npm install` |
| Test runner   | Jest + Supertest, 61 tests  | **None installed**         |

The two share no code. Their only contract is the HTTP API
([reference/api.md](../reference/api.md)).

---

## Backend layers

```
HTTP request
   ▼
index.js ─────────── composition root: config validation, env, database,
   │                 middleware order, health endpoints, mounting
   ▼
logger ───────────── morgan request line
   ▼
helmet ───────────── security headers
   ▼
cors → body parsers (1 MB limit)
   ▼
rate limit ───────── 300/15min general · 10 failed/15min on /auth
   ▼
routes/*.routes.js ─ path → middleware chain → controller. No logic.
   ▼
authenticateUser ─── verifies the token, populates req.user
authorizeAdmin ───── asserts the admin role
authorizeSelfOrAdmin scopes a :userId route to its owner
   ▼
controllers/ ─────── read the request, call services or models,
   │                 choose the status code, shape the response
   ▼
services/ ────────── multi-step persistence reused by more than one caller
   ▼
models/ ──────────── schemas, constraints and indexes
   ▼
MongoDB
```

Detail in [backend.md](backend.md).

## Frontend layers

```
main.jsx ────── ErrorBoundary → QueryClient → Router → Auth → Theme
   ▼
App.jsx ─────── route table, lazy loading, Suspense boundary
   ▼
guards/ ─────── route-level access decisions (UX, not security)
   ▼
components/layout/ ─ page shells with an <Outlet />
   ▼
pages/ ──────── data orchestration: queries, mutations, local state
   ▼
services/ ───── one function per endpoint; returns response.data
   ▼
config/api.js ─ the single Axios instance; token attach and refresh
```

Detail in [frontend.md](frontend.md).

---

## Dependency rules

The invariants that keep the layering meaningful. A pull request that breaks one should be
sent back.

**Backend**

1. `routes/` may import `controllers/` and `middlewares/` — never `models/`.
2. `controllers/` may import `services/` and `models/` — never `routes/`.
3. `services/` may import `models/` — never `req`/`res`.
4. `models/` import only `mongoose`.
5. Only `index.js`, `config/*` and the auth code read `process.env`.

**Frontend**

1. `pages/` may import `services/`, `components/`, `context/`, `styles/`.
2. `components/ui/` imports only styled-components and other primitives.
3. `services/` import only `config/api`.
4. Only `config/api.js` constructs an Axios instance.
5. Nothing imports from `pages/` except `App.jsx`.

---

## Configuration files

| File                    | Consumed by     | Purpose                                          |
| ----------------------- | --------------- | ------------------------------------------------ |
| `.env`                  | Both workspaces | Local configuration; git-ignored                 |
| `.env.example`          | Humans          | Committed template                               |
| `vercel.json`           | Vercel          | Two builds, API routing, SPA fallback            |
| `client/vite.config.js` | Vite            | Port 3000, `envDir: '../'`, manual chunks        |
| `client/jsconfig.json`  | Editors         | Path alias, JSX hints                            |
| `client/tsconfig.json`  | Nothing         | See [code-quality.md](../guides/code-quality.md) |
| `*/eslint.config.js`    | ESLint 9        | Flat config per workspace                        |
| `*/.prettierrc`         | Prettier        | Formatting per workspace                         |

Both workspaces read the **single root `.env`** — the backend resolves it explicitly, Vite is
pointed at it with `envDir: '../'`. Reference:
[reference/configuration.md](../reference/configuration.md).

---

## Known structural weaknesses

| Observation                                                         | Consequence                                                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| No root `package.json`                                              | Every command runs from a subdirectory; CI must install twice                                     |
| `services/` covers only two of twelve resources                     | Most controllers talk to models directly, so the layer is a convention rather than a rule         |
| The router is mounted at both `/` and `/api`                        | Two public surfaces to secure and document — see [reference/api.md](../reference/api.md#base-url) |
| `client/tsconfig.json` alongside `jsconfig.json`                    | Two overlapping editor configs; the stricter one has no consumer                                  |
| The `@/*` alias is declared but unused, with no matching Vite alias | Using it today would break the build                                                              |
| Page components run 400–1,000+ lines                                | Styled components co-located with page logic; the largest files are hard to review                |
| `errorHandler` is effectively unreachable                           | No controller calls `next(err)` — see [backend.md](backend.md#error-handling)                     |
| No test runner                                                      | The largest risk in the repository ([GAP-11](../product/roadmap.md#gap-11))                       |
