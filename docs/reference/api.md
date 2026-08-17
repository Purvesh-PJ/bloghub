# API Reference

> **Scope:** the complete endpoint catalogue and the rules for designing new endpoints.
> Single source of truth for the HTTP contract.
> **Excludes:** server layering ([architecture/backend.md](../architecture/backend.md)), the
> data model ([reference/database.md](database.md)), token mechanics and the
> permission model ([security/auth.md](../security/auth.md)).

---

## Base URL

The router is mounted **once**, at `/api`. It used to be mounted at `/` as well, which gave
every endpoint two URLs while `vercel.json` only ever forwarded `/api/*` — so the second mount
served no purpose in production and doubled the surface to reason about.

| Environment | Client uses                 |
| ----------- | --------------------------- |
| Local       | `http://localhost:4000/api` |
| Vercel      | `/api`                      |

`client/src/config/api.js` appends `/api` when the configured `VITE_API_URL` does not already
end with it, so an existing `.env` keeps working. Paths below omit the prefix.

---

## Conventions

### Authentication

```http
Authorization: Bearer <accessToken>
```

`authenticateUser` rejects a missing, malformed, expired or wrong-type token with 401 before
the controller runs. A refresh token is **not** accepted here. The acting user always comes
from the verified token, never from the request body.

### Response envelope

```jsonc
{ "success": true,  "message": "…", "data": { }, "pagination": { } }
{ "success": false, "message": "…", "error": "MachineCode" }
```

Endpoints migrated during remediation use the envelope. The table below marks each
endpoint's actual shape. New endpoints must use it; endpoints touched for other reasons
should be migrated.

### Status codes

| Code | Use                                                                            |
| ---- | ------------------------------------------------------------------------------ |
| 200  | Successful read, update or delete                                              |
| 201  | Created                                                                        |
| 400  | Malformed request or failed validation                                         |
| 401  | No valid credential                                                            |
| 403  | Valid credential, insufficient permission                                      |
| 404  | Not found — also returned for a non-public post, so existence is not confirmed |
| 409  | Conflict — duplicate, or an action contradicting current state                 |
| 429  | Rate limited                                                                   |
| 500  | Unhandled failure                                                              |
| 501  | Endpoint exists but the capability is not implemented                          |

### Rate limits

| Scope               | Limit                                      |
| ------------------- | ------------------------------------------ |
| All `/api` routes   | 300 requests / 15 minutes per IP           |
| `/auth/*`           | 10 **failed** attempts / 15 minutes per IP |
| `/health`, `/ready` | Exempt                                     |

`RateLimit-Policy` and `RateLimit-Limit` headers are returned.

### Pagination

List endpoints accept `?page` (default 1) and `?limit` (default 20, capped at 50) and return:

```json
"pagination": { "total": 124, "page": 2, "limit": 20, "pages": 7 }
```

### Naming

Plural, lowercase, kebab-case resources; the HTTP verb carries the action; filtering and
paging in the query string. The `/users` router violates this throughout (`/getUser`,
`/setUser`, `/followUser`) — documented as-is, but do not copy it. A future revision should
express these as `GET /users/me`, `PATCH /users/me`, `PUT /users/:id/follow`.

---

## Operations

| Method | Path      | Auth | Notes                                                 |
| ------ | --------- | ---- | ----------------------------------------------------- |
| GET    | `/health` | —    | Liveness. `{ status, uptime }`                        |
| GET    | `/ready`  | —    | Readiness incl. a database ping. 503 when unavailable |

Both are mounted outside the rate limiter.

---

## Endpoints

Legend — **Auth:** `—` public · `✓` any authenticated user · `self` caller must match the
path id (admins bypass) · `owner` resource ownership (admins bypass) · `admin` admin role.
**Shape:** `envelope` · `bare` · `error-only`.

### Authentication — `/auth`

| Method | Path                 | Auth | Body                                            | Success | Shape                                                     |
| ------ | -------------------- | ---- | ----------------------------------------------- | ------- | --------------------------------------------------------- |
| POST   | `/auth/signup`       | —    | `username, email, password, confirmPassword`    | 201     | envelope                                                  |
| POST   | `/auth/signin`       | —    | `credential, password`                          | 200     | envelope, `data: { accessToken, refreshToken, userdata }` |
| POST   | `/auth/refreshToken` | —    | `refreshToken`                                  | 200     | envelope, `data: { accessToken }`                         |
| POST   | `/auth/signout`      | ✓    | —                                               | 200     | envelope                                                  |
| PUT    | `/auth/password`     | ✓    | `currentPassword, newPassword, confirmPassword` | 200     | envelope                                                  |

`credential` accepts an email address or a username. Validation: username 3–30 characters from
`[A-Za-z0-9_-]`, valid email, password ≥ 10 characters, matching confirmation. Errors: 400
validation, 409 duplicate, 401 bad credentials, 429 too many failed attempts.

Both tokens carry a `tokenVersion` claim which is compared against the stored value on every
authenticated request. `signout` and a successful password change increment it, which is what
revokes outstanding tokens — including the one that made the request. Roles are read from the
account on each request and on refresh, never taken from the token payload.

### Posts — `/posts`

| Method | Path              | Auth  | Notes                                                                                                                                                                                                                                                                                                                 | Shape                            |
| ------ | ----------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| GET    | `/posts`          | —     | **Published posts only**, paginated, newest first. `?category=<name>` filters against the whole collection — an unknown name matches nothing rather than being ignored, which would return the unfiltered feed. Admins may pass `?all=true` for the unfiltered moderation list; the flag is ignored for everyone else | envelope + pagination            |
| GET    | `/posts/:id`      | —     | Author, likes, comments, replies and categories populated. Non-public posts return 404 unless the caller is the author or an admin                                                                                                                                                                                    | envelope                         |
| POST   | `/posts`          | ✓     | Body `title, slug?, content, imageURL?, visibility?, tags?`. `visibility` validated against `draft \| private \| public`, default `draft`. Up to 5 tags, created on demand                                                                                                                                            | envelope + `postId`              |
| GET    | `/posts/trending` | —     | Ranked by recent engagement, capped at 50. Carries `trendedBy`: `engagement` when a ranking was possible, `latest` when too little has happened in the window. Each post gains `trending: { score, readRate, views, reads }`                                                                                          | envelope + `trendedBy`, `window` |
| POST   | `/posts/bulk`     | ✓     | Body `ids` (1–100) and `action` = `delete \| public \| draft \| private`. Scoped to the caller's own posts unless admin; ids belonging to others match nothing                                                                                                                                                        | envelope + `affected`            |
| PUT    | `/posts/:id`      | owner | Every field optional. `visibility` and `tags` only written when sent                                                                                                                                                                                                                                                  | envelope                         |
| DELETE | `/posts/:id`      | owner | Cascades to comments and category back-references; counters adjust against the post's author                                                                                                                                                                                                                          | envelope                         |

### How trending is ranked

    score = opens + (likes x 3) + (comments x 5) + (finished reads x 5)

Only activity from the last 14 days counts, and a story needs at least 3 opens in that window
before it can rank at all — without the floor, one open and one finish would score 6 and beat
a story with fifty opens. When nothing clears the floor the endpoint returns the newest
stories and says so with `trendedBy: 'latest'`, rather than presenting recency as popularity.

Slugs are unique; a collision is resolved by appending `-2`, `-3`, … The route parameter is
`:id` on every post route — it was previously `:_id` on write and `:id` on read.

### Users — `/users`

| Method | Path                    | Auth  | Notes                                                                                                                               | Shape                            |
| ------ | ----------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| GET    | `/users`                | admin | `?page=1&limit=10`                                                                                                                  | envelope + pagination            |
| GET    | `/users/getUser`        | ✓     | The signed-in user with profile                                                                                                     | **`User` key**, not `data`       |
| PUT    | `/users/setUser`        | ✓     | `multipart/form-data`: `username, email, bio`, file `image`                                                                         | envelope                         |
| GET    | `/users/getUserPosts`   | ✓     | The caller's own posts, including drafts. `?page&limit&visibility&sort&q`; `sort` ∈ `newest \| oldest \| title \| updated`          | envelope + pagination + `counts` |
| DELETE | `/users/me`             | ✓     | Body `password`. Deletes the account, its posts, and the comments and likes on them. Refused for the last remaining administrator   | envelope                         |
| PATCH  | `/users/:id/suspension` | admin | Body `suspended`. Reversible; bumps `tokenVersion`, so the account is signed out everywhere at once and sign-in is refused with 403 | envelope                         |
| PATCH  | `/users/:id/role`       | admin | Body `admin`. Promotion applies on the target's next request; revocation also bumps `tokenVersion`                                  | envelope                         |
| DELETE | `/users/:id`            | admin | Body `password` — the _administrator's_ own. Cascades like self-deletion                                                            | envelope                         |

None of the three administrator routes will act on the caller's own account: settings is where
you change your own, so a mis-click cannot suspend or delete the account doing the clicking.
That rule is also what makes a "last administrator" check unnecessary here — the actor is
always an administrator other than the target — so it lives on self-deletion instead, which is
the one path that can leave the console with nobody in it.
| POST | `/users/postUserProfile` | ✓ | Creates a profile | bare object |
| GET | `/users/getUserProfile` | ✓ | The caller's profile | envelope |
| POST | `/users/followUser` | ✓ | Body `toFollowId`. 409 on self-follow | envelope |
| POST | `/users/unfollowUser` | ✓ | Body `toUnfollowId` | envelope |
| GET | `/users/isFollowing/:id` | ✓ | | `{ isFollowing }` |

Avatar upload is broken — [BUG-07](../product/roadmap.md#bug-07).

### Categories — `/categories`

| Method | Path                                         | Auth      | Notes                                                                                                                                                                                                                            | Shape         |
| ------ | -------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| GET    | `/categories`                                | —         | Each carries `postCount`. Categories with no published stories are omitted, so a reader is never offered a filter that leads nowhere; `?withEmpty=true` returns all of them, which is what the editor and the admin console need | envelope      |
| POST   | `/categories`                                | **admin** | Body `{ category }`. 409 when it already exists                                                                                                                                                                                  | envelope, 201 |
| POST   | `/categories/categoriesCollection`           | **owner** | Body `{ categories: [name], postId }`. Reports unknown names in `data.unknown`                                                                                                                                                   | envelope      |
| PUT    | `/categories/updateCategoriesCollection/:id` | **owner** | Body `{ selectedCategories, removedCategories }`                                                                                                                                                                                 | envelope      |

Ownership is checked against the target post; administrators bypass.

### Tags — `/tags`

| Method | Path    | Auth      | Shape    |
| ------ | ------- | --------- | -------- |
| GET    | `/tags` | —         | envelope |
| POST   | `/tags` | **admin** | envelope |

No client code writes tags yet ([GAP-04](../product/roadmap.md#gap-04)).

### Comments — `/comments`

| Method | Path                     | Auth                         | Notes                                                                                                                               | Shape                 |
| ------ | ------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| GET    | `/comments/post/:postId` | optional                     | Comments on one post, paginated. Comments on a non-public post are visible only to its author or an admin, which is reported as 404 | envelope + pagination |
| POST   | `/comments`              | ✓                            | Body `{ postId, message }`. Message capped at 5000 characters                                                                       | envelope, 201         |
| POST   | `/comments/replies`      | ✓                            | Body `{ repliedCommentId, message }`. 404 for an unknown parent; the reply stores the parent's post                                 | envelope, 201         |
| DELETE | `/comments/:id`          | author, post author or admin | Removes the comment and its replies                                                                                                 | envelope              |

The unscoped `GET /comments`, which returned every comment in the database to anonymous
callers, has been removed.

### Search — `/search`

| Method | Path             | Auth | Notes                                                                                                                                                         | Shape    |
| ------ | ---------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| GET    | `/search/:query` | —    | Public posts only, case-insensitive title regex with metacharacters escaped, newest first, `?limit` capped at 50. Returns `title` and a 200-character excerpt | envelope |

The term belongs in `?q=` rather than the path — fix alongside
[GAP-05](../product/roadmap.md#gap-05).

### Likes — `/likes`

| Method | Path                  | Auth | Notes                                                                                           | Shape         |
| ------ | --------------------- | ---- | ----------------------------------------------------------------------------------------------- | ------------- |
| POST   | `/likes`              | ✓    | Body `{ postId }`. 400 when already liked, 404 when the post is missing. Maintains `Post.likes` | envelope, 201 |
| DELETE | `/likes/post/:postId` | ✓    | 404 when no like exists. Maintains `Post.likes`                                                 | envelope      |
| GET    | `/likes/post/:postId` | —    | Usernames only — no email addresses                                                             | bare array    |
| GET    | `/likes/:id`          | —    |                                                                                                 | bare object   |

A unique index on `(post, user)` enforces one like per user per post.

### Page views — `/page-views`

| Method | Path                             | Auth            | Notes                                | Shape              |
| ------ | -------------------------------- | --------------- | ------------------------------------ | ------------------ |
| GET    | `/page-views/post/:postId`       | author or admin | Per-visit detail, capped at 200 rows | envelope           |
| GET    | `/page-views/post/:postId/count` | —               |                                      | envelope + `count` |

Read-only. Recording a view lives at `POST /analytics/view/:postId`, which is the only writer
and the only path that applies per-visitor de-duplication. The unauthenticated `POST
/page-views` and the `GET /page-views/:id` lookup have been removed.

### Analytics — `/analytics`

| Method | Path                      | Auth     | Notes                                                                                                                                              | Shape                                                                            |
| ------ | ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| GET    | `/analytics/post/:id`     | —        | Reads the stale `Analytics` collection; 404 for anything unseeded ([BUG-06](../product/roadmap.md#bug-06))                                         | bare object                                                                      |
| GET    | `/analytics/user/:userId` | **self** | Totals, per-post breakdown, top five. 403 for another user's id                                                                                    | envelope, `data: { totalViews, totalReads, readRate, postsAnalytics, topPosts }` |
| GET    | `/analytics/me`           | ✓        | The same figures for the caller, taking no id                                                                                                      | as above                                                                         |
| GET    | `/analytics/me/reading`   | ✓        | What the caller has opened and finished                                                                                                            | envelope, `data: { unfinished, finished, … }`                                    |
| GET    | `/analytics/admin`        | admin    | Site totals, top posts, top authors, recent views                                                                                                  | bare object                                                                      |
| POST   | `/analytics/view/:postId` | optional | Records one view per visitor per 6 hours. Anonymous visitors are keyed by a salted hash of their address; 404 for a post they could not be reading | envelope + `counted`                                                             |
| POST   | `/analytics/read/:postId` | optional | Same de-duplication as above                                                                                                                       | envelope + `counted`                                                             |

### User activity — `/user-activity`

| Method | Path                              | Auth     | Notes                                                                      | Shape       |
| ------ | --------------------------------- | -------- | -------------------------------------------------------------------------- | ----------- |
| GET    | `/user-activity/all`              | admin    | Recent posts, comments, likes and views, each paginated                    | bare object |
| GET    | `/user-activity/user/:userId`     | **self** | 403 for another user's id                                                  | bare object |
| GET    | `/user-activity/timeline/:userId` | **self** | Merged timeline, capped at 20                                              | bare array  |
| GET    | `/user-activity/moderation-log`   | admin    | Synthesised from `Post.updatedAt` ([GAP-10](../product/roadmap.md#gap-10)) | bare object |

`getAllUserActivity` counts users by a `lastActive` field no schema declares, so
`activeUsers` is always 0.

### Settings — `/settings`

Every path requires authentication (`router.use(authenticateUser)`).

| Method | Path                         | Auth     | Notes                                                                    | Shape    |
| ------ | ---------------------------- | -------- | ------------------------------------------------------------------------ | -------- |
| GET    | `/settings/user`             | ✓        | Creates defaults on first read                                           | envelope |
| PUT    | `/settings/user`             | ✓        | `theme, emailNotifications, privacySettings`. Only sent keys are applied | envelope |
| GET    | `/settings/profile/:userId?` | **self** | Omit the parameter for your own profile                                  | envelope |
| PUT    | `/settings/profile`          | ✓        | `fullName, bio, location, website, socialLinks`                          | envelope |
| PUT    | `/settings/security`         | ✓        | **501** — two-factor authentication is not implemented                   | envelope |
| PUT    | `/settings/privacy`          | ✓        | `privacySettings`                                                        | envelope |
| PUT    | `/settings/appearance`       | ✓        | `theme, fontSize, colorScheme`                                           | envelope |

Settings now persist — see [BUG-05](../product/roadmap.md#bug-05).

---

## Surface summary

| Resource         | Endpoints | Public | Authenticated | Admin |
| ---------------- | --------- | ------ | ------------- | ----- |
| `/auth`          | 3         | 3      | 0             | 0     |
| `/posts`         | 5         | 2      | 3             | 0     |
| `/users`         | 9         | 0      | 8             | 1     |
| `/categories`    | 4         | 1      | 2             | 1     |
| `/tags`          | 2         | 1      | 0             | 1     |
| `/comments`      | 3         | 1      | 2             | 0     |
| `/search`        | 1         | 1      | 0             | 0     |
| `/likes`         | 4         | 2      | 2             | 0     |
| `/page-views`    | 4         | 4      | 0             | 0     |
| `/analytics`     | 5         | 3      | 1             | 1     |
| `/user-activity` | 4         | 0      | 2             | 2     |
| `/settings`      | 7         | 0      | 7             | 0     |
| **Total**        | **51**    | **18** | **27**        | **6** |

Plus two unauthenticated operations endpoints.

Public **write** endpoints went from nine to three during remediation — the three remaining
are the analytics and page-view trackers, which are rate-limited but still undeduplicated
([SEC-04](../security/checklist.md#sec-04)).

---

## Rules for new endpoints

1. **Authenticate by default.** Public requires a written reason.
2. **Identity from the token.** Never read a user id from the body to decide who is acting.
3. **Authorise the resource.** A valid token does not imply ownership. Use
   `authorizeSelfOrAdmin(param)` for `:userId` routes; compare against `post.user` for
   content.
4. **Check existence, then permission.** 404 before 403, so a 403 never confirms a record
   exists. For non-public content, return 404 rather than 403.
5. **Validate input** with an `express-validator` chain in `middlewares/`.
6. **Return the envelope** with a correct status code.
7. **Paginate every list.** Accept `page` and `limit`, cap the limit, return `pagination`.
8. **Project queries.** Never return a password hash; never leak an email into a public
   payload.
9. **Declare new schema fields** — Mongoose silently drops undeclared ones.
10. **Add the index** the new query needs.
11. **Add the client service function**; never call `axios` directly from a component.
12. **Update this document** in the same pull request.

---

## Planned contract changes

Group these into one versioned change rather than letting them drift.

| Change                                                          | Reason                                                    |
| --------------------------------------------------------------- | --------------------------------------------------------- |
| Remove the unprefixed mount; serve `/api` only                  | One surface to secure and document                        |
| Apply the envelope to the remaining bare responses              | Removes per-endpoint unwrapping                           |
| Rename `/users` action paths to REST resources                  | `getUser` → `GET /users/me`                               |
| Move the search term to `?q=`                                   | Path parameters are identifiers                           |
| Merge `/page-views` writes into `/analytics`                    | One writer per collection                                 |
| Paginate `/comments`, `/likes/post/:id`, `/page-views/post/:id` | [SEC-11](../security/checklist.md#sec-11)                 |
| Return `likeCount` and `likedByMe` on post payloads             | Removes the client's dependence on the `Post.likes` array |
| Publish an OpenAPI document generated from the routers          | Keeps this reference honest                               |
