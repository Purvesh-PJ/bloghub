# Changelog

All notable changes to BlogHub are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.0.0] - Initial Release

### 🚀 Features
- **Publishing Studio**: Markdown writing studio with live preview, auto-slugs, image covers, and draft/public visibility.
- **Reading Experience**: High-performance reading view, topic carousels, responsive typography, and full-text search.
- **Community & Social**: User profiles, one-level threaded comments, post likes, and author follows.
- **Analytics & Insights**: Author dashboard with read-through rate, post opens, and traffic analytics.
- **Admin Console**: Centralised administration with user management, post moderation, tags, and audit activity.

### 🛡️ Security & Architecture
- **Auth**: Secure JWT authentication with HTTP-only cookies, refresh token rotation, and role-based access control.
- **Backend**: Express API Gateway with Helmet, strict rate-limiting, MongoDB compound indexing, and input sanitization.
- **Frontend**: React 19 SPA with Vite 7, TanStack Query v5 caching, and accessible Radix UI primitives.
- **Design System Tokens & Theme Architecture**: Built unified Tailwind CSS v4 `@theme` design tokens in `client/src/index.css` defining semantic colors (`primary`, `destructive`, `warning`, `success`, `info`, `scrim`, `primary-dark`), a standardized border-radius scale (`rounded-xs` through `rounded-4xl`), and micro-typography tokens (`text-2xs`, `text-caption`). Fully migrated all client components to design tokens, achieved 0 `design-system/enforce-tokens` errors, and established strict component reuse and token rules in `AGENTS.md`.
- **Automated Code Quality & Security Enforcement**: Added a native ESLint Design System Token Enforcer (`design-system/enforce-tokens`) and accessibility enforcement (`eslint-plugin-jsx-a11y`) to block raw HSL brackets, arbitrary HEX colors, raw palette classes, and arbitrary radii. Enforced strict JavaScript, React, and backend security rules (`eqeqeq`, `no-var`, `prefer-const`, `no-eval`, `no-implied-eval`, `no-async-promise-executor`, `react-hooks/exhaustive-deps: 'error'`, `react/jsx-key: 'error'`, `react/no-danger: 'error'`).
- **System Architecture Specification**: Added comprehensive [ARCHITECTURE.md](ARCHITECTURE.md) documenting decoupled 3-tier topology (React 19 SPA -> Express 4 API -> MongoDB 6+), request execution pipeline separating public routes from auth-guarded flows, Mongoose ERD across 9 collections, dual-token authentication sequence flows, reading dwell-time algorithms, and security threat model.
- **Architecture Decision Records (ADRs)**: Established `docs/adr/` with 7 foundational ADRs (ADR-0001 through ADR-0007) recording context, evaluated alternatives, decisions, and trade-offs for decoupling, live token revocation, concurrency indexes, trending algorithm, privacy-preserving HMAC telemetry, in-memory token storage, and ephemeral database testing.

### 🧪 Testing & Coverage
- **Backend Test Architecture**: Restructured backend tests into clean `tests/unit/` (fast, database-free) and `tests/integration/` (in-memory MongoDB) hierarchies.
- **Backend Unit & Integration Tests**: Added unit suites for validators, middlewares, and utils, plus integration suites for view deduplication and user settings (190 tests, 91.73% line coverage).
- **Frontend Test Suite**: Built complete unit and integration test coverage across custom hooks, route guards, auth/theme context, and all core/secondary pages (146 tests, 18 suites).
- **Frontend `__tests__/` Organization**: Co-located all client test files into dedicated `__tests__/` subfolders across feature directories.
- **Coverage Tooling**: Configured `@vitest/coverage-v8` for client test coverage reporting via `npm run test:coverage`.

### 🛠️ Developer Experience & Tooling
- **Root Orchestration**: Added root `package.json` with unified full-stack scripts (`npm test`, `npm run test:coverage`, `npm run lint`).
- **Issue Templates**: Added standard GitHub issue templates for tasks, bug reports, and feature requests under `.github/ISSUE_TEMPLATE/`.
- **Documentation**: Synchronized `README.md` with full-stack test counts (328 passing tests), coverage metrics, root command tables, decoupled 3-tier architecture diagram, and fixed screenshot image paths with explicit relative prefixes.
