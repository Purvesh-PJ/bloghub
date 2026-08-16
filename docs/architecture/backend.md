# Backend Architecture

> **Scope:** the internal design of the Express API — composition, request lifecycle,
> layering, error handling, cross-cutting concerns.
> **Excludes:** the endpoint catalogue ([reference/api.md](../reference/api.md)), the data
> model ([database.md](../reference/database.md)), token and permission mechanics
> ([security/auth.md](../security/auth.md)).

---

## Stack

| Concern | Choice | Version |
|---------|--------|---------|
| Runtime | Node.js | Unpinned — no `engines`, no `.nvmrc` |
| Framework | Express | 4.18 |
| ODM | Mongoose | 7.2 |
| Authentication | jsonwebtoken | 9.0 |
| Password hashing | bcryptjs | 2.4 |
| Validation | express-validator | 7.0 |
| Security headers | helmet | 8.3 |
| Rate limiting | express-rate-limit | 8.6 |
| Uploads | multer | 1.4 LTS |
| Request logging | morgan | 1.10 |
| CORS | cors | 2.8 |
| Configuration | dotenv | 16.4 |

CommonJS throughout.

---

## Composition root

`backend/index.js` wires the application in a fixed order, and the order matters:

```js
1  dotenv.config({ path: '../.env' })       // configuration first
2  assertEnv()                              // fail fast on a misconfigured deployment
3  connectDB()                              // skipped under NODE_ENV=test
4  app.use(logger)                          // morgan sees every request
5  app.use(helmet())                        // security headers
6  app.use(cors(...))                       // credentials only when CLIENT_URL is set
7  app.use(express.urlencoded({ limit: '1mb' }))
8  app.use(express.json({ limit: '1mb' }))
9  app.get(['/health','/ready'], ...)        // outside the rate limiter
10 router.use(generalLimiter)                // 300 / 15 min
11 router.use('/auth', authLimiter)          // 10 failed / 15 min
12 router.use('/<resource>', <resource>Routes)
13 app.use('/api', router); app.use('/', router)
14 app.use(errorHandler)                     // terminal — must be last
15 app.listen(PORT) unless running on Vercel
16 module.exports = app                      // serverless handler export
```

### Configuration validation

`config/env.js` runs before anything else. It requires `JWT_SECRET` everywhere and
`CLIENT_URL` in production, enforces a 32-character minimum secret in production, and refuses
to boot if `JWT_REFRESH_SECRET` equals `JWT_SECRET`. A misconfigured deployment now fails at
boot rather than on a user's first sign-in ([SEC-10](../security/checklist.md#sec-10)).

### Dual mounting

The same router answers at `/api` and `/`. This exists because `VITE_API_URL` points at the
API origin without a prefix while `vercel.json` forwards only `/api/*`. It is a compatibility
shim, not a design — two surfaces to secure and document. Settle on `/api`.

### Serverless-aware startup

```js
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) app.listen(PORT);
module.exports = app;
```

Locally the process listens; on Vercel the export is invoked per request.

### Health endpoints

`GET /health` reports liveness and uptime. `GET /ready` additionally pings MongoDB and
answers 503 when the connection is not usable. Both are mounted directly on the app, before
the rate limiter, so probes are never throttled, and both reveal nothing beyond status — a
health endpoint is a reconnaissance target.

---

## Database connection

`config/db.js` resolves the URI from `MONGODB_URI`, `MONGO_DB_URI` or `DB_URI`, exits with a
clear message when none is set, registers `error` and `disconnected` listeners, and closes on
`SIGINT`.

`connectDB()` is **not awaited** — requests arriving before the connection is established are
buffered by Mongoose. It is skipped entirely under `NODE_ENV=test` so a test harness can own
the connection.

> On serverless the connection is re-established per cold start with no pooling across
> invocations. A cached-connection pattern is the standard remedy — see
> [operations/deployment.md](../operations/deployment.md#serverless-considerations).

---

## Request lifecycle

```
Client · Authorization: Bearer <accessToken>
  ▼
morgan → helmet → cors → body parsers → rate limit
  ▼
Router match ─────── /api/posts/:id → routes/post.routes.js
  ▼
authenticateUser ─── verifies signature, expiry and type === 'access'
  │                  ✗ → 401
attachUserIfPresent  optional variant: populates req.user, never rejects
  ▼
authorizeAdmin ───── admin role required          ✗ → 403
authorizeSelfOrAdmin :userId must be the caller   ✗ → 403
  ▼
Controller ───────── validate → call a service or model
  │                  → choose the status code → send JSON
  ▼
Service ──────────── multi-step persistence, throws on failure
  ▼
Model ────────────── Mongoose query → MongoDB
```

---

## Layers

### `routes/`

Twelve routers declaring paths and their middleware chain. No logic.

```js
router.get('/', AuthUser.attachUserIfPresent, PostControllers.getBlogs);
router.post('/', AuthUser.authenticateUser, PostControllers.postBlogs);
```

`settings.routes.js` applies `router.use(authenticateUser)` to guard every path in the file —
the right pattern when a whole resource is authenticated.

### `middlewares/`

| Middleware | Responsibility |
|------------|----------------|
| `authenticateUser` | Verifies the bearer token, rejects a non-`access` type, then loads the account to confirm it still exists and its `tokenVersion` matches. `req.user = { id, _id, roles }`, with roles read from the record rather than the payload |
| `attachUserIfPresent` | Same population, but never rejects — for public routes whose response varies for a signed-in viewer |
| `authorizeAdmin` | Requires `admin` in `req.user.roles` |
| `authorizeSelfOrAdmin(param)` | Requires `req.params[param]` to be the caller, unless admin. An absent optional parameter means "me" |
| `validate` | Terminates an `express-validator` chain, collecting failures into one 400 |
| `validateObjectId(name, source)` | Rejects a malformed or non-string id before it reaches a query |
| `asyncHandler(fn)` | Wraps an async handler so a rejection reaches `errorHandler` instead of becoming an unhandled rejection |
| `uploadAvatar` | Multer, memory storage, single file, 2 MB cap, image MIME allowlist |
| `errorHandler` | Terminal error middleware. Reports the status an error carries and translates Mongoose/multer faults to 4xx |
| `logger` | Morgan — `dev` in development, `combined` otherwise, silent under test |

### `controllers/`

Twelve modules exporting one function per endpoint. A controller reads `req.params`,
`req.query`, `req.body` and `req.user`; validates what the route did not; calls a service or
model; selects the status code; shapes the JSON.

The identity idiom `req.user ? req.user.id || req.user._id || req.user : null` still appears
in older handlers. It is defensive against historical shapes of `req.user`; since
`authenticateUser` always sets both `id` and `_id`, `req.user.id` alone is sufficient.
Handlers touched during remediation use the simpler form.

### `services/`

Two modules covering multi-step persistence:

| Service | Function | Steps |
|---------|----------|-------|
| `postService` | `createPost` | Create → load the author → push onto `User.posts` → delete the post again if the author is missing |
| | `updatePost` | Validate required fields → `findByIdAndUpdate` with validators |
| `commentServices` | `createComment` | Create → load the post → push onto `Post.comments` → delete the comment again if the post is missing |

Services take plain values, never `req` or `res`, and signal failure by throwing. The
compensating deletes are a manual substitute for the transactions this codebase does not use.

Only two of twelve resources have a service module. Extract one when logic is reused or spans
more than one collection.

### `models/`

Eleven Mongoose schemas with constraints and indexes declared alongside them — see
[database.md](../reference/database.md).

---

## Response contract

Intended:

```jsonc
{ "success": true,  "message": "…", "data": { }, "pagination": { } }
{ "success": false, "message": "…", "error": "MachineCode" }
```

Applied inconsistently. Handlers migrated during remediation (posts, categories, settings,
likes, comments) use the envelope; several others still return a bare array or object, and
`GET /users/getUser` returns its record under a `User` key. Each variation forces the client
to special-case unwrapping. The per-endpoint shape is marked in
[reference/api.md](../reference/api.md).

---

## Error handling

Two mechanisms exist; one is in use.

**Local `try`/`catch` — used everywhere.** Each controller catches, logs with `console.error`
and a `[handlerName]` prefix, and responds directly. Precise status codes, at the cost of
repetition.

**`errorHandler` — effectively unreachable.** No controller calls `next(err)`, so it only
fires for synchronous throws in middleware. It hard-codes 500 and ignores `err.status`.
Stack traces are correctly withheld outside development.

**Target pattern** — an async wrapper plus a typed error, so controllers stop catching:

```js
router.get('/:id', asyncHandler(PostControllers.getSinglePost));

const post = await Post.findById(req.params.id);
if (!post) throw new ApiError(404, 'Post not found');
```

with `errorHandler` honouring `err.status`.

### Status codes

| Code | Meaning here |
|------|--------------|
| 200 / 201 | Success / created |
| 400 | Validation failure, invalid identifier |
| 401 | Missing, malformed, expired or wrong-type token; bad credentials |
| 403 | Authenticated but not permitted |
| 404 | Not found — also returned for a non-public post, so existence is not confirmed |
| 409 | Conflict — duplicate account or category, self-follow |
| 429 | Rate limited |
| 500 | Unhandled failure |
| 501 | Endpoint exists, capability not implemented (`PUT /settings/security`) |

---

## Cross-cutting concerns

### Authentication and authorisation

Stateless bearer tokens with separate secrets per token type. Enforced at three levels: route
middleware (`authorizeAdmin`), parameter scoping (`authorizeSelfOrAdmin`), and resource
ownership inside the controller. Full detail in
[security/auth.md](../security/auth.md).

### Input validation

Only registration is validated declaratively. Elsewhere validation is ad-hoc inside
controllers, and there is no shared identifier check — a malformed `ObjectId` usually surfaces
as a 500 from a cast error rather than a 400. A shared `validateObjectId` middleware is the
obvious next step.

`search.controllers.js` escapes regex metacharacters before building its query, preventing a
ReDoS through the search path.

### Rate limiting

Two limiters, both from `express-rate-limit`. The auth limiter sets
`skipSuccessfulRequests`, so a legitimate user is never locked out by their own successful
sign-ins. The default store is per-instance, making limits approximate on serverless; a
shared store would make them exact.

### File uploads

`multer.diskStorage` configured inline in `user.routes.js`, with no file-type filter and no
size limit, writing to a directory that is never created and is read-only on serverless. Both
broken and unsafe — [BUG-07](../product/roadmap.md#bug-07) and
[SEC-05](../security/checklist.md#sec-05).

### Logging

Morgan for request lines; `console.error` with a `[handler]` prefix elsewhere. No correlation
ids, no levels, no structure — [operations/runbook.md](../operations/runbook.md#part-2--logging).

---

## Architectural decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| Layered MVC-with-services | Familiar, low ceremony | The service layer is optional in practice, so responsibility drifts into controllers |
| Stateless JWT | No session store, fits serverless | No revocation — a leaked token is valid until expiry |
| Separate secret per token type | A refresh token cannot be replayed as an access token | Two secrets to manage |
| Mongoose over the raw driver | Schemas, population, validation | Strict mode silently drops undeclared fields — the root cause of [BUG-05](../product/roadmap.md#bug-05) |
| Referenced documents plus denormalised counters | Fast reads without joins | Counters drift; no transaction keeps both sides in step |
| Per-controller `try`/`catch` | Precise status codes | Repetition; the error middleware is dead weight |
| 404 rather than 403 for non-public content | Does not confirm a draft exists | Slightly less informative for legitimate owners |

---

## Extending the backend

1. `models/<resource>.model.js` — schema, constraints, **indexes**.
2. `services/<resource>Service.js` — only if multi-step or reused.
3. `controllers/<resource>.controllers.js` — one function per endpoint.
4. `routes/<resource>.routes.js` — paths and middleware chain.
5. Register in `index.js`: `router.use('/<resource>', <resource>Routes)`.
6. Add the matching `client/src/services/<resource>Service.js`.

Follow [reference/api.md](../reference/api.md#rules-for-new-endpoints) and the dependency
rules in [overview.md](overview.md#dependency-rules).
