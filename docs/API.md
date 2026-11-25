# API Reference

BlogHub exposes a JSON REST API mounted at the `/api` prefix.

---

## Base URL and Transport

- **Local Base URL:** `http://localhost:4000/api`
- **Content Type:** `application/json`
- **CORS:** Credentialed access pinned strictly to `CLIENT_URL`

---

## Response Envelope

All API endpoints return a uniform JSON payload format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

---

## Authentication Protocol

Protected routes require an `Authorization` header containing a valid Bearer token:

```http
Authorization: Bearer <accessToken>
```

- **Access Token:** Short-lived JWT (15-minute lifespan). Carries `userId`, `roles`, and `tokenVersion`.
- **Refresh Token:** Long-lived JWT (7-day lifespan). Used exclusively with `POST /api/auth/refresh`.
- **Session Revocation:** Password changes or administrative suspensions increment `tokenVersion` in MongoDB, immediately invalidating all outstanding tokens across devices.

---

## Endpoints

### 1. Authentication (`/api/auth`)

| Method | Endpoint             | Auth     | Description                                          |
| ------ | -------------------- | -------- | ---------------------------------------------------- |
| `POST` | `/api/auth/register` | Public   | Create a new user account                            |
| `POST` | `/api/auth/login`    | Public   | Authenticate with email/password; returns token pair |
| `POST` | `/api/auth/refresh`  | Public   | Mint new access/refresh token pair                   |
| `POST` | `/api/auth/logout`   | Optional | Clear client credentials                             |

### 2. Posts and Content (`/api/posts`, `/api/tags`, `/api/search`, `/api/likes`)

| Method   | Endpoint              | Auth     | Description                                                |
| -------- | --------------------- | -------- | ---------------------------------------------------------- |
| `GET`    | `/api/posts`          | Optional | Get paginated posts feed with optional tag filter          |
| `GET`    | `/api/posts/trending` | Public   | Get top 14-day trending posts based on engagement          |
| `GET`    | `/api/posts/:id`      | Optional | Get post by ID or slug (unpublished requires author/admin) |
| `POST`   | `/api/posts`          | Required | Create a new story (draft or public)                       |
| `PUT`    | `/api/posts/:id`      | Required | Update story content or visibility                         |
| `DELETE` | `/api/posts/:id`      | Required | Delete story (author or admin only)                        |
| `POST`   | `/api/posts/bulk`     | Required | Batch publish, unpublish, or delete stories                |
| `POST`   | `/api/likes/:postId`  | Required | Like a story (unique per user per post)                    |
| `DELETE` | `/api/likes/:postId`  | Required | Remove like from a story                                   |
| `GET`    | `/api/tags`           | Public   | List available topics/tags with story counts               |
| `GET`    | `/api/search`         | Public   | Full-text query across titles, tags, and authors (`?q=`)   |

### 3. Comments and Discussions (`/api/comments`)

| Method   | Endpoint                     | Auth     | Description                                   |
| -------- | ---------------------------- | -------- | --------------------------------------------- |
| `GET`    | `/api/comments/post/:postId` | Public   | Retrieve threaded discussion tree for a story |
| `POST`   | `/api/comments`              | Required | Post a comment or nested reply                |
| `DELETE` | `/api/comments/:id`          | Required | Remove a comment (author or admin only)       |

### 4. Users and Profiles (`/api/users`, `/api/settings`)

| Method | Endpoint                 | Auth     | Description                                          |
| ------ | ------------------------ | -------- | ---------------------------------------------------- |
| `GET`  | `/api/users/:id`         | Public   | Get public profile details and published stories     |
| `PUT`  | `/api/users/profile`     | Required | Update display name, bio, and social links           |
| `GET`  | `/api/users/:id/avatar`  | Public   | Stream user profile picture (supports caching `?v=`) |
| `POST` | `/api/users/avatar`      | Required | Upload new avatar (multipart/form-data, max 2MB)     |
| `POST` | `/api/users/:id/follow`  | Required | Follow or unfollow another creator                   |
| `GET`  | `/api/settings`          | Required | Get current account preferences                      |
| `PUT`  | `/api/settings`          | Required | Update preferences (theme, notification flags)       |
| `PUT`  | `/api/settings/password` | Required | Change password and revoke all other sessions        |

### 5. Analytics and Telemetry (`/api/page-views`, `/api/user-activity`)

| Method | Endpoint                             | Auth     | Description                                       |
| ------ | ------------------------------------ | -------- | ------------------------------------------------- |
| `POST` | `/api/page-views/:postId`            | Optional | Record page impression (6-hour deduplication)     |
| `POST` | `/api/user-activity/read/:postId`    | Optional | Record completed read (depth >= 95% + dwell time) |
| `GET`  | `/api/user-activity/reading-history` | Required | Get reading history for the current user          |

### 6. Administration and Moderation (`/api/admin`)

| Method | Endpoint                       | Auth  | Description                                         |
| ------ | ------------------------------ | ----- | --------------------------------------------------- |
| `GET`  | `/api/admin/stats`             | Admin | Get system-wide platform metrics                    |
| `GET`  | `/api/admin/users`             | Admin | List accounts with role and suspension filters      |
| `PUT`  | `/api/admin/users/:id/suspend` | Admin | Suspend or unsuspend account (instant session drop) |
| `GET`  | `/api/admin/activity`          | Admin | Review moderation activity logs                     |

---

## HTTP Status Codes

| Status                  | Meaning                 | Scenario                                  |
| ----------------------- | ----------------------- | ----------------------------------------- |
| `200 OK`                | Request succeeded       | Standard read/update response             |
| `201 Created`           | Resource created        | Account, post, or comment creation        |
| `400 Bad Request`       | Validation failure      | Missing field or invalid input format     |
| `401 Unauthorized`      | Authentication required | Missing, expired, or revoked JWT          |
| `403 Forbidden`         | Access denied           | Non-admin accessing admin endpoint        |
| `404 Not Found`         | Resource missing        | Requested post or user does not exist     |
| `409 Conflict`          | Duplicate record        | Email already registered, duplicate like  |
| `429 Too Many Requests` | Rate limit exceeded     | Exceeded 300 req/15m or 10 login failures |
| `500 Server Error`      | Unhandled error         | Internal unexpected server fault          |
