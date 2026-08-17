# Setup

> **Scope:** getting a working local environment — prerequisites, install, run, seed, verify.
> **Excludes:** the environment variable reference
> ([reference/configuration.md](../reference/configuration.md)), deployment
> ([operations/deployment.md](../operations/deployment.md)), code conventions
> ([development.md](development.md)).

---

## Prerequisites

| Requirement | Version                    | Check                           |
| ----------- | -------------------------- | ------------------------------- |
| Node.js     | 18 LTS or newer            | `node --version`                |
| npm         | 9 or newer                 | `npm --version`                 |
| MongoDB     | 6 or newer, local or Atlas | `mongosh --eval "db.version()"` |
| Git         | any recent                 | `git --version`                 |

No Node version is pinned — there is no `engines` field and no `.nvmrc`. Node 18+ is required
by Vite 7 and React 19.

---

## 1. Clone

```bash
git clone https://github.com/Purvesh-PJ/blogging_platform.git bloghub
cd bloghub
```

## 2. Configure

Both workspaces read a **single `.env` at the repository root**. The backend resolves it with
`dotenv.config({ path: '../.env' })`; Vite reads it via `envDir: '../'`. Do not create
per-workspace `.env` files — they are ignored.

```bash
cp .env.example .env
```

```env
NODE_ENV=development
PORT=4000
MONGO_DB_URI=mongodb://127.0.0.1:27017/bloghub
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:4000
JWT_SECRET=<a long random string>
JWT_REFRESH_SECRET=<a different long random string>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`JWT_REFRESH_SECRET` **must differ** from `JWT_SECRET` — that separation is what stops a
refresh token being replayed as an access token. It falls back to `JWT_SECRET` in
development with a warning; production refuses to boot if the two are equal.

Full variable reference:
[reference/configuration.md](../reference/configuration.md).

## 3. Install

No root `package.json`, so each workspace installs separately.

```bash
cd backend && npm install
cd ../client && npm install
```

`client/.npmrc` sets `legacy-peer-deps=true` — React 19 is newer than some transitive peer
ranges. Do not remove it without re-testing a clean install.

## 4. Start MongoDB

```bash
mongod --dbpath /path/to/data
```

Or create a free Atlas cluster, allow your IP, and paste the connection string into
`MONGO_DB_URI`.

## 5. Seed

```bash
cd backend && npm run seed
```

Creates 10 categories, 15 accounts and 99 stories — 84 public, 10 drafts and 5 private — plus
comments, likes, views and reads.

> ⚠️ **The seeder deletes every document in every collection first.**
>
> It refuses to run against a non-local database unless you pass `SEED_ALLOW_REMOTE=yes`. That
> guard exists because the difference between seeding your laptop and erasing a live deployment
> is one environment variable you forgot was still set.

| Role          | Email               | Password      |
| ------------- | ------------------- | ------------- |
| Member        | `john@example.com`  | `password123` |
| Administrator | `admin@bloghub.com` | `admin123`    |

## 6. Run

Two terminals — there is no combined command.

```bash
cd backend && npm run dev     # API → http://localhost:4000
cd client  && npm run dev     # App → http://localhost:3000
```

Expected API output:

```
[DB] Connection successful
Server running on port 4000
```

## 7. Verify

```bash
curl http://localhost:4000/api/health          # {"status":"ok",...}
curl http://localhost:4000/api/ready           # {"status":"ready"}
curl http://localhost:4000/api/posts           # paginated envelope

curl -X POST http://localhost:4000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"credential":"john@example.com","password":"password123"}'

curl http://localhost:4000/api/users/getUser \
  -H "Authorization: Bearer <accessToken>"
```

Every endpoint also answers without the `/api` prefix locally — see
[reference/api.md](../reference/api.md#base-url).

---

## Scripts

### `backend/`

| Script                                 | Purpose                                                                                                     |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm start`                            | Run without a watcher                                                                                       |
| `npm run dev`                          | nodemon, restarts on change                                                                                 |
| `npm run seed`                         | Reset and repopulate the database                                                                           |
| `npm run migrate` / `migrate:dry`      | Repair an existing database in place, non-destructively. `:dry` shows what would change and changes nothing |
| `npm run lint` / `lint:fix`            | ESLint                                                                                                      |
| `npm run format` / `format:check`      | Prettier                                                                                                    |
| `npm test`                             | 61 integration tests. Starts its own MongoDB in-process, so it needs no database and no `.env`              |
| `npm run test:watch` / `test:coverage` | The same, watching or with a coverage report                                                                |

### `client/`

| Script                            | Purpose                           |
| --------------------------------- | --------------------------------- |
| `npm run dev`                     | Vite dev server on port 3000      |
| `npm run build`                   | Production bundle → `client/dist` |
| `npm run preview`                 | Serve the built bundle            |
| `npm run lint` / `lint:fix`       | ESLint                            |
| `npm run format` / `format:check` | Prettier                          |

---

## Editor setup

Extensions: **ESLint**, **Prettier**, **vscode-styled-components**.

```jsonc
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.requireConfig": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
}
```

`requireConfig` matters because the two workspaces have slightly different Prettier settings —
see [code-quality.md](code-quality.md#formatting).

---

## Installation troubleshooting

| Symptom                                                       | Cause                                         | Fix                                                       |
| ------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| `[Config] Missing required environment variables: JWT_SECRET` | `.env` absent or incomplete                   | Confirm `.env` sits beside `README.md`                    |
| `[Config] JWT_REFRESH_SECRET must differ from JWT_SECRET`     | Both set to the same value in production      | Generate a second secret                                  |
| `[DB] Missing MONGODB_URI / DB_URI`                           | No URI in `.env`                              | Set `MONGO_DB_URI`                                        |
| `MongooseServerSelectionError`                                | MongoDB not running, or Atlas IP allowlist    | Start `mongod`; add your IP                               |
| `EADDRINUSE :4000`                                            | Port taken                                    | Change `PORT`, and update `VITE_API_URL`                  |
| Client loads, every request fails                             | Wrong `VITE_API_URL`, or the API is down      | Vite reads `.env` **at startup** — restart the dev server |
| CORS error in the console                                     | `CLIENT_URL` does not match the client origin | Set `CLIENT_URL=http://localhost:3000` and restart        |
| `ERESOLVE` peer dependency error                              | `legacy-peer-deps` not applied                | Install from inside `client/`                             |
| 429 on repeated sign-in attempts                              | Auth rate limit — 10 failures / 15 min        | Wait, or restart the API in development                   |

Runtime problems beyond installation:
[operations/runbook.md](../operations/runbook.md).

---

## Next

- [development.md](development.md) — where files go and how to write them
- [code-quality.md](code-quality.md) — linting, formatting, the TypeScript position
- [testing.md](testing.md) — what the backend suite covers, and what is still untested
- [architecture/overview.md](../architecture/overview.md) — how the repository fits together
