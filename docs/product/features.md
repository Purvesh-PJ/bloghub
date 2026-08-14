# Features

> **Scope:** the capability catalogue — what BlogHub does, for whom, and the implementation
> status of each capability.
> **Excludes:** journeys ([user-flows.md](user-flows.md)), planned work and defects
> ([roadmap.md](roadmap.md)), endpoint signatures
> ([reference/api.md](../reference/api.md)).

---

## Product summary

BlogHub is a full-stack blogging platform where writers publish Markdown articles, readers
discover and engage with them, and administrators moderate the catalogue. It ships three
experiences from one codebase: a public reading surface, an authenticated authoring and
analytics surface, and an admin console.

---

## Actors

| Actor | Authentication | Capabilities |
|-------|----------------|--------------|
| **Visitor** | None | Browse published posts, read a post, search, view public profiles |
| **Member** | JWT access token | Everything a visitor can, plus authoring, engagement, personal analytics, settings |
| **Administrator** | JWT with `admin` in `roles` | Everything a member can, plus the admin console, site-wide analytics, user listing, moderation of any post |

Roles live on `User.roles` (default `['user']`) and are carried in the JWT — see
[security/auth.md](../security/auth.md).

---

## Status legend

| Marker | Meaning |
|--------|---------|
| ✅ | Implemented and working end to end |
| ⚠️ | Implemented but incomplete — see the linked ID |
| ❌ | Not implemented |

---

## 1. Identity and accounts

| Capability | Status | Notes |
|------------|--------|-------|
| Register with username, email, password | ✅ | Validated by `express-validator`; confirmation enforced |
| Duplicate email/username rejection | ✅ | Unique indexes at the database; duplicate-key errors return 409 |
| Sign in with email **or** username | ✅ | Single `credential` field accepts either |
| Password hashing | ✅ | bcrypt, cost factor 10 |
| Access + refresh token issuance | ✅ | 15 minute / 7 day defaults, separate secrets, typed claims |
| Silent access-token refresh | ✅ | Axios interceptor retries the failed request once |
| Brute-force protection | ✅ | 10 failed attempts per 15 minutes per IP |
| Sign out | ⚠️ | Client-side only; no server-side revocation ([GAP-06](roadmap.md#gap-06)) |
| Password reset | ❌ | [GAP-01](roadmap.md#gap-01) |
| Email verification | ❌ | [GAP-02](roadmap.md#gap-02) |
| Two-factor authentication | ❌ | The endpoint answers 501 rather than pretending to work |

## 2. Authoring

| Capability | Status | Notes |
|------------|--------|-------|
| Markdown editor with live preview | ✅ | `@uiw/react-md-editor` |
| Auto-generated URL slug | ✅ | Client-side, editable |
| Cover image by URL | ✅ | Optional, on both create and edit |
| Assign categories | ✅ | Selected at write time, reconciled on edit, ownership enforced |
| Draft / private / public visibility | ✅ | Persisted and enforced server-side |
| Edit an existing post | ✅ | Works with or without a cover image |
| Delete a post | ✅ | Cascades to comments and category back-references |
| Ownership enforcement | ✅ | Author or `admin` only, on edit and delete |
| Assign tags | ⚠️ | Model, routes and service exist; the editor never sets them ([GAP-04](roadmap.md#gap-04)) |
| Autosave / revision history | ❌ | [GAP-03](roadmap.md#gap-03) |

## 3. Reading and discovery

| Capability | Status | Notes |
|------------|--------|-------|
| Landing page with hero, categories and feed | ✅ | |
| Drafts and private posts hidden from the public | ✅ | Enforced by the API, not the browser |
| Author can preview their own unpublished post | ✅ | Optional-auth on the detail endpoint |
| Filter the feed by category | ✅ | Client-side over the loaded page |
| Post detail with rendered Markdown | ✅ | |
| Paginated feed | ✅ | `?page` and `?limit`, default 20, capped at 50 |
| Search posts by title | ⚠️ | Public-only and capped at 50, but still an unindexed regex over titles ([GAP-05](roadmap.md#gap-05)) |
| Infinite scroll | ❌ | The API supports paging; the UI does not consume it yet |

## 4. Social engagement

| Capability | Status | Notes |
|------------|--------|-------|
| Like / unlike a post | ✅ | Persisted in both the collection and `Post.likes`; survives reload |
| One like per user per post | ✅ | Unique index, not a racy application check |
| Comment on a post | ✅ | Author taken from the token |
| Reply to a comment | ✅ | Reply carries its parent's post reference |
| Follow / unfollow an author | ✅ | Maintains both sides plus counters |
| Public author profile | ✅ | `/user/:userId` |
| Comment likes / dislikes | ❌ | Schema fields exist; no endpoint or UI |
| Edit or delete a comment | ❌ | No endpoint |
| Notifications | ❌ | [GAP-08](roadmap.md#gap-08) |

## 5. Analytics

| Capability | Status | Notes |
|------------|--------|-------|
| Author dashboard — views, reads, read rate, top posts | ✅ | Computed live from the `views` and `reads` collections |
| Analytics scoped to their owner | ✅ | A member cannot read another member's figures |
| Site-wide admin analytics | ✅ | Totals, top posts, top authors, recent activity |
| Page-view tracking | ⚠️ | Rate-limited but still undeduplicated ([SEC-04](../security/checklist.md#sec-04)) |
| Read tracking | ⚠️ | Endpoint exists; the client never calls it |
| Per-post analytics document | ⚠️ | Only the seeder maintains it ([BUG-06](roadmap.md#bug-06)) |

## 6. Profile and settings

| Capability | Status | Notes |
|------------|--------|-------|
| View own profile with posts and counters | ✅ | |
| Edit username, email and bio | ✅ | |
| Notification, privacy and appearance preferences | ✅ | Schema-backed; partial updates do not blank sibling fields |
| Extended profile fields — full name, location, website, social links | ✅ | Declared on `UserProfile` |
| Light / dark theme with system preference | ✅ | Persisted in local storage |
| Upload an avatar | ❌ | Disk storage is unusable on serverless ([BUG-07](roadmap.md#bug-07)) |
| Delete account | ❌ | [GAP-09](roadmap.md#gap-09) |

## 7. Administration

| Capability | Status | Notes |
|------------|--------|-------|
| Admin dashboard with site totals | ✅ | |
| Post management including drafts | ✅ | `?all=true`, honoured only for administrators |
| Delete any post | ✅ | Counters adjust against the post's author |
| Category management | ✅ | Creation is admin-only |
| Paginated user listing | ✅ | |
| Admin settings page | ⚠️ | Placeholder component, no behaviour |
| Role assignment from the UI | ❌ | Roles change only in the database or via the seeder |
| Audit log | ⚠️ | Synthesised from `Post.updatedAt` ([GAP-10](roadmap.md#gap-10)) |

## 8. Platform

| Capability | Status | Notes |
|------------|--------|-------|
| Responsive layout | ✅ | 375px through 1440px |
| Light and dark themes | ✅ | Two complete token sets |
| Route-based code splitting | ✅ | Every page lazily loaded |
| Vendor chunk splitting | ✅ | `vendor`, `radix`, `editor` |
| Client-side error boundary | ✅ | |
| Deep links and refresh on inner routes | ✅ | SPA fallback in `vercel.json` |
| Health and readiness endpoints | ✅ | `GET /health`, `GET /ready` |
| Security headers | ✅ | `helmet` |
| Rate limiting | ✅ | General and auth-specific |
| Server-side rendering / SEO metadata | ❌ | SPA only, one static `<title>` ([GAP-16](roadmap.md#gap-16)) |
| Internationalisation | ❌ | English strings inlined |

---

## Non-functional position

| Attribute | Current state |
|-----------|---------------|
| **Performance** | Route-level code splitting, a 5-minute query cache, paginated feed, and 13 indexes across 8 collections. `GET /posts` no longer populates every comment — previously the most expensive query in the application |
| **Scalability** | Stateless API. Remaining bottlenecks: the unindexed search regex and the still-unbounded comment and like list endpoints |
| **Availability** | Health and readiness endpoints exist; nothing polls them yet ([runbook](../operations/runbook.md)) |
| **Security** | Eight of twelve audit findings closed. Remaining: upload constraints, view deduplication, session revocation, dependency scanning ([checklist](../security/checklist.md)) |
| **Accessibility** | Semantic markup and a global focus ring; no audit run ([GAP-18](roadmap.md#gap-18)) |
| **Testability** | **No test runner installed.** The single largest risk to the codebase ([GAP-11](roadmap.md#gap-11)) |
