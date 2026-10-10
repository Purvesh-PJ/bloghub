# System Design & Architecture

> High-level system architecture, request lifecycles, authentication model, and core engineering decisions across BlogHub.

---

## 🏗️ System Overview

BlogHub is architected as a decoupled full-stack platform consisting of a React SPA frontend, an Express REST API backend, and a MongoDB persistence layer.

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (React 19 + Vite)"]
        UI["UI / Radix Primitives"]
        Query["TanStack Query (Server State Cache)"]
        Axios["Axios Interceptor (Auth & Token Refresh)"]
        UI --> Query --> Axios
    end

    subgraph Gateway["API Layer (Express 4)"]
        Security["Security Middlewares (Helmet, CORS, RateLimit)"]
        AuthMiddleware["Auth Middleware (JWT + tokenVersion verify)"]
        Controllers["Resource Controllers (Post, User, Read)"]
        Security --> AuthMiddleware --> Controllers
    end

    subgraph Persistence["Data Layer"]
        MongoDB[("MongoDB 6.0+ (Mongoose ODM)")]
    end

    Axios -->|REST / JSON| Security
    Controllers -->|Mongoose Queries| MongoDB
```

---

## 🔐 Authentication & Session Mechanics

BlogHub uses stateless dual-token JWT authentication with an instant revocation mechanism:

1. **Access Token:** Short-lived (`15m`), sent via `Authorization: Bearer <token>` header.
2. **Refresh Token:** Long-lived (`7d`), used to rotate expired access tokens via `/api/auth/refresh`.
3. **Instant Revocation (`tokenVersion`):**
   - Every `User` record holds an integer `tokenVersion`.
   - Both tokens are stamped with this version.
   - When a user logs out from all devices, resets password, or gets demoted by an admin, `tokenVersion` increments (`+1`).
   - All previously issued tokens become immediately invalid without needing a stateful blacklist.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Client
    participant API as Express API
    participant DB as MongoDB

    User->>Client: Login (email, password)
    Client->>API: POST /api/auth/login
    API->>DB: Verify credentials & read tokenVersion
    API-->>Client: Returns { accessToken, refreshToken, user }
    
    Note over Client,API: Subsequent Authenticated Requests
    Client->>API: GET /api/posts (with Access Token)
    API->>API: Verify JWT signature & tokenVersion
    API->>DB: Query requested data
    API-->>Client: 200 OK + Payload

    Note over Client,API: Token Expiration Flow
    Client->>API: GET /api/dashboard (Expired Access Token)
    API-->>Client: 401 Unauthorized (jwt expired)
    Client->>API: POST /api/auth/refresh (with Refresh Token)
    API->>DB: Fetch user.tokenVersion & match token claim
    API-->>Client: 200 OK + New Access Token
    Client->>API: Retry original request
```

---

## ⚖️ Key Architectural Decisions (ADRs)

### 1. Stateless Auth with `tokenVersion` vs Server-Side Sessions
- **Context:** Needed scalable auth that works well in both containerized and serverless environments.
- **Decision:** Dual-token JWT with an integer `tokenVersion` on the User document.
- **Outcome:** Zero Redis/Session infrastructure needed initially, while retaining instant revocation capabilities.

### 2. TanStack Query v5 for Server-Side State
- **Context:** Managing data fetching, caching, loading states, and optimistic updates across the SPA.
- **Decision:** TanStack Query instead of Redux/Zustand.
- **Outcome:** Eliminated complex boilerplate; automatic cache deduplication, background re-validation, and smooth UI transitions.

### 3. In-Memory MongoDB for Automated Testing
- **Context:** Integration tests must be isolated, fast, and runnable in CI without external database dependencies.
- **Decision:** `mongodb-memory-server` in Jest test suites.
- **Outcome:** Clean DB state per test suite, 0 mock-drift risk, completely self-contained CI execution.

### 4. Read-Through Tracking with Visitor Deduplication
- **Context:** Accurate reading metrics without double-counting fast page refreshes.
- **Decision:** Compound index on `[post, visitorKey, createdAt]` to de-duplicate repeat visits within reading sessions.
