# Security Policy

## Supported versions

BlogHub is developed on `main`. Security fixes are applied to `main` only; there are no
maintained release branches.

| Version | Supported |
|---------|-----------|
| `main` | ✅ |
| Older commits | ❌ |

---

## Reporting a vulnerability

**Do not open a public issue, pull request or discussion for a security vulnerability.**

Report it privately through one of these channels:

1. **GitHub Security Advisories** — preferred.
   Go to the repository's **Security** tab → **Report a vulnerability**. This creates a
   private thread visible only to maintainers.
2. **Email** — [purvesh9997@gmail.com](mailto:purvesh9997@gmail.com) with `SECURITY` in the
   subject line.

### What to include

The more of this you can provide, the faster the fix:

- The type of issue — authentication bypass, injection, data exposure, privilege escalation
- The affected file, endpoint or component
- Step-by-step reproduction, including any account role required
- A proof of concept, if you have one
- The impact as you assess it — what an attacker gains
- Any suggested remediation

### What to expect

| Stage | Timeframe |
|-------|-----------|
| Acknowledgement | Within 3 days |
| Initial assessment and severity | Within 7 days |
| Fix or a mitigation plan | Within 30 days for high and critical severity |
| Public disclosure | After a fix ships, coordinated with you |

This is a personal open-source project maintained in spare time. These are targets, made in
good faith, not a contractual commitment.

### Disclosure

Please give a reasonable window to ship a fix before disclosing publicly. Credit will be given
in the release notes and the advisory unless you prefer otherwise.

There is **no bug bounty** for this project.

---

## Known findings

Findings from the internal audit are published openly rather than kept private, because they
are already visible in the source to anyone who reads it, and because contributors need to
know what they are working around.

**[docs/security/checklist.md](./docs/security/checklist.md)** — twelve findings with severity,
impact, affected code and the fix applied or proposed.

**Eight are closed**, each verified by request against a running server. Four remain open:
file-upload constraints (SEC-05), view-tracking deduplication (SEC-04), token storage and
session revocation (SEC-08), and dependency scanning (SEC-12).

**Do not file a private report for something already listed there.** Fixes for known findings
are ordinary pull requests and are very welcome — the priority table in that document says
which to take first.

Deployment guidance:

> BlogHub is suitable for development, demonstration and portfolio use. Before running it
> with real user data, close the remaining findings in the checklist — and establish a test
> suite and CI pipeline. Without them, the security fixes already made can regress silently.

---

## Scope

### In scope

- The API in `backend/`
- The client in `client/`
- Authentication and authorisation logic
- Deployment configuration in `vercel.json`
- Dependency vulnerabilities affecting this project
- Secrets accidentally committed to the repository

### Out of scope

- Vulnerabilities in third-party services (Vercel, MongoDB Atlas) — report those to the vendor
- Findings that require physical access to a developer's machine
- Social engineering
- Denial of service through raw traffic volume
- Missing hardening headers on a **local development** server
- Automated scanner output with no demonstrated impact
- Anything already listed in the [known findings](#known-findings)

---

## Security practices in this project

For contributors, the standing rules are documented in
[docs/security/](./docs/security/checklist.md):

- The acting user comes from the verified token, never from client-supplied input
- Authorise the resource, not just the request
- Project queries so no password hash or private email address leaves the server
- Validate and constrain every input that reaches a database query
- No secret in source, in a log line, or in the client bundle — anything prefixed `VITE_` is
  public
- Escape anything interpolated into a regular expression

Every pull request is reviewed against the
[security checklist](./docs/security/checklist.md#review-checklist).

---

## Secrets

If a secret is ever committed:

1. **Rotate it immediately** — assume it is compromised the moment it reaches a remote.
   Removing it from history is not enough; it has been cloned, cached and indexed.
2. Rotating `JWT_SECRET` invalidates every issued token and signs all users out. That is the
   correct response.
3. Purge it from history with `git filter-repo` or the BFG, then force-push and notify anyone
   with a clone.
4. Report it through the channels above if it was a production credential.

`.env` is git-ignored. `.env.example` contains placeholders only and must never carry a real
value.
