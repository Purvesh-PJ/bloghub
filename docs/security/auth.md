# Authentication and Authorization

> **Scope:** how identity is established (credentials, tokens, storage, refresh) and what an
> identity is permitted to do (roles, enforcement layers, the permission matrix).
> **Excludes:** the finding register ([checklist.md](checklist.md)), endpoint signatures
> ([reference/api.md](../reference/api.md)).

---

# Part 1 — Authentication

## Model

Stateless **JWT bearer authentication** with an access/refresh pair. No session store, no
server-side token registry, no cookies.

```
┌────────┐  credentials   ┌────────┐   verify    ┌──────────┐
│ Client │───────────────▶│  API   │────────────▶│ MongoDB  │
│        │◀───────────────│        │             │  users   │
└───┬────┘  access +      └────────┘             └──────────┘
    │       refresh
    │ localStorage["auth-storage"]
    │ Authorization: Bearer <access>
    └──────────────────────────▶ every subsequent request
```

## Registration

```
validate (SignupValidation)
   username non-empty · valid email · password ≥ 6 · confirmation matches
        ✗ → 400 with field errors
        ▼
schema normalises email (lowercase, trim)
        ▼
User.findOne({ $or: [email, username] })    ✗ found → 409
        ▼
bcrypt.genSalt(10) → bcrypt.hash
        ▼
User.create(...)     ✗ duplicate key (unique index) → 409
        ▼
UserProfile.create({ user })
        ▼
201 — no session is created; the user must sign in
```

Uniqueness is enforced by **unique indexes on `email` and `username`**, not by the
application check alone — two concurrent registrations cannot both succeed. A duplicate-key
error is translated to the same 409 the pre-check returns.

## Sign in

```
{ credential, password }        email OR username
        ▼
[rate limit: 10 failed attempts / 15 minutes per IP]
        ▼
User.findOne({ $or: [{ email: lower(credential) }, { username: credential }] })
        ✗ → 401 "Invalid email/username or password"
        ▼
bcrypt.compare        ✗ → 401, the same message
        ▼
issueTokens(user)
        ▼
200 { accessToken, refreshToken, userdata }
```

`userdata` carries `user_id`, `username`, `email` and `roles` — never the hash.

The identical 401 for both failure modes is deliberate: the endpoint cannot be used to
enumerate accounts.

## Token contract

| Property | Access token | Refresh token |
|----------|--------------|---------------|
| Lifetime | `JWT_ACCESS_EXPIRES_IN`, default 15m | `JWT_REFRESH_EXPIRES_IN`, default 7d |
| Secret | `JWT_SECRET` | **`JWT_REFRESH_SECRET`** |
| Algorithm | HS256 | HS256 |
| Payload | `{ user, roles, type: 'access', iat, exp }` | `{ user, roles, type: 'refresh', iat, exp }` |
| Sent on | Every API request | Only `POST /auth/refreshToken` |
| Storage | `localStorage` | `localStorage` |
| Revocable | No | No |

```js
const issueTokens = (user) => ({
  accessToken: jwt.sign({ user: user.id, roles: user.roles, type: 'access' },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }),
  refreshToken: jwt.sign({ user: user.id, roles: user.roles, type: 'refresh' },
    refreshSecret(), { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }),
});
```

**The two types are cryptographically distinct.** Presenting a refresh token as an access
token fails signature verification, and the `type` claim is checked independently. This
closed [SEC-06](checklist.md#sec-06), which had made the 15-minute access lifetime
meaningless.

`JWT_REFRESH_SECRET` falls back to `JWT_SECRET` when unset — accepted in development, warned
about at boot, and a hard failure in production if the two are equal.

## Verification

`backend/middlewares/authenticateUser.js`:

```js
if (!authHeader?.startsWith('Bearer ')) return res.status(401)...

const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
if (decodedToken.type && decodedToken.type !== 'access') {
  return res.status(401).json({ success: false, message: 'Invalid token type' });
}

req.user = { id: userId, _id: userId, roles: Array.isArray(decodedToken.roles) ? decodedToken.roles : ['user'] };
```

Both `id` and `_id` are populated because the payload shape varied across earlier versions.
Roles fall back to `['user']` on a missing or malformed claim — a safe default granting least
privilege.

**The acting user always comes from the verified token.** No handler may read a user id from
the request body to decide who is acting.

### Optional authentication

`attachUserIfPresent` populates `req.user` when a valid token is present but never rejects.
It is used on public routes whose response varies for a signed-in viewer — an author reading
their own draft, or an administrator requesting `?all=true`.

**Note:** roles in a token are a snapshot from sign-in. Revoking `admin` does not take effect
until the token expires. Without revocation ([GAP-06](../product/roadmap.md#gap-06)) there is
no way to demote someone immediately.

## Refresh

```
{ refreshToken }        ✗ absent → 400
        ▼
jwt.verify(refreshToken, JWT_REFRESH_SECRET)    ✗ → 401
        ▼
type must be 'refresh'                          ✗ → 401
        ▼
sign a new access token
        ▼
200 { data: { accessToken } }
```

The refresh token is **not rotated** — the same one stays valid for its full 7 days.
Rotation would allow theft detection but needs server-side state.

### Client side

`client/src/config/api.js`:

```
401 and not yet retried
   ├─ set _retry
   ├─ POST /auth/refreshToken via bare axios (not `api`, so no recursion)
   ├─ success → store the new token → replay the original request
   └─ failure → authState.logout() → window.location.href = '/login'
```

Concurrent 401s each trigger their own refresh; a shared in-flight promise would coalesce
them.

## Client session

`authState` is a module-scope object plus a React provider that mirrors it — the design
rationale is in
[architecture/frontend.md](../architecture/frontend.md#authentication-state). The whole
session is JSON-serialised into `localStorage["auth-storage"]` and read at module load, so a
refresh restores the session before first paint.

### Storage trade-off

| | `localStorage` (current) | httpOnly cookie |
|---|---|---|
| XSS exposure | **Readable by any script on the origin** | Not readable by script |
| CSRF exposure | Immune — the token is attached explicitly | Needs SameSite plus a CSRF token |
| Cross-origin API | Works trivially | Needs `credentials` and matching CORS |
| Mobile client reuse | Works | Awkward |

An accepted trade-off for a bearer-token SPA. The honest statement of the risk: a successful
XSS yields account takeover. Since [SEC-06](checklist.md#sec-06), a stolen *access* token is
genuinely limited to 15 minutes — but the refresh token still cannot be revoked.

## Sign out

`authState.logout()` clears in-memory state and the persisted entry. **Client-side only** —
no request is sent and the tokens stay valid until they expire
([GAP-06](../product/roadmap.md#gap-06)).

Real sign-out needs server state. The lightest option:

```
POST /auth/logout { refreshToken }
  → record the token's jti in a revocation set with a TTL matching its expiry
  → the refresh endpoint rejects any listed jti
```

A `revokedTokens` collection with a MongoDB TTL index needs no extra infrastructure, and a
short access lifetime keeps the check on the refresh path only.

---

# Part 2 — Authorization

## Roles

| Role | Granted by | Capabilities |
|------|-----------|--------------|
| *(anonymous)* | No token | Read published content, register, sign in |
| `user` | Default on registration | Author, engage, manage own content, view own analytics |
| `admin` | Manual database edit or the seeder | Everything above, plus the console, site-wide analytics, user listing, moderation of any post |

There is no UI for granting a role.

## Enforcement layers

```
1. UI visibility        Header hides the admin link
                        ↳ cosmetic only
2. Route guards         AdminRoute / ProtectedRoute redirect
                        ↳ user experience only — bypassable by typing a URL
─────────────────── the security boundary ───────────────────
3. Route middleware     authenticateUser → authorizeAdmin
                                        → authorizeSelfOrAdmin(param)
4. Resource ownership   post.user === req.user.id, inside the controller
```

Layers 1 and 2 exist so users are not shown actions they cannot perform. **Every protected
resource is independently enforced at layer 3 or 4.** Relying on a guard for protection is a
security defect.

### Middleware

```js
// authorizeAdmin — requires the admin role
if (!req.user) return res.status(401)...
if (!(req.user.roles || []).includes('admin')) return res.status(403)...

// authorizeSelfOrAdmin(param) — the caller may only address their own id
const isSelf  = req.params[param] === req.user.id;
const isAdmin = (req.user.roles || []).includes('admin');
if (!isSelf && !isAdmin) return res.status(403)...
```

An absent optional parameter means "me" and passes through.

### Ownership

```js
if (post.user && post.user.toString() !== userId.toString() && !req.user.roles?.includes('admin')) {
  return res.status(403).json({ success: false, message: 'Unauthorized to edit this post' });
}
```

String-to-string comparison (ObjectId equality is not reference equality); administrators
bypass, enabling moderation; and the check runs **after** the existence check, so a missing
resource returns 404 rather than leaking existence through a 403.

Applied to `PUT /posts/:_id`, `DELETE /posts/:_id`, and both category-attachment endpoints.

---

## Permission matrix

**A** anonymous · **U** member · **O** owner · **X** admin. `✓` permitted · `✗` denied ·
`⚠` permitted but should not be.

### Posts

| Endpoint | A | U | O | X | Enforcement |
|----------|---|---|---|---|-------------|
| `GET /posts` | ✓ | ✓ | ✓ | ✓ | Published only. `?all=true` honoured for admins alone |
| `GET /posts/:id` | ✓ | ✓ | ✓ | ✓ | Non-public → 404 unless author or admin |
| `POST /posts` | ✗ | ✓ | — | ✓ | `authenticateUser` |
| `PUT /posts/:_id` | ✗ | ✗ | ✓ | ✓ | + ownership |
| `DELETE /posts/:_id` | ✗ | ✗ | ✓ | ✓ | + ownership |

### Users

| Endpoint | A | U | O | X | Enforcement |
|----------|---|---|---|---|-------------|
| `GET /users` | ✗ | ✗ | — | ✓ | `authorizeAdmin` |
| `GET /users/getUser` | ✗ | ✓ | — | ✓ | Scoped to the token subject |
| `PUT /users/setUser` | ✗ | ✓ | — | ✓ | Scoped |
| `GET /users/getUserPosts` | ✗ | ✓ | — | ✓ | Scoped |
| `POST /users/postUserProfile` | ✗ | ✓ | — | ✓ | Scoped |
| `GET /users/getUserProfile` | ✗ | ✓ | — | ✓ | Scoped |
| `POST /users/followUser` | ✗ | ✓ | — | ✓ | Actor from the token; 409 on self-follow |
| `POST /users/unfollowUser` | ✗ | ✓ | — | ✓ | Actor from the token |
| `GET /users/isFollowing/:id` | ✗ | ✓ | — | ✓ | Scoped |

### Categories and tags

| Endpoint | A | U | O | X | Enforcement |
|----------|---|---|---|---|-------------|
| `GET /categories`, `GET /tags` | ✓ | ✓ | — | ✓ | Public read is intended |
| `POST /categories` | ✗ | ✗ | — | ✓ | `authorizeAdmin` |
| `POST /tags` | ✗ | ✗ | — | ✓ | `authorizeAdmin` |
| `POST /categories/categoriesCollection` | ✗ | ✗ | ✓ | ✓ | + post ownership |
| `PUT /categories/updateCategoriesCollection/:id` | ✗ | ✗ | ✓ | ✓ | + post ownership |

### Comments

| Endpoint | A | U | O | X | Enforcement |
|----------|---|---|---|---|-------------|
| `GET /comments` | ⚠ | ⚠ | — | ✓ | Unscoped and unpaginated ([SEC-11](checklist.md#sec-11)) |
| `POST /comments` | ✗ | ✓ | — | ✓ | Author from the token |
| `POST /comments/replies` | ✗ | ✓ | — | ✓ | Author from the token; parent validated |

No update or delete exists, so there is nothing to authorise — but also no way to remove a
comment short of deleting the post.

### Likes and page views

| Endpoint | A | U | O | X | Enforcement |
|----------|---|---|---|---|-------------|
| `POST /likes` | ✗ | ✓ | — | ✓ | Actor from the token; unique index |
| `DELETE /likes/post/:postId` | ✗ | ✓ | — | ✓ | Deletes only the caller's own like |
| `GET /likes/post/:postId` | ✓ | ✓ | — | ✓ | Usernames only, no emails |
| `GET /likes/:id` | ✓ | ✓ | — | ✓ | |
| `POST /page-views` | ⚠ | ⚠ | — | ✓ | Rate-limited, undeduplicated ([SEC-04](checklist.md#sec-04)) |
| `GET /page-views/post/:postId` | ✓ | ✓ | — | ✓ | Usernames only |
| `GET /page-views/post/:postId/count` | ✓ | ✓ | — | ✓ | |

### Analytics and activity

| Endpoint | A | U | O | X | Enforcement |
|----------|---|---|---|---|-------------|
| `GET /analytics/post/:id` | ✓ | ✓ | — | ✓ | Counters only |
| `GET /analytics/user/:userId` | ✗ | ✗ | ✓ | ✓ | `authorizeSelfOrAdmin` |
| `GET /analytics/admin` | ✗ | ✗ | — | ✓ | `authorizeAdmin` |
| `POST /analytics/view/:postId` | ⚠ | ⚠ | — | ✓ | Rate-limited only |
| `POST /analytics/read/:postId` | ⚠ | ⚠ | — | ✓ | Rate-limited only |
| `GET /user-activity/all` | ✗ | ✗ | — | ✓ | `authorizeAdmin` |
| `GET /user-activity/user/:userId` | ✗ | ✗ | ✓ | ✓ | `authorizeSelfOrAdmin` |
| `GET /user-activity/timeline/:userId` | ✗ | ✗ | ✓ | ✓ | `authorizeSelfOrAdmin` |
| `GET /user-activity/moderation-log` | ✗ | ✗ | — | ✓ | `authorizeAdmin` |

### Settings

All behind `router.use(authenticateUser)`.

| Endpoint | A | U | O | X | Enforcement |
|----------|---|---|---|---|-------------|
| `GET`/`PUT /settings/user` | ✗ | ✓ | — | ✓ | Scoped |
| `GET /settings/profile/:userId?` | ✗ | ✗ | ✓ | ✓ | `authorizeSelfOrAdmin` |
| `PUT /settings/profile` | ✗ | ✓ | — | ✓ | Scoped |
| `PUT /settings/security` | ✗ | ✓ | — | ✓ | Returns 501 |
| `PUT /settings/privacy` | ✗ | ✓ | — | ✓ | Scoped |
| `PUT /settings/appearance` | ✗ | ✓ | — | ✓ | Scoped |

---

## Remaining gaps

| Pattern | Endpoints | Finding |
|---------|-----------|---------|
| Unauthenticated, undeduplicated writes | 3 tracking routes | [SEC-04](checklist.md#sec-04) |
| Unpaginated public reads | `GET /comments`, two list routes | [SEC-11](checklist.md#sec-11) |
| No ownership model | comments, likes | Cannot be edited or moderated |
| No session revocation | all | [GAP-06](../product/roadmap.md#gap-06) |

---

## Rules for new endpoints

1. **Authenticated by default.** Public needs a written reason.
2. **Authenticate, then authorise.** A valid token answers *who*, never *whether*.
3. **Scope by the token, not the parameter.** Use `authorizeSelfOrAdmin(param)`.
4. **Check existence before permission.** 404 before 403; 404 for non-public content.
5. **Filter reads by visibility**, not only writes by ownership.
6. **Project the query.** Authorisation controls record access; projection controls which
   fields leave the server.
7. **Never trust a client-side guard.**
8. **Update this matrix** in the same pull request.

---

## Proposed model

The two-role scheme is adequate today. If moderation grows, promote it to explicit
permissions rather than adding roles:

| Role | Permissions |
|------|-------------|
| `user` | `post:create`, `post:edit:own`, `post:delete:own`, `comment:create`, `like:toggle` |
| `moderator` | + `post:delete:any`, `comment:delete:any` |
| `admin` | + `user:list`, `user:role:assign`, `analytics:read:site` |

Then `requirePermission('post:delete:any')` replaces `authorizeAdmin`. Make this refactor
when the third role appears, not before.

---

## Hardening priority

| # | Action | Effort | Status |
|---|--------|--------|--------|
| 1 | Separate refresh secret + type claim | Low | ✅ Done |
| 2 | Rate-limit `/auth` | Low | ✅ Done |
| 3 | Unique indexes on identity fields | Low | ✅ Done |
| 4 | Scope `:userId` routes to the caller | Low | ✅ Done |
| 5 | Server-side revocation with a TTL collection | Medium | ❌ Open |
| 6 | Refresh-token rotation with reuse detection | Medium | ❌ Open |
| 7 | Password strength beyond 6 characters | Low | ❌ Open |
| 8 | Content-Security-Policy header | Medium | ❌ Open |
