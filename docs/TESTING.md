# Testing Guide

BlogHub maintains high test coverage through fast, deterministic, and hermetic tests across both workspaces.

---

## Testing Philosophy

1. **Hermetic by design:** Integration tests never connect to a shared or external database. Backend tests spin up an ephemeral in-memory MongoDB instance (`mongodb-memory-server`) that is created and destroyed per test run.
2. **Behavior over implementation:** Tests query components and endpoints the way real users and API consumers interact with them (accessible roles, labels, HTTP request/response shapes).
3. **Colocated tests:** Test files live alongside the code they verify inside `__tests__/` directories.

```
          / \
         /   \
        / E2E \       Manual browser verification & staging deployments
       /-------\
      / Integration \ Full API lifecycles (mongodb-memory-server) &
     /   (55%)       \ React Testing Library page flows
    /-----------------\
   /    Unit Tests     \ Pure functions, schema validators, custom business
  /       (45%)         \ hooks (useReading, useDraftRecovery)
 /-----------------------\
```

---

## Test Suites Overview

- **Backend (Jest):** 22 test suites covering authentication, post discovery, tag normalization, moderation rules, dwell time tracking, and observability.
- **Frontend (Vitest + jsdom):** 20 test files verifying UI primitives, composed patterns, route guards, Markdown editor drafts, and state management.
- **Total:** 340+ automated tests passing with zero flaky tests.

---

## Test Commands

Run tests from the repository root:

```bash
# Run the entire test suite across client and backend
npm test

# Run only backend Jest tests
npm run test:backend

# Run only frontend Vitest tests
npm run test:client

# Run tests in watch mode during active development
npm --prefix client test -- --watch
npm --prefix backend test -- --watch

# Generate code coverage reports
npm run test:coverage

# Run concurrency benchmarks and load tests
npm run test:load
```

---

## Writing Backend Tests

Place backend tests in `__tests__/` next to the relevant domain module (e.g. `backend/src/modules/posts/__tests__/post.test.js`).

### Integration Test Pattern
```javascript
const request = require('supertest');
const app = require('../../../index');

describe('POST /api/posts', () => {
  it('rejects unauthenticated requests with 401', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Test Post', content: 'Sample text' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
```

---

## Writing Frontend Tests

Place frontend tests in `__tests__/` next to the relevant feature (e.g. `client/src/features/auth/__tests__/Login.test.jsx`).

### React Testing Library Pattern
```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/Login';

describe('Login Page', () => {
  it('validates email format before submitting', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
  });
});
```

---

## Definition of Done for Testing

A pull request or task is complete only when:
- All 340+ tests pass cleanly (`npm test`).
- No existing tests are skipped, commented out, or removed to bypass failures.
- New endpoints, critical hooks, or business logic ship with corresponding tests.
- Client linting passes with zero errors (`npm --prefix client run lint`).
