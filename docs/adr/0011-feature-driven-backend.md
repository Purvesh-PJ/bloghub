# ADR-0011: Modular Backend Architecture with Dedicated Core Infrastructure

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

BlogHub's backend was initially structured using a **Technical Layered Architecture (Package-by-Layer)**:

```text
backend/
├── controllers/    # 12 mixed domain controllers
├── routes/         # 11 route files
├── models/         # 9 Mongoose schemas
├── services/       # 4 business services
└── validators/     # auth, content, and user validation rules
```

As the application grew, this horizontal layering introduced friction:

1. **"Folder Jumping" Cognitive Overhead:** Making changes to a single domain required context-switching across 5–6 different root folders.
2. **Scattered Domain Colocation:** Tests, validation schemas, and database models were separated from the business logic and route definitions they serve.
3. **Leaky Middlewares:** Domain authentication and role guards were lumped together with generic HTTP transport middlewares.

---

## 2. Decision Outcome

We restructured `backend/` into **Node.js Modular Architecture under `backend/src/` with Dedicated Core Infrastructure**:

```text
backend/
├── package.json                  # Tooling & dependencies
├── jest.config.js                # Test runner configuration
├── scripts/                      # Seed, migration, and benchmark scripts
├── tests/                        # Global test harness (setup/env.js, observability)
│
└── src/                          # 100% Application Runtime Source Code
    ├── core/                     # Cross-cutting HTTP & technical infrastructure
    │   ├── errors/               # AppError, errorHandler
    │   ├── health/               # /health & /ready probes
    │   ├── logging/              # logger, requestLogger
    │   ├── security/             # generalLimiter, authLimiter
    │   ├── storage/              # Multer memory storage & validation
    │   ├── validation/           # express-validator runner & ObjectId validation
    │   ├── async/                # asyncHandler wrapper
    │   └── utils/                # regex, visitorKey algorithms
    │
    ├── modules/                  # Domain functional modules
    │   ├── auth/                 # Authentication, refresh rotation, guards
    │   ├── posts/                # Posts, slugs, tags, likes, search
    │   ├── comments/             # Comment threads and responses
    │   ├── users/                # Profiles, settings, followers
    │   ├── analytics/            # Telemetry, views, reads, trending
    │   └── admin/                # Moderation and administrative operations
    │
    ├── config/                   # db.js, env.js
    └── index.js                  # Application entry point
```

### Key Principles

1. **Modules Encapsulate Domains:** Each module in `modules/` encapsulates its routes, controllers, services, models, validators, and tests behind a public `index.js`.
2. **Infrastructure Colocation:** Technical concerns under `core/` group both utilities and middlewares together (e.g., `core/errors/` contains both `AppError` and `errorHandler`).
3. **Domain Ownership of Guards:** Security policy middlewares (`authenticateUser`, `authorizeSelfOrAdmin`) are owned and exported by `modules/auth`.
4. **Colocated Tests:** Integration and unit tests are colocated inside `__tests__/` alongside the code they test.
5. **Zero Breaking Changes:** REST contracts, routes, and response formats remain identical.
