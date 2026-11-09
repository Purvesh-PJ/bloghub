# ADR-0009: Non-Functional Tooling and Performance Roadmap

- **Status:** Draft
- **Date:** 2026-11-06 (Updated 2026-11-08)
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

BlogHub currently has comprehensive functional tests (backend Jest unit and integration suites with in-memory MongoDB; client Vitest and React Testing Library suites) and static code checks (ESLint 9, custom design system token lint rules, Prettier).

However, functional tests only prove correctness under single-user, isolated test conditions. They do not address non-functional production requirements:
- Asset bundle size and client loading latency.
- Backend throughput and P95/P99 latency under concurrent traffic.
- Automated CI quality gates on PRs.
- Real browser end-to-end user journeys.
- Structured logging and production error telemetry.

Implementing all non-functional tools simultaneously is impractical. We need a single decision record listing evaluated tool options so we can adopt them incrementally, starting with client asset optimization.

---

## 2. Evaluated Tooling Options

### Option 1: Frontend Performance & Bundle Size (Implemented & Active)
- **Problem:** Rich markdown editor (`@uiw/react-md-editor`), syntax highlighter (`rehype-prism-plus`), and Radix primitives can inflate client bundle size, slowing initial page load on mobile devices.
- **Tools Implemented:**
  - `rollup-plugin-visualizer`: Generates interactive HTML bundle treemaps via `npm run build:analyze` (`client/dist/stats.html`).
  - `size-limit`: Enforces strict brotlied bundle budgets on every build via `npm run size` (`client/.size-limit.json`).
  - `@lhci/cli` (Lighthouse CI): Runs automated audits on a preview server via `npm run lighthouse` (`client/lighthouserc.json`).
- **Post-Audit Optimization Results (2026-11-08):**
  - Performance: **97%** (up from 89%, achieved via route code-splitting and layout decoupling in #15).
  - Accessibility: **100%** (up from 93%, achieved via contrast tuning and sequential headings in #14).
  - SEO: **100%** (up from 91%, achieved via `robots.txt` implementation in #13).
  - Best Practices: **96%**.
- **Execution Target:** **Completed**. Integrated into root and client scripts.

### Option 2: Backend Concurrency & Load Testing (Implemented & Active)
- **Problem:** MongoDB query latency, aggregation bottlenecks, and rate-limiter behaviors are unverified under concurrent load.
- **Tools Implemented:**
  - `autocannon`: Fast Node-based HTTP benchmarking tool integrated with an isolated, hermetic ephemeral server runner (`backend/scripts/load-test.js`) executed via `npm run test:load`.
- **Post-Benchmark Optimizations (2026-11-09):**
  - **Health Baseline (`/api/health`):** 6,851 req/sec | p95 latency: 12 ms | 0 errors.
  - **Trending Posts Query (`/api/posts/trending`):** Discovered severe aggregation bottleneck (35 req/sec, p95: 1,866ms). Optimized with 60-second in-memory TTL caching with automatic 0ms bypass in Jest test mode. Result: **3,713 req/sec** (~100x speedup), p95 latency **17 ms**, 0 errors.
  - **Search Query (`/api/search/:query`):** Discovered unindexed full-collection regex scans. Optimized with MongoDB compound text index on `{ title: 'text', content: 'text' }` (weights 10 and 2) and `{ tags: 1 }`, paired with indexed `$text` search and regex fallback. Result: **686 req/sec**, p95 latency **97 ms** (under 100ms budget), 0 errors.
- **Execution Target:** **Completed**. Integrated into root and backend scripts.

### Option 3: Pre-Commit & Pre-Push Local Git Hooks (Next Target)
- **Problem:** Developers can accidentally commit unformatted files or broken tests.
- **Candidate Tools:** `husky` + `lint-staged`.
- **Execution Target:** Step 3 (Immediate).

### Option 4: End-to-End (E2E) Browser Testing
- **Problem:** RTL + JSDOM cannot test real browser layout rendering, cross-route browser cookies, or network interruption recovery.
- **Candidate Tools:** **Playwright** (multi-browser headless automation).
- **Execution Target:** Step 4.

### Option 5: Production Observability & Error Telemetry (Implemented & Active)
- **Problem:** Express previously relied on synchronous `console.log` and lacked machine-readable logs, request tracing, and automated PII redaction.
- **Tools Implemented:**
  - `pino` & `pino-http`: High-throughput asynchronous JSON logging (`backend/utils/logger.js`, `backend/middlewares/requestLogger.js`).
  - Automated `x-request-id` header assignment on every response for distributed request tracing.
  - Automatic PII redaction for passwords, JWT tokens, cookies, and authorization headers.
  - Structured error logging in `errorHandler.js` attaching error stack traces to `reqId`.
  - Silent logging in Jest test mode to prevent test report pollution.
- **Execution Target:** **Completed**. Integrated across backend middlewares, errors, and configuration.

### Option 6: Automated Security & Dependency Scanning
- **Problem:** Vulnerable packages or committed secrets could slip into release branches.
- **Candidate Tools:** `npm audit` automated checks, GitHub Dependabot, and GitLeaks / Trivy.
- **Execution Target:** Step 6.

### Option 7: Database Query Profiling
- **Problem:** Complex aggregations in post analytics and activity feeds lack automated slow-query detection.
- **Candidate Tools:** MongoDB built-in profiler + automated query explain tests.
- **Execution Target:** Step 7.

### Option 8: CI/CD Automated Quality Gates (Final Integration)
- **Problem:** Pull requests have no automated verification until pipeline is deployed.
- **Candidate Tools:** GitHub Actions workflow (`.github/workflows/ci.yml`) running `lint`, `format:check`, `test`, `size`, and `build`.
- **Execution Target:** Step 8 (Final step, integrating all preceding tools).

---

## 3. Decision

1. Keep ADR-0009 in **Draft** status while remaining non-functional areas (Options 3 through 8) are implemented iteratively.
2. **Option 1 (Frontend Performance & Bundle Size) is Completed**:
   - `rollup-plugin-visualizer` configured for on-demand bundle inspection.
   - `size-limit` configured with strict chunk limits.
   - `@lhci/cli` configured for automated Lighthouse audits.
3. **Option 2 (Backend Concurrency & Load Testing) is Completed**:
   - `autocannon` benchmark harness configured via `npm run test:load`.
   - Trending query aggregation cached with 60-second TTL (35 -> 3,713 RPS).
   - Post search indexed with compound full-text and tag indexes (p95: 97ms).
4. **Option 5 (Production Observability & Error Telemetry) is Completed**:
   - `pino` and `pino-http` configured for asynchronous structured JSON logging.
   - Request correlation IDs (`x-request-id`) attached to all HTTP responses.
   - PII redaction and centralized error logging active across backend.
5. Transition ADR-0009 to **Accepted** once baseline local git hooks (Option 3) and remaining non-functional tools are operational.

---

## 4. Consequences

### Positive
- Prevents over-engineering by tackling one non-functional concern at a time.
- Gives the team a persistent reference for all planned production tools.
- Immediate visibility into client bundle health before deploying production assets.

### Negative / Trade-offs
- Until all steps complete, certain gaps (such as lack of PR CI automation) remain temporarily manual.
