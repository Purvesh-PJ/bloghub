## What

<!-- One or two sentences describing the change. -->

## Why

<!-- The problem this solves. Link the tracking ID if one exists: BUG-01, GAP-05, SEC-02.
     Closes #<issue> -->

## How

<!-- The approach taken, and any alternative you rejected and why. -->

## Verification

<!-- What you ran and what you observed. "Should work" is not verification.
     Example: signed in as a member, published a post, confirmed it appears on the feed
     and that a direct load of /post/<id> renders. -->

## Type of change

- [ ] Bug fix — non-breaking change that fixes an issue
- [ ] Feature — non-breaking change that adds capability
- [ ] Breaking change — existing behaviour changes
- [ ] Security fix
- [ ] Refactor — no behaviour change
- [ ] Documentation
- [ ] Tests
- [ ] Build, tooling or dependencies

## Checklist

**Always**

- [ ] I have self-reviewed the diff
- [ ] Commits follow Conventional Commits
- [ ] `npm run lint` and `npm run format:check` pass in both affected workspaces
- [ ] `npm run build` passes in `client/` (if the client changed)
- [ ] No secrets, leftover `console.log`, or commented-out code
- [ ] The owning document is updated — see the [SSOT map](../docs/README.md#single-source-of-truth)

**API changes**

- [ ] Correct status codes (404 missing, 403 forbidden, 409 conflict)
- [ ] Response uses the standard envelope
- [ ] The acting user comes from `req.user`, never from the request body
- [ ] Resource ownership is verified, not just authentication
- [ ] Any `:userId` parameter is scoped to the token subject
- [ ] Queries are projected — no password hash, no private email address
- [ ] List endpoints are paginated
- [ ] [api-guidelines.md](../docs/reference/api.md) is updated

**Database changes**

- [ ] Indexes added for every new query path
- [ ] New fields are declared in the schema (Mongoose silently drops undeclared fields)
- [ ] Migration considered for existing documents
- [ ] [database.md](../docs/reference/database.md) is updated

**UI changes**

- [ ] Loading, empty and error states are handled
- [ ] All values come from theme tokens — no inline hex or px
- [ ] Works in both light and dark themes
- [ ] Works at 375px, 768px and 1440px
- [ ] Keyboard operable with a visible focus ring
- [ ] Interactive elements have accessible names

## Screenshots

<!-- For UI changes: before and after, in both themes. -->

## Notes for the reviewer

<!-- Anything unusual, risky, or worth a second opinion. Deliberate omissions and why. -->
