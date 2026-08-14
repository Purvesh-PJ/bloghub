# Deployment and CI/CD

> **Scope:** how BlogHub is built and shipped — Vercel topology, routing, release procedure,
> rollback, and the automation pipeline that should gate it.
> **Excludes:** environment variables ([configuration.md](../reference/configuration.md)), production
> observability ([runbook.md](runbook.md)).

---

# Part 1 — Deployment

## Target

**Vercel**, hosting both halves from one repository, with **MongoDB Atlas** as the database.

```
                    ┌──────────────────────┐
   Browser ────────▶│  Vercel Edge Network │
                    └───────┬──────────┬───┘
              /api/*        │          │   everything else
                            ▼          ▼
                ┌────────────────┐  ┌──────────────────┐
                │ Serverless Fn  │  │ Static assets    │
                │ backend/index  │  │ client/dist      │
                └───────┬────────┘  └──────────────────┘
                        ▼
              ┌──────────────────┐
              │  MongoDB Atlas   │
              └──────────────────┘
```

## `vercel.json`

```jsonc
{
  "version": 2,
  "builds": [
    { "src": "backend/index.js", "use": "@vercel/node" },
    { "src": "client/package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/index.js" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

Routes evaluate top to bottom:

| Order | Rule | Effect |
|-------|------|--------|
| 1 | `/api/(.*)` | Everything under `/api` reaches the function |
| 2 | `handle: filesystem` | Real static files are served directly |
| 3 | `/(.*)` → `/index.html` | **SPA fallback** — the client router handles the path |

The fallback closed [BUG-12](../product/roadmap.md#bug-12): the previous rule rewrote to
`client/$1`, so `/post/abc123` mapped to a file that does not exist and every shared link,
deep link and refresh on an inner route returned 404. A dead `/uploads/(.*)` route pointing
at a directory that never exists in a deployment was removed at the same time.

> `builds`/`routes` is the legacy v2 format. It works, but `buildCommand`, `outputDirectory`
> and `rewrites` are better supported and clearer. Worth migrating.

## Build

```
backend/index.js  → @vercel/node → bundled with dependencies → λ
client/           → npm install (client/.npmrc: legacy-peer-deps)
                  → npm run build → client/dist → CDN
```

No root `package.json`, so the two installs are independent.

**The build is not gated** — no test, lint or type check runs before a deployment, because
none of that automation exists yet ([GAP-12](../product/roadmap.md#gap-12)). A commit that
fails lint deploys as readily as one that passes. That is the single biggest remaining risk in
the pipeline.

## Serverless considerations

The API was written as a long-running Express server and adapted. Several assumptions no
longer hold.

### Connection handling

`connectDB()` runs at module load, so every cold start opens a new Atlas connection. Under
concurrency this produces one connection per warm instance and exhausts the connection limit
on a small tier. The standard remedy is a cached connection:

```js
let cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(uri, { maxPoolSize: 10 });
  cached.conn = await cached.promise;
  return cached.conn;
}
```

`config/db.js` also registers a `SIGINT` handler — meaningful locally, irrelevant in a
function invocation.

### Rate limiting

`express-rate-limit`'s default store is in-memory and per-instance, so limits are approximate
across cold starts and concurrent instances. Still far better than nothing; a shared store
(Redis, or an Atlas collection) would make them exact.

### Filesystem

Read-only except `/tmp`, which does not persist between invocations. The multer disk-storage
configuration cannot work in production ([BUG-07](../product/roadmap.md#bug-07)); avatar
upload needs object storage.

### Timeouts

The Hobby plan caps a function at 10 seconds. `GET /posts` is now paginated and no longer
populates every comment, which removed the most likely offender — but `GET /comments` and the
unindexed search regex remain unbounded ([SEC-11](../security/checklist.md#sec-11)).

---

## Release procedure

### First deployment

1. **Provision Atlas.** Create the cluster and a database user. Add `0.0.0.0/0` to the IP
   allowlist — Vercel functions have no static egress addresses on lower tiers.
2. **Import the repository** into Vercel. Framework preset **Other** — `vercel.json`
   describes the builds.
3. **Set the environment variables** from the production template in
   [configuration.md](../reference/configuration.md#production). Remember `JWT_REFRESH_SECRET`, distinct
   from `JWT_SECRET` — the deployment **will refuse to boot** if they match.
4. **Deploy** and wait for both builds.
5. **Verify** with the checklist below.
6. **Seed only if the site is a demo.** `npm run seed` wipes every collection.

### Subsequent deployments

```
push to a branch  → preview deployment at a unique URL
merge to main     → production deployment
```

Every pull request gets a preview. Use it — until CI exists, it is the only pre-production
verification this project has.

### Verification checklist

```bash
BASE=https://<your-domain>

curl -s $BASE/api/health                       # {"status":"ok",...}
curl -s $BASE/api/ready                        # {"status":"ready"}
curl -s $BASE/api/posts | head -c 200          # paginated envelope
curl -sI $BASE/api/posts | grep -i strict-transport   # helmet is active

# security regressions
curl -o /dev/null -w "%{http_code}\n" -X POST $BASE/api/categories \
  -H 'Content-Type: application/json' -d '{"category":"x"}'   # expect 401
curl -o /dev/null -w "%{http_code}\n" $BASE/api/posts/507f1f77bcf86cd799439011  # expect 404
```

In a browser:

- [ ] Home loads and renders posts
- [ ] Sign in works and the session survives a reload
- [ ] **A direct load of `/post/<id>` works** — the [BUG-12](../product/roadmap.md#bug-12) check
- [ ] Publishing works and the post appears on the feed — the
      [BUG-01](../product/roadmap.md#bug-01) check
- [ ] A like survives a reload — the [BUG-03](../product/roadmap.md#bug-03) check
- [ ] No CORS error in the console
- [ ] Both themes render

## Rollback

**Immediate** — Vercel dashboard → Deployments → the last good one → *Promote to Production*.
Seconds, no rebuild.

**By revert** — `git revert <sha> && git push origin main`.

**Configuration only** — change the variable and redeploy; environment changes do not apply
to an existing deployment. `VITE_`-prefixed values are baked in at build time and need a
**rebuild**, not just a variable change.

**Database** — there is no migration tooling, so a schema change that breaks reads has no
automatic reverse. Take an Atlas snapshot before any deployment that alters document shape,
and note that **adding a unique index to a collection containing duplicates fails** — resolve
duplicates first ([database.md](../reference/database.md#migration-note)).

## Alternative topologies

Vercel's serverless model fits the client well and the API less well.

| Option | API host | Trade-off |
|--------|----------|-----------|
| **Split hosting** | Render / Railway / Fly.io for a long-running Node process; Vercel for the client | Real connection pooling, no cold starts, a filesystem for uploads, exact rate limits. Costs an always-on instance and needs cross-origin CORS |
| **Containers** | Docker on any orchestrator | Full control and parity; most operational overhead |

Splitting is the natural next step if uploads, background work or connection pressure become
real problems. It requires `VITE_API_URL` set to the API's absolute origin and `CLIENT_URL`
set to the client's.

---

# Part 2 — CI/CD

## Current state

**There is no CI.** No `.github/workflows`, nothing runs on push or pull request.

| Stage | Status |
|-------|--------|
| Lint / format / build | ✗ Manual |
| Tests | ✗ No runner ([GAP-11](../product/roadmap.md#gap-11)) |
| Dependency audit | ✗ Manual |
| Deploy | ✓ Automatic via Vercel |

**The one thing that happens automatically is shipping, and nothing verifies what is
shipped.** Closing this is [GAP-12](../product/roadmap.md#gap-12).

## Proposed pipeline

```
pull request → validate (backend | client, in parallel) → Vercel preview
merge to main → validate → e2e against the preview → production deploy
```

Fast checks on every pull request; slow end-to-end tests on merge.

### `.github/workflows/ci.yml`

```yaml
name: CI
on:
  pull_request: { branches: [main] }
  push: { branches: [main] }

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: backend/package-lock.json }
      - run: npm ci
        working-directory: backend
      - run: npm run lint
        working-directory: backend
      - run: npm run format:check
        working-directory: backend
      - run: npm test                      # enable once a runner exists
        working-directory: backend
        env:
          NODE_ENV: test
          JWT_SECRET: ci-secret-not-for-production
          JWT_REFRESH_SECRET: ci-refresh-secret-not-for-production

  client:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: client/package-lock.json }
      - run: npm ci
        working-directory: client
      - run: npm run lint
        working-directory: client
      - run: npm run format:check
        working-directory: client
      - run: npm run build
        working-directory: client
        env: { VITE_API_URL: /api }
```

Two jobs rather than a matrix, because only the client builds. `concurrency` cancels
superseded runs.

### Dependency audit

Weekly rather than per-pull-request — an advisory published overnight should not block an
unrelated change.

```yaml
name: Audit
on:
  schedule: [{ cron: '0 6 * * 1' }]
  workflow_dispatch:
jobs:
  audit:
    runs-on: ubuntu-latest
    strategy:
      matrix: { workspace: [backend, client] }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm audit --audit-level=high
        working-directory: ${{ matrix.workspace }}
```

Pair with Dependabot for `/backend`, `/client` and `github-actions`.

## Quality gates

| Gate | Blocks a merge | Rationale |
|------|---------------|-----------|
| Lint | Yes | Correctness rules, not style — it found two real bugs during remediation |
| Format check | Yes | Cheap, keeps diffs clean |
| Unit + integration tests | Yes | Where this codebase's defects actually live |
| Build | Yes | A broken build must never reach deploy |
| E2E | No — post-merge | Too slow to gate on |
| Coverage threshold | Not initially | Ratchet upward once a suite exists |
| Dependency audit | No — scheduled | Advisories are time-based, not change-based |

## Rollout order

Adding everything at once produces a permanently red pipeline people learn to ignore.

1. **Build and format check** — they pass today; turning them on costs nothing.
2. **Lint** — both workspaces are currently clean, so this can be blocking **immediately**.
   That window closes as soon as anyone commits a warning; take it now.
3. **A test job that runs zero tests** — wire the runner in.
4. **The first real tests** — auth and authorisation, per
   [testing.md](../guides/testing.md#what-to-build-first).
5. **Branch protection** once the checks are reliably green.
6. **E2E on merge.**
7. **Coverage reporting**, threshold a release later.

## Branch protection

- [ ] Require a pull request before merging
- [ ] Require the `backend` and `client` checks to pass
- [ ] Require branches to be up to date
- [ ] Require conversation resolution
- [ ] Dismiss stale approvals on new commits
- [ ] No force pushes or deletion

## Local parity

CI should never be the first place a failure appears:

```bash
cd backend && npm run lint && npm run format:check
cd ../client && npm run lint && npm run format:check && npm run build
```

Better still, run them via Husky and lint-staged before each commit —
[code-quality.md](../guides/code-quality.md#enforcement-plan).

## Secrets

Never place a production secret in a workflow used by pull-request builds — a fork's pull
request can read it. Vercel deployment needs no GitHub secret; the Git integration handles it.

---

## Outstanding deployment issues

| Issue | Impact | Reference |
|-------|--------|-----------|
| No quality gate before deploy | Broken code ships as easily as working code | [GAP-12](../product/roadmap.md#gap-12) |
| No cached database connection | Connection exhaustion under load | [above](#connection-handling) |
| Rate limits are per-instance | Approximate enforcement on serverless | [above](#rate-limiting) |
| Avatar upload cannot work | Read-only filesystem | [BUG-07](../product/roadmap.md#bug-07) |
| Legacy `builds`/`routes` format | Harder to maintain | [above](#verceljson) |
| Nothing polls the health endpoints | An outage is discovered by a user | [runbook.md](runbook.md) |
