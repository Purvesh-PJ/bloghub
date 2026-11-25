# Code Quality and Performance

BlogHub enforces code style, accessibility, bundle budgets, and Lighthouse thresholds across both workspaces. All commands run from the repository root.

## Linting and Formatting

- **ESLint:** Enforces React Hooks rules, JSX accessibility (`eslint-plugin-jsx-a11y`), Node/Express safety, and design-system token rules (see [Design System](DESIGN_SYSTEM.md)).
- **Prettier:** Enforces consistent formatting across `.js`, `.jsx`, `.json`, and `.md` files.

```bash
npm run lint             # Run ESLint across backend and client
npm run lint:fix         # Auto-fix fixable lint issues
npm run format:check     # Check Prettier formatting
npm run format           # Format all files with Prettier
```

## Bundle Size Budgets

`size-limit` (`client/.size-limit.json`) checks production chunk sizes after `npm run build`:

| Chunk | Budget | Contents |
| :--- | :--- | :--- |
| Vendor Core | `160 kB` | React, React DOM, Router (`vendor-*.js`) |
| Radix UI Primitives | `65 kB` | Dialog, Select, Dropdown, Avatar, Tabs (`radix-*.js`) |
| Markdown Preview | `140 kB` | Post rendering & sanitization (`markdown-preview-*.js`) |
| Editor Component | `35 kB` | Live Markdown editor (`editor-*.js`) |
| Syntax Highlighting | `240 kB` | Prism code block highlighting (`syntax-highlight-*.js`) |

```bash
npm run build            # Build production bundle
npm run size             # Verify chunk sizes against .size-limit.json
npm run build:analyze    # Generate visual bundle treemap (rollup-plugin-visualizer)
```

## Lighthouse Audits

Lighthouse CI (`client/lighthouserc.json`) starts `vite preview` at `http://localhost:4173/` and audits the built client with a desktop preset. Reports are saved to `client/.lighthouseci/`.

| Category | Minimum Score |
| :--- | :--- |
| Performance | `0.70` |
| Accessibility | `0.85` |
| Best Practices | `0.85` |
| SEO | `0.80` |

```bash
npm run build && npm run lighthouse
```

## Dependency Security Audit

Check backend and client dependencies for known vulnerabilities:

```bash
npm run audit
```
