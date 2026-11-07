# MERN Stack Engineering Rules

These rules define standard industry best practices for building and maintaining applications using the MERN stack (MongoDB, Express, React, Node.js). Each section has a single, dedicated responsibility.

---

## 1. Working Process

- **Plan First:** For any change touching 3+ files or any refactor, list the problems and the proposed file structure first, then wait for approval before editing.
- **No Silent Changes:** Do not change behavior, visuals, or public APIs unless explicitly asked. Refactors must keep props and API contracts backward compatible.
- **Ask Before Adding Dependencies:** Prefer existing patterns and libraries. Ask before introducing a new package.
- **Small Steps:** One logical change per task and per commit. Never commit secrets or `.env` files.
- **Summarize:** End every task with a short summary of what changed, why, and anything intentionally left alone.

---

## 2. React & Client-Side Architecture

- **Functional Components:** Use functional components exclusively with modern React hooks; do not use class components.
- **Separation of Concerns:** Keep UI presentation separate from business logic. Extract complex state, side effects, and API calls into custom hooks (`useXyz`).
- **Server vs Local State:** Use specialized cache libraries (e.g., TanStack Query) for server state; do not manually duplicate server responses into local `useState`. Do not store derived data in state; compute it during render.
- **Component Colocation:** Colocate tightly coupled components, hooks, helpers, config, and tests in the same feature folder rather than scattering them across global directories.
- **Single Responsibility:** Keep components small, composable, and focused on one task. Split a component when it exceeds ~150 lines or mixes layout, state, and business logic. Do not extract single-use pieces under ~20 lines into separate files.
- **Config-Driven UI:** If the same JSX pattern repeats 3+ times (nav items, menu entries, table columns, form fields), replace it with a config array and `.map()`.
- **Effects:** Use `useEffect` only to sync with external systems. Do not use it to transform data or handle events that a handler can handle. Always clean up subscriptions, timers, and listeners.
- **Routing:** Use `NavLink` for active state, not manual `pathname.startsWith` checks. Close mobile menus via an effect on route change, not per-link `onClick`. Lazy-load route-level components.
- **No Premature Optimization:** Do not add `useMemo`, `useCallback`, or `React.memo` without a measured performance problem.
- **UI States:** Every data-driven component handles loading, error, and empty states. Async actions must `await`, catch errors, show a pending state, and navigate only on success.
- **Error Boundaries:** Wrap route trees in error boundaries with a recovery action.

---

## 3. Design System & UI Consistency (Strict)

- **3-Tier UI Architecture:**
  - **Tier 1 — Core Primitives (`src/components/ui/`):** Atomic building blocks (`Button`, `IconButton`, `Input`, `Select`, `Card`, `Surface`, `Alert`, `Badge`, `Chip`, `Modal`, `Dialog`, `Table`, `Pagination`, `EmptyState`, `ErrorState`, `Skeleton`). Never hand-roll raw `<button>`, `<input>`, or ad-hoc styled divs when a primitive exists.
  - **Tier 2 — Composed Patterns (`src/components/patterns/`):** High-level, domain-agnostic UI compositions built 100% out of Tier 1 primitives:
    - `PageHeader`: Standardized page heading (`h1`), subtitle description, badge, and action slots.
    - `DataTableCard`: Standardized tabular container wrapping `Card`, `Table`, and optional `Pagination` footer.
    - `DataView`: Unified async data lifecycle state machine (`isLoading` with skeleton, `isError` with retry, `isEmpty`, and content).
    - `FilterToolbar`: Unified toolbar combining filter chips, sort dropdown, search box, and action slots.
    - `StatsGrid`: Responsive telemetry metrics grid (2, 3, 4, 5 columns) with loading skeletons.
    - `SettingSection`: Structured settings card wrapper with title, description, `Alert` notice, and footer actions.
    - `ChoiceGrid`: Accessible card-based visual radio selector using `Card as="button"`.
    - `ConfirmDialog`: Standardized modal confirmation dialog with busy states and danger/confirm actions.
    - `BulkActionBar`: Floating selection toolbar for batch actions ("X items selected").
  - **Tier 3 — Feature Components (`src/features/*/components/`):** Domain-specific components carrying business logic (e.g., `PostCard`, `AuthorByline`, `CommentItem`).
- **Reuse Before Inventing (Zero Redundant Inventions):**
  - Whenever a screen needs a page heading, data table wrapper, toolbar, async lifecycle, metrics row, settings card, visual selector, or confirmation modal, it **MUST** use the canonical pattern from `src/components/patterns/`.
  - Never write custom state ladders (`isLoading ? <Skeleton> : isError ? ... : isEmpty ? ...`).
  - Never write ad-hoc modal confirmation dialogs or floating selection banners.
  - Patterns must be composed 100% of primitives; they must never bypass primitives by rendering raw `<button>`, un-tokenized alerts, or raw skeleton cards.
- **Strict Semantic Tokens Only:** Never use raw Tailwind palette colors (`slate-*`, `sky-*`, `red-*`, `amber-*`, `emerald-*`, `blue-*`, etc.). Always use role-based tokens:
  - Brand & Action: `bg-primary`, `text-primary`, `border-primary`, `text-primary-foreground`, `to-primary-dark`.
  - Status & Roles: `destructive` (danger/delete), `warning` (caution/pending), `success` (valid/live/confirmed), `info` (guide/notice).
  - Surfaces & Elevation: `bg-surface-page`, `bg-surface-container`, `bg-surface-container-low`, `bg-surface-container-high`, `bg-surface-elevated`.
  - Lines & Borders: `border-line-subtle`, `border-line-default`, `border-line-strong`, `border-border`.
- **No Raw White or Black:**
  - Overlays, backdrops, and drawer scrims must use `bg-scrim` (never `bg-black/60` or `bg-black`).
  - Text on colored or gradient fills must use the corresponding `text-*-foreground` token (e.g., `text-primary-foreground`, never `text-white`).
- **No Arbitrary Color Syntaxes or CSS Variables:**
  - Never use arbitrary color functions `[#hex]`, `[hsl(...)]`, `[rgb(...)]`, or arbitrary syntax `[var(--x)]`. Use registered Tailwind utilities.
- **Strict Radius & Typography Scales:**
  - Use the design system radius scale: `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl`, or `rounded-full`.
  - Use the design system typography scale: `text-2xs` (10px), `text-caption` (11px), or Tailwind sizes (`text-xs`, `text-sm`, `text-base`, `text-lg`, etc.). Do not introduce arbitrary `text-[...px]`.
- **Component Extension Over Duplication:** Never create a one-off duplicate of an existing component under a feature folder with slight style differences. If a legitimate new variant is required, extend the CVA variants in `src/components/ui/` while preserving backward compatibility.
- **Zero Token Violations:** Every frontend task must pass `npm --prefix client run lint` with 0 `design-system/enforce-tokens` errors before completion.

---

## 4. Accessibility (WCAG 2.2 AA)

- **Semantic HTML:** Use `nav`, `aside`, `main`, `header`, `button`, and `ul/li`. Never use `div` with `onClick` for actions.
- **Labels:** Icon-only buttons require `aria-label`. Decorative icons get `aria-hidden="true"`. Repeated landmarks get distinct `aria-label`s.
- **Current Page:** The active navigation item must expose `aria-current="page"`.
- **Modals & Drawers:** Provide a focus trap, `Escape` to close, focus restoration on close, and body scroll lock. Closed drawers must not be keyboard-focusable.
- **Focus & Contrast:** Keep visible `focus-visible` styles. Text contrast must be at least 4.5:1. Never convey meaning by color alone.
- **Forms:** Link field errors with `aria-describedby`, and associate every input with a label.

---

## 5. Express & Node.js API Architecture

- **Layering:** Follow routes -> controllers -> services -> models. Dependencies point one way only.
- **Thin Controllers:** Controllers only extract request parameters, call the service layer, and return HTTP responses.
- **Dedicated Service Layer:** Place all business logic, external API calls, and calculations inside reusable service modules that never touch `req` or `res`.
- **Centralized Error Handling:** Never handle errors with ad-hoc response sends in try/catch blocks; pass errors to next (`next(err)`) and handle them via central Express error middleware. Use a custom `ApiError` class and map known errors (validation, cast, duplicate key, JWT) to proper 4xx responses. Never leak stack traces to clients.
- **Asynchronous Execution:** Use `async/await` consistently and ensure all asynchronous operations are properly awaited or wrapped with an async handler.
- **Consistent Responses:** Always use standard HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500) and return predictable JSON payload shapes `{ success, data, message }`.
- **Pagination:** Every list endpoint is paginated with an enforced maximum limit. No unbounded queries.
- **Configuration:** Read environment variables through a single config module, validated at startup. Fail fast when required values are missing. Keep a `.env.example`; never commit `.env`.
- **Logging:** Use a structured logger (e.g., pino) instead of `console.log`. Never log passwords, tokens, or other sensitive data.
- **Operations:** Expose a health endpoint and shut down gracefully on `SIGTERM` (finish in-flight requests, close the DB connection).

---

## 6. MongoDB & Mongoose Data Layer

- **Strict Schema Definitions:** Always define explicit Mongoose schemas with strict types, required fields, and built-in validators. Enable `timestamps`.
- **Database-Level Integrity:** Enforce data constraints (e.g., uniqueness, foreign references) at the database layer with indexes, not solely in application code.
- **Index Optimization:** Create explicit single-field and compound indexes for fields used in queries, filtering, or sorting.
- **Query Performance:** Use `.lean()` on read-only queries to bypass Mongoose document hydration overhead when update methods are not needed. Use `.select()` to fetch only required fields.
- **Avoid N+1 Queries:** Retrieve related records efficiently using targeted population (`.populate()`) or aggregation pipelines instead of querying in nested loops.
- **Sensitive Fields:** Mark password and token fields `select: false` and strip them from JSON output.
- **Transactions:** Use transactions for multi-document operations that must succeed or fail together.

---

## 7. Application & API Security

- **Input Validation:** Validate and sanitize all incoming request bodies, query params, and route parameters with a schema validator (e.g., Zod or Joi) before any business logic executes. Reject unknown fields.
- **Mass Assignment:** Never pass `req.body` directly to `create` or `update`. Pick allowed fields explicitly.
- **NoSQL Injection:** Never build queries from raw user-supplied objects. Validate types and strip operator keys (`$ne`, `$gt`, etc.).
- **Authentication:** Use short-lived access tokens with refresh rotation. Prefer httpOnly, Secure, SameSite cookies over `localStorage`. Use generic login-failure messages to prevent user enumeration.
- **Authorization:** Enforce role and ownership checks on the server for every protected route and resource (prevent IDOR). Deny by default. Frontend route guards are UX only, never security.
- **Content Sanitization:** Sanitize all rich text, HTML, or user-supplied markdown before rendering to prevent Cross-Site Scripting (XSS). Never use `dangerouslySetInnerHTML` with unsanitized content.
- **Security Headers & CORS:** Keep Helmet enabled for standard security headers and pin CORS strictly to allowed client origins with credentials. Limit request body size.
- **Rate Limiting:** Protect authentication and write-heavy routes with IP-based rate limiting to prevent brute force attacks and request flooding.
- **Credential Protection:** Never store passwords or secrets in plain text; hash credentials with bcrypt (cost factor 12 or higher) or argon2. Never commit secrets or expose them in client bundles.
- **Dependencies:** Run `npm audit` regularly and keep dependencies updated.

---

## 8. Testing & Code Quality

- **Hermetic Testing:** Integration tests must run against isolated, in-memory databases (e.g., `mongodb-memory-server`) to ensure tests never depend on or mutate external data.
- **Test Placement:** Colocate tests next to the code they verify (e.g., `Component.test.jsx`, `user.service.test.js`).
- **Test Behavior:** Test behavior, not implementation. Query UI by role or label. Cover success, validation failure, 401, 403, and 404 paths for API routes.
- **Definition of Done:** A task is complete only when `npm run lint`, `npm run build`, and `npm test` all pass with zero errors or warnings.
- **No New Failures:** Never introduce new failing tests. If a test was already failing before your change, report it instead of hiding or deleting it.
- **Clean Code:** No dead code, commented-out blocks, or `console.log` in committed code. Comments explain why, not what.