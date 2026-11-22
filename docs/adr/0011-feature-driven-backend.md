# ADR-0011: Feature-Driven Modular Backend Architecture

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
1. **"Folder Jumping" Cognitive Overhead:** Making changes to a single domain (such as Posts or User Settings) required context-switching across 5–6 different root folders (`routes/`, `controllers/`, `services/`, `models/`, `validators/`).
2. **Scattered Domain Colocation:** Tests, validation schemas, and database models were separated from the business logic and route definitions they serve.
3. **Full-Stack Architectural Disconnect:** The client application was previously reorganized into a Feature-Driven Architecture ([ADR-0008](0008-feature-driven-frontend.md)). The backend's horizontal layering caused unnecessary mental overhead when switching between frontend and backend.

---

## 2. Options Considered

### Option 1: Maintain Technical Layered Architecture
- *Pros:* Standard boilerplate for beginner Express applications.
- *Cons:* High cognitive overhead; low domain cohesion; difficult to isolate or refactor features.

### Option 2: Full Microservices Split
- *Pros:* Complete physical separation of deployables.
- *Cons:* Extreme operational complexity, network latency, distributed transactions, and overhead unwarranted for a medium-sized application.

### Option 3: Feature-Driven Modular Architecture (Chosen)
- *Pros:* High cohesion with vertical slices (`backend/features/<domain>/`). Each domain colocates its routes, controllers, services, models, and validators behind a clean public barrel export (`index.js`). Cross-feature dependencies are explicit and controlled.
- *Cons:* Requires discipline to avoid circular barrel imports by requiring models directly or decoupling shared validation primitives into shared middleware.

---

## 3. Decision Outcome

We decided on **Option 3: Feature-Driven Modular Architecture**.

All domain-specific backend code is organized under `backend/features/`:

```text
backend/
├── config/                     # Global db and env configuration
├── middlewares/                # Shared Express middlewares (auth, upload, validate)
├── utils/                      # Shared utility helpers (AppError, logger, visitor)
│
├── features/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── index.js
│   ├── posts/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── index.js
│   ├── comments/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── index.js
│   ├── users/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── index.js
│   ├── analytics/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   └── admin/
│       ├── controllers/
│       └── index.js
│
└── index.js                    # Express app mounting feature routes
```

### Key Rules
1. **Barrel Exports:** Every feature exposes a public interface via its `index.js`.
2. **Circular Dependency Prevention:** Data models (`*.model.js`) remain pure Mongoose schemas and are imported directly across features to prevent circular route/controller execution during module bootstrap.
3. **Shared Validation Primitives:** Cross-cutting rules (like `paginationRules`) are housed in shared middlewares (`backend/middlewares/validate.js`).
