# Changelog

All notable changes to BlogHub are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Design System Token Architecture**: Added Tailwind CSS v4 `@theme` block in `client/src/index.css` defining semantic color variables, border-radius scale (`rounded-xs` to `rounded-4xl`), and typography tokens (`text-2xs`, `text-caption`).
- **ESLint Design System Token Enforcer**: Added custom `design-system/enforce-tokens` rule in `client/eslint.config.js` to block raw HSL brackets, arbitrary HEX values, arbitrary border-radii, and hardcoded font sizes.
- **Strict Code Safety Rules**: Added `eqeqeq`, `no-var`, `prefer-const`, `no-duplicate-imports`, `no-unneeded-ternary`, and `no-empty` checks across both client and backend ESLint configurations.
- **Backend & React Safety Rules**: Added `no-eval`, `no-implied-eval`, `no-async-promise-executor`, and `no-promise-executor-return` in backend ESLint; upgraded `react-hooks/exhaustive-deps` to error and enabled `react/jsx-key`, `react/no-danger`, and `react/self-closing-comp` in client ESLint.

### Changed
- **Component Styling Standardization**: Standardized styling across all 80 client components (primitives, layouts, and feature pages) to use semantic Tailwind utility classes instead of raw bracket values.

### Fixed
- **Legacy Border Hack Removal**: Removed the legacy `!important` border override hack from `client/src/index.css`.
- **Lint & Syntax Corrections**: Fixed loose inequality check in `PostCard.jsx`, promise executor return values in `backend/scripts/seed.js` and `backend/tests/integration/profile.test.js`, and an arbitrary border radius in `PostDetailSkeleton.jsx`.

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
- **Design & Styling**: Unified design tokens with Tailwind CSS v4 and full dark mode support.
- **System Architecture Specification**: Added comprehensive [ARCHITECTURE.md](ARCHITECTURE.md) documenting decoupled 3-tier topology (React 19 SPA -> Express 4 API -> MongoDB 6+), request execution pipeline separating public routes from auth-guarded flows, Mongoose ERD across 9 collections, dual-token authentication sequence flows, reading dwell-time algorithms, and security threat model.
- **Architecture Decision Records (ADRs)**: Established `docs/adr/` with 7 foundational ADRs (ADR-0001 through ADR-0007) recording context, evaluated alternatives, decisions, and trade-offs for decoupling, live token revocation, concurrency indexes, trending algorithm, privacy-preserving HMAC telemetry, in-memory token storage, and ephemeral database testing.

### 🧪 Testing & Coverage
- **Backend Test Architecture**: Restructured backend tests into clean `tests/unit/` (fast, database-free) and `tests/integration/` (in-memory MongoDB) hierarchies.
- **Backend Unit & Integration Tests**: Added unit suites for validators, middlewares, and utils, plus integration suites for view deduplication and user settings (190 tests, 91.73% line coverage).
- **Frontend Test Suite**: Built complete unit and integration test coverage across custom hooks, route guards, auth/theme context, and all core/secondary pages (138 tests, 15 suites).
- **Frontend `__tests__/` Organization**: Co-located all client test files into dedicated `__tests__/` subfolders across feature directories.
- **Coverage Tooling**: Configured `@vitest/coverage-v8` for client test coverage reporting via `npm run test:coverage`.

### 🛠️ Developer Experience & Tooling
- **Root Orchestration**: Added root `package.json` with unified full-stack scripts (`npm test`, `npm run test:coverage`, `npm run lint`).
- **Issue Templates**: Added standard GitHub issue templates for tasks, bug reports, and feature requests under `.github/ISSUE_TEMPLATE/`.
- **Documentation**: Synchronized `README.md` with full-stack test counts (328 passing tests), coverage metrics, root command tables, decoupled 3-tier architecture diagram, and fixed screenshot image paths with explicit relative prefixes.
