# 🌐 REST API Specification & Endpoint Contracts

> **Scope:** The complete HTTP interface catalog — authentication requirements, URL paths, payload contracts, status codes, rate limits, and pagination contracts.

---

## 📌 Document Maintenance Guide (Where to Update)

Use this reference table when making changes to API routes:

| If you are doing this in code: | Update this section in this doc: |
| :--- | :--- |
| Changing base URLs, rate limits, or global envelope formats | **Section 1 (Conventions & Protocols)** |
| Adding or modifying `/api/auth/*` endpoints | **Section 2 (Authentication Endpoints)** |
| Adding or modifying `/api/posts/*` endpoints | **Section 3 (Posts & Editorial Endpoints)** |
| Adding or modifying `/api/users/*` endpoints | **Section 4 (Users & Profiles Endpoints)** |
| Modifying likes, views, reads, or comments | **Section 5 (Engagement & Social Endpoints)** |
| Updating search, tags, or system settings | **Section 6 (Search, Taxonomy & Settings)** |
| Modifying author analytics or `/api/admin/*` metrics | **Section 7 (Analytics & Administration)** |

---

## 📑 Table of Contents
1. [Conventions & Protocols](#1-conventions--protocols)
2. [Authentication Endpoints (`/api/auth`)](#2-authentication-endpoints-apiauth)
3. [Posts & Editorial Endpoints (`/api/posts`)](#3-posts--editorial-endpoints-apiposts)
4. [Users & Profiles Endpoints (`/api/users`)](#4-users--profiles-endpoints-apiusers)
5. [Engagement & Social Endpoints (`/likes`, `/comments`, `/page-views`)](#5-engagement--social-endpoints)
6. [Search, Taxonomy & Settings (`/search`, `/tags`, `/settings`)](#6-search-taxonomy--settings)
7. [Analytics & Administration (`/analytics`, `/admin`)](#7-analytics--administration)
8. [Health & Operational Probes](#8-health--operational-probes)

---

## 1. Conventions & Protocols

- **Base URL:** `/api` (e.g. `http://localhost:5000/api` locally, `/api` on production).
- **Authentication Header:**
  ```http
  Authorization: Bearer <accessToken>
  ```
- **Standard Success Envelope:**
  ```json
  {
    "success": true,
    "message": "Operation completed successfully",
    "data": { ... },
    "pagination": { "page": 1, "limit": 20, "total": 120, "pages": 6 }
  }
  ```
- **Standard Error Envelope:**
  ```json
  {
    "success": false,
    "message": "Human-readable failure description",
    "error": "ERROR_CODE",
    "errors": []
  }
  ```
- **Rate Limit Headers:** All routes return `RateLimit-Limit` and `RateLimit-Remaining`.
  - General routes: 300 requests / 15 minutes.
  - `/api/auth`: 10 failed requests / 15 minutes per IP (`skipSuccessfulRequests: true`).

---

## 2. Authentication Endpoints (`/api/auth`)

| Method | Path | Auth | Payload Body | Success | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Public | `username, email, password, confirmPassword` | `201` | Registers new user, emits default `'user'` role. |
| `POST` | `/auth/signin` | Public | `credential, password` | `200` | Accepts email or username. Returns tokens + user data. |
| `POST` | `/auth/refreshToken` | Public | `refreshToken` | `200` | Issues new short-lived access token. |
| `POST` | `/auth/signout` | User | None | `200` | Increments `tokenVersion` on user record, revoking all active sessions. |
| `PUT` | `/auth/password` | User | `currentPassword, newPassword, confirmPassword` | `200` | Validates current password, updates hash, and increments `tokenVersion`. |

---

## 3. Posts & Editorial Endpoints (`/api/posts`)

| Method | Path | Auth | Query / Body Parameters | Success | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/posts` | Public | Query: `page, limit, tag, author, q` | `200` | Returns published articles with pagination. Admins may pass `?all=true`. |
| `GET` | `/posts/:id` | Public | Param: `:id` (ObjectId or slug) | `200` | Populates author, tags, and comments. Returns 404 for draft/private posts if not author. |
| `POST` | `/posts` | Author | Body: `title, content, slug?, imageURL?, visibility?, tags?` | `201` | Creates article. `visibility` defaults to `'draft'`. Tags created on demand. |
| `PUT` | `/posts/:id` | Owner | Body: Updated article fields | `200` | Restricted to author or admin. Updates `editedAt` timestamp. |
| `DELETE` | `/posts/:id` | Owner | None | `200` | Cascades delete to comments and removes reference from author's posts list. |
| `POST` | `/posts/bulk` | Author | Body: `{ ids: string[], action: 'delete' \| 'public' \| 'draft' \| 'private' }` | `200` | Performs bulk batch operation scoped to caller's stories. |
| `GET` | `/posts/trending`| Public | Query: `limit` (max 50) | `200` | Evaluates 14-day engagement algorithm to rank top stories. |

### 14-Day Trending Ranking Formula
$$\text{Score} = \text{opens} + (3 \times \text{likes}) + (5 \times \text{comments}) + (5 \times \text{finished reads})$$
*Story must have at least 3 opens within the 14-day window to qualify for trending rank.*

---

## 4. Users & Profiles Endpoints (`/api/users`)

| Method | Path | Auth | Payload / Parameters | Success | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/users/getUser` | User | None | `200` | Fetches caller's private account record and profile. |
| `PUT` | `/users/setUser` | User | Form-data: `username, email, bio`, file: `image` | `200` | Updates profile. Capped avatar buffer at 2 MB in memory. |
| `GET` | `/users/getUserPosts` | User | Query: `page, limit, visibility, sort, q` | `200` | Author story management workspace. |
| `GET` | `/users/:id/profile` | Public | Param: `:id` | `200` | Public author profile and social links. |
| `GET` | `/users/:id/avatar` | Public | Param: `:id` | `200` | Serves binary avatar image buffer with `ETag` caching headers. |
| `POST` | `/users/followUser` | User | Body: `{ toFollowId }` | `200` | Follows author. Returns 400 on self-follow. |
| `POST` | `/users/unfollowUser`| User | Body: `{ toUnfollowId }` | `200` | Unfollows target author. |
| `DELETE`| `/users/me` | User | Body: `{ password }` | `200` | Self-deletion cascade. Purges author's posts, comments, and profile. |
| `GET` | `/users` | Admin | Query: `page, limit` | `200` | Paginated user management table. |
| `PATCH` | `/users/:id/suspension` | Admin | Body: `{ suspended: boolean }` | `200` | Toggles suspension and bumps `tokenVersion` to immediately disconnect account. |
| `PATCH` | `/users/:id/role` | Admin | Body: `{ admin: boolean }` | `200` | Promotes/demotes user role. |
| `DELETE`| `/users/:id` | Admin | Body: `{ password }` (admin's password) | `200` | Cascading user deletion by platform administrator. |

---

## 5. Engagement & Social Endpoints

### Comments (`/api/comments`)
| Method | Path | Auth | Body / Params | Success | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/comments/post/:postId` | Public | Param: `:postId`, Query: `page, limit` | `200` | Retrieves top-level comments and nested reply chains. |
| `POST` | `/comments` | User | Body: `{ postId, message }` | `201` | Submits top-level comment (max 5,000 chars). |
| `POST` | `/comments/replies` | User | Body: `{ repliedCommentId, message }` | `201` | Adds nested reply to an existing comment. |
| `DELETE`| `/comments/:id` | Author | Param: `:id` | `200` | Deletes comment and recursively removes attached replies. |

### Likes (`/api/likes`)
| Method | Path | Auth | Payload | Success | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/likes` | User | Body: `{ postId }` | `201` | Toggles like. Enforces uniqueness via `(post, user)` compound index. |
| `DELETE`| `/likes/post/:postId` | User | Param: `:postId` | `200` | Removes user like. |
| `GET` | `/likes/post/:postId` | Public | Param: `:postId` | `200` | Returns likes count and usernames list. |

### Page Impressions & Reading Metrics (`/api/page-views`)
| Method | Path | Auth | Payload | Success | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/page-views` | Public | Body: `{ postId, visitorKey?, isReadComplete? }` | `200` | Records view/read event with 6-hour deduplication window per visitor key. |

---

## 6. Search, Taxonomy & Settings

- **`GET /api/search/:query`:** Case-insensitive regex search spanning story title, body Markdown, author username, and tags. Returns excerpt and word counts.
- **`GET /api/tags`:** Lists public tags ordered by post frequency count.
- **`POST /api/tags`:** (Admin only) Creates standardized platform tag.
- **`DELETE /api/tags/:id`:** (Admin only) Deletes tag (returns `409 Conflict` if active stories remain attached).
- **`GET /api/settings`:** Retrieves user notification and theme settings.
- **`PUT /api/settings`:** Updates theme preferences, notification toggles, and appearance configurations.

---

## 7. Analytics & Administration

- **`GET /api/analytics/author`:** Returns creator dashboard statistics: total views, completed reads, likes, and average read-through rate conversion.
- **`GET /api/analytics/post/:id`:** Detailed engagement timeline for a single story.
- **`GET /api/admin/metrics`:** Site-wide health statistics: total registered users, public vs draft posts, read ratios, and 30-day activity trends.

---

## 8. Health & Operational Probes

- **`GET /api/health`:** Liveness probe (Express process status and uptime).
- **`GET /api/ready`:** Readiness probe (issues a database ping; returns `503 Service Unavailable` if MongoDB connection is lost).
