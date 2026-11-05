# ADR-0009: Performance and Load Testing Plan

- **Status:** Draft
- **Date:** 2026-11-06
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

Right now, BlogHub has **332 tests** (190 on backend, 142 on frontend). Every single one of them is a **functional test**:
- Does login work? Yes.
- Does a user get saved to the database? Yes.
- Do route guards block unauthorized users? Yes.

What we **do not** test right now is **how the app behaves under real-world pressure**:
- How slow does the site get when 500 people read articles at the same time?
- Does the editor load fast on a cheap mobile phone?
- What happens if someone loses internet while writing a post?
- Can people using screen readers use the site?

We don't need all of these on day one of `v1.0.0`, but we need a clear list so we don't forget them when traffic picks up.

---

## 2. What Is Missing & What Tools We Should Use

Here are the 5 practical areas we need to cover eventually:

### 1. Load Testing (Can the server handle traffic?)
- **The problem:** We don't know how many users our MongoDB queries and trending algorithm can handle before requests start timing out.
- **Recommended tool:** **k6** (simple scripts written in JavaScript).
- **Goal:** Keep response times under 200ms when 100–500 virtual users visit the trending feed.

### 2. Page Speed & Web Vitals (Does the site feel fast?)
- **The problem:** The Markdown editor and code syntax highlighting bundles are large. Users on slow mobile connections might see a blank screen for seconds.
- **Recommended tool:** **Lighthouse CI**.
- **Goal:** Good Core Web Vitals (page loads within 2.5 seconds on mobile).

### 3. Basic Security Testing (Is the API safe from abuse?)
- **The problem:** We have rate limiters, but we haven't automatically tested if someone can bypass them or send bad payloads to crash the server.
- **Recommended tool:** **OWASP ZAP** (automated scan).
- **Goal:** Catch common API security holes before deploying updates.

### 4. Accessibility / a11y (Can everyone use the site?)
- **The problem:** We don't verify if contrast in dark mode is readable or if buttons work properly with keyboards and screen readers.
- **Recommended tool:** **axe-core** (runs directly inside our existing Vitest tests).
- **Goal:** Zero accessibility warnings on reading and writing pages.

### 5. Network Drop / Offline Recovery (Is the user's draft safe?)
- **The problem:** If a writer is typing and their Wi-Fi drops, does the app silently protect their draft, or does it crash with an ugly error?
- **Goal:** Verify that localStorage draft recovery always restores 100% of the text after a dropped connection.

---

## 3. Simple Roadmap (When to build what)

We will tackle these in 2 simple steps when needed:

1. **Phase 1 (Most important):**
   - Add a basic **k6** script to test `/api/posts/trending` and `/api/posts/:slug`.
   - Run **Lighthouse** on the frontend build to keep track of page speed.

2. **Phase 2 (Nice to have):**
   - Add **axe-core** to Vitest for accessibility checks.
   - Run a scheduled security scan on the API.

---

## 4. Why this ADR is in "Draft"

- For `v1.0.0`, our functional tests give us full confidence that features work correctly.
- Setting up load testing servers and heavy browser scans right now would slow down development without immediate traffic.
- Keeping this ADR in **Draft** ensures the requirements and chosen tools are already decided whenever we are ready to implement them.
