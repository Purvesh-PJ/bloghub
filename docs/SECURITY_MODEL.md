# Security Model

This document lists the protections BlogHub has and the known trade-offs. For how login and sessions work in detail see [Authentication](AUTHENTICATION.md).

## Protections

Each row is one protection, how it works, and what it is meant to stop.

| Layer                 | What we do                                                                                                                                   | What it protects against                                       |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| Proxy and headers     | `trust proxy` set to one hop, and Helmet security headers (Content-Security-Policy, `nosniff`, `X-Frame-Options`, Strict-Transport-Security) | Wrong client IPs behind proxies, clickjacking, MIME sniffing   |
| CORS                  | Only `CLIENT_URL` is allowed, with credentials                                                                                               | Other websites calling the API from a user's browser           |
| Rate limiting         | 10 login attempts and 300 API calls per 15 minutes, per IP                                                                                   | Password guessing, credential stuffing, request flooding       |
| Constant-time login   | A dummy hash is checked for unknown emails                                                                                                   | Finding out which emails are registered by timing the response |
| Markdown sanitizing   | `rehype-sanitize` on rendered posts, plus server-side sanitization                                                                           | Malicious scripts hidden in post content (stored XSS)          |
| Session revocation    | `tokenVersion` checked against the database on every protected request                                                                       | Stolen or old tokens, delayed effect of suspensions            |
| Unique indexes        | `{ post, user }` is unique on likes, and similar rules elsewhere                                                                             | Duplicate likes or follows from simultaneous requests          |
| Privacy-safe tracking | Anonymous visitors are hashed with HMAC, and logs mask passwords, tokens, and authorization headers                                          | Storing raw IP addresses or secrets                            |

If the app runs behind a reverse proxy, the proxy must forward `X-Forwarded-For` and `X-Forwarded-Proto`. See [Deployment](DEPLOYMENT.md).

## Known trade-offs

- **Tokens live in `localStorage`.** This is simple and works well with a separate frontend, but any successful XSS attack could read them. That is why the Markdown sanitizing above matters so much. A common alternative is to keep the refresh token in an `httpOnly` cookie, which JavaScript cannot read.
- **One extra database read per protected request.** This is the cost of instant revocation. If traffic grows, a short-lived cache for `tokenVersion` can reduce the load, at the price of a small delay before a revocation takes effect.
