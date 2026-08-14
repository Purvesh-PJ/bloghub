# Security Checklist

> **Scope:** the security finding register (`SEC-xx`) and the checklists used before shipping
> and during review. Single source of truth for security findings.
> **Excludes:** how identity and permissions work ([auth.md](auth.md)); functional defects,
> which live in the [roadmap](../product/roadmap.md) as `BUG-xx`.

**Audit:** 2026-08-14, commit `4e24b38` — manual review of all 51 endpoints, 12 models and
the client authentication path.
**Remediation:** 2026-08-14 — 8 of 12 findings closed and verified against a running server.

---

## Status

| ID | Finding | Severity | Status |
|----|---------|----------|--------|
| [SEC-01](#sec-01) | Public reads returned drafts and private posts | Critical | ✅ **Fixed** |
| [SEC-02](#sec-02) | Four write endpoints required no authentication | Critical | ✅ **Fixed** |
| [SEC-03](#sec-03) | Authenticated routes not scoped to the calling user | High | ✅ **Fixed** |
| [SEC-04](#sec-04) | Unauthenticated, unthrottled analytics writes | Medium | ⚠️ Partially mitigated |
| [SEC-05](#sec-05) | File upload has no type, size or path constraints | High | ❌ Open |
| [SEC-06](#sec-06) | Refresh tokens were accepted as access tokens | High | ✅ **Fixed** |
| [SEC-07](#sec-07) | No rate limiting, security headers or body-size limit | High | ✅ **Fixed** |
| [SEC-08](#sec-08) | Tokens in `localStorage` with no revocation path | Medium | ⚠️ Accepted, window reduced |
| [SEC-09](#sec-09) | Email addresses exposed in public payloads | High | ✅ **Fixed** |
| [SEC-10](#sec-10) | Secrets not validated at startup | Medium | ✅ **Fixed** |
| [SEC-11](#sec-11) | Unbounded list endpoints | Medium | ⚠️ Mostly fixed |
| [SEC-12](#sec-12) | No dependency vulnerability scanning | Medium | ❌ Open — baseline recorded |

Every ✅ below was verified by request against a running server, not by inspection alone.

---

### SEC-01
**Public reads returned drafts and private posts.** Critical · ✅ Fixed

`GET /posts` ran `Post.find()` with no filter; `GET /posts/:id` returned any post by id. The
home page filtered to `visibility === 'public'` **in the browser**, which is presentation,
not protection — the data had already crossed the network.

**Fix** — `backend/controllers/post.controllers.js`

- The list endpoint filters on `{ visibility: 'public' }`.
- The detail endpoint 404s a non-public post unless the caller is its author or an
  administrator. 404 rather than 403, so the response never confirms a draft exists.
- `GET /posts/:id` and `GET /posts` gained `attachUserIfPresent`, an optional-auth middleware
  that identifies a viewer without requiring a token.
- Administrators may opt into the unfiltered list with `?all=true`, which the moderation
  console uses. The flag is ignored for everyone else.
- Search is filtered to public posts too.

**Verified**

```
draft leaked to public list        → false
anonymous GET draft by id          → 404
author    GET draft by id          → 200
admin ?all=true total              → 24   (23 public + 1 draft)
member ?all=true total             → 23   (flag ignored)
```

Depended on [BUG-01](../product/roadmap.md#bug-01) — filtering on a field the API never
wrote would have hidden everything.

---

### SEC-02
**Four write endpoints required no authentication.** Critical · ✅ Fixed

`category.routes.js` and `tag.routes.js` applied no middleware, so anonymous callers could
create taxonomy and **re-categorise anyone's post**.

**Fix**

| Endpoint | Now requires |
|----------|--------------|
| `POST /categories` | authentication + `admin` |
| `POST /tags` | authentication + `admin` |
| `POST /categories/categoriesCollection` | authentication + **post ownership** |
| `PUT /categories/updateCategoriesCollection/:id` | authentication + **post ownership** |

Both attachment handlers now load the post, 404 when missing, and 403 unless the caller owns
it or is an administrator.

**Verified**

```
POST /categories (no token)                     → 401
POST /tags (no token)                           → 401
stranger attaches categories to another's post  → 403
```

---

### SEC-03
**Authenticated routes not scoped to the calling user.** High · ✅ Fixed

Four routes verified *that* a caller was authenticated but never that the requested
`:userId` was theirs, so any account could read any other account's analytics, activity
timeline and profile.

**Fix** — new `backend/middlewares/authorizeSelfOrAdmin.js`, a parameterised guard applied
to `GET /analytics/user/:userId`, `GET /user-activity/user/:userId`,
`GET /user-activity/timeline/:userId` and `GET /settings/profile/:userId?`. An absent
optional parameter means "me" and passes through.

**Verified**

```
SELF  analytics  → 200
OTHER analytics  → 403
ADMIN analytics  → 200
OTHER activity   → 403
OTHER profile    → 403
```

---

### SEC-04
**Unauthenticated, unthrottled analytics writes.** Medium · ⚠️ Partially mitigated

`POST /analytics/view/:postId`, `POST /analytics/read/:postId` and `POST /page-views` accept
anonymous requests with no deduplication, and the analytics routes do not confirm the post
exists.

**Mitigated by** the general rate limit added in [SEC-07](#sec-07) — 300 requests per 15
minutes per IP now bounds inflation.

**Still open**

- No per-user or per-IP deduplication, so counts remain inflatable within the limit.
- `POST /analytics/view/:postId` still writes a document for an arbitrary post id.
- `/page-views` and `/analytics/view` write the same collection; one should be retired.

Closing this properly needs a deduplication design — one view per viewer per post per
window. Tracked in the [roadmap](../product/roadmap.md).

---

### SEC-05
**File upload has no type, size or path constraints.** High · ❌ Open

`backend/routes/user.routes.js` configures `multer.diskStorage` with no `fileFilter`, no
`limits`, an unsanitised `file.originalname` in the destination filename, and a relative
destination path.

Present exposure is limited because the upload path is also functionally broken
([BUG-07](../product/roadmap.md#bug-07) — serverless filesystems are read-only), but the
configuration must not ship as written.

**Planned fix** — bundle with the BUG-07 storage rework:

```js
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const ok = allowed.includes(file.mimetype);
    cb(ok ? null : new Error('Unsupported file type'), ok);
  },
});
```

Then upload the buffer to object storage and persist the returned URL. Validate magic bytes
as well as the declared MIME type — the latter is client-supplied.

---

### SEC-06
**Refresh tokens were accepted as access tokens.** High · ✅ Fixed

Both tokens were signed with `JWT_SECRET`, carried an identical payload and had no type
claim, so a refresh token authenticated any API request. The 15-minute access lifetime was
meaningless — the real session lifetime was 7 days.

**Fix** — `backend/controllers/auth.controllers.js`, `backend/middlewares/authenticateUser.js`

- Refresh tokens are signed with `JWT_REFRESH_SECRET` (falling back to `JWT_SECRET` with a
  startup warning, and refusing to boot in production if the two are equal).
- Both token types carry an explicit `type` claim (`access` / `refresh`).
- `authenticateUser` rejects a non-`access` type; the refresh endpoint rejects a
  non-`refresh` type.

**Verified**

```
GET /users/getUser with a REFRESH token → 401
GET /users/getUser with an ACCESS token → 200
```

---

### SEC-07
**No rate limiting, security headers or body-size limit.** High · ✅ Fixed

**Fix** — `backend/index.js`, with `helmet` and `express-rate-limit` added as dependencies:

| Control | Setting |
|---------|---------|
| Security headers | `helmet()` — HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` |
| General rate limit | 300 requests / 15 minutes per IP |
| Auth rate limit | 10 **failed** attempts / 15 minutes (`skipSuccessfulRequests`) |
| JSON body | 1 MB |
| Urlencoded body | 1 MB |

Health endpoints are mounted before the limiter so monitoring probes are never throttled.

**Verified**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
RateLimit-Policy: 300;w=900
```

**Caveat:** the default store is per-instance, so on a serverless deployment the limits are
approximate across cold starts. A shared store (Redis, or a MongoDB collection) would make
them exact.

---

### SEC-08
**Tokens in `localStorage` with no revocation path.** Medium · ⚠️ Accepted, window reduced

The session is persisted in `localStorage["auth-storage"]`, readable by any script on the
origin. Sign-out remains client-side only.

**Position:** an accepted trade-off for a bearer-token SPA. The alternative — httpOnly
cookies — brings CSRF requirements and complicates a cross-origin API. Trade-off table in
[auth.md](auth.md#storage-trade-off).

**Improved by** [SEC-06](#sec-06): a stolen *access* token is now genuinely limited to 15
minutes rather than being interchangeable with a 7-day credential.

**Still required**

1. Server-side revocation, so a compromise can be contained
   ([GAP-06](../product/roadmap.md#gap-06)).
2. A Content-Security-Policy header to shrink the XSS surface.

---

### SEC-09
**Email addresses exposed in public payloads.** High · ✅ Fixed

`GET /likes/post/:postId` and `GET /page-views/post/:postId` are unauthenticated and
populated `('user', 'username email')`, letting anyone enumerate the email address of every
user who liked or viewed a post.

**Fix** — both projections reduced to `('user', 'username')`. The `user-activity` handlers
retain emails because those routes are admin-gated, which is legitimate.

**Verified** — no `email` key appears in either response.

---

### SEC-10
**Secrets not validated at startup.** Medium · ✅ Fixed

Only the database URI was checked at boot. A missing `JWT_SECRET` surfaced as a 500 on the
first sign-in, in production, to a user.

**Fix** — new `backend/config/env.js`, invoked before the database connection:

- Requires `JWT_SECRET` in every environment, `CLIENT_URL` additionally in production.
- Requires `JWT_SECRET` to be at least 32 characters in production.
- Refuses to boot if `JWT_REFRESH_SECRET` equals `JWT_SECRET`; warns when it is unset.
- Exits non-zero with a named-variable message.

---

### SEC-11
**Unbounded list endpoints.** Medium · ⚠️ Mostly fixed

| Endpoint | Status |
|----------|--------|
| `GET /posts` | ✅ Paginated — `?page` and `?limit`, default 20, capped at 50 |
| `GET /search/:query` | ✅ Capped at 50, sorted by recency |
| `GET /comments` | ❌ Still returns every comment in the database |
| `GET /likes/post/:postId` | ❌ Unbounded |
| `GET /page-views/post/:postId` | ❌ Unbounded |

`GET /posts` also no longer populates all comments for every post — the single most
expensive query in the application, and the one most likely to breach Vercel's 10-second
function limit.

Remaining work tracked as [GAP-07](../product/roadmap.md#gap-07).

---

### SEC-12
**No dependency vulnerability scanning.** Medium · ❌ Open

No CI, no `npm audit` gate, no Dependabot.

**Baseline recorded 2026-08-14:**

| Workspace | Advisories |
|-----------|-----------|
| `backend/` | 25 (1 critical, 17 high, 4 moderate, 3 low) |
| `client/` | 17 (13 high, 3 moderate, 1 low) |

Notable: a `validator` URL-validation bypass reachable through `express-validator`, and a
`vite` `server.fs.deny` bypass on Windows alternate paths (development-only).

**These were not remediated in this pass** — `npm audit fix` on a project with no test suite
is an unacceptable risk. Sequence it as: tests first ([GAP-11](../product/roadmap.md#gap-11)),
then CI ([GAP-12](../product/roadmap.md#gap-12)), then dependency updates behind a green
pipeline.

---

## What is done well

Worth recording so it is not regressed.

| Practice | Where |
|----------|-------|
| bcrypt hashing with a per-password salt, cost 10 | `auth.controllers.js` |
| Identical 401 for unknown user and wrong password | `auth.controllers.js` |
| Regex metacharacters escaped before building the search query | `search.controllers.js` |
| Post ownership enforced on update and delete, with an admin bypass | `post.controllers.js` |
| Comment authorship taken from the token, never the body | `comment.controllers.js` |
| Password hash excluded from every user projection | `user.controllers.js` |
| Stack traces suppressed outside development | `errorHandler.js` |
| Role check defaults to least privilege on a malformed claim | `authenticateUser.js` |
| A single Axios instance, so no request bypasses the auth interceptor | `client/src/config/api.js` |
| Unique indexes enforce identity at the database, not in application code | `user.model.js` |
| Duplicate-key errors translated to a 409 rather than a 500 | `auth.controllers.js` |

---

## Remaining work, in order

| Order | Item | Effort | Note |
|-------|------|--------|------|
| 1 | [SEC-12](#sec-12) — audit in CI | 1 hour | Blocked on CI existing |
| 2 | [SEC-11](#sec-11) — paginate the remaining lists | Half a day | |
| 3 | [SEC-05](#sec-05) — upload constraints | 1 day | Bundle with BUG-07 |
| 4 | [SEC-04](#sec-04) — view deduplication | 1 day | Needs a design decision |
| 5 | [SEC-08](#sec-08) — revocation and CSP | Ongoing | Largest remaining exposure |

---

## Pre-release checklist

**Configuration**
- [ ] `JWT_SECRET` ≥ 32 bytes, unique to this environment, not in source
- [ ] `JWT_REFRESH_SECRET` set and **different** from `JWT_SECRET`
- [ ] `NODE_ENV=production`
- [ ] `CLIENT_URL` is an explicit origin — boot now fails without it in production
- [ ] Database credentials unique to this environment
- [ ] No `VITE_`-prefixed variable contains a secret
- [ ] Atlas IP allowlist as narrow as the platform permits

**Application**
- [ ] No new endpoint is unauthenticated without a written reason
- [ ] Every `:userId` parameter is guarded by `authorizeSelfOrAdmin`
- [ ] No projection returns `password` or a private `email`
- [ ] Every list endpoint is paginated with a capped limit
- [ ] Security headers present — verify with `curl -I`
- [ ] `GET /health` and `GET /ready` respond

**Repository**
- [ ] `npm audit` reviewed in both workspaces
- [ ] No secret in history — `git log -p | grep -iE 'secret|password|api[_-]?key'`
- [ ] `.env` is not tracked

---

## Review checklist

- [ ] Is the acting user taken from `req.user`, never from the body or a path parameter?
- [ ] Is the route authenticated? Should it be?
- [ ] Is resource **ownership** verified, not just authentication?
- [ ] Is a `:userId` parameter scoped to the caller?
- [ ] Is every input validated before it reaches a query?
- [ ] Is the query projected so no hash or private email escapes?
- [ ] Is anything interpolated into a regex escaped?
- [ ] Is the list paginated with a capped limit?
- [ ] Are new schema fields **declared**? Mongoose silently drops undeclared fields
- [ ] Does an error response leak internal detail?

---

## Reporting a vulnerability

Do not open a public issue. See [SECURITY.md](../../SECURITY.md).
