# Changelog

All notable changes to BlogHub are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-07

### Added
- **Publishing Studio:** Markdown authoring workspace with live split-pane preview, auto-generated URL slugs, cover image support, and draft or public visibility controls.
- **Reading Experience:** Distraction-free article reader with sanitized markdown rendering, code syntax highlighting, responsive typography, and full-text search.
- **Read-Through Analytics:** Telemetry tracking viewport dwell time and scroll completion to measure verified article read rates rather than superficial clicks.
- **Trending Algorithm:** Time-weighted discovery feed ranking stories published within a 14-day window by read engagement.
- **Community & Discussions:** User profiles, threaded comments, article likes, and author follows with database-level duplicate prevention.
- **Administration & Moderation:** Management dashboard for reviewing stories, managing tags, updating user roles, and viewing site-wide activity logs.
- **Design System & Theme Tokens:** Standardized semantic theme tokens, border-radius scales, and micro-typography across light and dark reading modes, alongside accessible Checkbox, SearchInput, and TableSkeleton primitives.
- **Full-Stack Test Suite:** 339 automated tests spanning unit validations, in-memory database integration flows, and frontend interaction scenarios.
- **Architecture Documentation:** System architecture specifications and 9 Architecture Decision Records (ADRs) under `docs/adr/`.

### Security
- Dual-token JWT authentication with HTTP-only cookies, automatic silent refresh rotation, and instant server-side session revocation.
- Security headers configured via Helmet and strict origin-pinned CORS policies.
- IP-based rate limiting on sensitive authentication and mutation endpoints.
- Server-side input validation and HTML sanitization on all markdown content to prevent XSS.

### Fixed
- Inconsistent container padding and corner radiuses across article reader views.
- Color contrast and hardcoded color literals unified into the central design token scale.
- Redundant workspace and admin shell layouts consolidated, eliminating duplicate code and fixing mobile drawer keyboard accessibility.
