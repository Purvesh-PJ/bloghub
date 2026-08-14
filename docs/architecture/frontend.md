# Frontend Architecture

> **Scope:** the internal design of the React client — provider composition, routing, state
> ownership, data fetching, styling integration, performance.
> **Excludes:** tokens and component specifications
> ([reference/design-system.md](../reference/design-system.md)), journeys
> ([product/user-flows.md](../product/user-flows.md)), the repository tree
> ([overview.md](overview.md)).

---

## Stack

| Concern | Choice | Version |
|---------|--------|---------|
| UI library | React | 19.2 |
| Build tool | Vite | 7.2 |
| Routing | React Router | 7.11 |
| Server state | TanStack Query | 5.90 |
| HTTP client | Axios | 1.13 |
| Styling | styled-components | 6.2 |
| Markdown editor | `@uiw/react-md-editor` | 4.0 |
| Icons | lucide-react | 0.562 |
| Notifications | react-hot-toast | 2.6 |
| Dates | date-fns | 4.1 |
| Dialog primitive | `@radix-ui/themes` | 3.2 |

`react-hook-form`, `@hookform/resolvers` and `zod` are installed but imported nowhere — forms
are controlled by hand with `useState`. Either adopt them or drop them.

---

## Provider composition

`client/src/main.jsx`. The nesting order is deliberate.

```jsx
<React.StrictMode>
  <ErrorBoundary>                       // catches render errors from everything below
    <QueryClientProvider>               // server-state cache
      <BrowserRouter>                   // history — above anything that navigates
        <AuthProvider>                  // session — guards depend on it
          <ThemeProvider>               // styled-components theme + GlobalStyles
            <App />
            <Toaster position="top-right" />
```

`ErrorBoundary` is outermost so a failure in any provider still renders a recovery screen.
`AuthProvider` sits above `ThemeProvider` because guards consume auth and theming consumes
nothing.

### Query client defaults

```js
{ staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false }
```

Suitable for a content site where posts change slowly. Anything that must be live overrides
`staleTime` at the call site.

---

## Routing

`client/src/App.jsx` declares two trees — public/member under `Layout`, admin under
`AdminRoute → AdminLayout`. The full route table is in
[product/user-flows.md](../product/user-flows.md#route-map).

### Lazy loading

Every page is code-split. Pages use **named** exports, so a helper adapts them to the default
export `React.lazy` expects:

```js
const lazyPage = (importFn, name) =>
  lazy(() => importFn().then((module) => ({ default: module[name] })));
```

A single `Suspense` boundary renders a centred `Spinner` during chunk loading.

### Guards

```jsx
// ProtectedRoute
if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

// AdminRoute — additionally
if (!isAdmin()) return <Navigate to="/" replace />;
```

`state.from` lets `Login` return the user where they were headed; `replace` keeps the
redirect out of history.

**Guards are UX, not security.** Every protected resource is independently enforced by the
API — see [security/auth.md](../security/auth.md#enforcement-layers).

---

## State ownership

Four kinds of state, each with one home. Putting state in the wrong layer is the most common
review comment on this codebase.

| Kind | Owner | Examples |
|------|-------|----------|
| **Server state** | TanStack Query | posts, categories, comments, analytics, users |
| **Session state** | `authState` + `AuthContext` | user, tokens, `isAuthenticated` |
| **Theme state** | `ThemeProvider` | light/dark mode |
| **Local UI state** | `useState` in the component | form fields, open modals, active tab, carousel index |

No Redux, Zustand or Jotai, and none is needed.

### Authentication state

`client/src/context/AuthContext.jsx` is a deliberate two-part design.

```
authState  ─ a plain module-scope object
             ├─ user, accessToken, refreshToken, isAuthenticated
             ├─ setState / setAccessToken / logout
             ├─ persist() → localStorage["auth-storage"]
             └─ subscribe(listener)
                        │
AuthProvider ───────────┘  mirrors into React state and exposes
                           { …state, setAuth, setAccessToken, setUser,
                             logout, isLoggedIn, isAdmin }
```

**Why the singleton exists:** the Axios interceptor is not a React component and cannot call
`useAuth()`. It needs the current token synchronously on every request. A module-scope object
provides that; the subscription keeps React in step.

Initialisation reads `localStorage` at module load, so a refresh restores the session before
first render — no authenticated flash of the signed-out UI.

Trade-off: tokens in `localStorage` are readable by any script on the origin —
[SEC-08](../security/checklist.md#sec-08).

---

## Data flow

```
Page component
   │  useQuery / useMutation
   ▼
TanStack Query          cache hit returns immediately; miss calls queryFn
   ▼
services/<name>Service  one function per endpoint, returns response.data
   ▼
config/api.js           Axios instance + request/response interceptors
   ▼
Express API
```

### Service layer

Ten modules, each a plain object of async functions:

```js
export const postService = {
  getPosts: async (params = {}) => (await api.get('/posts', { params })).data,
  getAllPosts: async (params = {}) =>
    (await api.get('/posts', { params: { ...params, all: 'true' } })).data,
  getPost: async (id) => (await api.get(`/posts/${id}`)).data,
  createPost: async (postData) => (await api.post('/posts', postData)).data,
};
```

No React, no caching, no reshaping. They return `response.data` and stop, which is why pages
handle the inconsistent server envelopes described in
[backend.md](backend.md#response-contract).

### The Axios instance

`client/src/config/api.js` is the only place an instance is created.

```
baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

request interceptor   → Authorization: Bearer <authState.accessToken>

response interceptor  → 401 and not yet retried
                          → POST /auth/refreshToken via bare axios (no recursion)
                          → success: store the token, replay the request
                          → failure: logout + hard redirect to /login
```

The `_retry` flag guarantees at most one refresh per failed request. Concurrent 401s each
trigger their own refresh; a shared in-flight promise would coalesce them.

### Query keys

| Key | Data | Used by |
|-----|------|---------|
| `['posts']` | **Published** posts, paginated | Home, UserProfile |
| `['allPosts']` | **All** posts incl. drafts — admin only | Admin Dashboard, Admin Posts |
| `['post', id]` | One post with comments and likes | PostDetail, WritePost (edit) |
| `['categories']` | Categories | Home, WritePost, Admin Categories |
| `['userPosts']` | The signed-in author's posts | MyPosts, Profile, Analytics |
| `['currentUser']` | The signed-in user record | Profile, Settings |
| `['userAnalytics', userId]` | Per-author analytics | Analytics |
| `['adminAnalytics']` | Site-wide analytics | Admin Dashboard |
| `['admin-users', page]` | Paginated users | Admin Users |
| `['search', query]` | Search results | Search |
| `['isFollowing', userId]` | Follow state | UserProfile |

Convention: resource name first, then identifiers, general to specific.

`['posts']` and `['allPosts']` now hold **genuinely different data** — the public feed versus
the moderation view. Two keys for two datasets is correct; merging them would be wrong
([BUG-13](../product/roadmap.md#bug-13)).

`admin-users` is kebab-case while everything else is camelCase — inconsistent, worth
normalising.

### Mutations

Mutations invalidate rather than patch:

```js
useMutation({
  mutationFn: (data) => commentService.createComment(data),
  onSuccess: () => queryClient.invalidateQueries(['post', id]),
  onError: (error) => toast.error(error.response?.data?.message ?? 'Failed'),
});
```

Simple and always correct, at the cost of a refetch. No optimistic updates are used.

---

## Component organisation

```
components/
├── layout/     Header, Footer, Layout, AdminLayout, ThemeToggle, ErrorBoundary
├── posts/      PostCard
└── ui/         13 token-driven primitives + a barrel index
```

| Tier | May import | Must not |
|------|-----------|----------|
| `ui/` | styled-components, other primitives | services, context, router |
| `posts/` (domain) | `ui/`, router links, formatting | fetch data |
| `layout/` | `ui/`, `context/`, router | contain page logic |
| `pages/` | everything above, plus `services/` | be imported by anything but `App.jsx` |

Pages own the data; components below receive props.

### Styled components live with their component

Each page defines its styled components at module scope above the component function. This
keeps a screen self-contained at the cost of very long files — `Home.jsx` exceeds 1,000
lines, most of it styling. Splitting the largest pages into a directory with a `styles.js` is
queued in the [roadmap](../product/roadmap.md#phase-5--scale-and-polish).

### Error boundary

`components/layout/ErrorBoundary.jsx` is the only class component — React has no hook
equivalent. It catches render-phase errors; it does **not** catch errors in event handlers or
async code, which mutation `onError` callbacks handle. It currently reports nowhere; wiring
it to an error tracker is the highest-value frontend observability work available
([runbook](../operations/runbook.md#frontend-errors)).

---

## Performance

| Technique | Where | Effect |
|-----------|-------|--------|
| Route code splitting | `App.jsx` | Only the visited route's chunk downloads |
| Manual vendor chunks | `vite.config.js` | `vendor`, `radix`, `editor` cache separately |
| Query caching | `main.jsx` | Five-minute freshness, no focus refetch |
| Conditional queries | `WritePost` | `enabled: isEditing` avoids a pointless fetch |
| Memoised theme | `ThemeProvider` | Not rebuilt every render |
| System fonts | `typography.js` | No web-font download or layout shift |
| Server-side pagination | `postService` | The feed no longer downloads every post with all comments populated |

**Current constraint:** the feed requests one page and does not paginate further, so only the
20 most recent posts are reachable from the UI ([GAP-07](../product/roadmap.md#gap-07)).

**Known issue:** four pages hydrate form state from a query inside `useEffect`, causing a
cascading render ([BUG-15](../product/roadmap.md#bug-15)).

---

## Adding to the frontend

**A page** — `pages/<Name>.jsx` with a named export; register in `App.jsx` via `lazyPage`
inside the right guard; fetch with `useQuery`; handle loading, empty and error.

**An API call** — add the function to the matching `services/<resource>Service.js`. Never
call `axios` directly.

**A primitive** — see
[reference/design-system.md](../reference/design-system.md#extending-the-system).
