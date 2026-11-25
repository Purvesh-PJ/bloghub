# Deployment

How to build and run BlogHub in production. For running it locally instead, see [Development](DEVELOPMENT.md).

## Production setup

BlogHub is deployed as three separate parts:

| Part           | What it is                       | Where it can run                            |
| :------------- | :------------------------------- | :------------------------------------------ |
| **Web client** | Static React app built by Vite   | Vercel, Netlify, Cloudflare Pages, or Nginx |
| **API server** | Node.js 20+ Express app          | Vercel Functions, Docker, or a VM with PM2  |
| **Database**   | MongoDB 6.0+ (Atlas recommended) | MongoDB Atlas or your own server            |

## Environment variables

| Variable             | Required | Description                                                | Example                           |
| :------------------- | :------: | :--------------------------------------------------------- | :-------------------------------- |
| `PORT`               |    No    | API port (default 4000)                                    | `4000`                            |
| `NODE_ENV`           |   Yes    | Set to `production`                                        | `production`                      |
| `CLIENT_URL`         |   Yes    | Production frontend URL, used for strict CORS              | `https://bloghub.example.com`     |
| `VITE_API_URL`       |   Yes    | Production API base URL                                    | `https://api.bloghub.example.com` |
| `MONGO_DB_URI`       |   Yes    | MongoDB connection string                                  | `mongodb+srv://...`               |
| `JWT_SECRET`         |   Yes    | Secret for 15-minute access tokens (64+ hex characters)    |                                   |
| `JWT_REFRESH_SECRET` |   Yes    | A different secret for refresh tokens (64+ hex characters) |                                   |

## Building the client

```bash
npm run build
```

The output goes to `client/dist/`: minified chunks with content hashes, and lazy-loaded route bundles.

To check the bundle:

```bash
npm run build:analyze   # visual treemap of the bundle
npm run size            # checks the size-limit budgets
```

## Running behind a proxy

The API trusts one proxy hop. When it runs behind a reverse proxy or CDN (Vercel, Cloudflare, Nginx, AWS ALB), the proxy must forward:

- `X-Forwarded-For`, so rate limiting sees the real client IP;
- `X-Forwarded-Proto`, so HTTPS is detected correctly.

Security headers and rate limits are described in [Security Model](SECURITY_MODEL.md).

## Health checks

Use these endpoints for load balancer checks and uptime monitoring.

| Endpoint                           | Purpose                              | Response                                              |
| :--------------------------------- | :----------------------------------- | :---------------------------------------------------- |
| `GET /health` or `GET /api/health` | Liveness: is the process up          | `200` with `{ "status": "ok", "uptime": 1428.5 }`     |
| `GET /ready` or `GET /api/ready`   | Readiness: can it reach the database | `200` if MongoDB answers a ping, `503` if it does not |
