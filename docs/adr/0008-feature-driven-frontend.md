# ADR-0008: Feature-Driven Frontend Architecture

- **Status:** Accepted
- **Date:** 2026-11-06
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

BlogHub's client is a React 19 Single Page Application (SPA) containing 18 distinct route views, markdown authoring tools, reader telemetry, threaded discussions, and an administration console.

Initially, the client was organized using a **Technical Layered Architecture**:
```
client/src/
├── components/      # Mixed UI primitives, layout, posts, stats, marketing
├── context/         # AuthContext and ThemeProvider
├── guards/          # ProtectedRoute and AdminRoute
├── hooks/           # useDraftRecovery, useDebounced, useReading, useCurrentUser
├── pages/           # All 18 route page components
└── services/        # API clients and queryKeys
```

As the application grew, this layered structure introduced significant friction:
1. **"Folder Jumping" Cognitive Overhead:** Making a change to a single feature (for example, authoring posts or user profile settings) required jumping back and forth between `pages/`, `components/posts/`, `hooks/`, `services/`, and test folders.
2. **Blurred Domain Boundaries:** There was no clear encapsulation of domain-specific logic. Any component could freely import deep, private helpers or services from any other layer without an explicit public contract.
3. **Scattered Tests:** Tests were decoupled from their domain implementations, making it difficult to assess test coverage or refactor a domain cleanly.
4. **Difficult Deletions / Maintenance:** Deleting or replacing a feature required hunting down scattered files across six separate directories.

We needed an architecture that optimizes for domain cohesion, maintainability, and clean boundaries.

---

## 2. Options Considered

### Option 1: Maintain Technical Layered Architecture
- *Pros:* Familiar to developers used to basic starter templates; all pages in one folder, all hooks in another.
- *Cons:* Low cohesion; violates the principle of "colocate things that change together"; high cognitive fatigue during feature development.

### Option 2: Full Feature-Sliced Design (FSD)
- *Pros:* Standardized and highly structured with strict dependency flow (`app` -> `pages` -> `widgets` -> `features` -> `entities` -> `shared`).
- *Cons:* Excessive boilerplate, high learning curve, and overly verbose folder hierarchies for a fast-moving, medium-sized application.

### Option 3: Feature-Driven Architecture with Domain Colocation (Chosen)
- *Pros:* High cohesion, domain isolation, colocation of components, pages, hooks, services, and tests inside domain packages (`src/features/<feature>/`). Cross-domain imports are accessed cleanly via feature entry points (`index.js`). Truly shared primitives (buttons, layout, generic helpers) remain in global shared directories (`components/ui`, `components/layout`, `config`, `utils`).
- *Cons:* Requires team discipline to import across features via public barrel exports (`index.js`) rather than reaching into private internals.

---

## 3. Decision Outcome

We decided on **Option 3: Feature-Driven Architecture with Domain Colocation**.

All domain-specific code is grouped under `client/src/features/` into six core domains:

```
client/src/features/
├── admin/          # Admin console (Dashboard, Users, Posts, Tags, Activity)
├── analytics/      # Reading telemetry, dwell tracking, read rate bars
├── auth/           # Login, Register, AuthContext, Route Guards, auth services
├── comments/       # Discussion responses and comment services
├── posts/          # Home feed, PostDetail, WritePost, Stories, Search, draft hooks
└── users/          # UserProfile, Settings, Dashboard, user services
```

### Colocation Structure within each Feature
Each feature encapsulates its own lifecycle and dependencies:
```
features/<domain>/
├── components/     # Domain-specific UI components
├── hooks/          # Domain-specific custom hooks
├── pages/          # Domain route view components
├── services/       # Domain Axios API clients
├── __tests__/      # Colocated Vitest unit and integration tests
└── index.js        # Public API / barrel export for other features and App.jsx
```

### Shared / Foundation Code
Truly universal, domain-agnostic code lives outside `features/`:
- `client/src/components/ui/` — Generic UI design system components (Radix UI wrappers, Button, Dialog, Skeleton, etc.).
- `client/src/components/layout/` — Global application shell (`Header`, `Footer`, `WorkspaceLayout`, `NotFound`).
- `client/src/config/` — Global API client instance (`api.js`) and centralized TanStack Query cache keys (`queryKeys.js`).
- `client/src/styles/` — Global styling and `ThemeProvider`.
- `client/src/utils/` — Generic helpers (formatting, date calculations, validation utilities).
- `client/src/test/` — Shared test utilities and custom renderers.

---

## 4. Consequences & Trade-offs

### Positive:
- **Maximum Cohesion:** Everything required to understand, develop, and test a feature (e.g. `posts`) is located in one self-contained directory.
- **Easy Refactoring & Deletion:** A feature can be modified or deleted without fear of leaving orphaned files across disparate folders.
- **Explicit Public Contracts:** Features expose their public components, hooks, and services through `index.js`, preventing leaky internal abstractions.
- **Colocated Testing:** Unit and component tests live directly next to the code they verify in `__tests__/`, streamlining TDD and code review.

### Trade-offs & Rules:
- **No Circular Feature Dependencies:** Feature A should not depend on Feature B if Feature B also depends on Feature A. Shared primitives must be elevated to `components/` or `config/`.
- **Barrel Imports:** Cross-feature imports should import from the feature root (e.g. `import { useCurrentUser } from '../features/users'`) rather than reaching deep into private files.

