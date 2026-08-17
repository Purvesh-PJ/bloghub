# Roadmap and Backlog

> **Scope:** the single backlog — known defects (`BUG-xx`), missing capabilities (`GAP-xx`)
> and the phased plan.
> **Excludes:** security findings, owned by
> [security/checklist.md](../security/checklist.md) as `SEC-xx` and referenced here by ID.

IDs are stable. Reference them from commits and pull requests rather than restating the
problem.

---

## Defect status

| ID | Defect | Priority | Status |
|----|--------|----------|--------|
| [BUG-01](#bug-01) | Post visibility never persisted | P0 | ✅ **Fixed** |
| [BUG-02](#bug-02) | Post without a cover image could not be edited | P0 | ✅ **Fixed** |
| [BUG-03](#bug-03) | `Post.likes` never maintained at runtime | P0 | ✅ **Fixed** |
| [BUG-04](#bug-04) | Comment replies lost their post reference | P1 | ✅ **Fixed** |
| [BUG-05](#bug-05) | Settings feature persisted nothing | P0 | ✅ **Fixed** |
| [BUG-06](#bug-06) | `Analytics` documents never updated | P2 | ⚠️ Partially fixed |
| [BUG-07](#bug-07) | Avatar upload broken | P1 | ❌ Open |
| [BUG-08](#bug-08) | Missing post returned 200 instead of 404 | P1 | ✅ **Fixed** |
| [BUG-09](#bug-09) | Duplicate accounts possible | P1 | ✅ **Fixed** |
| [BUG-10](#bug-10) | Post-count adjustment targeted the wrong profile | P2 | ✅ **Fixed** |
| [BUG-11](#bug-11) | Category attachment did not await its writes | P2 | ✅ **Fixed** |
| [BUG-12](#bug-12) | Deep links 404 in production | P1 | ✅ **Fixed** |
| [BUG-13](#bug-13) | Two cache keys held the same data | P3 | ✅ **Resolved** |
| [BUG-14](#bug-14) | CORS wildcard origin with credentials | P2 | ✅ **Fixed** |
| [BUG-15](#bug-15) | `setState` inside an effect in four pages | P2 | ❌ Open |
| [BUG-16](#bug-16) | Seeder wrote `posts` instead of `post` on every like | P0 | ✅ **Fixed** |
| [BUG-17](#bug-17) | `PostDetail` referenced an undefined component | P1 | ✅ **Fixed** |
| [BUG-18](#bug-18) | Seeder could not find the root `.env` | P1 | ✅ **Fixed** |

14 of 18 closed. BUG-16 to BUG-18 were found during remediation, two of them by tooling that
was fixed along the way.

---

## Fixed

### BUG-01
**Post visibility never persisted.** ✅ `backend/services/postService.js`

`createPost` built the document from `user, imageURL, title, slug, content` and `updatePost`
wrote only `imageURL, title, slug, content`, so the editor's `visibility` was discarded and
every post stayed a draft. Because `Home.jsx` filters the feed to `visibility === 'public'`,
**no post authored through the running application ever reached the home page** — only
seeded content appeared. The most damaging defect in the repository.

*Fix:* both service functions accept `visibility`, normalised against the enum with a
`draft` fallback. On update the field is only written when the caller actually sent one, so
a partial update cannot silently unpublish a live post.

*Verified:* published a post through the API, read back `visibility: "public"`, confirmed it
appears in `GET /posts`.

### BUG-02
**A post without a cover image could not be edited.** ✅ `backend/services/postService.js`

`updatePost` required `imageURL` to be non-empty, but the editor sends `''` when no cover
image is set, so every update on such a post failed with 400 — inconsistent with create,
where the field is optional.

*Fix:* `imageURL` dropped from the required set and normalised to `''`.
*Verified:* `PUT /posts/:id` with `imageURL: ''` → 200.

### BUG-03
**`Post.likes` never maintained at runtime.** ✅ `backend/controllers/like.controllers.js`

`createLike` wrote to the `likes` collection but never pushed onto `Post.likes`; `deleteLike`
never pulled. Only the seeder populated the array, so `PostDetail`'s liked state reset on
every reload.

*Fix:* both handlers keep the array in step with `$addToSet` / `$pull`. `getSinglePost`
populates `likes` with their user reference, and the client compares by string so a populated
or bare id both work.
*Verified:* liked a post, `Post.likes.length` → 1.

### BUG-04
**Comment replies lost their post reference.** ✅ `backend/controllers/comment.controllers.js`

Replies were created with `{ user, message }` only, so every post-scoped query missed them,
and an unvalidated `repliedCommentId` could attach a reply to nothing.

*Fix:* the parent is loaded, 404 when absent, and its `post` is copied onto the reply. The
handler now returns 201 with the created comment.
*Verified:* reply carries the parent's post id; unknown parent → 404.

### BUG-05
**The settings feature persisted nothing.** ✅ `backend/models/user-settings.model.js`

`UserSetting` was `new mongoose.Schema({})` — an empty schema. Strict mode silently dropped
every field the controller wrote, including the `user` link, so the endpoints returned 200
and stored nothing. `PUT /settings/profile` had the same problem against `UserProfile`.

*Fix:*
- `UserSetting` declares `user`, `theme`, `emailNotifications`, `privacySettings` and
  `appearance`, with defaults and a unique index.
- `UserProfile` gained `fullName`, `location`, `website` and `socialLinks`.
- Updates apply only the keys the caller sent, so a partial update cannot blank a sibling
  field; appearance uses dot-notation for the same reason.
- `PUT /settings/security` now returns **501 Not Implemented**. Two-factor authentication
  does not exist, and answering 200 for work that never happened was the underlying problem.
- Dead `backend/models/settings.model.js` deleted.

*Verified:* wrote `theme: dark`, read it back.

### BUG-08
**A missing post returned 200 instead of 404.** ✅

`Post.findById` resolved to `null` and the controller wrapped it in
`{ success: true, data: null }`, so the client dereferenced a null post.

*Fix:* 404 when the lookup yields nothing.
*Verified:* `GET /posts/507f1f77bcf86cd799439011` → 404.

### BUG-09
**Duplicate accounts possible.** ✅ `backend/models/user.model.js`

`username` and `email` were required but not unique, and signup relied on a `findOne` two
concurrent requests could both pass.

*Fix:* unique indexes on both, plus `lowercase` and `trim` on the schema so normalisation no
longer depends on the controller. Duplicate-key errors are translated to the existing 409
rather than surfacing as a 500.
*Verified:* duplicate email signup → 409.

### BUG-10
**Post-count adjustment targeted the wrong profile.** ✅

`deletePost` decremented `UserProfile.postCount` for `req.user`, so an administrator
moderating someone else's post lost their own count while the author's stayed high.

*Fix:* counters and the `User.posts` pull both target `post.user`.

### BUG-11
**Category attachment did not await its writes.** ✅

`categories.map(async …)` discarded its promises, so the handler responded 200 before any
write completed and threw an unhandled `TypeError` on an unknown category name.

*Fix:* rewritten around `Promise.all` with bulk `updateMany` / `updateOne`. Unknown names are
reported back in the response rather than crashing. Ownership is enforced
([SEC-02](../security/checklist.md#sec-02)).

### BUG-12
**Deep links 404 in production.** ✅ `vercel.json`

The catch-all rewrote `/(.*)` to `client/$1`, so `/post/abc123` mapped to a file that does
not exist and the SPA shell was never served. Every shared link and every refresh on an
inner route failed.

*Fix:* unmatched paths rewrite to `/index.html`. The dead `/uploads/(.*)` route — pointing at
a directory that never exists in a deployment — was removed.

### BUG-13
**Two cache keys held the same data.** ✅ Resolved

`['posts']` and `['allPosts']` were both filled by `postService.getPosts()`.

*Resolution:* they now hold genuinely different data. `['posts']` is the public feed;
`['allPosts']` is the moderation view via `getAllPosts()`, which passes `?all=true` and
includes drafts. Distinct keys for distinct data is correct — deduplicating them would have
been wrong.

### BUG-14
**CORS wildcard origin with credentials.** ✅

`origin: CLIENT_URL || '*'` with `credentials: true` is rejected by browsers when the
fallback applies.

*Fix:* credentials are only enabled when `CLIENT_URL` is set; otherwise the origin is open
without credentials. Production refuses to boot without `CLIENT_URL`
([SEC-10](../security/checklist.md#sec-10)).

### BUG-16
**Seeder wrote `posts` instead of `post` on every like.** ✅ `backend/seed.js`

`new Like({ user, posts: post._id })` — the plural is not a schema field, so every seeded
like stored `post: null` and was unqueryable by post. This is why like counts appeared broken
even with seed data, and it had been silently wrong for the life of the seeder.

Found by the unique index added in [BUG-09](#bug-09), which rejected the second
`{ post: null, user: … }` document. A good illustration of a constraint earning its keep
immediately.

### BUG-17
**`PostDetail` referenced an undefined component.** ✅ `client/src/pages/PostDetail.jsx`

The post-not-found branch rendered `<SubmitBtn>`, which is defined nowhere in the file — so
the error page itself crashed. Latent until [BUG-08](#bug-08) made that branch reachable.

Found by enabling `react/jsx-no-undef`, one of the rules registered but never turned on. See
[code-quality.md](../guides/code-quality.md).

### BUG-18
**Seeder could not find the root `.env`.** ✅ `backend/seed.js`

`require('dotenv').config()` with no path resolves against `backend/`, where no `.env`
exists, so `npm run seed` exited on a missing database URI.

*Fix:* resolves `../.env` explicitly, matching `index.js`.

---

## Open

### BUG-06
**`Analytics` documents never updated.** P2 · ⚠️ Partially fixed

The schema referenced `ref: 'Blog'` — a model that does not exist. **Fixed:** the reference
now names `Post`, and `blogPost` is indexed.

**Still open:** nothing creates or increments an `Analytics` document except the seeder, so
`GET /analytics/post/:id` returns 404 for any post created through the API.

*Recommended fix:* remove the collection and compute per-post analytics on demand, the way
`getUserAnalytics` already does. That eliminates a second source of truth rather than adding
machinery to keep it in step.

### BUG-07
**Avatar upload broken.** P1 · ❌ Open

Three faults: multer writes to a relative path that is never created and is read-only on
serverless; `setUser` stores `file.path` (a string) into `image.data` (typed `Buffer`); and
`getUser` base64-encodes that string back, producing a corrupt data URL.

*Fix:* move to object storage (S3, Cloudinary, Vercel Blob), store the returned URL as a
string, and delete the disk-storage configuration. Bundle with
[SEC-05](../security/checklist.md#sec-05).

### BUG-15
**`setState` inside an effect.** P2 · ❌ Open

`WritePost`, `Settings` and `UserProfile` hydrate local form state from a query inside
`useEffect`. The pattern works but causes a cascading render, and
`react-hooks/set-state-in-effect` flags it. (The fourth page originally listed here, `Profile`,
no longer exists — it was folded into the workspace split.)

Set to `warn` rather than `error` deliberately: refactoring form hydration without any client
test is how regressions get shipped. Sequence it after the client half of
[GAP-11](#gap-11).

---

## Capability gaps

| ID | Gap | Priority | Status |
|----|-----|----------|--------|
| <a id="gap-01"></a>**GAP-01** | Password reset | P1 | ❌ Open |
| <a id="gap-02"></a>**GAP-02** | Email verification | P2 | ❌ Open |
| <a id="gap-03"></a>**GAP-03** | Draft autosave and revision history | P2 | ❌ Open |
| <a id="gap-04"></a>**GAP-04** | Tags wired into the editor | P2 | ❌ Open — model, routes and service exist |
| <a id="gap-05"></a>**GAP-05** | Real search | P1 | ⚠️ Partial — server-side category filtering added; still an unindexed regex over titles |
| <a id="gap-06"></a>**GAP-06** | Server-side session revocation | P1 | ✅ **Done** — `tokenVersion` on the account, compared on every request |
| <a id="gap-07"></a>**GAP-07** | Pagination on list endpoints | P0 | ⚠️ Partial — `/posts`, `/search`, `/comments`, `/users` and the author's own list done; `/page-views/post/:id` is capped at 200 rather than paged; `GET /likes/post/:postId` is still unbounded |
| <a id="gap-08"></a>**GAP-08** | Notifications | P3 | ❌ Open |
| <a id="gap-09"></a>**GAP-09** | Account deletion | P2 | ✅ **Done** — `DELETE /users/me`, sharing `purgeAccount` with the admin path |
| <a id="gap-10"></a>**GAP-10** | Real audit log | P2 | ❌ Open — the moderation log is synthesised from `Post.updatedAt` |
| <a id="gap-11"></a>**GAP-11** | Automated tests | P0 | ⚠️ Partial — 61 backend integration tests; **the client has none, and that is now the highest-value item** |
| <a id="gap-12"></a>**GAP-12** | CI pipeline | P0 | ✅ **Done** — lint, format check, tests, build and a dependency audit on every push and pull request |
| <a id="gap-13"></a>**GAP-13** | Database indexes | P0 | ✅ **Done** — 13 indexes across 8 collections |
| <a id="gap-14"></a>**GAP-14** | Health and readiness endpoints | P1 | ✅ **Done** — `GET /health`, `GET /ready` |
| <a id="gap-15"></a>**GAP-15** | Structured logging | P2 | ❌ Open — morgan plus `console.*` |
| <a id="gap-16"></a>**GAP-16** | SEO and social metadata | P2 | ❌ Open |
| <a id="gap-17"></a>**GAP-17** | Image upload pipeline | P2 | ❌ Open — see [BUG-07](#bug-07) |
| <a id="gap-18"></a>**GAP-18** | Accessibility audit | P2 | ❌ Open |

---

## Plan

### ✅ Phase 1 — Correctness and safety *(complete)*

Twelve defects and eight security findings closed, each verified against a running server.
The application now does what it claims: posts publish, drafts stay private, edits succeed,
likes persist, settings save, and deep links resolve.

### ✅ Phase 2 — Foundations *(largely complete)*

Every defect in Phase 1 was one a modest test suite would have caught before merge, so this
phase built the thing that stops them coming back.

- [x] [GAP-11](#gap-11) a backend suite — 61 integration tests over auth, authorisation,
      posts, comments, the workspace, trending and the admin console, plus a regression test
      for each closed `BUG-xx` and `SEC-xx` a request can reach
- [x] [GAP-12](#gap-12) CI running lint, format check, tests, build and a dependency audit on
      every push and pull request
- [x] [SEC-12](../security/checklist.md#sec-12) dependency audit in CI, failing on high and
      critical advisories
- [x] [GAP-06](#gap-06) session revocation via `tokenVersion`
- [x] [GAP-09](#gap-09) account deletion
- [ ] **Client tests** — the remaining half of [GAP-11](#gap-11). CI proves the client
      compiles, not that it behaves
- [ ] [GAP-07](#gap-07) page `GET /likes/post/:postId`, the last unbounded list
- [ ] [BUG-15](#bug-15) refactor form hydration, now that backend tests make the API side safe

### Phase 3 — Data model consolidation

- [ ] [BUG-06](#bug-06) retire the `Analytics` collection
- [ ] Reconcile `User.posts` against `Post.user` and keep one
- [ ] Derive like and view counts from their collections rather than the denormalised arrays
- [ ] Add a counter reconciliation script

### Phase 4 — Product depth

- [ ] [GAP-01](#gap-01) password reset
- [ ] [GAP-05](#gap-05) text-index search with paging
- [ ] [GAP-17](#gap-17) image upload pipeline, closing [BUG-07](#bug-07) and
      [SEC-05](../security/checklist.md#sec-05)
- [ ] [GAP-04](#gap-04) tags in the editor
- [ ] [GAP-08](#gap-08) notifications
- [ ] [GAP-16](#gap-16) SEO metadata

### Phase 5 — Scale and polish

- [ ] [GAP-15](#gap-15) structured logging
- [ ] [GAP-10](#gap-10) real audit log
- [ ] [GAP-18](#gap-18) accessibility audit
- [ ] Response caching and ETags on public reads
- [ ] Split the oversized page components — `Home.jsx` is still the largest
- [ ] Decide on TypeScript — see [code-quality.md](../guides/code-quality.md)

---

## Working agreement

- One ID per pull request where possible; reference it in the title —
  `fix(posts): persist visibility on create and update (BUG-01)`.
- Closing an item means updating its status in [features.md](features.md) and here, in the
  same pull request.
- New findings take the next free ID in the relevant series and are added to the owning
  register — never to an ad-hoc list elsewhere.
