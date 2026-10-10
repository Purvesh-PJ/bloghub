# Security Policy

## 🛡️ Supported Versions

Security updates are actively maintained on the `main` branch.

| Version | Supported |
| :--- | :--- |
| `main` / `v1.0.x` | ✅ Active Security Support |
| Older commits | ❌ Unsupported |

---

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **GitHub Security Advisory (Preferred):**  
   Navigate to the repository's **Security** tab → **Report a vulnerability** to start a private advisory thread.
2. **Email:**  
   Send details to [purvesh9997@gmail.com](mailto:purvesh9997@gmail.com) with `[SECURITY] BlogHub Vulnerability` in the subject.

Please allow up to 72 hours for an initial response before public disclosure.

---

## 🧱 Core Security Implementations

BlogHub incorporates strict security-by-default mechanisms across the stack:

1. **Stateless JWT with Revocation:** Dual-token model (15m access, 7d refresh) paired with an incrementable `tokenVersion` on the User document for instant multi-device session revocation.
2. **XSS Protection:** Markdown authoring passes through strict AST sanitization (`rehype-sanitize`) to prevent stored cross-site scripting attacks.
3. **HTTP Hardening:** Helmet security headers, CORS origin restrictions, and request body size caps (1 MB).
4. **Rate Limiting:** IP-throttled rate limiting on general API endpoints (300 req / 15m) and strict brute-force protection on `/api/auth` (10 failed attempts / 15m).
5. **No Secrets in Source:** Secrets are strictly loaded via `.env` files which are excluded from Git tracking.
