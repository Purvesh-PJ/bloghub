# Changelog

Notable changes to BlogHub, newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Load tests for the health, trending, and search endpoints.
- Structured request logging, with a request ID on every response. Passwords and tokens are masked in logs.

### Changed

- The trending feed is cached for 60 seconds, so it responds much faster under load.
- Story search is faster, using text and tag indexes.

### Removed

- The older Morgan request logger, replaced by structured logging.

### Security

- Added a command that scans client and backend dependencies for known vulnerabilities.

## [1.0.0] - 2026-11-08

### Added

- Publishing studio: Markdown editor with live preview, automatic URL slugs, cover images, and draft or public visibility.
- Article reader with sanitized Markdown, code highlighting, and full-text search.
- Read-through analytics based on scroll depth and time on page.
- Trending feed that ranks stories from the last 14 days.
- User profiles, threaded comments, likes, and follows.
- Admin dashboard for stories, tags, user roles, and activity logs.
- Shared design system with light and dark themes, and lint rules that enforce it.
- Automated tests for the backend and the client.
- Bundle size limits and Lighthouse checks.
- Architecture docs and decision records.

### Fixed

- Inconsistent spacing and corner radius in the article reader.
- Hardcoded colors replaced with theme tokens.
- Duplicate admin and workspace layouts merged, and the mobile drawer is now usable with a keyboard.
- Accessibility, SEO, and performance issues found by Lighthouse: missing `robots.txt`, low color contrast, heading order, and too much JavaScript loaded up front.

### Security

- Sign-in with short-lived access tokens and refresh tokens, silent refresh, and instant session revocation.
- Security headers, a strict CORS policy, and rate limits on login and write endpoints.
- Server-side validation and sanitization of Markdown to prevent XSS.
