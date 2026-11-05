# Architecture Decision Records (ADRs)

This directory documents the key architectural decisions made in BlogHub. Each record captures the context, options considered, decisions made, and their consequences.

## Index of Decisions

| ADR | Title | Status | Date |
| :--- | :--- | :--- | :--- |
| [ADR-0001](0001-decoupled-react-spa-and-express-api.md) | Decoupled React 19 SPA and Express API Architecture | **Accepted** | 2026-11-05 |
| [ADR-0002](0002-dual-token-auth-with-live-revocation.md) | Dual-Token Authentication with Live Database Revocation | **Accepted** | 2026-11-05 |
| [ADR-0003](0003-compound-indexes-for-concurrency.md) | Compound Unique Indexes for Race Condition Prevention | **Accepted** | 2026-11-05 |
| [ADR-0004](0004-14-day-weighted-trending-formula.md) | 14-Day Rolling Window Weighted Trending Score Formula | **Accepted** | 2026-11-05 |
| [ADR-0005](0005-privacy-preserving-telemetry-deduplication.md) | Privacy-Preserving Salted HMAC Telemetry & Dwell Tracking | **Accepted** | 2026-11-05 |
| [ADR-0006](0006-in-memory-token-storage-and-silent-refresh.md) | In-Memory Access Token Storage with Silent 401 Refresh | **Accepted** | 2026-11-05 |
| [ADR-0007](0007-in-memory-mongodb-testing-strategy.md) | In-Memory MongoDB Testing Architecture (`mongodb-memory-server`) | **Accepted** | 2026-11-05 |
| [ADR-0008](0008-feature-driven-frontend-architecture.md) | Feature-Driven Frontend Architecture & Domain Colocation | **Accepted** | 2026-11-06 |

---

## What is an ADR?

An **Architecture Decision Record (ADR)** is a lightweight document that records a significant architectural decision along with its context and trade-offs.

When someone joins the project or revisits a feature months later, these documents explain **why** the system was built this way, saving teams from second-guessing or accidentally undoing sound decisions.

