# ADR-0007: In-Memory Database for Testing

- **Status:** Accepted
- **Date:** 2026-11-05
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

BlogHub relies heavily on MongoDB-specific features: compound unique indexes, aggregation pipelines for trending, atomic counters for views, and populated references between users, posts, and comments.

When writing automated integration tests for the backend (190 test cases), we faced a critical dilemma:
- If we mock the database in tests, we cannot catch index violations, aggregation typos, or constraint failures.
- If we connect tests to a real cloud or local MongoDB instance, tests become flaky, slow, and pollute the database with dummy test records.

We needed a testing architecture that runs real MongoDB queries fast and isolated, without external dependencies.

## 2. Options Considered

1. **Mocking Mongoose via Jest Mocks / Spies:**
   - *Pros:* Super fast test runs (no real database starts).
   - *Cons:* Complete illusion of security. Mocks test what you *assume* the database will do, not what MongoDB *actually* does. Compound unique index bugs or aggregation pipeline errors pass in tests but crash in production.

2. **Dockerized MongoDB Container in CI/CD:**
   - *Pros:* 100% real MongoDB environment.
   - *Cons:* Requires Docker daemon to be running locally on every developer's machine and in CI; test database state persists across test runs unless manual cleanup scripts run after every test; slower test suite startup.

3. **In-Process Ephemeral MongoDB via `mongodb-memory-server` (Chosen):**
   - *Pros:* Runs a real MongoDB binary inside memory during test execution. Exercises real indexes, real constraints, and real aggregation pipelines. Automatically destroys all test data when the test process finishes.
   - *Cons:* First-time setup downloads the MongoDB binary into memory cache, taking a few seconds on initial run.

## 3. Decision Outcome

We chose **Option 3: Use `mongodb-memory-server` combined with Supertest for all backend integration tests.**

### How it works in BlogHub:
1. In `backend/tests/setup.js`:
   - Before tests run (`beforeAll`), an in-memory MongoDB instance starts: `MongoMemoryServer.create()`.
   - Mongoose connects directly to this ephemeral URI.
2. Between test suites (`afterEach`), all collections are cleared:
   - `collection.deleteMany({})` wipes the tables clean, guaranteeing that Test A cannot corrupt Test B.
3. When the test runner finishes (`afterAll`), the ephemeral server stops and all memory is reclaimed.

## 4. Consequences & Trade-offs

### Positive:
- **100% Real Verification:** When our tests assert that a duplicate like is rejected, MongoDB's actual WiredTiger storage engine throws the `code: 11000` error. We know with mathematical certainty that our production concurrency guards work.
- **Zero External Dependencies:** A new developer can clone the repo, run `npm test`, and all 190 backend tests pass on their machine without needing Docker or a local MongoDB service running.
- **Zero Test Contamination:** Each test run starts with a completely pristine database state.

### Negative / Trade-offs:
- Initial test suite boot time takes 3–5 seconds to initialize the in-memory binary.
- Requires sufficient RAM on CI machines to hold the in-memory database process alongside the Node.js test runner.

