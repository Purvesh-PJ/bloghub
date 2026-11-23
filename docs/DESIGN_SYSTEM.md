# Design System Guide

BlogHub enforces a strict 3-tier design system to keep the user interface consistent, accessible, and maintainable.

---

## 3-Tier UI Architecture

All frontend components strictly belong to one of three tiers. Never mix layout, business logic, and atomic rendering in a single file.

```
Tier 1: Core Primitives (client/src/components/ui/)
   │    Button, IconButton, Input, Card, Modal, Badge, Dialog, Table, Skeleton
   ▼
Tier 2: Composed Patterns (client/src/components/patterns/)
   │    PageHeader, DataTableCard, DataView, FilterToolbar, StatsGrid, ConfirmDialog
   ▼
Tier 3: Domain Feature Components (client/src/features/*/components/)
        PostCard, AuthorByline, CommentItem, ProfileHeader, TagManager
```

### Tier 1 — Core Primitives (`client/src/components/ui/`)
Atomic, domain-agnostic building blocks constructed with Radix UI and Tailwind CVA (Class Variance Authority):
- `Button`, `IconButton`, `Input`, `Select`, `Card`, `Surface`, `Alert`, `Badge`, `Chip`, `Modal`, `Dialog`, `Table`, `Pagination`, `EmptyState`, `ErrorState`, `Skeleton`.
- **Rule:** Never hand-roll raw `<button>`, `<input>`, or styled `div` wrappers when a Tier 1 primitive exists.

### Tier 2 — Composed Patterns (`client/src/components/patterns/`)
Reusable UI compositions built 100% out of Tier 1 primitives:
- `PageHeader`: Standard heading (`h1`), subtitle description, badge, and action slots.
- `DataTableCard`: Standard table container wrapping `Card`, `Table`, and `Pagination`.
- `DataView`: Unified async lifecycle state machine (`isLoading`, `isError`, `isEmpty`, and content).
- `FilterToolbar`: Unified filter chips, sort dropdown, search box, and action slots.
- `StatsGrid`: Responsive telemetry metrics grid with loading skeletons.
- `ConfirmDialog`: Standard confirmation modal with busy states and danger/confirm actions.
- `SettingSection`: Structured settings card wrapper with title, description, and footer actions.
- `ChoiceGrid`: Accessible visual radio selector using `Card as="button"`.
- `BulkActionBar`: Floating selection toolbar for batch actions ("X items selected").
- **Rule:** Never invent custom state ladders (`isLoading ? <Skeleton> : isError ? ...`) or ad-hoc modals. Always reuse canonical patterns.

### Tier 3 — Domain Feature Components (`client/src/features/*/components/`)
Domain-specific components carrying business logic and data schema awareness:
- Examples: `PostCard`, `AuthorByline`, `CommentItem`, `ProfileHeader`.

---

## Semantic Token System

Never use raw Tailwind palette colors (such as `blue-500`, `slate-900`, `emerald-600`, or `amber-400`). Always use role-based semantic tokens that adapt automatically across light and dark themes.

### 1. Brand and Action Tokens
- `bg-primary`, `text-primary`, `border-primary`
- `text-primary-foreground` (text on primary fill)
- `to-primary-dark`

### 2. Status Tokens
- **Destructive (danger/delete):** `bg-destructive`, `text-destructive`, `text-destructive-foreground`
- **Warning (caution/pending):** `bg-warning`, `text-warning`, `text-warning-foreground`
- **Success (valid/live):** `bg-success`, `text-success`, `text-success-foreground`
- **Info (guide/notice):** `bg-info`, `text-info`, `text-info-foreground`

### 3. Surfaces and Elevation
- `bg-surface-page`: Main background
- `bg-surface-container`: Base card and container surface
- `bg-surface-container-low`: Lower elevation recessed surface
- `bg-surface-container-high`: Higher elevation popover/modal surface
- `bg-surface-elevated`: Floating menus and dropdowns

### 4. Lines and Borders
- `border-line-subtle`: Dividers and subtle separators
- `border-line-default`: Standard card and input borders
- `border-line-strong`: High-contrast borders
- `border-border`: General container border

### 5. Overlays
- Use `bg-scrim` for drawer backdrops and modal scrims. Never use `bg-black/60` or raw black.

---

## Typography and Radius Scales

### Radius Scale
Only use registered radius utilities:
- `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl`, `rounded-full`.
- **Forbidden:** Arbitrary `rounded-[...px]`.

### Typography Scale
Use semantic typography tokens:
- Micro-copy: `text-2xs` (10px), `text-caption` (11px).
- Standard scale: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.
- **Forbidden:** Arbitrary font sizes like `text-[13px]`.

---

## Automated Lint Enforcement

We enforce these design rules through a custom ESLint plugin (`design-system/enforce-tokens`) in `client/eslint.config.js`.

The rule automatically detects and fails the build on:
- Raw palette colors (e.g. `bg-blue-600`, `text-slate-500`).
- Arbitrary CSS bracket syntax (e.g. `[#1a202c]`, `[hsl(...)]`).
- Arbitrary sizes and radii (e.g. `rounded-[8px]`, `text-[14px]`).

Verify compliance:
```bash
npm --prefix client run lint
```
Every frontend pull request must pass with 0 errors.
