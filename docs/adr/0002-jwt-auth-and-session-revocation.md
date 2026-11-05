# ADR-0002: JWT Authentication and Session Revocation

- **Status:** Accepted
- **Date:** 2026-11-05
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

In standard JSON Web Token (JWT) implementations, tokens are completely "stateless". The server signs the token, and for as long as that token has not expired, anyone holding it has full access.

This creates a serious security problem:
- If an admin suspends a malicious account or demotes a user's permissions, the user still keeps their access until their token expires (which could be hours or days).
- If a user clicks "Logout from all devices" or their account is compromised, there is no way to cancel existing tokens without waiting for them to expire.

We needed a way to revoke tokens instantly without throwing away the benefits of JWT.

## 2. Options Considered

1. **Pure Stateless JWT (Single long-lived token):**
   - *Pros:* Zero database checks on API calls; extremely fast.
   - *Cons:* Impossible to revoke on demand. A banned user can keep writing posts until the token expires.

2. **Redis-Backed Token Blacklist:**
   - *Pros:* Tokens can be blacklisted instantly by saving revoked token IDs in a Redis cache with a TTL.
   - *Cons:* Adds a whole new piece of infrastructure (Redis cluster) just to handle logouts. Increases server hosting cost, complexity, and failure points.

3. **Dual-Token System with Live `tokenVersion` Check (Chosen):**
   - *Pros:* Short-lived 15-minute access token in memory + 7-day refresh token in HttpOnly cookie. Every authenticated request does one fast, indexed database lookup to verify `{ tokenVersion, suspended }`.
   - *Cons:* Authenticated API calls cost 1 indexed database query.

## 3. Decision Outcome

We chose **Option 3: Dual-token system with live `tokenVersion` verification in MongoDB.**

### How it works in BlogHub:
1. When a user logs in, they receive:
   - A short-lived **Access Token** (expires in 15 minutes) kept only in memory.
   - A long-lived **Refresh Token** (expires in 7 days) stored securely in an `HttpOnly`, `SameSite=Lax` cookie.
2. In MongoDB, every user document has an integer field: `tokenVersion: Number` (defaults to `0`).
3. Whenever an authenticated route is requested, the `authenticateUser` middleware:
   - Checks the token's cryptographic signature.
   - Runs a fast indexed query: `User.findById(userId).select('roles tokenVersion suspended').lean()`.
   - Rejects the request immediately if `suspended === true` or if `decoded.tokenVersion !== user.tokenVersion`.
4. When a user clicks "Logout All Devices" or is banned by an admin, we simply increment `tokenVersion` by `1` in MongoDB. All existing tokens become instantly invalid.

## 4. Consequences & Trade-offs

### Positive:
- **Instant Revocation:** Suspensions and logouts take effect in under 1 second.
- **No Redis Required:** We keep our infrastructure simple (just Node.js and MongoDB) without sacrificing security.
- **Role Accuracy:** If an administrator demotes a user from 'admin' to 'user', the change is respected on the very next request.

### Negative / Trade-offs:
- Authenticated endpoints incur 1 indexed read query per request. Because it only queries 3 fields on an indexed `_id` with `.lean()`, the overhead is typically less than 2 milliseconds in MongoDB.

