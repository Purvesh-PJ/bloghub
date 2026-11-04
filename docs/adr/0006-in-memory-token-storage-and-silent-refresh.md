# ADR-0006: In-Memory Access Token Storage with Silent 401 Refresh

- **Status:** Accepted
- **Date:** 2026-11-05
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

In single-page React applications, storing authentication tokens securely is notoriously tricky:
- If you store JWTs in browser `localStorage` or `sessionStorage`, any Cross-Site Scripting (XSS) vulnerability or malicious npm dependency can run `localStorage.getItem('token')` and steal the user's account permanently.
- If you store the access token only in JavaScript memory, the token is safe from XSS, but it disappears whenever the user refreshes the page, and it expires after 15 minutes mid-session.

We needed a strategy that keeps the access token 100% immune to XSS theft while providing a seamless, zero-interruption user experience.

## 2. Options Considered

1. **Store Tokens in `localStorage`:**
   - *Pros:* Survives page refreshes; trivial to implement (`localStorage.getItem`).
   - *Cons:* Extremely vulnerable to XSS attacks. If any 3rd party script or Markdown parser has a vulnerability, all logged-in user tokens can be silently exfiltrated.

2. **All Tokens in `HttpOnly` Cookies:**
   - *Pros:* JavaScript cannot read `HttpOnly` cookies, preventing direct XSS token theft.
   - *Cons:* Vulnerable to Cross-Site Request Forgery (CSRF) unless strict anti-CSRF tokens are configured on every POST/PUT/DELETE request.

3. **In-Memory Access Token + HttpOnly Refresh Cookie + Axios Interceptor (Chosen):**
   - *Pros:* Access token lives in a JavaScript singleton variable (`authState`); completely unreachable by malicious scripts reading `localStorage`. Refresh token lives in an `HttpOnly`, `SameSite=Lax` cookie. Axios silently catches 401 responses, refreshes the token, and replays failed requests without the user noticing.
   - *Cons:* On full page refresh, the app must execute a quick handshake call (`/api/auth/refresh`) to restore the in-memory session.

## 3. Decision Outcome

We chose **Option 3: In-Memory Access Token with an Axios 401 Interceptor.**

### How it works in BlogHub:
1. **Zero Tokens on Disk:** The 15-minute access token is stored purely in memory inside `client/src/services/api.js`.
2. **Safe Refresh Token:** The 7-day refresh token is delivered by the backend as an `HttpOnly`, `Secure` (in prod), `SameSite=Lax` cookie. JavaScript in the browser cannot read this cookie.
3. **Transparent 401 Retry Loop:**
   - When the 15-minute access token expires while a user is actively reading or drafting an article, the next API request fails with a `401 Unauthorized` status.
   - Our Axios response interceptor intercepts the `401`.
   - Instead of logging the user out or crashing the screen, Axios pauses all outgoing requests in a queue.
   - It makes a silent request: `POST /api/auth/refresh` (the browser automatically includes the HttpOnly cookie).
   - Once the new 15-minute access token arrives, Axios saves it into memory and replays all paused requests with the new token.
   - The user never notices anything happened.

## 4. Consequences & Trade-offs

### Positive:
- **Maximum XSS Security:** An attacker injecting JavaScript cannot steal access tokens from `localStorage` because none exist there.
- **Zero Interruption:** Users are never abruptly kicked to a login screen in the middle of writing a long post.
- **Auto-Sync:** Token refresh is completely automated at the HTTP client boundary; feature components never have to write token refresh logic.

### Negative / Trade-offs:
- When a user presses `F5` (hard page reload), memory is wiped. The React app must run a quick initialization query on mount (`auth/refresh`) to restore the user session before rendering protected screens.

