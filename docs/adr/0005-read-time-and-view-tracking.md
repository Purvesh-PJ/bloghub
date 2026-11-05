# ADR-0005: Read Time and View Tracking

- **Status:** Accepted
- **Date:** 2026-11-05
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

To give authors meaningful statistics (how many people viewed and actually read their article), BlogHub must track reading events.

However, tracking user activity presents two conflicting challenges:
1. **Preventing Spam Inflation:** If someone refreshes the page 50 times in a row or an automated script pings the URL, it shouldn't log 50 fake views.
2. **User Privacy & Legal Compliance (GDPR):** Storing raw IP addresses or detailed browser fingerprints in a database violates user privacy and creates legal liability.

We needed a system that stops view spam while ensuring no personal identifying information (PII) is ever written to disk.

## 2. Options Considered

1. **Store Raw IP Addresses and User-Agent Strings:**
   - *Pros:* Easy to identify duplicates (`WHERE ip = '...' AND post = '...'`).
   - *Cons:* Horrible for privacy; violates GDPR; storing raw user IPs creates a honeypot for data leaks.

2. **Track Authenticated Users Only:**
   - *Pros:* Reliable identity verification.
   - *Cons:* Most readers on the internet read articles without creating an account. Ignoring guest readers would make analytics useless for authors.

3. **Salted SHA-256 HMAC with a 6-Hour Window + Client Dwell Watcher (Chosen):**
   - *Pros:* One-way cryptographic hash of `IP + User-Agent + Secret Salt`. Impossible to reverse-engineer the original IP. Automatically expires after 6 hours. Combines with a 5-second client-side dwell watcher before recording a "Read".
   - *Cons:* Slightly higher CPU usage on incoming telemetry requests (computing the hash).

## 3. Decision Outcome

We chose **Option 3: Privacy-Preserving Salted HMAC with a 6-hour rolling window.**

### How it works in BlogHub:
1. When a reader opens an article:
   - The backend takes the reader's IP, their User-Agent, and a secret server salt.
   - It hashes them using `crypto.createHmac('sha256', SECRET_SALT)`.
   - The resulting hash is saved as `visitorKey`. **The raw IP address is discarded immediately and never saved to the database.**
2. A `windowKey` is calculated: `Math.floor(Date.now() / (6 * 60 * 60 * 1000))`. This divides time into discrete 6-hour blocks.
3. If the same visitor refreshes the article within that 6-hour block, MongoDB's unique index `{ post: 1, visitorKey: 1, windowKey: 1 }` rejects the duplicate insert.
4. **Dwell Time Verification (`useReadTracking`):**
   - A "View" is recorded upon opening the page.
   - But a "Read" is only recorded if the reader scrolls through the content and stays on the article for at least 5 seconds. If they bounce within 2 seconds, only a view is recorded, not a read.

## 4. Consequences & Trade-offs

### Positive:
- **100% Privacy-Preserving:** Even if the database is dumped or leaked, not a single user's IP address or identity can ever be recovered from the analytics table.
- **Bot & Refresh Protection:** Prevents authors or bots from artificially inflating metrics through rapid reloads.
- **Accurate Engagement Data:** Authors see real readers who spent genuine time on their work.

### Negative / Trade-offs:
- After 6 hours have passed, if the same reader revisits the post, a new view will be counted. This is an intentional compromise: 6 hours represents a genuine separate reading session.
- Client-side ad blockers that block telemetry scripts will not be counted in views or reads.

