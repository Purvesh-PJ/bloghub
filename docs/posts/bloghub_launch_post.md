I recently completed and deployed **BlogHub**, a hands-on full-stack project I built as part of my learning journey.

This isn't a product built to solve a unique problem. The main goal of this project was to **practice full-stack development, understand how different parts of a web application work together, and turn the concepts I was learning into a working application.**

### What I worked with

* Architecture: Decoupled 3-Tier Architecture (SPA ➔ Stateless API Gateway ➔ Persistence Tier)
* Frontend: React 19, Vite, TanStack Query v5, styled-components
* Backend: Node.js, Express.js (Layered REST API, Domain Services)
* Database: MongoDB & Mongoose (20 declared compound & unique indexes)
* Other: Jest & Supertest (In-memory DB testing), Vitest, Helmet, Rate limiting, Vercel

### What I learned through the project

* **End-to-End System Architecture:** I got hands-on experience designing and connecting a complete **3-Tier Architecture** — an independent React 19 SPA (Client Tier) communicating through stateless REST APIs with an Express.js Gateway (Application Tier), backed by an indexed MongoDB cluster (Persistence Tier). Keeping these layers decoupled helped me understand how presentation, business logic, and data persistence can stay cleanly separated instead of becoming a tightly coupled monolith.

* **Authentication, RBAC & API Defense:** I went beyond basic JWT authentication and worked through a dual-token lifecycle using short-lived access tokens and refresh tokens, with silent Axios 401 interceptors. I also implemented multi-device session revocation using a `tokenVersion` pattern, along with defensive layers such as rate limiting, input validation, and XSS-safe Markdown rendering.

* **Database Schema Design & Concurrency:** I learned why database design matters beyond just defining schemas. High-frequency analytical events like views and reads were separated from core post documents to avoid document bloating and write contention. I also used MongoDB compound unique indexes to handle race conditions at the database level instead of relying on racy application-level checks.

* **Client State & Caching Architecture:** I used TanStack Query v5 to separate server state from UI state, handling caching, background refetching, and query invalidation without building fragile custom `useEffect` pipelines.

* **Automated Testing & Verification:** I built integration test suites using Jest, Supertest, and `mongodb-memory-server`, running tests against an isolated in-memory database to verify API contracts without affecting persistent data.

One of the biggest takeaways from this project was **learning to think about architectural trade-offs rather than just making things work.**

For example, understanding why a decoupled 3-tier structure is worth the initial planning, why business logic belongs in domain services instead of being dumped into controllers, and why edge cases like token invalidation and database race conditions need to be handled at the system level.

Building BlogHub helped me understand the difference between **knowing a concept theoretically and actually making it work in a complete application.**

The project is live:
https://bloghub-gold.vercel.app/

GitHub:
https://github.com/Purvesh-PJ/bloghub

Continuing to learn, build, and improve as a full-stack software engineer.
