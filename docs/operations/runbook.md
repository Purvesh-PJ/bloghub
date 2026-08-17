# Operations Runbook

> **Scope:** running BlogHub in production — what to observe, what to log, and how to
> diagnose a failure. Merged from separate monitoring, logging and troubleshooting documents,
> because in practice you use all three at once.
> **Excludes:** deployment topology ([deployment.md](deployment.md)), configuration
> ([configuration.md](../reference/configuration.md)). Known defects are described once in the
> [roadmap](../product/roadmap.md) and referenced here by ID.

---

# Part 1 — Monitoring

## Current state

Health and readiness endpoints exist. **Nothing polls them yet**, there is no error tracker
and no alerting.

| Signal                       | State                                   |
| ---------------------------- | --------------------------------------- |
| Health / readiness endpoints | ✅ `GET /health`, `GET /ready`          |
| Uptime monitoring            | ❌ Nothing calls them                   |
| Backend error tracking       | ❌                                      |
| Frontend error tracking      | ❌ `ErrorBoundary` catches and discards |
| Request metrics              | Partial — Vercel dashboard aggregates   |
| Database metrics             | Atlas dashboard, unmonitored            |
| Alerting                     | ❌                                      |

The practical consequence: **the first report of an outage will come from a user.**

## The endpoints

```js
GET /health   → 200 { status: 'ok', uptime }        liveness, no dependencies
GET /ready    → 200 { status: 'ready' }             readiness, pings MongoDB
              → 503 { status: 'unavailable' }
```

Both are mounted directly on the app **before the rate limiter**, so probes are never
throttled, and both deliberately reveal nothing beyond status — a health endpoint is a
reconnaissance target.

## What to watch

### Availability

| Check                         | Target | Frequency |
| ----------------------------- | ------ | --------- |
| `GET /api/health` returns 200 | 99.9%  | 1 minute  |
| `GET /api/ready` returns 200  | 99.9%  | 1 minute  |
| The home page returns 200     | 99.9%  | 5 minutes |

A free uptime service (UptimeRobot, Better Stack, Cronitor) takes minutes to configure. Alert
on **two consecutive** failures — a single serverless cold start can exceed a tight timeout.

### Errors

| Signal                      | Threshold                                          |
| --------------------------- | -------------------------------------------------- |
| 5xx rate                    | > 1% of requests over 5 minutes                    |
| Unhandled promise rejection | Every occurrence                                   |
| Database connection failure | Every occurrence                                   |
| 401 rate                    | > 20% — suggests a token or clock problem          |
| 429 rate                    | Sustained — either an attack or limits set too low |
| 403 spike                   | Possible probing                                   |

### Latency

| Endpoint class      | p95 target | Note                                 |
| ------------------- | ---------- | ------------------------------------ |
| `GET /posts`        | < 300ms    | Now paginated and indexed            |
| `GET /posts/:id`    | < 400ms    | Deep population, several round trips |
| `POST /auth/signin` | < 800ms    | bcrypt is intentionally slow         |
| Writes              | < 300ms    |                                      |
| Cold start          | < 2s       | Measure before optimising            |

### Database

| Metric           | Alert at                                                       |
| ---------------- | -------------------------------------------------------------- |
| Connections      | > 80% of the tier limit — likely the missing cached connection |
| Storage          | > 80%                                                          |
| Slow queries     | Any over 100ms                                                 |
| Collection scans | Any — the search regex is the known offender                   |

Atlas's Performance Advisor recommends indexes from real traffic. With 13 indexes now
declared it should have far less to say than before.

### Business signals

Not failures, but they reveal breakage that stays technically green:

| Signal                                         | Why                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Posts created per day                          | A drop to zero with normal traffic means the publish path is broken               |
| Registrations per day                          | Same for signup                                                                   |
| Failed sign-in ratio                           | A spike suggests credential stuffing                                              |
| **Posts visible on the feed vs posts created** | Divergence is the fingerprint of [BUG-01](../product/roadmap.md#bug-01) recurring |

## Recommended stack

| Layer           | Tool                        | Effort           |
| --------------- | --------------------------- | ---------------- |
| Uptime          | UptimeRobot or Better Stack | Minutes          |
| Backend errors  | Sentry (`@sentry/node`)     | ~1 hour          |
| Frontend errors | Sentry (`@sentry/react`)    | ~1 hour          |
| Request metrics | Vercel Analytics            | Built in         |
| Database        | Atlas monitoring            | Configure alerts |

### Scrubbing is not optional

```js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    delete event.request?.headers?.authorization;
    delete event.request?.data?.password;
    return event;
  },
});
```

The `Authorization` header is on every authenticated request. Shipping it to a third party
would turn error tracking into a credential leak.

### Frontend errors

`ErrorBoundary` currently catches render errors and discards them. One change converts silent
failure into a reported one, and is the highest-value observability work available:

```jsx
componentDidCatch(error, errorInfo) {
  Sentry.captureException(error, { extra: errorInfo });
}
```

## Alerting

Alert on symptoms users feel. An alert nobody acts on trains people to ignore the channel.

| Alert                   | Condition                              | Urgency   |
| ----------------------- | -------------------------------------- | --------- |
| Site down               | Health check fails twice consecutively | Immediate |
| Database unreachable    | Readiness fails                        | Immediate |
| Error spike             | 5xx > 1% for 5 minutes                 | Immediate |
| Latency degradation     | p95 > 2× baseline for 15 minutes       | Same day  |
| Connection pressure     | Atlas connections > 80%                | Same day  |
| New dependency advisory | Weekly audit                           | This week |

## Rollout

1. **Uptime monitoring** against the existing endpoints — minutes of work, catches outages.
2. **Sentry on the frontend**, wired into `ErrorBoundary`.
3. **Sentry on the backend**, with scrubbing.
4. **Atlas alerts** for connections and storage.
5. **Vercel Analytics.**
6. **Business metrics** once the basics are stable.

Steps 1–3 are an afternoon and take the project from blind to informed.

---

# Part 2 — Logging

## Current state

| Layer       | Mechanism                                           |
| ----------- | --------------------------------------------------- |
| Requests    | morgan — `dev` in development, `combined` otherwise |
| Application | `console.error('[handlerName]', error)`             |
| Frontend    | Nothing                                             |

Handlers touched during remediation use a `[handlerName]` prefix, which makes an error
greppable. Debug residue (`console.log(cat)`) was removed.

### Remaining problems

| Problem                           | Consequence                                                        |
| --------------------------------- | ------------------------------------------------------------------ |
| No levels                         | Cannot filter to errors or raise verbosity during an incident      |
| No structure                      | Not machine-parseable, so not queryable                            |
| No correlation id                 | A request's lines cannot be tied together when requests interleave |
| No timestamps on application logs | Morgan timestamps requests; `console.error` does not               |
| Frontend errors go nowhere        | `ErrorBoundary` discards                                           |

`no-console` is disabled in both ESLint configs because console output _is_ the logging
mechanism.

## Target: structured logging

**Pino** — fast, JSON by default, works in a serverless function where a file transport does
not.

```js
const logger = pino({
  level:
    process.env.LOG_LEVEL ??
    (process.env.NODE_ENV === "production" ? "info" : "debug"),
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.confirmPassword",
      "req.body.refreshToken",
      "*.accessToken",
      "*.refreshToken",
    ],
    censor: "[redacted]",
  },
});
```

**The `redact` block is the important part.** `Authorization` is present on every
authenticated request; without redaction, enabling body logging would write live credentials
to disk.

Replace morgan with `pino-http` so request and application logs share one format and
`req.log` carries the request id into every handler.

### Levels

| Level   | Use                                                                     |
| ------- | ----------------------------------------------------------------------- |
| `fatal` | The process cannot continue                                             |
| `error` | An operation failed and a user is affected                              |
| `warn`  | Unexpected but handled — repeated failed sign-ins, rate limit hits      |
| `info`  | Notable business events — server start, user registered, post published |
| `debug` | Diagnostic detail                                                       |
| `trace` | Very verbose — never in production                                      |

Production runs at `info`; `LOG_LEVEL` raises verbosity during an incident without a code
change.

### Never log

Passwords in any form · tokens or the `Authorization` header · `JWT_SECRET` or the database
URI · full request bodies on auth routes · personal data beyond an id · whole documents.

When in doubt, log the identifier and look the record up.

### Format

```json
{
  "level": 50,
  "time": 1755180000000,
  "requestId": "8f3e…",
  "userId": "65a1…",
  "route": "PUT /api/posts/:id",
  "msg": "Failed to update post",
  "err": { "type": "ValidationError", "message": "…" }
}
```

The message is a **constant string**; variable parts are fields. `"Failed to update post"`
with a `postId` field is greppable; a template literal is not.

### Migration

1. Add `backend/config/logger.js` with redaction.
2. Replace morgan with `pino-http`.
3. Replace `console.error(...)` with `req.log.error({ err }, 'context')`.
4. Turn on `no-console` so the pattern cannot return.
5. Add `LOG_LEVEL` to `.env.example` and
   [configuration.md](../reference/configuration.md#variable-reference).

### Reading logs

```bash
vercel logs <deployment-url> --since 1h

# once JSON:
vercel logs <url> | jq 'select(.level >= 50)'                 # errors and worse
vercel logs <url> | jq 'select(.requestId == "8f3e…")'        # one request's trail
vercel logs <url> | jq 'select(.userId == "65a1…") | .msg'    # one user's activity
```

Following a single request or user across every line it produced is the entire reason to
adopt structured logging, and is impossible today.

---

# Part 3 — Troubleshooting

## Diagnostic order

```
1. Is it reproducible?    Another browser, incognito, another account
2. Which layer?           Browser console → network tab → API logs → database
3. Did it ever work?      git log on the relevant path
4. Environment or code?   Does it happen locally? On a preview?
```

The network tab is the fastest triage tool: the status code alone separates auth (401/403),
missing resource (404), validation (400), rate limiting (429) and server fault (500).

## Known open defects

Check these before investigating.

| Symptom                                                | Cause                                                                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Avatar upload fails or shows a broken image            | [BUG-07](../product/roadmap.md#bug-07) — the file is validated but has nowhere durable to be stored                             |
| `GET /analytics/post/:id` returns 404 for a real post  | [BUG-06](../product/roadmap.md#bug-06) — `Analytics` documents are seeder-only                                                  |
| Only the first page is reachable from the landing feed | [GAP-07](../product/roadmap.md#gap-07) — the landing page does not consume pagination; `/search` does                           |
| Search misses obvious matches                          | [GAP-05](../product/roadmap.md#gap-05) — titles only, no content search                                                         |
| Trending looks like "latest"                           | Correct behaviour when nothing clears the minimum-views floor in the 14-day window. The response says so: `trendedBy: 'latest'` |

**Recently fixed** — if you see one of these, it is a regression and needs a test:
posts not appearing on the feed ([BUG-01](../product/roadmap.md#bug-01)); "All fields are
required" when editing ([BUG-02](../product/roadmap.md#bug-02)); a like resetting on reload
([BUG-03](../product/roadmap.md#bug-03)); settings not persisting
([BUG-05](../product/roadmap.md#bug-05)); a blank post page instead of "not found"
([BUG-08](../product/roadmap.md#bug-08)); a shared link 404ing
([BUG-12](../product/roadmap.md#bug-12)).

## Startup

### `[Config] Missing required environment variables: JWT_SECRET`

Boot-time validation. Set the variable; see
[configuration.md](../reference/configuration.md#variable-reference).

### `[Config] JWT_REFRESH_SECRET must differ from JWT_SECRET`

Production refuses to boot with a shared secret, because a refresh token would then be
replayable as an access token. Generate a second secret.

### `[DB] Missing MONGODB_URI / DB_URI environment variable`

| Check                                         | Fix                                                               |
| --------------------------------------------- | ----------------------------------------------------------------- |
| Does `.env` exist **at the repository root**? | Both workspaces read the root file                                |
| Is `MONGO_DB_URI` set?                        | See [aliases](../reference/configuration.md#database-uri-aliases) |
| Is the file actually named `.env`?            | `.env.txt` on Windows is a common trap                            |

### `MongooseServerSelectionError: connect ECONNREFUSED`

MongoDB unreachable. Start `mongod`; on Atlas check the IP allowlist and that the password is
URL-encoded — a literal `@` or `#` breaks the URI.

### `EADDRINUSE :::4000`

```bash
# Windows
netstat -ano | findstr :4000 && taskkill /PID <pid> /F
# macOS / Linux
lsof -ti:4000 | xargs kill -9
```

## Authentication

### Every request returns 401

| Cause                                       | Check                                                            |
| ------------------------------------------- | ---------------------------------------------------------------- |
| No token attached                           | Network tab → request headers → `Authorization`                  |
| Token expired                               | Decode at jwt.io → `exp`                                         |
| **A refresh token used as an access token** | Payload `type` must be `access` — this is now rejected by design |
| `JWT_SECRET` changed                        | All existing tokens are invalid; sign in again                   |
| Clock skew                                  | A machine minutes fast rejects freshly issued tokens             |

### 429 on sign-in

Ten failed attempts per 15 minutes per IP. Successful sign-ins do not count. Wait, or restart
the API in development to clear the in-memory store.

### Signed out unexpectedly

The refresh attempt failed. In order of likelihood:

| Cause                                 | Check                                                                                                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`tokenVersion` was incremented**    | The account signed out elsewhere, changed its password, was suspended, or was demoted. This is the system working — every token issued before that moment is dead |
| The refresh token expired             | 7 days by default                                                                                                                                                 |
| `JWT_REFRESH_SECRET` changed          | Every refresh token is invalid; everyone signs in again                                                                                                           |
| The refresh endpoint returned non-2xx | Check that specific call in the network tab                                                                                                                       |

### Revoking a session deliberately

There is no session table to delete from. Increment the account's `tokenVersion` and every
token already issued to it stops being accepted on the next request:

```js
db.users.updateOne(
  { email: "user@example.com" },
  { $inc: { tokenVersion: 1 } },
);
```

The same effect is reachable through the product: suspending the account from the admin console
does this and blocks sign-in as well.

### Infinite redirect between `/login` and a protected route

`isAuthenticated` is true while the token is unusable:

```js
localStorage.removeItem("auth-storage");
location.reload();
```

If it recurs, persisted state and token validity have diverged — worth a defect report.

## CORS

| Cause                                          | Fix                                       |
| ---------------------------------------------- | ----------------------------------------- |
| `CLIENT_URL` does not match the browser origin | Set it exactly, including scheme and port |
| API not restarted after the change             | CORS is configured at boot                |
| `127.0.0.1` vs `localhost`                     | Different origins to a browser            |

Check the preflight `OPTIONS` request, not the one that appears to fail.

## Client

### Blank page, no errors

A lazy chunk failed to load, or a crash above the error boundary. A `Loading chunk … failed`
message means a stale index referencing a deleted build — hard refresh.

### `.env` changes have no effect

**Vite reads environment variables once, at startup.** Restart the dev server. This catches
everyone at least once.

### `useAuth must be used within an AuthProvider` / `Cannot read properties of undefined (reading 'colors')`

The component rendered outside its provider — commonly in a test without providers. Use the
`renderWithProviders` helper from
[testing.md](../guides/testing.md#client-integration).

### Stale data after a mutation

The mutation did not invalidate the right key. `['posts']` (public feed) and `['allPosts']`
(admin, includes drafts) are **deliberately different datasets** — check the
[key table](../architecture/frontend.md#query-keys).

## API

### 500 with no useful message

Production returns a generic message by design. Read the cause in the Vercel Runtime Logs, or
reproduce locally with `NODE_ENV=development`, which includes the message and stack.

### 403 on a category or analytics request

Both are now scoped. Categories require post ownership; `:userId` routes require the id to be
the caller's. Confirm the token subject matches.

### A slow or timing-out request

`GET /posts` and `GET /comments/post/:postId` are paginated and indexed, and the unscoped
`GET /comments` no longer exists. The remaining unbounded endpoint is `GET /likes/post/:id`;
`GET /page-views/post/:id` is capped at 200 rather than paged
([SEC-11](../security/checklist.md#sec-11)). The unindexed search regex is the other candidate.

## Database

### `E11000 duplicate key error`

A unique index rejecting a duplicate — working as intended. Which index the message names
tells you what happened:

| Index                      | Meaning                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `email_1` / `username_1`   | Duplicate account attempt — the API translates this to 409 |
| `post_1_user_1` on `likes` | Duplicate like, or a like written with a null post         |
| `name_1` on `categories`   | Duplicate category                                         |

### Adding an index fails

Unique index creation fails while duplicates exist. Find them first:

```js
db.users.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 }, ids: { $push: "$_id" } } },
  { $match: { count: { $gt: 1 } } },
]);
```

### Counters disagree with reality

`postCount`, `followersCount` and `followingsCount` are maintained by separate `$inc`
operations with no transaction. Reconcile:

```js
db.userprofiles.find().forEach((p) => {
  db.userprofiles.updateOne(
    { _id: p._id },
    {
      $set: {
        postCount: db.posts.countDocuments({ user: p.user }),
        followersCount: (p.followers ?? []).length,
        followingsCount: (p.followings ?? []).length,
      },
    },
  );
});
```

### Everything is slow

Confirm a scan:

```js
db.posts.find({ visibility: "public" }).explain("executionStats");
// COLLSCAN in winningPlan.stage confirms it
```

Thirteen indexes are declared — verify they exist in the target database. Indexes are created
on connection, so a database that predates a schema change may lack them.

### The database is empty after a command

`npm run seed` clears every collection with no prompt and no undo. Restore from an Atlas
snapshot.

## Production

### A shared post link 404s

Fixed by the SPA fallback ([BUG-12](../product/roadmap.md#bug-12)). If it recurs, check the
`routes` block in `vercel.json` — the catch-all must target `/index.html`.

### `MongoServerError: connection pool cleared`

Atlas connection limit reached. Each cold start opens a new connection and nothing caches it
([deployment.md](deployment.md#connection-handling)). Short-term: restart or raise the tier.

### Deployment succeeded but the site is broken

1. Compare environment variables against the last working deployment. A missing
   `VITE_API_URL` is the usual cause, and it is baked in at build time — it needs a
   **rebuild**, not just a variable change.
2. Check the build logs for a warning that was not a failure.
3. Promote the last known-good deployment while investigating.

---

## Escalation

Capture before asking for help:

1. Expected versus actual behaviour
2. Reproduction steps, including the account role
3. The failing request — method, path, status, response body
4. Console output, browser and server
5. Environment — local, preview or production; commit SHA
6. Scope — one user, one browser, or everyone

Open a report with the [bug template](../../.github/ISSUE_TEMPLATE/bug_report.md). For a
security issue, do **not** open a public issue — follow
[SECURITY.md](../../SECURITY.md).
