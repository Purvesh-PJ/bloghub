I recently completed and deployed **BlogHub**, a full-stack project I built as part of my learning journey.

This isn't a product built to solve a unique problem. I built it to **practice full-stack development, understand how different parts of a web application work together, and turn the concepts I was learning into a working application.**

### What I worked with

* **Architecture:** Decoupled 3-Tier Architecture (SPA ➔ Stateless API Gateway ➔ Persistence Tier)
* **Frontend:** React 19, Vite, TanStack Query v5, styled-components
* **Backend:** Node.js, Express.js (Layered REST API, Domain Services)
* **Database:** MongoDB & Mongoose (20 declared compound & unique indexes)
* **Other:** Jest & Supertest (In-memory DB testing), Vitest, Helmet, Rate limiting, Vercel

### What I learned

**End-to-End System Architecture:**
Designed a **3-Tier Architecture** with an independent React 19 SPA (Client Tier), stateless REST APIs through an Express.js Gateway (Application Tier), and an indexed MongoDB cluster (Persistence Tier). This helped me understand clean separation between presentation, business logic, and data persistence.

**Authentication, RBAC & API Defense:**
Implemented a dual-token lifecycle with short-lived access + refresh tokens, silent Axios 401 interceptors, and `tokenVersion` for multi-device session revocation. Also worked with rate limiting, input validation, and XSS-safe Markdown rendering.

**Database Schema Design & Concurrency:**
Separated high-frequency analytical events (views and reads) from core post documents to avoid document bloating and write contention. Used MongoDB compound unique indexes to handle race conditions at the database level instead of relying on application checks.

**Client State & Caching Architecture:**
Used TanStack Query v5 to separate server state from UI state, with caching, background refetching, and query invalidation instead of custom `useEffect` pipelines.

**Automated Testing & Verification:**
Built integration tests using Jest, Supertest, and `mongodb-memory-server`, running against an isolated in-memory database to verify API contracts without polluting persistent data.

The biggest takeaway for me was learning to think about **architectural trade-offs**, rather than just making things work—especially around decoupled architecture, authentication edge cases, and database concurrency.

Building this helped me understand the difference between **knowing a concept theoretically and actually making it work in a complete application.**

**Live:** https://bloghub-gold.vercel.app/
**GitHub:** https://github.com/Purvesh-PJ/bloghub

Still learning, building, and improving as a full-stack software engineer.
