# BlogHub

An open-source publishing platform focused on read-through engagement analytics, live Markdown authoring, and platform moderation.

[![CI](https://github.com/Purvesh-PJ/blogging_platform/actions/workflows/ci.yml/badge.svg)](https://github.com/Purvesh-PJ/blogging_platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**[Live Demo](https://bloghub-gold.vercel.app/)** · [Architecture](ARCHITECTURE.md) · [Changelog](CHANGELOG.md) · [ADRs](docs/adr/) · [Contributing](CONTRIBUTING.md)

---

## What it does

Most publishing tools report clicks. BlogHub tracks **read-through rate**: viewport scroll depth and dwell time to measure how many visitors finish an article.

- **Readers:** 720px focused reading column, light and dark themes, 14-day trending feed, threaded comments, and likes.
- **Authors:** Split-pane live Markdown editor, auto-slugs, image cover support, draft/public visibility, and read completion analytics.
- **Moderators:** Story visibility control, user management, instant session revocation, and audit logs.

![BlogHub preview](./client/public/screenshots/landing.png)

---

## Quick Start

### Prerequisites
- Node.js 18.0.0 or later
- MongoDB 6.0+ (local instance or MongoDB Atlas)

### 1. Clone and install
```bash
git clone https://github.com/Purvesh-PJ/blogging_platform.git
cd blogging_platform
cp .env.example .env
npm install --prefix backend && npm install --prefix client
```

### 2. Configure environment
Edit `.env` at the repository root. Generate secure signing secrets:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Required variables:
- `MONGO_DB_URI`: MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/bloghub`).
- `JWT_SECRET` and `JWT_REFRESH_SECRET`: Distinct secrets for access (15m) and refresh (7d) tokens.
- `CLIENT_URL` (`http://localhost:3000`) and `VITE_API_URL` (`http://localhost:4000`).

### 3. Seed demo accounts (optional)
```bash
npm --prefix backend run seed
```
Seeds test stories and two local accounts:
- **Author:** `john@example.com` / `password123`
- **Admin:** `admin@bloghub.com` / `admin123`

### 4. Run development servers
```bash
# Terminal 1: API (port 4000)
cd backend && npm run dev

# Terminal 2: Web client (port 3000)
cd client && npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Commands and Testing

Run all scripts from the repository root:

| Command | Action |
|---|---|
| `npm test` | Run full test suite (349 tests: 190 backend + 159 client) |
| `npm run test:backend` | Run backend Jest tests (unit and in-memory integration) |
| `npm run test:client` | Run client Vitest tests |
| `npm run test:coverage` | Generate coverage reports for both workspaces |
| `npm run lint` | Run ESLint with token enforcement across client and backend |
| `npm run format:check` | Verify formatting with Prettier |
| `npm run build` | Build the client production bundle |

---

## Architecture & Documentation

BlogHub is structured as a decoupled three-tier application: React 19 SPA, Express 4 REST API, and MongoDB 6+.

- **[ARCHITECTURE.md](ARCHITECTURE.md):** System topology, Mongoose ERD across 9 collections, authentication flow, and security boundaries.
- **[docs/adr/](docs/adr/):** 10 Architecture Decision Records documenting structural choices, design system patterns, trending algorithms, and telemetry design.
- **[CHANGELOG.md](CHANGELOG.md):** Version history following Keep a Changelog.
- **[CONTRIBUTING.md](CONTRIBUTING.md):** Contribution workflow and conventions.

---

## License

Released under the [MIT License](LICENSE).
