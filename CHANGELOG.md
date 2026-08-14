# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Entry types: `Added` · `Changed` · `Deprecated` · `Removed` · `Fixed` · `Security`.

---

## [Unreleased]

An end-to-end audit produced a register of 18 functional defects, 18 capability gaps and 12
security findings. This release closes **14 defects and 8 security findings**, each verified
by request against a running server.

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
- Complete technical documentation under `docs/` — 19 documents with a single-source-of-truth
  map and stable issue identifiers.
- Repository community files: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, this
  changelog, and GitHub issue and pull request templates.

### Changed

- `GET /posts` returns a paginated envelope rather than a bare array, and no longer populates
  every comment for every post — previously the most expensive query in the application.
- Enabled the registered but inactive `eslint-plugin-react` and `eslint-plugin-react-hooks`
  rule sets. This removed roughly 600 false-positive warnings and surfaced two real defects.
  Client lint went from 604 problems to 26 warnings and 0 errors.
- Email normalisation moved from the controller to the `User` schema (`lowercase`, `trim`).

### Removed

- `backend/models/settings.model.js` and `backend/services/categoryServices.js` — both dead
  code, imported nowhere.
- The `/uploads/(.*)` route from `vercel.json`, which pointed at a directory that never exists
  in a deployment.

### Known limitations

Not fixed in this release, and the reason this is not production-ready:

- **No test suite and no CI pipeline** (GAP-11, GAP-12). Every fix above is verified by hand
  and could regress unnoticed.
- Avatar upload remains broken and unconstrained (BUG-07, SEC-05).
- View tracking is rate-limited but still undeduplicated (SEC-04).
- Sign-out remains client-side only; there is no session revocation (GAP-06).
- Dependency advisories are recorded but not remediated — correct order is tests, then CI,
  then updates behind a green pipeline (SEC-12).

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
