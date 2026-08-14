# User Flows

> **Scope:** end-to-end journeys — what the user does, what the client does, what the API
> does, and where each flow can fail.
> **Excludes:** capability status ([features.md](features.md)), endpoint signatures
> ([reference/api.md](../reference/api.md)).

Notation: `→` step transition, `⇢` network call, `✗` failure branch.

---

## Route map

| Route | Access | Page |
|-------|--------|------|
| `/` | Public | `Home` |
| `/login`, `/register` | Public | `Login`, `Register` |
| `/post/:id` | Public | `PostDetail` |
| `/user/:userId` | Public | `UserProfile` |
| `/search` | Public | `Search` |
| `/write`, `/edit/:id` | Member | `WritePost` |
| `/profile` | Member | `Profile` |
| `/my-posts` | Member | `MyPosts` |
| `/analytics` | Member | `Analytics` |
| `/settings` | Member | `Settings` |
| `/admin` | Admin | `AdminDashboard` |
| `/admin/posts` | Admin | `AdminPosts` |
| `/admin/categories` | Admin | `AdminCategories` |
| `/admin/users` | Admin | `AdminUsers` |
| `/admin/settings` | Admin | `AdminSettings` |
| `*` | Public | `NotFound` |

Member routes are wrapped in `ProtectedRoute`, admin routes in `AdminRoute`. Both redirect to
`/login` and preserve the attempted location in router state, so the user lands where they
started after signing in.

---

## 1. Registration

```
/register → username, email, password, confirm → Submit
  ⇢ POST /auth/signup
      ├─ express-validator: all four fields
      │    ✗ → 400 with field errors
      ├─ normalise: email lowercased and trimmed by the schema
      ├─ User.findOne({ $or: [email, username] })
      │    ✗ match → 409
      ├─ bcrypt.hash(password, salt=10)
      ├─ User.create(...)
      │    ✗ duplicate key from the unique index → 409
      └─ UserProfile.create({ user })
  → 201 → toast → navigate to /login
```

Registration does not sign the user in. Uniqueness is enforced by the database, so two
concurrent registrations cannot both succeed.

---

## 2. Sign in

```
/login → credential (email OR username) + password → Submit
  ⇢ POST /auth/signin        [max 10 failed attempts / 15 min per IP]
      ├─ User.findOne({ $or: [email, username] })
      │    ✗ → 401 — message deliberately does not say which field was wrong
      ├─ bcrypt.compare
      │    ✗ → 401, same message
      └─ issue accessToken (15m, JWT_SECRET, type: access)
                refreshToken (7d, JWT_REFRESH_SECRET, type: refresh)
  → 200 { accessToken, refreshToken, userdata }
  → authState.setState → localStorage["auth-storage"]
  → subscribers notified → header switches to the member view
  → navigate(location.state.from ?? "/", { replace: true })
```

`authState` is a plain object outside React so the Axios interceptor can read the current
token without a hook — see
[architecture/frontend.md](../architecture/frontend.md#authentication-state).

---

## 3. Authenticated request and silent refresh

```
component → service → api.request
  ├─ request interceptor: Authorization: Bearer <accessToken>
  ⇢ API — authenticateUser verifies signature, expiry, and type === 'access'
  └─ response interceptor
       ├─ 2xx → return
       └─ 401 and not already retried
            ├─ mark _retry
            ⇢ POST /auth/refreshToken { refreshToken }   (bare axios, no recursion)
            ├─ success → store the new access token → replay the original request
            └─ ✗ → authState.logout() → redirect to /login
```

A refresh token presented as an access token is rejected with 401 — different secret and a
mismatched `type` claim.

---

## 4. Browsing the feed

```
/ → Home mounts
  ⇢ GET /posts        → queryKey ["posts"]   (published only, paginated, 20 per page)
  ⇢ GET /categories   → queryKey ["categories"]
  → hero, featured-category carousel, feature grid, feed, trending sidebar
  → selecting a category filters the loaded page in memory
  → clicking a card → /post/:id
```

The API returns only `visibility: 'public'` posts, so no browser-side filter is required.
Responses are cached for five minutes and are not refetched on window focus.

**Known limitation:** the UI requests one page and does not paginate further, so only the 20
most recent posts are reachable from the feed ([GAP-07](roadmap.md#gap-07)).

---

## 5. Reading a post

```
/post/:id → PostDetail mounts
  ⇢ GET /posts/:id     → queryKey ["post", id]
       ├─ ✗ unknown id → 404 → "Post not found" screen
       ├─ non-public and viewer is not the author or an admin → 404
       └─ author, likes, comments, replies, categories populated
  ⇢ POST /analytics/view/:id   (fire and forget)
  → cover image, title, author card, Markdown body, comment thread
  → author sees Edit and Delete
```

An author opening their own draft gets 200 — the route carries optional authentication.

### 5a. Commenting

```
type → Submit
  ⇢ POST /comments { postId, message }     author taken from the token
  → invalidate ["post", id]
```

### 5b. Replying

```
Reply → type → Submit
  ⇢ POST /comments/replies { repliedCommentId, message }
       ├─ ✗ unknown parent → 404
       ├─ reply stores the parent's post reference
       └─ parent.replies.addToSet(child), replyCount += 1
  → 201 → invalidate ["post", id]
```

### 5c. Liking

```
click like
  ⇢ POST /likes { postId }     or DELETE /likes/post/:postId
       ├─ ✗ already liked → 400 (unique index also enforces it)
       └─ Like document written and Post.likes kept in step
  → invalidate ["post", id]
```

Like state survives a reload because `Post.likes` is maintained and populated on read.

---

## 6. Publishing

```
/write → WritePost mounts
  ⇢ GET /categories
  → title → slug auto-derives
  → Markdown editor with preview toggle
  → optional cover image URL
  → multi-select categories
  → Save draft | Publish

  client guards: title, content and slug non-empty

  ⇢ POST /posts { title, slug, content, imageURL, visibility }
       └─ visibility validated against the enum, default draft
  → 201 { postId }
  → if categories selected ⇢ POST /categories/categoriesCollection
       └─ ✗ not the owner → 403
  → navigate to /post/:postId
```

Publishing with `visibility: 'public'` puts the post on the home feed immediately.

Category attachment is a second request from the mutation's success handler. If it fails the
post still exists, uncategorised; the response now reports unknown category names rather than
failing silently.

---

## 7. Editing

```
/edit/:id → WritePost in edit mode
  ⇢ GET /posts/:id   (enabled only when editing)
  → form hydrates; the original category list is snapshotted for diffing
  → Save
  ⇢ PUT /posts/:id
       ├─ ✗ missing → 404
       ├─ ✗ not author and not admin → 403
       └─ updates title, slug, content, imageURL, and visibility when sent
  → diff categories → ⇢ PUT /categories/updateCategoriesCollection/:id if changed
  → navigate to /post/:id
```

A post without a cover image edits normally.

---

## 8. Managing your posts

```
/my-posts → ⇢ GET /users/getUserPosts → ["userPosts"]
  → View, Edit, Delete per row
  → Delete → confirmation modal → ⇢ DELETE /posts/:id
       ├─ 404 missing, 403 not owner or admin
       ├─ pull the id from referencing categories
       ├─ delete attached comments
       ├─ pull from User.posts (the author's)
       ├─ delete the post
       └─ decrement the **author's** postCount
  → invalidate ["userPosts"]
```

Deletion leaves orphaned likes, views and reads — see
[reference/database.md](../reference/database.md#integrity).

---

## 9. Analytics

```
/analytics → ⇢ GET /users/getUserPosts       → ["userPosts"]
             ⇢ GET /analytics/user/:userId   → ["userAnalytics", userId]
                  ├─ ✗ userId is not the caller and caller is not admin → 403
                  ├─ count views and reads for the author's posts
                  └─ per-post rates and a top-five ranking
  → summary tiles, per-post table, ranking
```

---

## 10. Following

```
/user/:userId → ⇢ GET /posts (filtered client-side to this author)
              → ⇢ GET /users/isFollowing/:userId
  → Follow   ⇢ POST /users/followUser { toFollowId }
       ├─ ✗ self-follow → 409
       ├─ ✗ target profile missing → 404
       └─ both sides and both counters updated
  → Unfollow ⇢ POST /users/unfollowUser — mirror
```

The two profile updates are separate writes with no transaction; a failure between them
leaves the relationship one-sided.

---

## 11. Search

```
header search → /search → type
  ⇢ GET /search/:query
       ├─ regex metacharacters escaped
       ├─ match public posts by title, newest first, capped at 50
       └─ project title + a 200-character excerpt with HTML stripped
  → results → /post/:id
```

Titles only. Content, authors, tags and categories are not searched, and the regex cannot use
an index ([GAP-05](roadmap.md#gap-05)).

---

## 12. Theme switching

```
ThemeToggle → toggleTheme()
  → localStorage["theme"] = mode
  → <html data-theme="mode">
  → <meta name="theme-color"> updated
  → styled-components re-renders with the new token set
```

A stored preference wins on load; otherwise `prefers-color-scheme` decides. The system
listener only auto-switches while no explicit choice is stored.

---

## 13. Administration

```
/admin (AdminRoute: authenticated AND roles contains "admin")
  ├─ Dashboard   ⇢ GET /posts?all=true → ["allPosts"], GET /analytics/admin
  ├─ Posts       ⇢ GET /posts?all=true — includes drafts and private posts
  ├─ Categories  ⇢ GET /categories; create via POST /categories (admin-only)
  ├─ Users       ⇢ GET /users?page=n → ["admin-users", page]
  └─ Settings    → placeholder
```

`?all=true` is honoured only for an admin token; for anyone else the flag is ignored and the
public list is returned. `AdminRoute` is a convenience — every admin resource is independently
enforced server-side ([security/auth.md](../security/auth.md)).

---

## Cross-cutting failure handling

| Layer | Mechanism |
|-------|-----------|
| Render errors | `ErrorBoundary` wraps the tree |
| Route not found | Catch-all renders `NotFound` |
| Expired access token | Interceptor refreshes once and replays |
| Refresh failure | Session cleared, hard redirect to `/login` |
| Rate limited | 429 with a retry message |
| Mutation failure | Error toast from `onError` |
| Query failure | One retry, then the page's error branch |
