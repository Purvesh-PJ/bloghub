# Development

How to run BlogHub on your own machine. A [hosted demo](https://bloghub-gold.vercel.app/) is available if you only want to see it working.

## Prerequisites

- **Node.js** 20 or higher
- **npm** 10 or higher
- **MongoDB** 6.0 or higher, running locally on `localhost:27017` or as a MongoDB Atlas connection string
- **Git**

## Setup

### 1. Clone and install

```bash
git clone https://github.com/Purvesh-PJ/bloghub.git
cd bloghub
npm install --prefix backend
npm install --prefix client
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Generate two random signing keys:

```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(48).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(48).toString('hex'))"
```

Put them in `.env`:

```ini
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:4000
MONGO_DB_URI=mongodb://127.0.0.1:27017/bloghub
JWT_SECRET=<generated_access_secret>
JWT_REFRESH_SECRET=<generated_refresh_secret>
```

### 3. Seed demo data (optional)

If you want sample posts, tags, and pre-configured test accounts to try out the app locally:

```bash
npm --prefix backend run seed
```

For pre-seeded account credentials and database reset details, see **[Database Guide](DATABASE.md#seeding--local-reset)**.

### 4. Start the app

From the repository root, start both servers:

```bash
npm run dev
```

Or start them separately:

```bash
# Terminal 1: API on port 4000
cd backend && npm run dev

# Terminal 2: web client on port 3000
cd client && npm run dev
```

Open http://localhost:3000.

## Useful commands

Run from the repository root:

| Command                | What it does                                                  |
| :--------------------- | :------------------------------------------------------------ |
| `npm test`             | Runs all backend and client tests (see [Testing](TESTING.md)) |
| `npm run lint`         | Runs ESLint, including the design-token rules                 |
| `npm run format:check` | Checks formatting with Prettier                               |
| `npm run build`        | Builds the client for production                              |
