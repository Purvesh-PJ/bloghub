# Design System

BlogHub keeps its interface consistent with three component tiers, role-based theme tokens, and lint rules that fail the build when the rules are broken.

## Contents

1. [Component tiers](#1-component-tiers)
2. [Theme tokens](#2-theme-tokens)
3. [Radius and typography](#3-radius-and-typography)
4. [Lint enforcement](#4-lint-enforcement)

---

## 1. Component tiers

Every frontend component belongs to exactly one tier. Layout, business logic, and basic rendering are never mixed in a single file.

| Tier | Location | What it is | Examples |
| :-- | :-- | :-- | :-- |
| **1. Primitives** | `client/src/components/ui/` | Basic, domain-free building blocks made with Radix UI and Tailwind CVA | `Button`, `IconButton`, `Input`, `Select`, `Card`, `Badge`, `Modal`, `Dialog`, `Table`, `Skeleton` |
| **2. Patterns** | `client/src/components/patterns/` | Reusable compositions built only from Tier 1 | `PageHeader`, `DataTableCard`, `DataView`, `FilterToolbar`, `StatsGrid`, `ConfirmDialog`, `SettingSection`, `ChoiceGrid`, `BulkActionBar` |
| **3. Domain components** | `client/src/features/*/components/` | Components that know about BlogHub data | `PostCard`, `AuthorByline`, `CommentItem`, `ProfileHeader`, `TagManager` |

Rules:

- Do not hand-write a raw `<button>`, `<input>`, or styled `div` when a Tier 1 primitive exists.
- Do not write your own loading, error, and empty-state logic or ad-hoc modals. Use `DataView` and `ConfirmDialog`.

---

## 2. Theme tokens

Never use raw Tailwind palette colors such as `blue-500` or `slate-900`. Use role-based tokens, which adapt to the light and dark themes automatically.

| Group | Tokens |
| :-- | :-- |
| **Brand** | `bg-primary`, `text-primary`, `border-primary`, `text-primary-foreground` |
| **Danger** | `bg-destructive`, `text-destructive`, `text-destructive-foreground` |
| **Warning** | `bg-warning`, `text-warning`, `text-warning-foreground` |
| **Success** | `bg-success`, `text-success`, `text-success-foreground` |
| **Info** | `bg-info`, `text-info`, `text-info-foreground` |
| **Surfaces** | `bg-surface-page` (page), `bg-surface-container` (cards), `bg-surface-container-low` (recessed), `bg-surface-container-high` (popovers, modals), `bg-surface-elevated` (menus) |
| **Lines** | `border-line-subtle`, `border-line-default`, `border-line-strong`, `border-border` |
| **Overlay** | `bg-scrim` for drawer and modal backdrops, never `bg-black/60` |

---

## 3. Radius and typography

- **Radius:** use only `rounded-xs` to `rounded-4xl` and `rounded-full`. Arbitrary values like `rounded-[8px]` are not allowed.
- **Typography:** use `text-2xs` (10px) and `text-caption` (11px) for small text, and the standard `text-xs` to `text-xl` scale otherwise. Arbitrary sizes like `text-[13px]` are not allowed.

---

## 4. Lint enforcement

A custom ESLint plugin (`design-system/enforce-tokens`, configured in `client/eslint.config.js`) fails the build on:

- raw palette colors, such as `bg-blue-600` or `text-slate-500`;
- arbitrary bracket values, such as `[#1a202c]` or `[hsl(...)]`;
- arbitrary sizes and radii, such as `rounded-[8px]` or `text-[14px]`.

Outside `client/src/components/ui/`, `react/forbid-elements` warns on raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`, and `<dialog>` elements so Tier 1 primitives are used instead.

To check:

```bash
npm --prefix client run lint
```