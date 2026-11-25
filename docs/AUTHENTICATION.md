# Authentication

This document explains how login works, how expired tokens are refreshed, and how a user's sessions can be ended instantly. For the other protections in the app see [Security Model](SECURITY_MODEL.md).

## How it works

Login uses two tokens:

- an **access token** that lasts 15 minutes and is sent with every API call;
- a **refresh token** that lasts 7 days and is only used to get a new pair.

Each user also has a number called `tokenVersion`, stored both in the token and in the database. If the two numbers do not match, the token is rejected. To log a user out everywhere, the server simply increases the number in the database. This happens when a user changes their password or an admin suspends the account.

The diagram shows three moments: signing in, silently refreshing an expired token, and revoking all sessions.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React app (Axios)
    participant Gateway as Express API
    participant DB as MongoDB (Users)

    Note over User,DB: 1. Sign in
    User->>Client: Submits email and password
    Client->>Gateway: POST /api/auth/login
    activate Gateway
    Gateway->>DB: Find user by email, verify Bcrypt hash
    activate DB
    DB-->>Gateway: User record (roles, tokenVersion=1, suspended=false)
    deactivate DB
    Gateway-->>Client: 200 OK + accessToken (15m), refreshToken (7d)
    deactivate Gateway
    Client->>Client: Store tokens in localStorage

    Note over User,DB: 2. Silent token refresh (Axios 401 interceptor)
    Client->>Gateway: GET /api/posts/mine (expired access token)
    activate Gateway
    Gateway-->>Client: 401 Unauthorized (jwt expired)
    deactivate Gateway
    Client->>Gateway: POST /api/auth/refresh (refresh token)
    activate Gateway
    Gateway->>DB: Check tokenVersion matches and user is not suspended
    activate DB
    DB-->>Gateway: Account valid
    deactivate DB
    Gateway-->>Client: 200 OK + new accessToken, refreshToken
    deactivate Gateway
    Client->>Gateway: Replay GET /api/posts/mine with new access token
    activate Gateway
    Gateway-->>Client: 200 OK (author stories)
    deactivate Gateway

    Note over User,DB: 3. Instant session revocation
    User->>Client: Changes password (or an admin suspends the account)
    Client->>Gateway: PUT /api/settings/password
    activate Gateway
    Gateway->>DB: Update password and increase tokenVersion
    activate DB
    DB-->>Gateway: tokenVersion is now 2
    deactivate DB
    Gateway-->>Client: 200 OK
    deactivate Gateway
    Note over Gateway,DB: Old tokens still carry tokenVersion=1, so any later request on any device is rejected.
```

## What this design gives us

- **Instant kill switch.** The server compares `tokenVersion` and `suspended` with the database on every protected request, so a suspended or password-changed account loses access right away, on every device.
- **No hint about which emails exist.** If an email is not registered, the login code still checks the password against a fixed dummy hash. A wrong email and a wrong password take the same time to answer, so an attacker cannot tell them apart by measuring response time.
