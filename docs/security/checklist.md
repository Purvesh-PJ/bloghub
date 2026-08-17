# Security Checklist

> **Scope:** the security finding register (`SEC-xx`) and the checklists used before shipping
> and during review. Single source of truth for security findings.
> **Excludes:** how identity and permissions work ([auth.md](auth.md)); functional defects,
> which live in the [roadmap](../product/roadmap.md) as `BUG-xx`.

**First audit:** 2026-08-14, commit `4e24b38` — manual review of all endpoints, 12 models and
the client authentication path.
**Second audit:** 2026-08-17, commit `fc8892d` — repeat pass over the same surface plus the
rendering path, which the first audit had not covered. Found SEC-13, the worst issue in either
round.
**Remediation:** 2026-08-18 — all 13 findings closed, each verified by request against a
running server or by measurement in a browser, not by inspection alone.

---

## Status

| ID                | Finding                                               | Severity | Status       |
| ----------------- | ----------------------------------------------------- | -------- | ------------ |
| [SEC-01](#sec-01) | Public reads returned drafts and private posts        | Critical | ✅ **Fixed** |
| [SEC-02](#sec-02) | Four write endpoints required no authentication       | Critical | ✅ **Fixed** |
| [SEC-03](#sec-03) | Authenticated routes not scoped to the calling user   | High     | ✅ **Fixed** |
| [SEC-04](#sec-04) | Unauthenticated, unthrottled analytics writes         | Medium   | ✅ **Fixed** |
| [SEC-05](#sec-05) | File upload has no type, size or path constraints     | High     | ✅ **Fixed** |
| [SEC-06](#sec-06) | Refresh tokens were accepted as access tokens         | High     | ✅ **Fixed** |
| [SEC-07](#sec-07) | No rate limiting, security headers or body-size limit | High     | ✅ **Fixed** |
| [SEC-08](#sec-08) | Tokens in `localStorage` with no revocation path      | Medium   | ✅ **Fixed** |
| [SEC-09](#sec-09) | Email addresses exposed in public payloads            | High     | ✅ **Fixed** |
| [SEC-10](#sec-10) | Secrets not validated at startup                      | Medium   | ✅ **Fixed** |
| [SEC-11](#sec-11) | Unbounded list endpoints                              | Medium   | ✅ **Fixed** |
| [SEC-12](#sec-12) | No dependency vulnerability scanning                  | Medium   | ✅ **Fixed** |
| [SEC-13](#sec-13) | Stored XSS in rendered post bodies                    | Critical | ✅ **Fixed** |
| [SEC-14](#sec-14) | Rate limiting keyed to the proxy, not the client      | High     | ✅ **Fixed** |
| [SEC-15](#sec-15) | Roles read from the token, never re-checked           | High     | ✅ **Fixed** |

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

| Endpoint                                         | Now requires                        |
| ------------------------------------------------ | ----------------------------------- |
| `POST /categories`                               | authentication + `admin`            |
| `POST /tags`                                     | authentication + `admin`            |
| `POST /categories/categoriesCollection`          | authentication + **post ownership** |
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

Four routes verified _that_ a caller was authenticated but never that the requested
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

**Unauthenticated, unthrottled analytics writes.** Medium · ✅ Fixed

`POST /analytics/view/:postId`, `POST /analytics/read/:postId` and `POST /page-views` accepted
anonymous requests with no deduplication, and did not confirm the post existed. Holding down
refresh inflated any post's numbers without limit, which made every figure on the analytics
dashboard decorative.

**Fixed** — `backend/utils/visitor.js` and `analytics.controllers.js`:

- Each tracking request is keyed to a visitor: the account id when signed in, otherwise an
  HMAC of the address and user agent, salted with the app secret. The address is hashed rather
  than stored — the analytics only need to know two requests came from the same place.
- One row per visitor per post per 6-hour window; repeats answer 200 with `counted: false`.
- Tracking refuses a post the caller could not have been reading (missing, or unpublished and
  not theirs).
- `POST /page-views` is removed. It was a second, weaker writer for the same collection with
  no deduplication, so totals depended on which endpoint the caller happened to use.

Verified: repeated `POST /analytics/view/:postId` from one client writes a single row.

---

### SEC-05

**File upload has no type, size or path constraints.** High · ✅ Fixed

`multer.diskStorage` with no `fileFilter`, no `limits`, and `Date.now() + '-' +
file.originalname` as the destination filename. `originalname` is chosen by the client, so
`../` in a filename escaped the upload directory.

**Fixed** — `backend/middlewares/upload.js`:

- `multer.memoryStorage()`, a 2 MB cap, one file, and a MIME allowlist of JPEG, PNG, WebP
  and GIF.
- No filename is derived from user input at all. The bytes go into the profile document as
  the `Buffer` the schema had always declared, which also fixed the feature end to end —
  see [BUG-07](../product/roadmap.md#bug-07). The previous code wrote the file _path_ into
  that Buffer field, which the read path then base64-encoded into a broken data URI.

Storing a 2 MB-capped avatar in Mongo avoids introducing object storage for this project. If
images grow, `upload.js` is the seam to move behind S3.

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

| Control            | Setting                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| Security headers   | `helmet()` — HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` |
| General rate limit | 300 requests / 15 minutes per IP                                                  |
| Auth rate limit    | 10 **failed** attempts / 15 minutes (`skipSuccessfulRequests`)                    |
| JSON body          | 1 MB                                                                              |
| Urlencoded body    | 1 MB                                                                              |

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

**Tokens in `localStorage` with no revocation path.** Medium · ✅ Fixed

The session is persisted in `localStorage["auth-storage"]`, readable by any script on the
origin, and sign-out only made this browser forget it — anyone who had captured a token could
keep using it for its full lifetime.

**Fixed** — `tokenVersion` on the User document. Both tokens carry the value they were minted
with, and `authenticateUser` compares it against the stored one on every request, so bumping
the field invalidates everything already issued. It is bumped by sign-out, by a password
change, and by an administrator suspending or demoting the account.

`POST /auth/signout` now exists and does this. So does `PUT /auth/password`, which revokes the
session that made the request — the point, if the password is being changed because the old
one leaked.

Verified: an access token that worked a moment earlier answers 401 immediately after
sign-out. Covered by `tests/auth.test.js` and `tests/admin.test.js`.

**Storage itself is still `localStorage`**, which remains the accepted trade-off for a
bearer-token SPA — httpOnly cookies bring CSRF requirements and complicate a cross-origin API.
Trade-off table in [auth.md](auth.md#storage-trade-off). What changed is that a leaked token
can now be killed rather than merely waited out.

**Still worth adding:** a Content-Security-Policy header. [SEC-13](#sec-13) closed the one
XSS that existed; CSP is the defence in depth for the next one.

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

**Unbounded list endpoints.** Medium · ✅ Fixed

| Endpoint                       | Status                                                     |
| ------------------------------ | ---------------------------------------------------------- |
| `GET /posts`                   | Paginated — `?page` and `?limit`, default 20, capped at 50 |
| `GET /posts/trending`          | Capped at 50                                               |
| `GET /search/:query`           | Capped at 50, sorted by recency                            |
| `GET /comments/post/:postId`   | Paginated, capped at 50                                    |
| `GET /likes/post/:postId`      | Bounded                                                    |
| `GET /page-views/post/:postId` | Capped at 200, and now author-or-admin only                |
| `GET /users`                   | Paginated, capped at 50                                    |
| `GET /users/getUserPosts`      | Paginated, capped at 50                                    |

The unscoped `GET /comments` is gone entirely. It ran `Comment.find()` with no filter, no
pagination and no authentication, returning every comment in the database to anonymous
callers — including comments on drafts and private posts. It is replaced by
`GET /comments/post/:postId`, which is paginated and applies the post's own visibility rule.

`GET /posts` also no longer populates all comments for every post — the single most
expensive query in the application, and the one most likely to breach Vercel's 10-second
function limit.

---

### SEC-12

**No dependency vulnerability scanning.** Medium · ✅ Fixed

No CI, no `npm audit` gate, no Dependabot.

**Baseline recorded 2026-08-14:**

| Workspace  | Advisories                                  |
| ---------- | ------------------------------------------- |
| `backend/` | 25 (1 critical, 17 high, 4 moderate, 3 low) |
| `client/`  | 17 (13 high, 3 moderate, 1 low)             |

**Fixed 2026-08-18.** Both workspaces report **0 vulnerabilities**. Mongoose 7 → 8 cleared
the critical; nodemon 3 cleared the rest of the backend's. Two mattered more than their
rating suggested: `jws` improperly verifies HMAC signatures and sits directly under
`jsonwebtoken`, on the auth path; `lodash` carried prototype-pollution and `_.template`
code-injection advisories.

`.github/workflows/ci.yml` runs `npm audit --audit-level=high` for both workspaces on every
push and pull request, so a high or critical advisory now fails the build. Moderate and below
are reported by `npm audit` locally but do not block a merge.

The sequencing concern recorded in the original entry — that `npm audit fix` on a project
with no test suite is an unacceptable risk — was addressed in the order it described: the
suite landed first, then CI, then the upgrades behind a green pipeline.

---

### SEC-13

**Stored XSS in rendered post bodies.** Critical · ✅ Fixed

Found in the second audit. The first pass reviewed endpoints and models and did not look at
the rendering path, which is where the worst issue in either round was.

Post bodies reached the DOM unsanitised through two paths. Content beginning with a tag went
into `dangerouslySetInnerHTML`; everything else went to `MDEditor.Markdown`, which enables
`rehype-raw` unconditionally in its default plugin chain. `rehype-raw` was installed and
active; `rehype-sanitize` was not installed at all.

Any author publishing `<img src=x onerror=…>` executed script in every reader's browser.
Access _and_ refresh tokens live in `localStorage` ([SEC-08](#sec-08)), so the payload could
read both and exfiltrate them: one malicious post read by an administrator was persistent
admin access.

**Fixed** — `client/src/config/markdown.js`. The `rehypePlugins` prop is appended _after_
`rehype-raw`, which is what makes this work: the raw HTML is parsed into the tree first, then
`rehype-sanitize` strips what is dangerous out of it. The schema keeps class names on code and
text elements so fenced code blocks still highlight. The `dangerouslySetInnerHTML` branch was
deleted rather than patched — the renderer handles inline HTML on its own, so the special case
bought nothing.

Verified against `<img onerror>`, `<script>`, `<iframe>`, and `javascript:` hrefs in both link
and raw-anchor form; legitimate Markdown including the `language-*` class survives.

---

### SEC-14

**Rate limiting keyed to the proxy, not the client.** High · ✅ Fixed

`app.set('trust proxy', …)` was never called. Every request arrives through the platform's
proxy, so Express resolved `req.ip` to that address rather than the real client, and all
visitors shared one bucket: 300 requests per 15 minutes for the entire site, and 10 failed
sign-ins per 15 minutes across all users combined.

That inverts the control. Instead of stopping one abuser it lets one abuser lock everybody
out, and the limits added in [SEC-07](#sec-07) were not doing what that entry claimed.

**Fixed** — `app.set('trust proxy', 1)`. Exactly one hop: trusting all of them would let a
client spoof `X-Forwarded-For` and skip the limit entirely.

The default store is still per-instance, so on serverless the limits remain approximate
across cold starts. A shared store would make them exact.

---

### SEC-15

**Roles read from the token, never re-checked.** High · ✅ Fixed

`authenticateUser` lifted `roles` straight out of the JWT payload, and `refreshToken` copied
`decoded.roles` into each newly minted access token without consulting the database. The chain
never touched the User document after sign-in.

So demoting an administrator, banning a user or deleting an account changed nothing for the
refresh token's full 7-day life — and the holder could keep minting fresh access tokens the
whole time.

**Fixed** — `authenticateUser` now loads the account and takes `roles` from the record, and
rejects a token whose `tokenVersion` is stale or whose account is deleted or suspended.
`refreshToken` re-reads the account rather than trusting the presented payload. One indexed
read per request is what makes revocation and demotion take effect immediately.

Verified by test: a forged refresh token whose payload claims `roles: ['admin']` mints an
access token that is refused 403 by an admin-only route.

---

## What is done well

Worth recording so it is not regressed.

| Practice                                                                 | Where                      |
| ------------------------------------------------------------------------ | -------------------------- |
| bcrypt hashing with a per-password salt, cost 12                         | `auth.controllers.js`      |
| Identical 401 for unknown user and wrong password                        | `auth.controllers.js`      |
| Regex metacharacters escaped before building the search query            | `search.controllers.js`    |
| Post ownership enforced on update and delete, with an admin bypass       | `post.controllers.js`      |
| Comment authorship taken from the token, never the body                  | `comment.controllers.js`   |
| Password hash excluded from every user projection                        | `user.controllers.js`      |
| Stack traces suppressed outside development                              | `errorHandler.js`          |
| Role check defaults to least privilege on a malformed claim              | `authenticateUser.js`      |
| A single Axios instance, so no request bypasses the auth interceptor     | `client/src/config/api.js` |
| Unique indexes enforce identity at the database, not in application code | `user.model.js`            |
| Duplicate-key errors translated to a 409 rather than a 500               | `auth.controllers.js`      |

---

## Remaining work, in order

Every finding in the register is closed. What is listed here is defence in depth, not
outstanding remediation.

| Order | Item                           | Effort     | Note                                                                                         |
| ----- | ------------------------------ | ---------- | -------------------------------------------------------------------------------------------- |
| 1     | Content-Security-Policy header | Half a day | [SEC-13](#sec-13) closed the XSS that existed; CSP is the guard for the next one             |
| 2     | Shared rate-limit store        | Half a day | Makes the [SEC-14](#sec-14) limits exact across serverless instances rather than approximate |
| 3     | Email verification at sign-up  | 1 day      | An address is currently taken on trust                                                       |
| 4     | Password reset                 | 1 day      | No recovery path exists; a forgotten password is a lost account                              |

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
