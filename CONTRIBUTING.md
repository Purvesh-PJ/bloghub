# Contributing to BlogHub

Thank you for contributing to BlogHub. This document outlines the streamlined process for developing, testing, and submitting contributions.

---

## 🚀 Quick Development Setup

1. **Clone & Setup:**
   ```bash
   git clone https://github.com/Purvesh-PJ/bloghub.git
   cd bloghub
   cp .env.example .env
   ```

2. **Install Dependencies:**
   ```bash
   npm install --prefix backend
   npm install --prefix client
   ```

3. **Seed Database (Local MongoDB required):**
   ```bash
   npm run seed --prefix backend
   ```

4. **Run Dev Servers:**
   - Backend API (`http://localhost:5000`): `npm run dev --prefix backend`
   - Client App (`http://localhost:3000`): `npm run dev --prefix client`

For deep architecture and documentation, see [docs/README.md](docs/README.md).

---

## 🌿 Branching & Git Workflow

We follow standard GitHub flow:

1. **Branch Naming:**
   - `feat/<topic>` — For new features and enhancements.
   - `fix/<topic>` — For bug fixes.
   - `docs/<topic>` — For documentation improvements.
   - `chore/<topic>` — For tooling and maintenance.

2. **Commit Convention:**
   Use clear conventional commit messages:
   - `feat(auth): add redis token blacklist`
   - `fix(editor): fix split-pane scrolling desync`
   - `docs: update setup steps in getting-started`

3. **Testing Before Commits:**
   Ensure all automated integration and unit tests pass:
   ```bash
   npm test --prefix backend   # Runs 125 Jest integration tests
   npm test --prefix client    # Runs 73 Vitest client tests
   ```

---

## 📬 Submitting a Pull Request (PR)

1. Push your branch to GitHub:
   ```bash
   git push -u origin <branch-name>
   ```
2. Open a Pull Request targeting `main`.
3. Fill in the provided PR template (Context, Changes, Verification).
4. Automated checks and code reviews will run against the PR.
