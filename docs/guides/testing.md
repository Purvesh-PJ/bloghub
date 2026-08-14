# Testing

> **Scope:** the whole testing story — current state, strategy, tooling, and conventions for
> each level. Merged from four separate documents, because three of them described tests that
> do not exist.
> **Excludes:** CI wiring
> ([operations/deployment.md](../operations/deployment.md#part-2--cicd)), lint and format
> ([code-quality.md](code-quality.md)).

---

## Current state

**There is no working test infrastructure.** This is the single largest risk to the codebase
([GAP-11](../product/roadmap.md#gap-11)) and, after the correctness work in Phase 1, the
highest-value thing anyone can contribute.

| Workspace | Runner | Tests | `npm test` |
|-----------|--------|-------|-----------|
| `backend/` | None installed | One file that cannot run | `echo "Error: no test specified" && exit 1` |
| `client/` | None installed | None | No script |

`backend/tests/post.test.js` requires `supertest` and Jest globals, neither installed. Even if
it ran it would fail on its own terms — it expects 201 from a route that requires a token, and
an `id` field the API does not return. Delete or rewrite it as part of the first real suite.

### What this has already cost

Every defect closed in Phase 1 is one a modest suite would have caught before merge:

| Defect | The test that would have caught it |
|--------|-----------------------------------|
| [BUG-01](../product/roadmap.md#bug-01) | Create a post with `visibility: 'public'`, read it back |
| [BUG-02](../product/roadmap.md#bug-02) | Update a post with `imageURL: ''` |
| [BUG-03](../product/roadmap.md#bug-03) | Like a post, assert the post payload reflects it |
| [BUG-05](../product/roadmap.md#bug-05) | Write a setting, read it back |
| [BUG-08](../product/roadmap.md#bug-08) | `GET /posts/<unknown>` expects 404 |
| [BUG-16](../product/roadmap.md#bug-16) | Seed, then query likes by post |
| [SEC-01](../security/checklist.md#sec-01) | Create a draft as A, list posts anonymously |
| [SEC-02](../security/checklist.md#sec-02) | `POST /categories` with no token expects 401 |

Those fixes were verified by hand against a running server. That verification is not
repeatable, and nothing stops any of them regressing tomorrow.

---

## Pyramid

```
              ╱╲
             ╱E2E╲          few · slow · high confidence · brittle
            ╱──────╲        critical journeys only
           ╱ Integr. ╲      moderate · realistic · best value here
          ╱────────────╲    HTTP + database
         ╱     Unit     ╲   many · fast · isolated
        ╱────────────────╲  pure logic, services, components
```

| Level | Share | Count target | Runtime budget |
|-------|-------|--------------|----------------|
| Unit | ~60% | 120–180 | < 10s |
| Integration | ~30% | 50–80 | < 60s |
| End-to-end | ~10% | 8–15 | < 5min |

**Integration deserves the heaviest early investment.** Nearly every defect in this codebase
lived at the controller-to-database seam — an undeclared schema field, a dropped property, a
wrong status code. Unit tests with mocked models would have proved nothing, because the units
are thin and the mistakes are in how the layers connect.

---

## Tooling

| Level | Tool | Rationale |
|-------|------|-----------|
| Backend unit + integration | **Jest** + **Supertest** | The app already exports without listening, so Supertest can drive it directly |
| Backend test database | **mongodb-memory-server** | Real Mongoose semantics in process — essential, since strict-mode field dropping is only observable against a real connection |
| Frontend unit + component | **Vitest** + **React Testing Library** | Vitest reuses the existing Vite config |
| API mocking in the client | **MSW** | Intercepts at the network layer, so `services/` and the Axios interceptors run for real |
| End-to-end | **Playwright** | Cross-browser, auto-waiting, good tracing |

```bash
cd backend
npm install --save-dev jest supertest mongodb-memory-server cross-env

cd ../client
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom msw

npm install --save-dev --save-exact @playwright/test
npx playwright install --with-deps
```

```jsonc
// backend/package.json
"test": "cross-env NODE_ENV=test jest --runInBand",
"test:coverage": "cross-env NODE_ENV=test jest --coverage"

// client/package.json
"test": "vitest run",
"test:e2e": "playwright test"
```

`--runInBand` matters: parallel workers sharing one in-memory MongoDB interfere with each
other.

**The prerequisite is already in place** — `index.js` skips `connectDB()` under
`NODE_ENV=test`, so a harness can own the connection.

---

## Principles

1. **Test behaviour, not implementation.** A test that breaks on a rename without a behaviour
   change is a liability.
2. **One reason to fail per test.**
3. **Arrange, act, assert** — in that order, visibly separated.
4. **Independent.** No ordering dependency, no shared mutable state.
5. **Deterministic.** Fix the clock, seed randomness, never touch the network. A flaky test
   trains people to ignore failures.
6. **Fast at the bottom.** If the unit suite is slow, nobody runs it.
7. **A bug fix ships with a regression test** named for its tracking ID.

```js
describe('POST /posts', () => {
  it('creates a post with the requested visibility', …);   // behaviour
  it('returns 401 without an access token', …);            // failure path
  it('persists visibility on update (BUG-01)', …);         // regression
});
```

---

## Layout

```
backend/tests/
├── setup.js          in-memory MongoDB, env, per-test cleanup
├── factories.js      makeUser, makeAdmin, tokenFor, makePost
├── unit/
└── integration/

client/src/
├── setupTests.js
├── mocks/handlers.js
├── test/renderWithProviders.jsx
├── services/__tests__/
└── components/ui/__tests__/
```

Backend tests are centralised and mirror the source tree; client tests sit beside the code
they cover.

---

## Unit tests

Exercise one module with collaborators replaced. No network, filesystem or database.

| In scope | Out of scope |
|----------|--------------|
| `backend/services/` with models mocked | Anything hitting MongoDB → integration |
| `backend/middlewares/` with faked `req`/`res` | Full route chains → integration |
| Pure helpers — slug generation, analytics arithmetic | Controllers → integration |
| `client/src/services/` with Axios mocked | Pages that fetch → integration |
| `client/src/components/ui/` primitives | Multi-component flows → E2E |

Rule of thumb: if replacing the collaborator makes the test meaningless, it is not a unit
test.

### Middleware — the easiest high-value target

```js
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authenticateUser', () => {
  beforeEach(() => { process.env.JWT_SECRET = 'test-secret'; });

  it('populates req.user from a valid access token', () => {
    const token = jwt.sign({ user: 'abc123', roles: ['user'], type: 'access' }, 'test-secret');
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();

    authenticateUser(req, mockRes(), next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 'abc123', _id: 'abc123', roles: ['user'] });
  });

  it('rejects a refresh token (SEC-06)', () => {
    const token = jwt.sign({ user: 'abc123', type: 'refresh' }, 'test-secret');
    const res = mockRes();
    authenticateUser({ headers: { authorization: `Bearer ${token}` } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it.each([
    ['no header', {}],
    ['wrong scheme', { authorization: 'Basic abc' }],
    ['malformed token', { authorization: 'Bearer not-a-jwt' }],
  ])('rejects with 401 when there is %s', (_label, headers) => {
    const res = mockRes();
    authenticateUser({ headers }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
```

### Client components

Test what a user perceives — visible text, roles, disabled state — never internal state or
class names.

```jsx
const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

it('is disabled and shows a loading label while loading', () => {
  renderWithTheme(<Button isLoading>Publish</Button>);
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
  expect(button).toHaveTextContent('Loading...');
});
```

Every component reading `theme.*` must be wrapped in `ThemeProvider` — a bare render throws
on the first token lookup.

Query priority: `getByRole` → `getByLabelText` → `getByText` → `getByTestId` last. Never
query by class name; styled-components generates them.

---

## Integration tests

The level that matters most here.

| Real | Replaced |
|------|----------|
| The Express app including every middleware | MongoDB server → `mongodb-memory-server` |
| Routing, validation, controllers, services | |
| Mongoose schemas, casting, **strict-mode behaviour** | |
| JWT signing and verification | |

### Harness

```js
// backend/tests/setup.js
let mongo;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});
```

Clear collections **after** each test, not before — failures leave inspectable state.

### Factories

```js
exports.makeUser = async (overrides = {}) => {
  const password = overrides.password ?? 'password123';
  const user = await User.create({
    username: overrides.username ?? `user-${unique()}`,
    email: overrides.email ?? `user-${unique()}@example.com`,
    password: await bcrypt.hash(password, 10),
    roles: overrides.roles ?? ['user'],
  });
  await UserProfile.create({ user: user._id });
  return { user, password };
};

exports.tokenFor = (user) =>
  jwt.sign({ user: user.id, roles: user.roles, type: 'access' }, process.env.JWT_SECRET,
    { expiresIn: '15m' });
```

Never reuse `backend/seed.js` — it targets the real database and wipes every collection.

### Authorisation — the highest-value suite

```js
it('returns 403 when another member tries to update a post', async () => {
  const { user: author } = await makeUser();
  const { user: stranger } = await makeUser();
  const post = await makePost(author);

  const res = await request(app)
    .put(`/posts/${post._id}`)
    .set('Authorization', `Bearer ${tokenFor(stranger)}`)
    .send({ title: 'Hijacked', slug: post.slug, content: 'x' });

  expect(res.status).toBe(403);
});

it('lets an administrator update any post', async () => { /* … expects 200 */ });
it('returns 401 without a token', async () => { /* … expects 401 */ });
```

### Regression suite

One test per closed defect. These lock in the Phase 1 work:

```js
it('persists visibility on create (BUG-01)', async () => {
  const created = await request(app).post('/posts')
    .set('Authorization', `Bearer ${tokenFor(user)}`)
    .send({ title: 'x', slug: 'x', content: 'x', visibility: 'public' });

  const fetched = await request(app).get(`/posts/${created.body.postId}`);
  expect(fetched.body.data.visibility).toBe('public');
});

it('hides drafts from anonymous callers (SEC-01)', async () => {
  await makePost(user, { visibility: 'draft', title: 'Secret draft' });
  const res = await request(app).get('/posts');
  expect(res.body.data.map((p) => p.title)).not.toContain('Secret draft');
});

it('rejects a refresh token as an access token (SEC-06)', async () => { /* … 401 */ });
it('requires authentication to create a category (SEC-02)', async () => { /* … 401 */ });
it('persists user settings (BUG-05)', async () => { /* … reads back dark */ });
```

### Client integration

Component or page plus its real service layer, with MSW intercepting the network — this
exercises the Axios instance and both interceptors, including the refresh path that no unit
test can reach.

```jsx
export function renderWithProviders(ui, { route = '/' } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider><ThemeProvider>{ui}</ThemeProvider></AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
```

Mirror the nesting from `main.jsx`, and disable retries so a failure assertion does not wait.
Set `onUnhandledRequest: 'error'` on the MSW server so a forgotten mock fails loudly.

### Conventions

| Rule | Reason |
|------|--------|
| Assert the status code **and** the body shape | A 200 with the wrong body is still a defect |
| Assert what is **absent** — no `password`, no draft, no `email` | Exposure bugs are invisible to positive assertions |
| Test the failure path for every endpoint | 401, 403, 404, 409 are the contract too |
| Never reach a real database or the network | Guard on `NODE_ENV === 'test'` |

---

## End-to-end tests

Build these **last**. Slowest, most brittle, most expensive to maintain — reserve them for
journeys where full-stack confidence justifies the cost.

### Coverage — ten journeys, no more

| # | Journey | Priority |
|---|---------|----------|
| 1 | Register → sign in → land on the feed | Critical |
| 2 | Sign in → write → publish → the post is readable and on the feed | Critical |
| 3 | Read a post → comment → the comment appears | Critical |
| 4 | Edit an existing post → the change is visible | High |
| 5 | Delete a post → it disappears from My Posts | High |
| 6 | Like a post → reload → the like persists | High |
| 7 | Search → open a result | Medium |
| 8 | Admin signs in → deletes a post from the console | High |
| 9 | A member is redirected away from `/admin` | Critical |
| 10 | Toggle the theme → reload → it persists | Low |

Journeys 2 and 6 are the user-visible face of [BUG-01](../product/roadmap.md#bug-01) and
[BUG-03](../product/roadmap.md#bug-03) — both now fixed, and exactly the regressions worth
locking down.

### Environment

E2E needs a **dedicated database** it may destroy, plus a guard:

```js
if (!process.env.MONGO_DB_URI?.includes('_e2e')) {
  throw new Error('Refusing to run: MONGO_DB_URI is not an e2e database');
}
```

The guard is not optional — the seeder clears every collection it can reach.

### Rules

| Rule | Reason |
|------|--------|
| Query by role, label or text — never by CSS class | styled-components regenerates class names every build |
| Never `waitForTimeout` | Playwright auto-waits; a fixed sleep is too short or wasted |
| Each test creates its own data, timestamped | Parallel-safe |
| No conditional logic in a test | An `if` means two tests |
| Journeys only | Edge cases belong in integration tests, 100× faster |
| Never run against production | The suite writes and deletes real records |

Use page objects so a UI change breaks one file, not twelve. Reuse a signed-in
`storageState` per role rather than signing in through the UI in every test — the session
lives in `localStorage["auth-storage"]`, which Playwright persists. Add `.auth/` to
`.gitignore`; those files contain real tokens.

---

## Coverage

A signal, not a goal. Do not gate CI on it until a real suite exists; ratchet upward instead
of starting at a number nobody can meet.

| Area | Target |
|------|--------|
| `backend/middlewares/` | 95% — small, critical, easy |
| `backend/services/` | 90% |
| `backend/controllers/` | 80% |
| `client/src/services/` | 80% |
| `client/src/components/ui/` | 70% |
| `client/src/pages/` | 50% — cover logic, leave layout to E2E |
| Overall | 70% |

---

## What to build first

Do not chase the targets in one pass. This order maximises defects caught per hour.

1. **The harness.** Install backend tooling, add the in-memory setup, delete or rewrite
   `post.test.js`, and get one passing test — `GET /posts` returns 200 — to prove it works.
2. **Authentication and authorisation.** Highest-risk surface, easiest to assert. Sign-up,
   sign-in, refresh, token-type rejection, the admin gate, `authorizeSelfOrAdmin`, post
   ownership.
3. **A regression test per closed `BUG-xx` and `SEC-xx`.** Locks in Phase 1 permanently.
4. **Services and pure logic.**
5. **Client** — MSW handlers, `services/`, `ui/` primitives, auth context and guards.
6. **End-to-end** — three journeys to start: publish, engage, admin delete.

---

## What not to test

- Framework behaviour — Express routing, Mongoose casting, React rendering
- Third-party libraries
- styled-components output — assert behaviour, not CSS
- Exact copy strings — assert role and presence, not wording
