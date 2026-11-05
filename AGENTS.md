# MERN Stack Engineering Rules

These rules define standard industry best practices for building and maintaining applications using the MERN stack (MongoDB, Express, React, Node.js). Each section has a single, dedicated responsibility.

---

## 1. React & Client-Side Architecture

- **Functional Components:** Use functional components exclusively with modern React hooks; do not use class components.
- **Separation of Concerns:** Keep UI presentation separate from business logic. Extract complex state, side effects, and API calls into custom hooks.
- **Server vs Local State:** Use specialized cache libraries (e.g., TanStack Query) for server state; do not manually duplicate server responses into local `useState`.
- **Component Colocation:** Colocate tightly coupled components, helper utilities, and tests close to where they are used rather than scattering them across arbitrary global directories.
- **Single Responsibility:** Keep components small, composable, and focused on one visual or behavioral task.

---

## 2. Express & Node.js API Architecture

- **Thin Controllers:** Keep controllers thin; their only job is to extract request parameters, call the service layer, and return HTTP responses.
- **Dedicated Service Layer:** Place all business logic, external API calls, and calculations inside reusable service modules.
- **Centralized Error Handling:** Never handle errors with ad-hoc response sends in try/catch blocks; pass errors to next (`next(err)`) and handle them via central Express error middleware.
- **Asynchronous Execution:** Use `async/await` consistently and ensure all asynchronous operations are properly awaited or wrapped with an async handler.
- **Consistent Responses:** Always use standard HTTP status codes (200, 201, 400, 401, 403, 404, 409, 500) and return predictable JSON payload shapes `{ success, data, message }`.

---

## 3. MongoDB & Mongoose Data Layer

- **Strict Schema Definitions:** Always define explicit Mongoose schemas with strict types, required fields, and built-in validators.
- **Database-Level Integrity:** Enforce data constraints (e.g., uniqueness, foreign references) at the database layer with indexes, not solely in application code.
- **Index Optimization:** Create explicit single-field and compound indexes for fields used in queries, filtering, or sorting.
- **Query Performance:** Use `.lean()` on read-only queries to bypass Mongoose document hydration overhead when update methods are not needed.
- **Avoid N+1 Queries:** Retrieve related records efficiently using targeted population (`.populate()`) or aggregation pipelines instead of querying in nested loops.

---

## 4. Application & API Security

- **Input Validation:** Validate and sanitize all incoming request bodies, query params, and route parameters before any business logic executes.
- **Content Sanitization:** Sanitize all rich text, HTML, or user-supplied markdown before rendering to prevent Cross-Site Scripting (XSS).
- **Security Headers & CORS:** Keep Helmet enabled for standard security headers and pin CORS strictly to allowed client origins with credentials.
- **Rate Limiting:** Protect authentication and write-heavy routes with IP-based rate limiting to prevent brute force attacks and request flooding.
- **Credential Protection:** Never store passwords or secrets in plain text; hash credentials using bcrypt with appropriate salt rounds.

---

## 5. Testing & Code Quality

- **Hermetic Testing:** Integration tests must run against isolated, in-memory databases (e.g., `mongodb-memory-server`) to ensure tests never depend on or mutate external data.
- **Test Placement:** Colocate unit and component tests directly adjacent to the code they verify in dedicated `__tests__/` directories.
- **Non-Breaking Changes:** Never consider a task complete without running and verifying that all tests pass (`npm test`).
- **Static Analysis:** Maintain clean code standards with zero linter errors or warnings (`npm run lint`).

