# Changelog

All notable changes to BlogHub are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-08

### Added
- **Publishing Studio:** Markdown authoring workspace with live split-pane preview, auto-generated URL slugs, cover image support, and draft or public visibility controls.
- **Reading Experience:** Distraction-free article reader with sanitized markdown rendering, code syntax highlighting, responsive typography, and full-text search.
- **Read-Through Analytics:** Telemetry tracking viewport dwell time and scroll completion to measure verified article read rates rather than superficial clicks.
- **Trending Algorithm:** Time-weighted discovery feed ranking stories published within a 14-day window by read engagement.
- **Community & Discussions:** User profiles, threaded comments, article likes, and author follows with database-level duplicate prevention.
- **Administration & Moderation:** Management dashboard for reviewing stories, managing tags, updating user roles, and viewing site-wide activity logs.
- **3-Tier UI Architecture & Composed Patterns:** Standardized 9 canonical composed patterns (`PageHeader`, `DataTableCard`, `DataView`, `FilterToolbar`, `StatsGrid`, `SettingSection`, `ChoiceGrid`, `ConfirmDialog`, `BulkActionBar`) in `src/components/patterns/`, composed 100% of core primitives to eliminate UI duplication across all user and administrative screens.
- **Design System & Theme Tokens:** Standardized semantic theme tokens, border-radius scales, and micro-typography across light and dark reading modes, alongside accessible Checkbox, SearchInput, and TableSkeleton primitives.
- **Full-Stack Test Suite:** 349 automated tests (190 backend unit and in-memory integration tests + 159 client component and interaction tests).
- **Frontend Performance & Bundle Budget Tooling:** Configured `rollup-plugin-visualizer` for interactive treemap analysis, `size-limit` for bundle size budget enforcement, and `@lhci/cli` (Lighthouse CI) scoring 90%+ across Performance, Accessibility, Best Practices, and SEO.
- **Architecture Documentation:** System architecture specifications and 10 Architecture Decision Records (ADRs) under `docs/adr/`.

### Security
- Dual-token JWT authentication with HTTP-only cookies, automatic silent refresh rotation, and instant server-side session revocation.
- Security headers configured via Helmet and strict origin-pinned CORS policies.
- IP-based rate limiting on sensitive authentication and mutation endpoints.
- Server-side input validation and HTML sanitization on all markdown content to prevent XSS.

### Fixed
- Inconsistent container padding and corner radiuses across article reader views.
- Color contrast and hardcoded color literals unified into the central design token scale.
- Redundant workspace and admin shell layouts consolidated, eliminating duplicate code and fixing mobile drawer keyboard accessibility.
- Ad-hoc HTML elements and duplicate async state ladders across screens replaced with canonical composed patterns, guaranteeing 100% primitive compliance and zero ESLint token violations.
- **Lighthouse CI Audits (#13, #14, #15):**
  - Generated valid `robots.txt` directives for crawler indexing, raising SEO score to 100% (#13).
  - Corrected primary token contrast (4.88:1 light, 9.4:1 dark), aligned search label names, and normalized sequential heading hierarchy (`h1 -> h2 -> h3`), raising Accessibility to 100% (#14).
  - Code-split route pages and decoupled layout shells from feature barrels, eliminating ~1.1 MB of unused JavaScript on initial load and raising Performance score to 97% (#15).
