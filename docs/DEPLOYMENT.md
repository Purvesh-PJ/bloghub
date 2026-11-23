# Deployment Guide

This guide describes how to build, configure, and operate BlogHub in production.

---

## Production Architecture

BlogHub is deployed as a decoupled system:

- **Web Client:** Static React 19 Single Page Application built by Vite. Deployable on Vercel, Netlify, Cloudflare Pages, or an Nginx web server.
- **API Server:** Node.js 20+ Express application running on a serverless platform (Vercel Functions), container (Docker), or dedicated VM (PM2).
- **Database:** MongoDB 6.0+ replica set (MongoDB Atlas recommended).

---

## Environment Variables Checklist

Configure the following variables in your hosting environment:

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | Optional | API listening port (default: 4000) | `4000` |
| `NODE_ENV` | Required | Set to production | `production` |
| `CLIENT_URL` | Required | Production frontend URL (strict CORS) | `https://bloghub.example.com` |
| `VITE_API_URL` | Required | Production API base URL | `https://api.bloghub.example.com` |
| `MONGO_DB_URI` | Required | MongoDB production connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Required | High-entropy secret for 15-min access tokens | Minimum 64 hex characters |
| `JWT_REFRESH_SECRET` | Required | Distinct high-entropy secret for refresh tokens | Minimum 64 hex characters |

---

## Building the Client

Compile the optimized client production bundle:

```bash
npm run build
```

The output artifacts are written to `client/dist/`:
- Minified, gzip-optimized chunks with content hashing.
- Route-level lazy-loaded bundles (`Login`, `PostDetail`, `AdminLayout`).

Verify bundle budgets and treemap:
```bash
# Visual bundle composition
npm run build:analyze

# Verify size-limit thresholds
npm run size
```

---

## Server Ingress and Proxy Configuration

### 1. Reverse Proxy Hop
The backend relies on `app.set('trust proxy', 1)`. When deploying behind a reverse proxy (e.g., Vercel, Cloudflare, Nginx, AWS ALB), ensure the proxy forwards:
- `X-Forwarded-For`: Preserves client IP for rate limiters.
- `X-Forwarded-Proto`: Enforces HTTPS detection.

### 2. Security Headers
Helmet is enabled by default to set strict security headers:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Strict-Transport-Security`

### 3. Rate Limiting Configuration
Production rate limits run across two tiers:
- **Global limiter:** 300 requests per 15 minutes per IP.
- **Auth limiter:** 10 failed login attempts per 15 minutes per IP.

---

## Health and Readiness Probes

Use these endpoints for load balancer health checks and uptime monitoring:

### 1. Liveness Probe (`GET /health` or `GET /api/health`)
Returns process uptime without exposing internal system state:
```json
{
  "status": "ok",
  "uptime": 1428.5
}
```

### 2. Readiness Probe (`GET /ready` or `GET /api/ready`)
Pings the MongoDB connection to verify database availability:
- **Status 200 OK:** Database connected and responding to pings.
- **Status 503 Service Unavailable:** Database disconnected or ping timed out.
