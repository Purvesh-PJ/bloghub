# ADR-0003: Compound Unique Indexes for Race Condition Prevention

- **Status:** Accepted
- **Date:** 2026-11-05
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

In a social publishing web app, users trigger rapid, concurrent actions. For example:
- A user rapidly double-clicks the "Like" button on a post.
- Two users try to register the exact same username or email at the same millisecond.
- A user rapidly refreshes an article, causing multiple simultaneous analytics events.

If we only check for duplicates in application code (e.g. `const existing = await Like.findOne(...)` then `if (!existing) await Like.create(...)`), a **race condition** occurs. Both requests check the database at the same time, neither finds an existing record, and both insert duplicate rows.

We needed a guaranteed way to prevent duplicate records under high concurrency without slowing down the app.

## 2. Options Considered

1. **Application-Level Checks Only:**
   - *Pros:* Simple to write in JavaScript.
   - *Cons:* Vulnerable to race conditions. Under parallel network requests, duplicates will slip through.

2. **Distributed Locks (e.g., Redis Redlock):**
   - *Pros:* Locks the resource before performing writes.
   - *Cons:* High complexity, high latency, requires an external Redis server, and risk of deadlocks if a server crashes mid-lock.

3. **Database-Enforced Compound Unique Indexes (Chosen):**
   - *Pros:* Handled directly by MongoDB's internal WiredTiger storage engine; atomic, race-condition proof, and zero extra infrastructure needed.
   - *Cons:* The application must catch and gracefully handle duplicate key errors (`code: 11000`).

## 3. Decision Outcome

We decided on **Option 3: Enforce data uniqueness strictly at the database layer using Mongoose compound unique indexes.**

### Concrete Examples in BlogHub:
1. **Likes (`Like.js`):**
   - We created a compound index: `{ post: 1, user: 1 }, { unique: true }`.
   - Even if 5 requests arrive at the exact same microsecond, MongoDB allows only 1 insert and safely rejects the remaining 4 with duplicate key errors.
2. **Analytics Views & Reads (`View.js`, `Read.js`):**
   - We created a compound index: `{ post: 1, visitorKey: 1, windowKey: 1 }, { unique: true }`.
   - Prevents duplicate view counting within the active tracking window.
3. **Users (`User.js`):**
   - Unique indexes on `email` and `username`.

When the database throws error code `11000`, our controllers catch it and return clean responses (e.g., "Already liked" or "Email already in use") instead of crashing.

## 4. Consequences & Trade-offs

### Positive:
- **100% Race-Condition Proof:** It is physically impossible for duplicate likes or duplicate views to exist in the database, even under load testing.
- **Zero Extra Latency:** The uniqueness check happens during the database insert operation itself; no separate lock acquisitions are required.

### Negative / Trade-offs:
- Indexes consume a small amount of memory (RAM) in MongoDB.
- Every write controller must wrap creations in `try/catch` blocks and inspect `error.code === 11000` to provide user-friendly feedback.

