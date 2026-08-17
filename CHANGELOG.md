# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Entry types: `Added` · `Changed` · `Deprecated` · `Removed` · `Fixed` · `Security`.

---

## [Unreleased]

An end-to-end audit produced a register of 18 functional defects, 18 capability gaps and 15
security findings — three of the security findings were discovered during remediation itself.
This release closes **every security finding** and every defect a request can reach, each
verified against a running server, and adds the test suite and pipeline that keep them closed.

### Security

- Public post reads no longer return drafts or private posts. The list endpoint filters on
  visibility; the detail endpoint returns 404 for non-public content unless the caller is its
  author or an administrator. Administrators can opt into the unfiltered list with
  `?all=true` (SEC-01).
- Category and tag write endpoints now require authentication. Taxonomy creation requires the
  `admin` role; attaching categories to a post requires post ownership. Four unauthenticated
  write endpoints closed (SEC-02).
- Analytics, activity and profile routes carrying a `:userId` are scoped to their owner via a
  new `authorizeSelfOrAdmin` middleware. Members can no longer read one another's figures
  (SEC-03).
- Refresh tokens are signed with a separate `JWT_REFRESH_SECRET` and carry an explicit `type`
  claim, so a refresh token can no longer be presented as an access token. This restores the
  15-minute access-token lifetime, which was previously meaningless (SEC-06).
- Added `helmet` security headers, general rate limiting (300 requests / 15 minutes) and
  auth-specific rate limiting (10 failed attempts / 15 minutes), plus 1 MB request body limits
  (SEC-07).
- Removed email addresses from the unauthenticated like and page-view payloads (SEC-09).
- Required configuration is validated at boot. A missing `JWT_SECRET`, an absent `CLIENT_URL`
  in production, a secret under 32 characters, or a refresh secret equal to the access secret
  now stops the server with a named error (SEC-10).
- Sessions are now revocable. Both tokens carry the `tokenVersion` they were minted with, and
  every authenticated request compares it against the account. Sign-out, a password change, a
  suspension and a demotion each increment it, so tokens already issued stop working
  immediately rather than at expiry (SEC-08, GAP-06).
- Roles are read from the account on every request instead of being trusted from the token
  payload. A token minted before a demotion no longer carries administrator authority until it
  expires (SEC-15).
- Rendered Markdown is sanitised with `rehype-sanitize`, closing a stored XSS: post content was
  passed to the renderer with raw HTML enabled, so a `<script>` or an `onerror` attribute in a
  published post executed in every reader's browser (SEC-13).
- `app.set('trust proxy', 1)`. Behind Vercel's proxy every request appeared to come from one
  address, so both rate limiters shared a single bucket — locking out all traffic at once while
  limiting no individual client. They are now keyed to the real caller (SEC-14).
- File uploads moved to `multer.memoryStorage()` with a 2 MB cap and a MIME allowlist, and **no
  filename derived from user input**, closing the path-traversal risk in the previous inline
  disk configuration (SEC-05).
- View and read tracking are deduplicated per visitor per post over a 6-hour window. The visitor
  key is the account id when signed in, otherwise a salted HMAC of address and user agent —
  hashed, not stored, since the analytics only need to know two requests came from the same
  place (SEC-04).
- The unscoped `GET /comments`, which returned every comment in the database to anonymous
  callers, was removed. `GET /comments/post/:postId` replaces it, paginated and following the
  post's own visibility rule (SEC-11).
- Declarative validation across every write path, with a shared `validateObjectId` that matches
  a 24-character hex string rather than `mongoose.isValid` — which also accepts any 12-character
  string, so a short password could be passed as an id.
- The API is served from a single `/api` mount. It had also been mounted at `/`, giving every
  endpoint two addresses and doubling the surface any path-based rule has to cover.
- Every dependency advisory cleared. Both workspaces now report zero, and CI fails on any new
  high or critical advisory (SEC-12).
- `GET /posts` and `GET /search/:query` are paginated and capped, removing the two largest
  unbounded reads (SEC-11).

### Fixed

- Post visibility is persisted on create and update. Previously the API discarded the field,
  so every post stayed a draft and — because the feed shows only public posts — nothing
  authored through the application ever appeared (BUG-01).
- A post without a cover image can be edited. `imageURL` is no longer required on update
  (BUG-02).
- Likes are maintained on `Post.likes`, so like state survives a page reload (BUG-03).
- Comment replies store their parent's post reference, and an unknown parent returns 404
  (BUG-04).
- The settings feature persists. `UserSetting` was an empty schema, so Mongoose strict mode
  discarded every write; it now declares theme, notification, privacy and appearance fields.
  `UserProfile` gained the extended fields the API was already writing. `PUT /settings/security`
  returns 501 rather than reporting success for unimplemented two-factor authentication
  (BUG-05).
- A missing post returns 404 instead of 200 with a null body (BUG-08).
- Duplicate accounts are prevented by unique indexes on `email` and `username`; duplicate-key
  errors are translated to 409 (BUG-09).
- Post-count adjustments target the post's author rather than whoever issued the delete
  (BUG-10).
- Category attachment awaits its writes and reports unknown category names instead of
  responding before the work completes (BUG-11).
- Deep links resolve in production. `vercel.json` now falls back to the SPA shell, so shared
  post links and refreshes on inner routes no longer 404 (BUG-12).
- CORS no longer combines a wildcard origin with credentials (BUG-14).
- The seeder wrote `posts` instead of `post` on every like, storing a null reference and making
  seeded likes unqueryable. Found by the new unique index (BUG-16).
- `PostDetail` rendered an undefined `SubmitBtn` on its not-found branch, crashing the error
  screen. Found by enabling `react/jsx-no-undef` (BUG-17).
- The seeder resolves the root `.env` explicitly; a bare `dotenv.config()` looked in
  `backend/` and found nothing (BUG-18).

### Added

- `GET /health` and `GET /ready` endpoints, mounted outside the rate limiter (GAP-14).
- Thirteen database indexes across eight collections, including unique constraints on user
  identity, category and tag names, and the `(post, user)` like pair (GAP-13).
- `attachUserIfPresent` middleware for public routes whose response varies for a signed-in
  viewer.
- `postService.getAllPosts()` on the client for the admin moderation view.
- Complete technical documentation under `docs/` — 20 documents with a single-source-of-truth
  map and stable issue identifiers.
- Repository community files: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, this
  changelog, and GitHub issue and pull request templates.
- **A backend test suite** — 61 integration tests over auth, posts, comments, the workspace,
  trending and the admin console. Jest and Supertest drive the real Express app against a
  MongoDB that `mongodb-memory-server` starts in-process, so `npm test` needs no database and no
  `.env` (GAP-11).
- **A CI pipeline** — lint, format check, tests, client build and a dependency audit on every
  push and pull request, in three parallel jobs (GAP-12).
- A trending ranking. Score is `views + likes×3 + comments×5 + reads×5` over a 14-day window,
  with a minimum-views floor so a single-view post cannot outrank a widely read one. When
  nothing qualifies the response falls back to newest and says so, rather than presenting
  "latest" as though it were "trending".
- Read tracking is now actually recorded. `trackPostRead` existed in the client service layer
  with nothing calling it, so no `Read` document was ever written; `useReading` now records one
  on real scroll depth and dwell.
- Account deletion — `DELETE /users/me`, password-confirmed, sharing one `purgeAccount` service
  with the admin path so both mean the same thing (GAP-09).
- Admin user management: suspend and restore, promote and demote, delete. Suspension and
  demotion revoke live sessions; a guard prevents removing the last administrator.
- `GET /analytics/me` and `GET /analytics/me/reading`, which derive the author from the token.
  An endpoint that cannot name another user's data cannot leak it.
- `backend/scripts/migrate.js` — non-destructive repair of an existing database, with `--dry`.
- A `SEED_ALLOW_REMOTE=yes` guard on the seeder, which empties every collection it can reach.
- Draft recovery in the editor, plus navigation guarding on unsaved changes.
- A skip link, image alternative text, and `aria-describedby` wiring on form errors.
- `.gitattributes` with `* text=auto eol=lf`. Without it a Windows checkout commits CRLF and the
  format check fails in CI with hundreds of `Delete ␍` errors on a change that touched nothing.

### Changed

- `GET /posts` returns a paginated envelope rather than a bare array, and no longer populates
  every comment for every post — previously the most expensive query in the application.
- Enabled the registered but inactive `eslint-plugin-react` and `eslint-plugin-react-hooks`
  rule sets. This removed roughly 600 false-positive warnings and surfaced two real defects.
  Client lint went from 604 problems to 26 warnings and 0 errors.
- Email normalisation moved from the controller to the `User` schema (`lowercase`, `trim`).
- Password hashing cost raised from 10 to 12.
- **The workspace was split into three pages by the question each answers**: `/dashboard` (how
  the work is doing), `/stories` (what has been written and how to manage it), `/comments` (what
  readers said back). It had been one page mixing statistics with post management, which meant
  neither was good at its job. The old paths redirect rather than 404.
- Story management filters, sorts, searches and pages **on the server**, with the parameters in
  the query key, so a reload or a shared link reproduces the same view and the tab counts are
  computed over the whole collection rather than the current page.
- Both themes are now derived by `createTheme(ramps, mode)` from Radix colour ramps instead of
  being two hand-maintained palettes.
- **Foreground colour on a solid fill is measured, not assumed.** The theme implements WCAG 2.1
  contrast and picks whichever of white or near-black wins. White on `sky-9` measures 1.48:1,
  which is why primary button labels were effectively invisible; it is now 12.04:1.
- Duplicated base components — card, badge, table, dropdown, empty state — were folded back into
  `ui/`, which grew from 13 to 21 primitives. The interactive ones wrap Radix, so keyboard and
  screen-reader behaviour is the real thing rather than five approximations of it.
- Controllers migrated to `asyncHandler` plus a typed `AppError`, so the status code is chosen
  where the failure is understood. Eight of thirteen modules are converted.

### Removed

- `backend/models/settings.model.js` and `backend/services/categoryServices.js` — both dead
  code, imported nowhere.
- The `/uploads/(.*)` route from `vercel.json`, which pointed at a directory that never exists
  in a deployment.
- The admin Settings page — a screen of switches wired to nothing. A control that does not
  control anything is worse than an absent one.
- The landing page's category filter, "browse by topics" strip and "featured creators" panel.
  The filter searched only the posts already in memory while looking like a search of the
  platform, and the two widgets restated what the feed below them already showed. Category
  filtering now lives on `/search`, where the server applies it to the whole collection.
- The duplicate filter panel on the explore page, which did the same job as the one above it.

### Known limitations

Not fixed in this release:

- **The client has no tests** (GAP-11). CI lints and builds it, which proves it compiles and
  nothing more — a component can throw on render and the pipeline stays green.
- **CI reports but does not gate.** Branch protection is not enabled, so a red run still
  deploys.
- Avatar images are stored in MongoDB as document bytes. It works and needs no external
  service, but image bytes inflate every read that populates a profile; object storage is the
  right destination at volume (GAP-17).
- Rate-limit counters live in each instance's memory, so limits are approximate across
  serverless instances. A shared store would make them exact.
- No Content-Security-Policy, no email verification, no password reset (GAP-01, GAP-02).
- Search is still an unindexed regex over titles (GAP-05).
- `GET /likes/post/:postId` is the last unbounded list endpoint (GAP-07).
- The seeded demo credentials in the README are published deliberately for local use and must
  be changed before any deployment holding real data.

Full registers: [docs/product/roadmap.md](./docs/product/roadmap.md) and
[docs/security/checklist.md](./docs/security/checklist.md).

---

## [1.0.0]

The state of the project at the time of the documentation audit. Entries are reconstructed
from Git history; dates are omitted where they were not recorded.

### Added

- **Authoring** — Markdown editor with live preview, auto-generated slugs, cover image URLs,
  category assignment, draft/private/public visibility enum.
- **Reading** — landing page with hero, featured-category carousel, platform feature grid,
  category-filtered post feed and trending sidebar; full post view with rendered Markdown.
- **Social** — comments with one level of replies, likes, follow and unfollow, public author
  profiles.
- **Analytics** — per-author dashboard covering views, reads, read rate and top posts;
  site-wide admin analytics with top posts, top authors and recent activity.
- **Administration** — admin console with dashboard, post management, category management and
  a paginated user listing, gated by an `admin` role.
- **Accounts** — registration with validation, sign-in by email or username, JWT access and
  refresh tokens, silent token refresh via an Axios interceptor, profile editing.
- **Design system** — light and dark themes, shared design tokens, typography scale, and 13
  reusable UI primitives (`Button`, `Input`, `TextArea`, `Card`, `Badge`, `Container`, `Modal`,
  `Select`, `Avatar`, `Spinner`, `Tabs`, `Alert`, `Loading`).
- **Platform** — route-level code splitting with `React.lazy`, manual vendor chunking, error
  boundary, toast notifications, responsive layout.
- **Seeder** — sample dataset of 10 categories, 15 users, 22 posts, comments, likes and views.

### Changed

- Consolidated environment configuration into a single root `.env` read by both workspaces,
  replacing per-workspace files.
- Migrated ESLint to flat configuration in both workspaces.
- Reorganised the client component tree, replacing an ambiguous `common/` directory with
  `guards/`, `posts/`, `layout/` and `ui/`.
- Refactored pages to consume the shared UI primitives instead of bespoke styled elements.
- Backed the `Modal` primitive with Radix Dialog while keeping token-based styling.
- Applied `NODE_ENV` to the error handler's response detail and the morgan log format.

### Removed

- Unused dependencies `express-jwt` and `react-quill`; replaced `cheerio` with native regex.
- Unused controllers, dead stubs and unreferenced React components.
- AI IDE configuration artifacts and an obsolete Jest configuration.

### Fixed

- Enforced post ownership on update and delete, with an administrator bypass.
- Added authentication to comment endpoints and stopped accepting the author identity from the
  request body.
- Corrected response status codes, header handling and follow-count logic on user endpoints.

### Security

- Sanitised regex input in the search controller to prevent ReDoS.
- Untracked `.env` so it is ignored by Git.

---

## Maintaining this file

- Add entries under `[Unreleased]` as changes land, not at release time.
- One line per user-visible change; implementation detail belongs in the commit.
- Reference the tracking ID where one exists — `Fixed: post visibility is now persisted
(BUG-01)`.
- On release, rename `[Unreleased]` to the version with its date and open a fresh
  `[Unreleased]` section.
- `Security` entries are mandatory for any change that closes a `SEC-xx` finding.

[Unreleased]: https://github.com/Purvesh-PJ/blogging_platform/compare/main...HEAD
[1.0.0]: https://github.com/Purvesh-PJ/blogging_platform/releases/tag/v1.0.0
