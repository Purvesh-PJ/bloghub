# User Flows

> **Scope:** end-to-end journeys — what the user does, what the client does, what the API
> does, and where each flow can fail.
> **Excludes:** capability status ([features.md](features.md)), endpoint signatures
> ([reference/api.md](../reference/api.md)).

Notation: `→` step transition, `⇢` network call, `✗` failure branch.

---

## Route map

| Route                 | Access | Page                                                  |
| --------------------- | ------ | ----------------------------------------------------- |
| `/`                   | Public | `Home`                                                |
| `/login`, `/register` | Public | `Login`, `Register`                                   |
| `/post/:id`           | Public | `PostDetail`                                          |
| `/user/:userId`       | Public | `UserProfile`                                         |
| `/search`             | Public | `Search`                                              |
| `/dashboard`          | Member | `Dashboard` — how the work performed                  |
| `/stories`            | Member | `Stories` — what has been written, and its management |
| `/comments`           | Member | `Responses` — what readers said back                  |
| `/write`, `/edit/:id` | Member | `WritePost`                                           |
| `/settings`           | Member | `Settings`                                            |
| `/admin`              | Admin  | `AdminDashboard`                                      |
| `/admin/posts`        | Admin  | `AdminPosts`                                          |
| `/admin/categories`   | Admin  | `AdminCategories`                                     |
| `/admin/users`        | Admin  | `AdminUsers`                                          |
| `*`                   | Public | `NotFound`                                            |

Member routes are wrapped in `ProtectedRoute`, admin routes in `AdminRoute`. Both redirect to
`/login` and preserve the attempted location in router state, so the user lands where they
started after signing in.

### Redirects

The workspace used to be one page that mixed statistics with post management, which meant
neither was good at its job. It is now three pages split by the question each answers, and the
old paths redirect rather than 404:

| Old route    | Redirects to |
| ------------ | ------------ |
| `/profile`   | `/dashboard` |
| `/my-posts`  | `/stories`   |
| `/analytics` | `/dashboard` |

There is no `/admin/settings`. It was a page of toggles wired to nothing, so it was removed
rather than left to imply that the switches did something.

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
  ⇢ GET /posts           → queryKey ["posts"]     (published only, paginated)
  ⇢ GET /posts/trending  → queryKey ["trending"]
  → hero, feed, trending sidebar
  → clicking a card → /post/:id
```

The API returns only `visibility: 'public'` posts, so no browser-side filter is required.
Responses are cached for five minutes and are not refetched on window focus.

The landing page has **no category filter**. It had one, and it was removed: it filtered only
the posts already in memory, so it looked like a search of the platform while actually
searching one page, and it competed with the ranking the page exists to present. Filtering
belongs on `/search`, where the server does it against the whole collection.

**Known limitation:** the feed requests one page and does not paginate further, so only the
most recent page is reachable from the landing page ([GAP-07](roadmap.md#gap-07)). `/search`
is the way to reach the rest.

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

## 8. Managing your stories

`/stories` answers "what have I written, and what do I want to do with it". Every control on
it — the filter, the search, the sort, the page — is a query parameter, so the server does the
work and a reload or a shared link reproduces the same view.

```
/stories → ⇢ GET /users/getUserPosts?page&limit&visibility&sort&q → ["myPosts", params]
         → ⇢ GET /analytics/me                                    → ["myAnalytics"]
  → tabs count all / public / draft / private from `counts` in the response
  → per row: View · Edit · Publish or Unpublish · Delete
  → Publish/Unpublish ⇢ PUT /posts/:id { visibility }
  → Delete → confirmation modal → ⇢ DELETE /posts/:id
       ├─ 404 missing, 403 not owner or admin
       ├─ pull the id from referencing categories
       ├─ delete attached comments
       ├─ pull from User.posts (the author's)
       ├─ delete the post
       └─ decrement the **author's** postCount
  → selection → ⇢ POST /posts/bulk { ids, action }
       └─ action is delete | public | draft | private; ownership is checked per id,
          so a mixed selection cannot be used to reach someone else's post
  → invalidate ["myPosts"], ["myAnalytics"], ["posts"]
```

`counts` is computed server-side over the whole collection, not over the current page —
otherwise the tab labels would change every time you paged.

Deletion leaves orphaned likes, views and reads — see
[reference/database.md](../reference/database.md#integrity).

---

## 9. The workspace dashboard

`/dashboard` answers "how is the work doing". It reads only; every action on it is a link to
somewhere that writes.

```
/dashboard → ⇢ GET /analytics/me         → ["myAnalytics"]
                  ├─ ✗ not signed in → 401
                  ├─ count views and reads over the caller's own posts
                  └─ totals, per-post rates, a top-five ranking
           → ⇢ GET /users/getUserPosts?visibility=draft&limit=4&sort=updated
                  └─ the drafts to pick back up
           → ⇢ GET /analytics/me/reading → ["readingActivity"]
                  └─ what this account has been reading
  → summary tiles, top stories, unfinished drafts
```

`GET /analytics/me` derives the author from the token rather than taking a user id in the
path. The older `GET /analytics/user/:userId` still exists for the admin console and checks
`authorizeSelfOrAdmin`; the workspace does not use it, because an endpoint that cannot name
anyone else's data cannot leak anyone else's data.

---

## 10. Responses

`/comments` answers "what did readers say back", which was previously answerable only by
opening each post in turn.

```
/comments → ⇢ GET /users/getUserPosts?limit=50&sort=newest → ["myPosts", params]
          → select a story
          → ⇢ GET /comments/post/:postId?limit=50          → ["postComments", id]
  → Delete a response ⇢ DELETE /comments/:id
       └─ allowed for the comment's author, the post's author, or an admin
  → invalidate ["postComments", id]
```

---

## 11. Following

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

## 12. Search

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

## 13. Theme switching

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

## 14. Administration

```
/admin (AdminRoute: authenticated AND roles contains "admin")
  ├─ Dashboard   ⇢ GET /posts?all=true → ["allPosts"], GET /analytics/admin
  ├─ Posts       ⇢ GET /posts?all=true — includes drafts and private posts
  ├─ Categories  ⇢ GET /categories; create via POST /categories (admin-only)
  └─ Users       ⇢ GET /users?page=n → ["admin-users", page]
                 ⇢ PATCH /users/:id/suspension { suspended }
                 ⇢ PATCH /users/:id/role       { role }
                 ⇢ DELETE /users/:id
```

The user actions are the reason the console exists. Suspension and demotion both increment the
target's `tokenVersion`, so an account loses its existing sessions the moment it is acted on
rather than whenever its access token happens to expire. Deletion goes through the same
`purgeAccount` service the member-facing "delete my account" uses, so there is one definition
of what removing an account means.

There is no admin Settings page. It was a screen of switches wired to nothing, and a control
that does not control anything is worse than an absent one.

`?all=true` is honoured only for an admin token; for anyone else the flag is ignored and the
public list is returned. `AdminRoute` is a convenience — every admin resource is independently
enforced server-side ([security/auth.md](../security/auth.md)).

---

## Cross-cutting failure handling

| Layer                | Mechanism                                  |
| -------------------- | ------------------------------------------ |
| Render errors        | `ErrorBoundary` wraps the tree             |
| Route not found      | Catch-all renders `NotFound`               |
| Expired access token | Interceptor refreshes once and replays     |
| Refresh failure      | Session cleared, hard redirect to `/login` |
| Rate limited         | 429 with a retry message                   |
| Mutation failure     | Error toast from `onError`                 |
| Query failure        | One retry, then the page's error branch    |
