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

### Option 2: Backend Concurrency & Load Testing (Next Target)
- **Problem:** MongoDB query latency and rate-limiter behaviors are unverified under concurrent load.
- **Candidate Tools:**
  - **k6:** Modular JavaScript scenarios testing RPS and response time percentiles on `/api/posts/trending` and `/api/search`.
  - **Autocannon:** Fast Node-based HTTP benchmarking tool.
- **Execution Target:** **Step 2 (Immediate)**.

### Option 3: Pre-Commit & Pre-Push Local Git Hooks
- **Problem:** Developers can accidentally commit unformatted files or broken tests.
- **Candidate Tools:** `husky` + `lint-staged`.
- **Execution Target:** Step 3.

### Option 4: End-to-End (E2E) Browser Testing
- **Problem:** RTL + JSDOM cannot test real browser layout rendering, cross-route browser cookies, or network interruption recovery.
- **Candidate Tools:** **Playwright** (multi-browser headless automation).
- **Execution Target:** Step 4.

### Option 5: Production Observability & Error Telemetry
- **Problem:** Express currently uses Morgan for console output. Production deployments require structured JSON logs and real-time crash alerting.
- **Candidate Tools:** **Pino** for structured JSON logging with request correlation IDs, **Sentry** for client/server error tracking.
- **Execution Target:** Step 5.

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

1. Keep ADR-0009 in **Draft** status while remaining non-functional areas (Options 2 through 8) are implemented iteratively.
2. **Option 1 (Frontend Performance & Bundle Size) is Completed**:
   - `rollup-plugin-visualizer` configured for on-demand bundle inspection.
   - `size-limit` configured with strict chunk limits.
   - `@lhci/cli` configured for automated Lighthouse audits.
3. Transition ADR-0009 to **Accepted** once baseline Load Testing (Option 2) and core telemetry are operational.

---

## 4. Consequences

### Positive
- Prevents over-engineering by tackling one non-functional concern at a time.
- Gives the team a persistent reference for all planned production tools.
- Immediate visibility into client bundle health before deploying production assets.

### Negative / Trade-offs
- Until all steps complete, certain gaps (such as lack of PR CI automation) remain temporarily manual.
