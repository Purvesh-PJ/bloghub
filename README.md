# BlogHub

An open-source publishing platform focused on read-through engagement analytics, live Markdown authoring, and platform moderation.

[![CI](https://github.com/Purvesh-PJ/blogging_platform/actions/workflows/ci.yml/badge.svg)](https://github.com/Purvesh-PJ/blogging_platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**[Live Demo](https://bloghub-gold.vercel.app/)** · [Architecture](ARCHITECTURE.md) · [API Reference](docs/API.md) · [Development](docs/DEVELOPMENT.md) · [Design System](docs/DESIGN_SYSTEM.md) · [Testing](docs/TESTING.md)

---

## What it does

Most publishing tools only report clicks. BlogHub measures **read-through rate**: tracking viewport scroll depth and active dwell time to determine when a reader actually finishes an article.

- **Readers:** Focused 720px reading typography, light/dark themes, 14-day engagement trending feed, threaded discussions, and unique likes.
- **Authors:** Split-pane live Markdown studio, automatic slug generation, draft recovery, cover image support, and story read-completion telemetry.
- **Moderators:** Administrative dashboard, story visibility control, instant multi-session revocation, and activity audit logs.

![BlogHub preview](./client/public/screenshots/landing.png)

---

## Quick Start

### 1. Clone and install dependencies
```bash
git clone https://github.com/Purvesh-PJ/blogging_platform.git
cd blogging_platform
cp .env.example .env
npm install --prefix backend && npm install --prefix client
```

### 2. Configure environment
Edit `.env` at the repository root and add your MongoDB connection string and signing secrets. Generate random keys with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Seed demo accounts (optional)
```bash
npm --prefix backend run seed
```
Creates pre-populated stories and demo credentials:
- **Author:** `john@example.com` / `password123`
- **Admin:** `admin@bloghub.com` / `admin123`

### 4. Start development
```bash
# Terminal 1: Backend API (port 4000)
cd backend && npm run dev

# Terminal 2: Web Client (port 3000)
cd client && npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Documentation Directory

Deep dive guides are organized by single responsibility:

| Document | Focus |
|---|---|
| 💻 **[Development Guide](docs/DEVELOPMENT.md)** | Step-by-step local setup, environment variables, seeding, and Git workflow |
| 📡 **[API Reference](docs/API.md)** | REST endpoints, response envelopes, authentication headers, and error shapes |
| 🧪 **[Testing Guide](docs/TESTING.md)** | In-memory hermetic database testing, Vitest/Jest suites, and verification commands |
| 🎨 **[Design System](docs/DESIGN_SYSTEM.md)** | 3-tier UI architecture, role-based tokens, CVA primitives, and automated lint rules |
| 🚀 **[Deployment Guide](docs/DEPLOYMENT.md)** | Production builds, Vercel/Node hosting, reverse proxy configuration, and health probes |
| 🏛️ **[System Architecture](ARCHITECTURE.md)** | System topology, Mongoose ERD across 9 collections, token refresh, and algorithms |
| 📜 **[Architecture Decision Records](docs/adr/README.md)** | Historical engineering trade-offs and rationale behind key architectural choices |

---

## Primary Verification Commands

Run these scripts from the repository root:

```bash
# Run full automated test suite (340+ tests across client and backend)
npm test

# Run ESLint with strict design token enforcement
npm run lint

# Check formatting with Prettier
npm run format:check

# Build frontend production bundle
npm run build
```

---

## License

Released under the [MIT License](LICENSE).
