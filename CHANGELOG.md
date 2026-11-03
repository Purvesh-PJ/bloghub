# Changelog

All notable changes to BlogHub are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🧪 Testing & Coverage
- **Backend Test Architecture**: Restructured backend tests into clean `tests/unit/` (fast, database-free) and `tests/integration/` (in-memory MongoDB) hierarchies.
- **Backend Unit & Integration Tests**: Added unit suites for validators, middlewares, and utils, plus integration suites for view deduplication and user settings (190 tests, 91.73% line coverage).
- **Frontend Test Suite**: Built complete unit and integration test coverage across custom hooks, route guards, auth/theme context, and all core/secondary pages (138 tests, 15 suites).
- **Frontend `__tests__/` Organization**: Co-located all client test files into dedicated `__tests__/` subfolders across feature directories.
- **Coverage Tooling**: Configured `@vitest/coverage-v8` for client test coverage reporting via `npm run test:coverage`.

### 🛠️ Developer Experience & Tooling
- **Root Orchestration**: Added root `package.json` with unified full-stack scripts (`npm test`, `npm run test:coverage`, `npm run lint`).
- **Issue Templates**: Added standard GitHub issue templates for tasks, bug reports, and feature requests under `.github/ISSUE_TEMPLATE/`.
- **Documentation**: Updated `README.md` with full-stack test counts (328 passing tests), coverage metrics, root command tables, and fixed screenshot image paths with explicit relative prefixes.

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
