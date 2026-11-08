# ADR-0010: 3-Tier UI Architecture and Composed Patterns

- **Status:** Accepted
- **Date:** 2026-11-08
- **Deciders:** Purvesh

---

## 1. Context & Problem Statement

BlogHub's client grew from a basic reader into a full-featured publishing platform with 18 route views across reader, authoring studio, account settings, and administration consoles.

While [ADR-0008](0008-feature-driven-frontend.md) solved horizontal domain colocation (`features/posts`, `features/admin`, etc.), and atomic design system primitives (`Button`, `Card`, `Input`, `Table`) existed in `components/ui/`, a major architectural gap emerged between primitives and full feature screens:

1. **Repetitive Async State Ladders:** Every data-fetching screen manually re-invented loading, error, empty, and content branching (`isLoading ? <Skeleton> : isError ? <ErrorState> : isEmpty ? <EmptyState> : ...`).
2. **Tabular Container Boilerplate:** Every management screen duplicated `<Card tone="low" radius="xl" padding="none" className="overflow-hidden"> <Table> ... </Table> <Pagination /> </Card>`.
3. **Inconsistent Page Headers:** Screens hand-rolled flex headers with varying margins, text sizes, and action button slots.
4. **Primitive Bypasses:** Some screens used raw HTML `<button>` or un-tokenized divs with ad-hoc Tailwind class chains rather than standard primitives.

We needed a formal design-system composition tier that eliminates UI duplication across screens while strictly enforcing base primitive usage.

---

## 2. Decision Outcome

We adopted a **3-Tier UI Architecture** and established a canonical **Composed Patterns Layer** under `client/src/components/patterns/`:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Tier 1: Core Primitives (`client/src/components/ui/`)                 │
│ Button, IconButton, Card, Surface, Alert, Badge, Chip, Table, Input... │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Compose 100% of)
┌───────────────────────────────────▼────────────────────────────────────┐
│ Tier 2: Composed Patterns (`client/src/components/patterns/`)          │
│ Generic, domain-agnostic workflows used across 3+ distinct screens     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Provide structure to)
┌───────────────────────────────────▼────────────────────────────────────┐
│ Tier 3: Feature Components (`client/src/features/*/components/`)       │
│ Domain-specific components carrying schema logic (PostCard, Byline)    │
└────────────────────────────────────────────────────────────────────────┘
```

### The 9 Canonical Composed Patterns

| Pattern | Responsibility | Base Primitives Used |
| :--- | :--- | :--- |
| **`PageHeader`** | Standardized page heading (`h1`), description, badge, and action button slots. | Typography, `Button`, `Badge` |
| **`DataTableCard`** | Tabular container encapsulating surface, overflow handling, table body, and pagination footer. | `Card`, `Table`, `Pagination` |
| **`DataView`** | Unified async data lifecycle state machine (loading skeleton, error retry, empty, content). | `EmptyState`, `ErrorState`, `TableSkeleton` |
| **`FilterToolbar`** | Responsive toolbar integrating filter chips, sort select, and search input. | `Card`, `Chip`, `Select`, `SearchInput` |
| **`StatsGrid`** | Telemetry metrics grid (2, 3, 4, 5 columns) with skeleton placeholders. | `Card`, `StatTile`, `Skeleton` |
| **`SettingSection`** | Settings card wrapper with title, description, `Alert` notice, and action footer. | `Card`, `Alert`, `Button` |
| **`ChoiceGrid`** | Accessible visual radio selector for modes and choices using card primitives. | `Card (as="button")`, `Check` |
| **`ConfirmDialog`** | Standardized modal confirmation dialog with danger/confirm busy states. | `Modal`, `Button` |
| **`BulkActionBar`** | Floating selection toolbar for multi-select batch operations. | `Surface`, `Button` |

---

## 3. Strict Rules & Architectural Constraints

1. **Primitives Composition Rule:** Patterns must be composed 100% out of Tier 1 primitives. A pattern must never bypass primitives by rendering raw `<button>` or un-tokenized divs.
2. **Reuse Before Inventing:** Screens must use canonical patterns for page headers, data tables, filter toolbars, async state transitions, and confirmation dialogs.
3. **No Domain Leakage in Patterns:** Pattern components must remain domain-agnostic. They never import feature models or API services.

---

## 4. Consequences

### Positive
- **Drastic Boilerplate Reduction:** Screens like `Stories.jsx` and `Tags.jsx` shrank by 30-40% while gaining consistent accessibility.
- **Single Source of Truth:** A change to loading skeleton styles or error recovery propagates across the entire application instantly.
- **Enforced via `AGENTS.md`:** Future agentic coding and human contributors are bound by strict design system composition rules.

### Trade-offs / Neutral
- Developers must check `src/components/patterns/` before implementing new views rather than inventing ad-hoc layouts.
- Slight learning curve for understanding the boundary between generic patterns (Tier 2) and domain feature components (Tier 3).
