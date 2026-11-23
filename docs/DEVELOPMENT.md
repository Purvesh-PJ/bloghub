# Development Guide

This guide walks you through setting up, running, and contributing to BlogHub on your local machine.

---

## Prerequisites

Ensure you have the following installed before starting:

- **Node.js**: `v20.0.0` or higher (verified with `node -v`)
- **npm**: `v10.0.0` or higher
- **MongoDB**: `v6.0+` running locally on `localhost:27017` or a remote MongoDB Atlas connection string
- **Git**: Installed and configured

---

## Quick Setup

### 1. Clone the repository
```bash
git clone https://github.com/Purvesh-PJ/blogging_platform.git
cd blogging_platform
```

### 2. Install workspace dependencies
BlogHub uses npm workspaces for client and backend:
```bash
npm install --prefix backend
npm install --prefix client
```

### 3. Configure environment variables
Copy the template configuration at the repository root:
```bash
cp .env.example .env
```

Generate secure, random signing keys for JWT authentication:
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(48).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(48).toString('hex'))"
```

Update your `.env` with the generated values:
```ini
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:4000
MONGO_DB_URI=mongodb://127.0.0.1:27017/bloghub
JWT_SECRET=<generated_access_secret>
JWT_REFRESH_SECRET=<generated_refresh_secret>
```

### 4. Seed development data
Populate the local database with sample tags, posts, and pre-configured accounts:
```bash
npm --prefix backend run seed
```

This creates two ready-to-use accounts:
- **Author account:** `john@example.com` / `password123`
- **Admin account:** `admin@bloghub.com` / `admin123`

---

## Running the Servers

Start both servers concurrently from the repository root:
```bash
npm run dev
```

Or start them in separate terminal windows:
```bash
# Terminal 1: Backend API (port 4000)
cd backend && npm run dev

# Terminal 2: Vite Web Client (port 3000)
cd client && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Code Quality and Verification

Run these checks before committing changes:

```bash
# Run all tests across backend and client
npm test

# Run code linters (including strict design token enforcement)
npm run lint

# Check code formatting with Prettier
npm run format:check

# Verify frontend production build
npm run build
```

---

## Branching and Commit Workflow

We follow standard GitHub flow:

1. **Branch naming:**
   - `feat/<description>` — New features
   - `fix/<description>` — Bug fixes
   - `refactor/<description>` — Code refactoring without behavior changes
   - `docs/<description>` — Documentation additions or updates
   - `test/<description>` — Test additions or test harness updates

2. **Commit conventions:**
   Use Conventional Commits format (`type(scope): description`):
   ```bash
   git commit -m "feat(posts): add tag filtering on discovery feed"
   git commit -m "fix(auth): handle expired token error on page reload"
   ```
