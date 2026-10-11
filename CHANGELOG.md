# Changelog

All notable changes to BlogHub are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
