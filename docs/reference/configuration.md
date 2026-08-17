# Environments

> **Scope:** the complete environment variable reference, how configuration is loaded, and
> the differences between environments. Single source of truth for configuration.
> **Excludes:** local install steps ([guides/getting-started.md](../guides/getting-started.md)),
> deployment topology ([deployment.md](../operations/deployment.md)), secret policy
> ([security/checklist.md](../security/checklist.md)).

---

## How configuration is loaded

Both workspaces read **one `.env` at the repository root** — consolidated from per-workspace
files so a single value cannot drift out of step.

| Workspace | Mechanism |
|-----------|-----------|
| `backend/` | `dotenv.config({ path: path.resolve(__dirname, '../.env') })` in `index.js` and `seed.js` |
| `client/` | `envDir: '../'` in `vite.config.js` |

Consequences:

- A `.env` inside `backend/` or `client/` is **ignored**. Do not create one.
- Vite reads the file **once at startup**. Editing `.env` requires restarting the dev server.
- Only `VITE_`-prefixed variables reach browser code.
- The file is git-ignored; `.env.example` is committed and must stay in sync.

> **Anything prefixed `VITE_` is compiled into the client bundle and is public.** Never
> prefix a secret with `VITE_`.

---

## Validation at boot

`backend/config/env.js` runs before the database connection and exits non-zero on a
misconfiguration, so a broken deployment fails at boot rather than on a user's first request.

| Check | Scope |
|-------|-------|
| `JWT_SECRET` present | All environments |
| `CLIENT_URL` present | Production only |
| `JWT_SECRET` ≥ 32 characters | Production only |
| `JWT_REFRESH_SECRET` ≠ `JWT_SECRET` | Production — **hard failure** |
| `JWT_REFRESH_SECRET` set | Production — warning if absent |
| Database URI present | All environments (`config/db.js`) |

---

## Variable reference

### Backend

| Variable | Required | Default | Consumed by | Purpose |
|----------|----------|---------|-------------|---------|
| `NODE_ENV` | No | `undefined` | `index.js`, `errorHandler`, `logger`, `env.js` | `development` enables stack traces in error responses and the `dev` log format; `test` skips the database connection |
| `PORT` | No | `4000` | `index.js` | Listening port. Ignored on Vercel |
| `MONGO_DB_URI` | **Yes** | — | `config/db.js` | Connection string. See [aliases](#database-uri-aliases) |
| `CLIENT_URL` | Production | — | `index.js` | CORS allowed origin. Credentials are only enabled when it is set |
| `JWT_SECRET` | **Yes** | — | `auth.controllers.js`, `authenticateUser.js`, `utils/visitor.js` | Signs and verifies **access** tokens, and salts the visitor hash used to deduplicate view and read tracking |
| `JWT_REFRESH_SECRET` | Recommended | falls back to `JWT_SECRET` | `auth.controllers.js` | Signs and verifies **refresh** tokens. Must differ — see [SEC-06](../security/checklist.md#sec-06) |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | `auth.controllers.js` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | `auth.controllers.js` | Refresh token lifetime |
| `VERCEL` | Auto | — | `index.js` | Set by the platform; suppresses `app.listen` |
| `SEED_ALLOW_REMOTE` | No | — | `seed.js` | Must equal `yes` before the seeder will touch a non-local database. The seeder empties every collection first, so without this guard one careless command destroys a live deployment |

### Client

| Variable | Required | Default | Consumed by | Purpose |
|----------|----------|---------|-------------|---------|
| `VITE_API_URL` | No | `http://localhost:4000` | `config/api.js` | API base URL. **Public** |

One client variable by design — everything else the browser needs comes from the API.

---

## Database URI aliases

`config/db.js` accepts three names, in order:

```js
process.env.MONGODB_URI || process.env.MONGO_DB_URI || process.env.DB_URI
```

The chain exists because the name changed twice during development and hosting providers
differ — Atlas templates use `MONGODB_URI`, while `.env.example` documents `MONGO_DB_URI`.

**Use `MONGO_DB_URI`.** Setting more than one is confusing rather than harmful; the process
exits with a clear message when none is set.

---

## Templates

### Development

```env
NODE_ENV=development
PORT=4000
MONGO_DB_URI=mongodb://127.0.0.1:27017/bloghub
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:4000
JWT_SECRET=<48 random bytes, hex>
JWT_REFRESH_SECRET=<a different 48 random bytes>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Test

```env
NODE_ENV=test
MONGO_DB_URI=mongodb://127.0.0.1:27017/bloghub_e2e
JWT_SECRET=test-secret-not-for-production
JWT_REFRESH_SECRET=test-refresh-secret-not-for-production
```

Under `NODE_ENV=test`, `index.js` skips `connectDB()` so a test harness owns the connection.
Integration tests should use `mongodb-memory-server` rather than a URI —
[guides/testing.md](../guides/testing.md). This template is for end-to-end runs,
which need a real server, and the database name **must** contain `_e2e` for the guard to pass.

### Production

Set in the Vercel dashboard, not in a file.

```env
NODE_ENV=production
MONGO_DB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bloghub?retryWrites=true&w=majority
CLIENT_URL=https://<your-domain>
VITE_API_URL=/api
JWT_SECRET=<a distinct 48-byte secret>
JWT_REFRESH_SECRET=<a second distinct 48-byte secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

- `VITE_API_URL=/api` — a same-origin relative path, because `vercel.json` forwards only
  `/api/*` to the function.
- `PORT` is omitted; the platform manages the listener.
- Boot **fails** without `CLIENT_URL`, or if the two secrets are equal.

---

## Comparison

| Aspect | Development | Test | Production |
|--------|-------------|------|------------|
| Database | Local `mongod` | In-memory / throwaway | Atlas replica set |
| API origin | `http://localhost:4000` | in-process | Same origin, `/api` |
| Error responses | Message **and stack** | Message and stack | Generic message only |
| Request logs | `dev` | `dev` | `combined` |
| Rate limits | Active | Active | Active |
| Seed data | Recommended | Required for E2E | **Never** |
| Secret source | Root `.env` | Test env | Vercel dashboard |
| Boot validation | Warns on a shared refresh secret | Same | **Fails** on a shared refresh secret |

---

## Generating secrets

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

- A distinct secret per environment, and **two distinct secrets per environment** — access
  and refresh.
- Minimum 32 bytes; 48 is better.
- Rotating `JWT_SECRET` invalidates every access token; rotating `JWT_REFRESH_SECRET`
  invalidates every session. That is the correct emergency response to a suspected leak, and
  currently the **only** way to force sign-out
  ([GAP-06](../product/roadmap.md#gap-06)).
- Never commit, log, or send over chat.

---

## Adding a variable

1. Add it to `.env.example` with a placeholder and a comment.
2. Add a row to the [reference table](#variable-reference).
3. Read it in exactly one place and pass the value onward.
4. Provide a safe default, or add it to `config/env.js` so boot fails clearly without it.
5. Add it to the Vercel dashboard **before** merging anything that depends on it.
6. If the browser needs it, prefix `VITE_` — and confirm it is not a secret.

---

## Remaining weaknesses

| Issue | Impact | Fix |
|-------|--------|-----|
| Three accepted names for one URI | Ambiguity about which is authoritative | Settle on one, delete the fallbacks |
| No schema validation | Typos in optional variables surface at runtime | Validate with `zod` at boot — already installed |
| `JWT_REFRESH_SECRET` falls back in development | A developer may never set it, so local behaviour differs from production | Acceptable; the warning makes it visible |

---

## Secret handling

| Rule | Detail |
|------|--------|
| Never commit `.env` | Git-ignored, and untracked retroactively in `dba4590` |
| Keep `.env.example` current | Placeholders only |
| Rotate on any suspicion | Change in Vercel and redeploy |
| Do not reuse across environments | A development leak must not compromise production |
| Do not log configuration | Not at boot, not in an error path |
| Restrict dashboard access | Vercel variables are readable by every project member |
