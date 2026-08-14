# Contributing to BlogHub

Thanks for taking the time to contribute. This document covers everything you need to make a
change that gets merged quickly.

---

## Code of conduct

This project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating you
agree to uphold it.

---

## Ways to contribute

| Contribution | Start here |
|--------------|-----------|
| **Add tests** | [docs/guides/testing.md](./docs/guides/testing.md) — no runner is installed. **This is the highest-value contribution available**, and every other item is safer once it exists |
| Set up CI | [docs/operations/deployment.md](./docs/operations/deployment.md#part-2--cicd) — workflows are written out and ready to commit. Both workspaces lint clean today, so the gate can be blocking immediately |
| Fix a known defect | [docs/product/roadmap.md](./docs/product/roadmap.md) — every item has an ID, a file reference and a proposed fix |
| Close a security finding | [docs/security/checklist.md](./docs/security/checklist.md) — four remain open, with the fix sketched for each |
| Report a bug | [Open an issue](../../issues/new?template=bug_report.md) |
| Propose a feature | [Open an issue](../../issues/new?template=feature_request.md) — discuss before building |
| Improve documentation | [docs/](./docs/README.md) — check the SSOT map first so you edit the owning document |

**Good first issues:** [BUG-15](./docs/product/roadmap.md#bug-15) (form hydration — do this
after tests exist), [GAP-04](./docs/product/roadmap.md#gap-04) (wire tags into the editor; the
model, routes and service already exist), and paginating the remaining list endpoints
([SEC-11](./docs/security/checklist.md#sec-11)).

---

## Getting set up

Full instructions: [docs/guides/getting-started.md](./docs/guides/getting-started.md).

```bash
git clone https://github.com/<your-username>/blogging_platform.git bloghub
cd bloghub
cp .env.example .env          # then fill in MONGO_DB_URI and JWT_SECRET
cd backend && npm install
cd ../client && npm install
cd ../backend && npm run seed
```

Then run the API and the client in separate terminals with `npm run dev`.

---

## Workflow

1. **Open or claim an issue** before starting non-trivial work, so effort is not duplicated.
2. **Fork and branch** from `main`.

   ```
   feature/<short-description>
   fix/<short-description>
   docs/<short-description>
   ```

3. **Make the change**, following
   [docs/guides/development.md](./docs/guides/development.md).
4. **Update the owning document.** Each subject has exactly one home — see the
   [SSOT map](./docs/README.md#single-source-of-truth). Documentation changes belong in the same
   pull request as the code.
5. **Run the checks locally.**

   ```bash
   cd backend && npm run lint && npm run format:check
   cd ../client && npm run lint && npm run format:check && npm run build
   ```

6. **Commit** using Conventional Commits.
7. **Open a pull request** against `main` using the template.

---

## Commit messages

```
<type>(<scope>): <subject>
```

| Type | Use |
|------|-----|
| `feat` | New capability |
| `fix` | Defect repair |
| `refactor` | Behaviour-preserving change |
| `perf` | Performance |
| `style` | Formatting only |
| `docs` | Documentation |
| `test` | Tests |
| `build` | Build system or dependencies |
| `chore` | Maintenance |

Rules: imperative mood, lowercase subject, no trailing period, reference the tracking ID when
one exists.

```
fix(posts): persist visibility on create and update (BUG-01)
feat(auth): add password reset flow (GAP-01)
docs(api): document the settings router
test(auth): cover sign-in failure paths
```

---

## Pull requests

### Keep them focused

One concern per pull request. Formatting-only changes go in a separate commit or pull request
so the real diff stays reviewable.

| Lines changed | Expectation |
|---------------|-------------|
| < 100 | Ideal |
| 100–400 | Fine with a clear description |
| > 400 | Split it, unless it is a move or a reformat — say so in the title |

### Description

The template asks for what, why, how, and how you verified it. "Should work" is not
verification — say what you ran and what you observed.

### Review

Reviewers use the checklist in
[docs/guides/development.md](./docs/guides/development.md) and prefix comments
by severity:

| Prefix | Meaning |
|--------|---------|
| `blocking:` | Must change before merge |
| `question:` | Needs clarification |
| `suggestion:` | Better, but your call |
| `nit:` | Trivial preference |

Formatting is never a review comment — Prettier decides it.

---

## Definition of done

- [ ] Behaves as specified, including failure paths
- [ ] Loading, empty and error states handled (UI changes)
- [ ] Correct status codes and the response envelope (API changes)
- [ ] Indexes added for any new query path
- [ ] No new lint warnings; formatting clean
- [ ] No secrets, no leftover `console.log`, no commented-out code
- [ ] The owning document updated
- [ ] Self-reviewed against the [review checklist](./docs/guides/development.md)

---

## Standards summary

The details live in the documentation; these are the rules that most often come up in review.

**Both workspaces**
- `const` by default, `async`/`await`, strict equality
- Names say what things are — no `data`, `temp`, `obj`
- Comments explain *why*, not *what*
- Delete commented-out code; Git remembers it

**Backend** — [docs/architecture/backend.md](./docs/architecture/backend.md)
- The acting user comes from `req.user`, never from the request body
- Authorise the resource, not just the request
- Services never touch `req` or `res`
- Every list endpoint is paginated
- Project queries — never return a password hash or a private email address

**Frontend** — [docs/architecture/frontend.md](./docs/architecture/frontend.md)
- Server state belongs in TanStack Query, never `useState` + `useEffect`
- All values come from theme tokens — no inline hex or px
- `components/ui/` primitives never fetch data
- Never call `axios` directly; go through `config/api`
- Works in both themes and at 375px, keyboard operable

---

## Testing

There is no test runner installed yet ([GAP-11](./docs/product/roadmap.md#gap-11)). Until
one exists, verify manually and describe what you did in the pull request.

If you would like to establish the harness, that is the single most valuable contribution
available — [docs/guides/testing.md](./docs/guides/testing.md)
specifies the tooling and the order to build it in.

Once the runner lands: a bug fix ships with a regression test named for its tracking ID.

---

## Documentation

The documentation set follows one rule: **each subject is owned by exactly one document**, and
everything else links to it. Before adding a section, check the
[SSOT map](./docs/README.md#single-source-of-truth).

- Describe the code as it is. Anything not built is labelled **Planned** or **Proposed** with a
  `GAP-xx` reference.
- Reference findings by ID rather than restating them.
- Paths are relative to the repository root.
- New findings get the next free ID in the relevant series, added to the owning register.

---

## Reporting security issues

**Do not open a public issue for a vulnerability.** Follow [SECURITY.md](SECURITY.md).

Already-known findings are published openly in
[docs/security/checklist.md](./docs/security/checklist.md) — fixes for
those are ordinary pull requests and are very welcome.

---

## Questions

Open a [discussion](../../discussions) or ask in the issue you are working on. A question
early is cheaper than a rewrite late.
