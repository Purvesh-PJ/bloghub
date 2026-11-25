# Testing

BlogHub has 340+ automated tests across the backend and the client. All commands run from the repository root.

## How the tests are built

- **No shared database.** Backend integration tests start a temporary in-memory MongoDB (`mongodb-memory-server`) for each run and throw it away afterwards.
- **Behavior over implementation.** Tests use the app the way a user or API client would: accessible roles and labels in the UI, and request and response shapes in the API.
- **Tests sit next to the code.** Each test file lives in a `__tests__/` folder beside the code it checks.

## Suites

| Suite                   | Tool           | What it covers                                                                           |
| :---------------------- | :------------- | :--------------------------------------------------------------------------------------- |
| **Backend** (22 suites) | Jest           | Authentication, post discovery, tag handling, moderation, read tracking, logging         |
| **Client** (20 files)   | Vitest + jsdom | UI primitives, composed patterns, route guards, Markdown editor drafts, state management |

## Commands

```bash
npm test                 # all tests, backend and client
npm run test:backend     # backend only
npm run test:client      # client only
npm run test:coverage    # with coverage reports
npm run test:load        # API load benchmarks
```

To re-run tests while editing:

```bash
npm --prefix client test -- --watch
npm --prefix backend test -- --watch
```

## Before finishing a change

- All tests pass, and none have been skipped or removed to make them pass.
- New endpoints and important logic come with tests.
- Client linting passes with no errors (`npm --prefix client run lint`).
