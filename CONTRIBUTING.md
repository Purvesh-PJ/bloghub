# Contributing to BlogHub

Guidelines for developing, testing, and submitting contributions to BlogHub.

---

## Development Setup

Before making changes, set up your local environment, install dependencies, and seed test data by following the step-by-step **[Development Guide](docs/DEVELOPMENT.md)**.

---

## Branching & Git Workflow

We follow standard GitHub flow:

1. **Branch Naming:**
   - `feat/<topic>` — New features and enhancements
   - `fix/<topic>` — Bug fixes
   - `refactor/<topic>` — Code refactoring without behavior changes
   - `docs/<topic>` — Documentation improvements
   - `test/<topic>` — Testing harness and test suite additions

2. **Commit Convention:**
   Use Conventional Commits (`type(scope): description`):
   - `feat(auth): add refresh token rotation`
   - `fix(editor): fix split-pane scrolling desync`
   - `docs: update setup steps in readme`

3. **Pre-commit Verification:**
   Before pushing, verify that all linting checks and automated tests pass:
   ```bash
   npm run lint               # Enforces code safety, React rules, and design tokens
   npm run format:check       # Prettier code formatting check
   npm test                   # Runs full test suite (340+ tests: backend + client)
   ```
   *For design system and UI token guidelines, consult the **[Design System Guide](docs/DESIGN_SYSTEM.md)**.*

---

## Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push -u origin <branch-name>
   ```
2. Open a Pull Request targeting `main`.
3. Fill in the provided PR template (Context, Changes, Verification).
4. Ensure all CI automated checks pass before requesting review.
