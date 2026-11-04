# ADR-0004: 14-Day Rolling Window Weighted Trending Score Formula

- **Status:** Accepted
- **Date:** 2026-11-05
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

A blogging platform lives or dies by its discovery algorithm. When visitors open the homepage, they want to see interesting, active, and relevant stories.

We needed an algorithm to rank "Trending" stories. We faced three common pitfalls in ranking systems:
1. **The "All-Time Winner" Trap:** If we sort by total views or likes, articles from 2 years ago permanently stay at the top, and new authors get zero visibility.
2. **The "Clickbait" Trap:** If we only count raw page clicks/views, shallow clickbait headlines beat well-written, in-depth articles.
3. **The "Single-Fan" Anomaly:** If we sort by ratio (likes / views), an article with 1 view and 1 like has a 100% score and unfairly ranks above an article with 500 reads and 80 comments.

## 2. Options Considered

1. **Sort by Total Views (Simple Hit Counter):**
   - *Pros:* Very simple to query.
   - *Cons:* Rewards clickbait titles and bot reloads; ignores whether people actually liked or read the post.

2. **Hacker News / Reddit Gravity Formula (`(Votes - 1) / (Time + 2)^G`):**
   - *Pros:* Excellent decay over time for fast-moving news.
   - *Cons:* Overly aggressive decay for long-form blogs (stories disappear from trending within 18 hours), and complex to tune without dedicated tuning tools.

3. **14-Day Weighted Engagement Formula with a Minimum View Floor (Chosen):**
   - *Formula:* `Trending Score = (1 × views) + (3 × likes) + (5 × comments) + (5 × reads)`
   - *Time Window:* Only counts events from the last 14 days (`createdAt >= NOW - 14 days`).
   - *Minimum Threshold:* Post must have at least 3 views (`MIN_VIEWS = 3`) to qualify.

## 3. Decision Outcome

We chose **Option 3: The 14-day weighted formula with a 3-view floor.**

### Why these specific weights?
- **Raw Views (Weight: 1):** Represents initial interest/clicks. Lowest weight because clicking a link is low effort.
- **Likes (Weight: 3):** Represents explicit reader appreciation. 3 times more valuable than a casual click.
- **Comments (Weight: 5):** Writing a thoughtful reply takes time and sparks community discussions. High value.
- **Completed Reads (Weight: 5):** A "Read" is only recorded after a reader spends at least 5 seconds and scrolls through the article (`useReadTracking`). This rewards depth over clickbait.
- **14-Day Window:** Keeps the trending page dynamic and fresh while giving good articles enough time to be discovered.
- **3-View Floor:** Disqualifies empty posts or isolated single-click tests from ranking #1.

## 4. Consequences & Trade-offs

### Positive:
- **Rewards High-Quality Writing:** Authors who write insightful posts that get read to completion and spark comments naturally rise to the top.
- **Freshness:** The 14-day cutoff ensures the trending feed changes every week, giving every new author an equal chance.
- **Transparent & Explainable:** The formula is clean and easy to understand, test, and explain.

### Negative / Trade-offs:
- Running aggregation pipelines over a rolling 14-day window costs CPU cycles on MongoDB as the dataset grows into hundreds of thousands of events.
- *Mitigation for future scale:* In the future, this score can be computed via background cron or cached in Redis every 15 minutes. At current scale, MongoDB index on `createdAt` makes the query run in milliseconds.

