# ADR-0001: Separate Frontend and Backend Architecture

- **Status:** Accepted
- **Date:** 2026-11-05
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

BlogHub is a community publishing platform where writers draft articles in Markdown, interact with reader comments, and view reading analytics.

When building the platform, we needed to decide how to structure the relationship between the user interface (frontend) and the server logic (backend):
- Should we build a single monolithic app using server-rendered templates (like Next.js or EJS)?
- Or should we decouple the project into an independent React Single Page Application (SPA) communicating with a standalone Express REST API?

## 2. Options Considered

1. **Monolithic Server-Side Rendering (Next.js / Remix):**
   - *Pros:* Excellent SEO out of the box, faster initial HTML render.
   - *Cons:* Tight coupling of frontend framework with backend runtime, complex deployment hosting requirements, and harder to plug in alternative clients (e.g., future mobile apps) later.

2. **Server-Rendered Templates (Express + EJS / Pug):**
   - *Pros:* Simple architecture, single deployment target.
   - *Cons:* Poor interactive experience for rich authoring studios; every edit or filter requires a full page reload or messy inline jQuery/vanilla scripts.

3. **Decoupled React 19 SPA + Express 4 REST API (Chosen):**
   - *Pros:* Clear separation of concerns, rich client-side interactivity, fast local state and cache management via TanStack Query, independent deployability.
   - *Cons:* Client-side hydration overhead, SEO for articles requires dedicated open-graph meta tags or prerendering later.

## 3. Decision Outcome

We decided on **Option 3: A decoupled React 19 SPA powered by Vite, interacting with a standalone Node.js / Express REST API.**

### Key Reasons:
- **Rich Editor Experience:** Authors need a live preview Markdown editor (`@uiw/react-md-editor`) that responds immediately without round-trips to the server.
- **Client-Side Telemetry:** Features like `useReadTracking` (which measures viewport scroll depth and dwell time) live naturally in the browser lifecycle.
- **Independent Evolution:** The backend is a pure REST API. If we ever build a CLI tool or mobile app in the future, the exact same API endpoints will serve them without any backend redesign.

## 4. Consequences & Trade-offs

### Positive:
- The frontend and backend can be developed, tested, and scaled completely independently.
- Fast, fluid transitions between the 18 application routes without whole-page refreshes.
- Frontend state is cleanly handled by TanStack Query v5 with optimistic UI updates.

### Negative / Trade-offs:
- Public search engines cannot read dynamically loaded JavaScript as easily as raw HTML. To solve article SEO down the road, we will need static prerendering or dynamic OpenGraph generation.
- Users on slower devices must download the JavaScript bundle on first visit (mitigated by Vite code-splitting).

