# Contributing to BlogHub

Guidelines for developing, testing, and submitting contributions to BlogHub.

---

## Development Setup

1. **Clone & Setup:**
   ```bash
   git clone https://github.com/Purvesh-PJ/blogging_platform.git
   cd blogging_platform
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
   - Backend API (`http://localhost:4000`): `npm run dev --prefix backend`
   - Client App (`http://localhost:3000`): `npm run dev --prefix client`

---

## Branching & Git Workflow

We follow standard GitHub flow:

1. **Branch Naming:**
   - `feat/<topic>` — New features and enhancements.
   - `fix/<topic>` — Bug fixes.
   - `docs/<topic>` — Documentation improvements.
   - `chore/<topic>` — Tooling and maintenance.

2. **Commit Convention:**
   Use Conventional Commits:
   - `feat(auth): add refresh token rotation`
   - `fix(editor): fix split-pane scrolling desync`
   - `docs: update setup steps in readme`

3. **Pre-commit Verification:**
   Before pushing, verify that all linting checks and automated tests pass:
   ```bash
   npm run lint               # Enforces code safety, React rules, and design tokens
   npm run format:check       # Prettier code formatting check
   npm test                   # Runs full test suite (336 tests: backend + client)
   ```
   *Note: Client linting strictly blocks raw palette colors (`sky-*`, `red-*`) and arbitrary syntax (`[#hex]`, `rounded-[...px]`). Always use design tokens from `client/src/index.css`.*

---

## Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push -u origin <branch-name>
   ```
2. Open a Pull Request targeting `main`.
3. Fill in the provided PR template (Context, Changes, Verification).
4. Ensure all CI automated checks pass before requesting review.
