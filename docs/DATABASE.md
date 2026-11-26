# Database

BlogHub uses MongoDB 6+ accessed through Mongoose 8. This document covers connection configuration, seeding, migrations, and health monitoring. For collection schemas and relationships, see [Data Model](DATA_MODEL.md).

## Configuration

Set the MongoDB connection URI in `.env`:

```ini
# Local instance
MONGO_DB_URI=mongodb://127.0.0.1:27017/bloghub

# Or MongoDB Atlas replica set
MONGO_DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/bloghub?retryWrites=true&w=majority
```

The connection module (`backend/src/config/db.js`) manages the Mongoose lifecycle:

- Logs connection success, errors, and unexpected disconnections.
- Handles graceful shutdown on `SIGINT` and `SIGTERM` by draining active requests and closing the database connection cleanly.

## Seeding & Local Reset

To populate a fresh local database with demo tags, sample posts, and pre-configured accounts:

```bash
npm --prefix backend run seed
```

> **Warning:** This wipes existing collections and repopulates fresh test data. Do not run against a production database.

Pre-seeded accounts:

| Role   | Email               | Password      |
| :----- | :------------------ | :------------ |
| Author | `john@example.com`  | `password123` |
| Admin  | `admin@bloghub.com` | `admin123`    |

## Migrations & Schema Repairs

When updating models or repairing an existing database without data loss, use the migration utility:

```bash
# Preview changes without modifying data
npm --prefix backend run migrate:dry

# Apply schema migrations and repairs
npm --prefix backend run migrate
```

What the migration script checks and repairs (`backend/scripts/migrate.js`):

1. **Comment back-references:** Ensures every comment has a valid `post` ID reference so post-scoped queries include all responses.
2. **Comment parent links:** Ensures top-level comments and replies are structured correctly (`parent: null` for top-level).
3. **Duplicate slugs:** Normalizes and resolves duplicate post slugs before building the unique index.

## Readiness & Health Checks

Use the `/ready` probe to verify database connectivity from load balancers or uptime monitors:

- **Endpoint:** `GET /ready` (or `GET /api/ready`)
- **Success (`200 OK`):** MongoDB connection state is active (`readyState === 1`) and database admin ping succeeds:
  ```json
  { "status": "ready" }
  ```
- **Failure (`503 Service Unavailable`):** MongoDB is disconnected or ping timed out:
  ```json
  { "status": "unavailable" }
  ```

## Index Guarantees

Critical integrity constraints (such as unique likes, slug collision prevention, and 6-hour read deduplication) are enforced directly by MongoDB compound indexes. For complete schema index definitions and entity relationships, see **[Data Model](DATA_MODEL.md)**.
