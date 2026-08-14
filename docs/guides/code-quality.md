# Code Quality Tooling

> **Scope:** ESLint, Prettier and the project's type-safety position — configuration, known
> gaps and enforcement.
> **Excludes:** the conventions being enforced ([development.md](development.md)), testing
> ([testing.md](testing.md)), CI wiring
> ([operations/deployment.md](../operations/deployment.md#part-2--cicd)).

---

# Linting

ESLint 9 with flat config in both workspaces. No shared base — the module systems and globals
differ.

| | `backend/` | `client/` |
|---|-----------|-----------|
| Config | `eslint.config.js` (CommonJS) | `eslint.config.js` (ESM) |
| Base | `eslint-plugin-prettier/recommended` | `@eslint/js` recommended |
| Plugins | `prettier` | `react`, `react-hooks` |
| Source type | `commonjs` | `module` |
| Target | `.` | `src` |
| Prettier integration | Yes — violations are lint errors | No — Prettier runs separately |

## Current state

Both workspaces lint clean:

```
backend: 0 errors, 0 warnings
client:  0 errors, 26 warnings
```

The client's 26 remaining warnings are unused imports and `exhaustive-deps` hints — real but
non-blocking.

## The React plugin gap, and what it hid

The client registered `eslint-plugin-react` and `eslint-plugin-react-hooks` but **never
enabled their rules**. Without `react/jsx-uses-vars`, `no-unused-vars` cannot see a component
referenced only in JSX, so it reported nearly every import as unused — **600 false
positives**, which is enough noise that nobody reads the output.

Enabling the recommended rule sets dropped the client from 604 problems to 26, and
immediately surfaced two genuine defects:

| Rule | Found |
|------|-------|
| `react/jsx-no-undef` | `PostDetail` rendered `<SubmitBtn>`, defined nowhere — the post-not-found screen crashed ([BUG-17](../product/roadmap.md#bug-17)) |
| `no-undef` | Four references to a variable renamed during refactoring |

```js
settings: { react: { version: 'detect' } },
rules: {
  ...reactPlugin.configs.recommended.rules,
  ...reactHooksPlugin.configs.recommended.rules,
  'react/react-in-jsx-scope': 'off',      // React 19 automatic JSX runtime
  'react/prop-types': 'off',              // no runtime type checking in use
  'react/no-unescaped-entities': 'off',   // apostrophes in copy are intentional
  'react-hooks/exhaustive-deps': 'warn',
  'react-hooks/set-state-in-effect': 'warn',
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  'no-console': 'off',
}
```

`set-state-in-effect` is a **warning** deliberately: four pages hydrate form state from a
query inside an effect, and refactoring that across four pages without a test suite is how
regressions ship. Tracked as [BUG-15](../product/roadmap.md#bug-15).

## Known backend gaps

Two remaining weaknesses, both worth fixing:

1. **The recommended rule set is not applied.** `backend/eslint.config.js` extends only
   `eslint-plugin-prettier/recommended`, so core rules — `no-undef`, `no-dupe-keys`,
   `no-unreachable` — are inactive. This is the single biggest remaining lint gap; the client
   equivalent found two real bugs.

   ```js
   const js = require('@eslint/js');
   module.exports = [js.configs.recommended, eslintPluginPrettierRecommended, …];
   ```

2. **Globals are hand-listed.** Anything not in the list — `setInterval`, `URL`, `fetch`,
   `structuredClone` — reports as undefined. Replace with `...globals.node`.

Also note: `client/eslint.config.js` imports `@eslint/js` and `globals`, neither declared in
`client/package.json`. It works only via hoisting from ESLint's own tree. Add them:

```bash
cd client && npm install --save-dev @eslint/js globals
```

## Suppressions

Disable per-line, with a reason:

```js
// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by arity
const errorHandler = (err, req, res, _next) => { … };
```

Never disable a whole file. If a rule is wrong for this project, change the configuration so
the decision is visible and reviewed.

## Further hardening

| Rule | Catches |
|------|---------|
| `no-await-in-loop` (warn) | Sequential awaits that should be `Promise.all` |
| `require-atomic-updates` | Race conditions on shared state |
| `eqeqeq`, `no-var`, `prefer-const` | Style-adjacent correctness |
| `eslint-plugin-import` | Import ordering, unresolved paths, cycles |
| `eslint-plugin-security` | Dynamic regex construction, unsafe filesystem paths |

---

# Formatting

Machine-decided. Never a review comment.

| Option | `backend/` | `client/` |
|--------|-----------|-----------|
| `semi` | `true` | `true` |
| `singleQuote` | `true` | `true` |
| `tabWidth` | `2` | `2` |
| `printWidth` | `100` | `100` |
| `trailingComma` | **`all`** | **`es5`** | ⚠ diverges |
| `arrowParens` | `always` | default `always` |

## The `trailingComma` divergence

Both are valid; the inconsistency is the problem. It produces different diffs for the same
edit depending on which side of the repository you are on.

**Recommendation:** standardise on `"all"` — the Prettier 3 default, cleaner diffs when
arguments are added, supported by every runtime this project targets. One reformat commit in
`client/`, kept separate from any behavioural change.

## Ignore files

`client/.prettierignore` excludes `package-lock.json`; `backend/.prettierignore` does not, so
`npm run format` there rewrites the lockfile. Add the entry.

## Enforcement asymmetry

| Layer | Backend | Client |
|-------|---------|--------|
| Lint | **Integrated** — formatting violations are lint errors | Not integrated |
| Pre-commit | None | None |
| CI | None ([GAP-12](../product/roadmap.md#gap-12)) | None |

A formatting mistake in `backend/` fails `npm run lint`; the same mistake in `client/` passes
lint and is caught only by `format:check`. Resolve by either integrating Prettier into the
client config too, or — the option Prettier's own maintainers recommend — removing
`eslint-plugin-prettier` from the backend and running `format:check` separately in both.

## Formatting-only commits

Keep them separate. Add large reformat SHAs to `.git-blame-ignore-revs`:

```
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

---

# TypeScript

## Position

**BlogHub is a plain JavaScript project.** No `.ts` or `.tsx` file exists, nothing
type-checks, and no runtime validation is in use.

| Signal | State |
|--------|-------|
| Source files | `.js` and `.jsx` only |
| `typescript` dependency | Present in `client/` devDependencies, **unused** |
| `@types/react`, `@types/react-dom` | Present, unused |
| `client/tsconfig.json` | Present, strict, **no consumer** |
| `client/jsconfig.json` | Present, used by editors |
| Type-check script | None |
| Runtime validation | `zod` installed, imported nowhere |
| Prop types | Disabled |

## The configuration drift

Two overlapping configs that disagree, and the stricter one is inert:

| Setting | `jsconfig.json` | `tsconfig.json` |
|---------|----------------|-----------------|
| `target` | ES2020 | ES2022 |
| `jsx` | react-jsx | *(unset)* |
| `paths` | `@/* → src/*` | *(unset)* |
| `strict` | *(unset)* | `true` |
| `allowJs` | implied | **not set** — `.js` files are not even seen |

TypeScript prefers `tsconfig.json`, so editors read the strict config — which has no
`allowJs`, no `jsx` and no `paths`. Consequences: the `@/*` alias is invisible to the editor
and has no matching `resolve.alias` in Vite (using it would break the build); `tsconfig.json`
type-checks nothing; and four packages are installed for nothing.

**This is drift from a scaffold, not a decision.**

## Resolve it — pick one

### Option A — commit to JavaScript (lower effort)

1. Delete `client/tsconfig.json`.
2. Remove `typescript`, `@types/react`, `@types/react-dom`.
3. Either remove the unused `@/*` alias, or make it real:
   ```js
   resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
   ```
4. Recover type safety with JSDoc plus `checkJs` in `jsconfig.json`.
5. Use `zod` for API response validation, or remove it along with `react-hook-form` and
   `@hookform/resolvers`, which are equally unused.

### Option B — commit to TypeScript (higher effort, better payoff)

Given ~12,000 lines and the concentration of errors it would catch — the inconsistent
response envelope, the defensive `req.user` chains — this is the more valuable path if the
project keeps growing. Migrate incrementally, never big-bang:

- **Phase 0** — tests first ([GAP-11](../product/roadmap.md#gap-11)); delete `jsconfig.json`;
  add `allowJs`, `jsx`, `paths`; add `"type-check": "tsc --noEmit"` to CI; install
  `typescript-eslint`.
- **Phase 1** — shared types (`Post`, `User`, `Comment`, `ApiResponse<T>`); convert
  `config/api.js` first.
- **Phase 2** — leaves upward: `services/` → `components/ui/` → `context/` and `guards/` →
  `layout/` → `pages/` last.
- **Phase 3** — `strict: true`, eliminate `any`.
- **Phase 4** — backend, as a separate decision.

## Interim safety, whichever option

Runtime validation is arguably more valuable here than static typing, because the server's
response shape genuinely varies by endpoint:

```js
const PostSchema = z.object({
  _id: z.string(),
  title: z.string(),
  visibility: z.enum(['draft', 'private', 'public']),
});

export const getPost = async (id) => PostSchema.parse((await api.get(`/posts/${id}`)).data.data);
```

`zod` is already installed.

## Decision record

| Item | Status |
|------|--------|
| Adopt TypeScript | **Undecided** — this section exists to force the choice |
| Remove the drift | **Recommended now**, regardless of that choice |
| `zod` validation at the API boundary | **Recommended now** — dependency already installed |
| Backend TypeScript | Deferred |

---

# Dependency health

Baseline recorded 2026-08-14:

| Workspace | Advisories |
|-----------|-----------|
| `backend/` | 25 (1 critical, 17 high, 4 moderate, 3 low) |
| `client/` | 17 (13 high, 3 moderate, 1 low) |

Notable: a `validator` URL-validation bypass reachable through `express-validator`, and a
`vite` `server.fs.deny` bypass on Windows (development-only).

**Not remediated** — running `npm audit fix` on a project with no test suite is an
unacceptable risk. Correct order: tests, then CI, then dependency updates behind a green
pipeline ([SEC-12](../security/checklist.md#sec-12)).

Several packages are installed and unused: `react-hook-form`, `@hookform/resolvers`, `zod`,
`typescript`, `@types/react`, `@types/react-dom`. Removing them shrinks the audit surface for
free.

---

# Enforcement plan

Lint should stop being advisory.

| Stage | Mechanism | Behaviour |
|-------|-----------|-----------|
| Editing | Editor extension | Inline as you type |
| Pre-commit | Husky + lint-staged | Lints staged files, blocks the commit |
| Pull request | CI job | Blocks the merge |

```jsonc
{ "lint-staged": { "*.{js,jsx}": ["eslint --fix", "prettier --write"] } }
```

Both workspaces are lint-clean today, so blocking enforcement can be switched on immediately
without a cleanup commit first — the right moment to do it.
