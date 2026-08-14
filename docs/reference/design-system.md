# Design System

> **Scope:** the visual language and how to compose it — tokens, themes, primitive components,
> layout, interaction, feedback and accessibility. Merges what were separate design-system and
> ui-guidelines documents.
> **Excludes:** component file organisation
> ([architecture/frontend.md](../architecture/frontend.md)), journeys
> ([product/user-flows.md](../product/user-flows.md)).
>
> Rendered screenshots of the shipped UI are in
> [`client/public/screenshots/`](../../client/public/screenshots/) and referenced from the
> [README](../../README.md). They are the visual reference; this document is the specification.

---

## Principles

1. **Reading comes first.** The article is the product. Chrome recedes; typography and
   whitespace carry the experience.
2. **One accent.** Indigo in light mode, violet in dark. Colour marks the primary action and
   nothing else; status colours only signal status.
3. **Depth through space, not lines.** Prefer spacing and subtle elevation over rules.
4. **Every state is designed.** Loading, empty, error and success are part of the screen.
5. **Both themes are first class.** Dark mode is a peer implementation, not a filter.

---

# Foundation

Styling is CSS-in-JS via **styled-components v6**. No utility framework, no global stylesheet
beyond `GlobalStyles`. Every value a component needs comes from the theme object.

```
client/src/styles/
├── ThemeProvider.jsx        # context, mode persistence, system-preference listener
└── theme/
    ├── index.js             # barrel
    ├── tokens.js            # mode-independent values
    ├── typography.js        # mode-independent type scale
    ├── lightTheme.js        # light colours + shadows
    ├── darkTheme.js         # dark colours + shadows
    └── GlobalStyles.js      # reset, element defaults, .post-content, utilities
```

The theme handed to styled-components is a flat merge:

```js
{ ...(mode === 'light' ? lightTheme : darkTheme), ...tokens, ...typography }
```

So a component reaches every value from one object:

```js
const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;
```

---

## Tokens

### Spacing — `theme.spacing`

8px rhythm with a 4px half-step: `xs` 4 · `sm` 8 · `md` 16 · `lg` 24 · `xl` 32 · `xxl` 48.

### Radii — `theme.radii`

| Token | Value | Use |
|-------|-------|-----|
| `sm` | 6px | Badges, inline code |
| `md` | 8px | Buttons, inputs |
| `lg` | 12px | Cards, images |
| `xl` | 16px | Modals |
| `2xl` | 20px | Hero surfaces |
| `full` | 9999px | Avatars, pills |

### Breakpoints — `theme.breakpoints`

`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1440px. Written mobile-first with
`max-width` queries against these values.

### Z-index — `theme.zIndices`

`base` 0 · `dropdown` 100 · `sticky` 200 · `overlay` 300 · `modal` 400 · `toast` 500.

Never write a raw z-index. Add a rung to the ladder if one is missing.

### Layout — `theme.layout`

| Token | Value | Meaning |
|-------|-------|---------|
| `headerHeight` | 60px | Fixed header offset |
| `sidebarWidth` | 260px | Admin sidebar |
| `maxContentWidth` | 1200px | Page container ceiling |
| `contentWidth` | 680px | Reading measure for article bodies |

### Transitions — `theme.transitions`

`fast` 150ms (colour, opacity) · `normal` 200ms (most state changes) · `slow` 300ms (layout) ·
`spring` 300ms cubic-bezier (playful entrances).

---

## Typography

System font stacks — no web fonts, so no font-loading shift.

| Role | Stack |
|------|-------|
| `fonts.body` | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, …` |
| `fonts.heading` | `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, …` |
| `fonts.mono` | `"SF Mono", "Fira Code", Menlo, Monaco, Consolas, monospace` |

> `index.html` still preconnects to `fonts.googleapis.com` although no Google font is
> requested. Dead markup, safe to remove.

### Scale — `theme.fontSizes`

| Token | rem / px | | Token | rem / px |
|-------|----------|---|-------|----------|
| `xs` | 0.75 / 12 | | `2xl` | 1.5 / 24 |
| `sm` | 0.8125 / 13 | | `3xl` | 1.875 / 30 |
| `md` | 0.9375 / 15 | | `4xl` | 2.25 / 36 |
| `base` | 1 / 16 | | `5xl` | 2.75 / 44 |
| `lg` | 1.125 / 18 | | | |
| `xl` | 1.25 / 20 | | | |

Body copy defaults to `md` (15px); article bodies step up to `lg` (18px).

**Weights** `normal` 400 · `medium` 500 · `semibold` 600 · `bold` 700.
**Line heights** `none` 1 · `tight` 1.2 · `snug` 1.35 · `normal` 1.5 · `relaxed` 1.65 ·
`loose` 1.8.
**Tracking** `tighter` −0.03em through `wider` 0.03em.

Headings default to `semibold` with `tight` tracking; article bodies use `loose` line height.

---

## Colour

Both themes expose an identical key set, so a component written against `theme.colors.<name>`
works in either mode without a conditional. **Never inline a hex value.**

| Group | Keys |
|-------|------|
| Surfaces | `bgPrimary`, `bgSecondary`, `bgTertiary`, `bgElevated`, `bgHover`, `bgActive`, `bgOverlay` |
| Text | `textPrimary`, `textSecondary`, `textMuted`, `textDisabled`, `textInverse`, `textLink`, `textLinkHover` |
| Borders | `border`, `borderLight`, `borderHover`, `borderFocus` |
| Brand | `accent`, `accentHover`, `accentActive`, `accentSubtle`, `accentMuted` |
| Status | `success`, `warning`, `error`, `info` — each with `…Hover`, `…Bg`, `…Border` |
| Buttons | `buttonPrimary*`, `buttonSecondary*`, `buttonGhostHover` |
| Inputs | `inputBg`, `inputBorder`, `inputBorderHover`, `inputBorderFocus`, `inputPlaceholder` |
| Cards | `cardBg`, `cardBorder`, `cardHoverBg` |
| Chrome | `scrollbar*`, `selection`, `selectionText`, `codeBg`, `codeBorder` |
| Badges | `badgeBg`, `badgeText`, `badgeActiveBg`, `badgeActiveText` |

### Palette anchors

| Role | Light | Dark |
|------|-------|------|
| Brand accent | Indigo `#6366f1` | Violet `#8b5cf6` |
| Page background | `#f9fafb` | `#09090b` |
| Surface | `#ffffff` | `#18181b` |
| Primary text | `#111827` | `#fafafa` |
| Secondary text | `#4b5563` | `#a1a1aa` |
| Border | `#e5e7eb` | `#3f3f46` |
| Success / Warning / Error / Info | `#10b981` `#f59e0b` `#ef4444` `#3b82f6` | `#34d399` `#fbbf24` `#f87171` `#60a5fa` |

Dark mode is warm neutral rather than pure black, with lightened status colours to hold
contrast.

### Elevation — `theme.shadows`

`none`, `xs`–`xl`, plus intent-named `card`, `cardHover`, `focus` and `focusRing`. Dark-mode
shadows are deeper to stay visible. `focusRing` is a two-layer ring applied globally to
`*:focus-visible`.

---

## Theme switching

Owned by `ThemeProvider`.

| Concern | Behaviour |
|---------|-----------|
| Initial mode | `localStorage["theme"]` if valid, else `prefers-color-scheme`, else light |
| Persistence | Written on every change |
| DOM signal | `<html data-theme="light\|dark">` |
| Mobile chrome | `<meta name="theme-color">` updated |
| System changes | A `matchMedia` listener switches only while no explicit choice is stored |

Consumers use `useTheme()` for `{ mode, isDark, isLight, toggleTheme, setTheme }`. Prefer
reading `theme.colors.*` over branching on `isDark`.

> The `theme-color` update writes `#0d1117`, which is not a `darkTheme` token
> (`bgSecondary` is `#09090b`). Minor inconsistency worth aligning.

---

## Primitives

`client/src/components/ui/`, all re-exported from `index.js`:

```js
import { Button, Input, Card, Modal, Alert } from '../components/ui';
```

| Component | Props | Notes |
|-----------|-------|-------|
| `Button` | `variant`: primary \| secondary \| outline \| ghost \| danger; `size`: sm \| md \| lg; `fullWidth`, `isLoading`, `disabled` | Heights 32 / 40 / 48px |
| `Input` | `label`, `error`, plus native props | Label, field and error as one unit |
| `TextArea` | Same contract as `Input` | |
| `Select` | `options`, `label`, `error` | Native `<select>`, styled to match |
| `Card` | `children` | `cardBg`, `cardBorder`, `radii.lg`, `shadows.card` |
| `Badge` | `variant`, `children` | Pill using the badge group |
| `Container` | `children` | Also exports `Box` and `Flex` |
| `Modal` | `open`, `onOpenChange`, `title` | Radix Dialog underneath — keeps focus trapping and Escape handling |
| `Avatar` | `src`, `name`, `size` | Falls back to the first initial |
| `Spinner` | `size` | The route-level Suspense fallback |
| `Tabs` | `tabs`, `active`, `onChange` | |
| `Alert` | `variant`: success \| warning \| error \| info | Uses the matching status trio |
| `Loading` | `text` | Centred spinner with a caption — the standard page loading state |

### Rules for primitives

1. **Transient props only** — styling props are `$`-prefixed so they are not forwarded to the
   DOM.
2. **No business logic** — a primitive renders and reports events; it never calls a service.
3. **Native props pass through** — spread `...props` so callers keep `type`, `aria-*`,
   `onBlur`.
4. **Token-only values.** `Button` hard-codes `#ef4444` for its danger variant and falls back
   to literal hexes when a token is missing. That is drift to fix, not a pattern to copy.

---

# Composition

## Layout

| Shell | Component | Structure |
|-------|-----------|-----------|
| Public / member | `Layout` | Fixed `Header` (60px) → `<Outlet />` → `Footer` |
| Admin | `AdminLayout` | Fixed 260px sidebar → content area |

```
┌──────────────────────────────────────────────┐   ┌───────────┬──────────────┐
│ HEADER  BlogHub [search] [Write] (avatar ▾)  │   │ Admin     │              │
├──────────────────────────────────────────────┤   │ Dashboard │              │
│                                              │   │ Posts     │  <Outlet />  │
│                 <Outlet />                   │   │ Categories│              │
│                                              │   │ Users     │              │
├──────────────────────────────────────────────┤   │ Settings  │              │
│ FOOTER                                       │   └───────────┴──────────────┘
└──────────────────────────────────────────────┘
```

The avatar menu holds Profile, My posts, Analytics, Settings and Sign out, plus an Admin entry
for admin accounts. Signed-out visitors see `Sign in` and `Get started` instead.

### Widths

| Content | Width | Token |
|---------|-------|-------|
| Article body | 680px | `layout.contentWidth` |
| Page container | 1200px | `layout.maxContentWidth` |

Never let a paragraph exceed `contentWidth` — 680px is roughly 70–80 characters, the readable
band.

### Spacing

Vertical rhythm is a multiple of 8px. Section separation `xl` or `xxl`; card padding `lg`,
dropping to `md` on mobile; related controls `sm` apart, unrelated groups `lg` apart.

### Responsive

Mobile-first; add `max-width` queries only where the layout genuinely breaks.

| Range | Expectation |
|-------|-------------|
| < 640px | Single column, full-bleed cards, collapsed nav, no hover-only affordances |
| 640–1024px | Two-column grids, sidebars stack below content |
| > 1024px | Full layout, sidebars beside content |

`GlobalStyles` provides `.hide-mobile` and `.hide-desktop`. Use sparingly — reflowing beats
hiding.

## Interaction states

Every interactive element defines all five.

| State | Convention |
|-------|-----------|
| Default | Token colours at rest |
| Hover | `bgHover` / `…Hover` token; `transitions.fast` |
| Focus | Global `*:focus-visible` ring from `shadows.focusRing` — **never remove it** |
| Active | `bgActive` or `…Active` |
| Disabled | `opacity: 0.6`, `cursor: not-allowed`, no transform |

Hover transforms (`translateY(-1px)`) are reserved for buttons and cards, and must be reverted
on `:disabled`.

## Feedback

| Situation | Mechanism |
|-----------|-----------|
| Mutation succeeded | `toast.success('Post created')` |
| Mutation failed | `toast.error(err.response?.data?.message ?? 'Something went wrong')` |
| Field invalid | Inline `error` prop on `Input` / `TextArea` |
| Whole form or page failed | `Alert variant="error"` above the form |
| Page data loading | `Loading` with a caption |
| In-place work | Inline `Spinner`, or the button's `isLoading` |
| Destructive confirmation | `Modal` with an explicitly named action |

Toasts appear top-right. Do not use them for validation — validation belongs next to the field.

**Loading:** route transitions use the `Suspense` fallback; pages render `<Loading />`; buttons
carry `isLoading`. Never leave a blank frame.

**Empty states** always explain and offer a next action:

```
No posts yet
Share your first story with the community.
[ Write a post ]
```

**Errors** keep the user on the page and say what to do. Missing resources render a dedicated
block with a route home. Never surface a raw exception or stack trace.

## Forms

1. Every field has a visible label — placeholders illustrate format, never replace a label.
2. Validate on submit, not every keystroke; re-validate once a field is corrected.
3. Errors name the fix: "Password must be at least 6 characters".
4. The submit button carries the mutation's pending state.
5. Set `autoComplete` correctly — `username`, `current-password`, `new-password`, `email`.
6. Destructive submits are confirmed through a `Modal`, with the action named on the button
   ("Delete post", not "OK").

## Content and voice

| Rule | Yes | No |
|------|-----|-----|
| Sentence case | "Write a post" | "Write A Post" |
| Verb-first buttons | "Publish", "Save draft" | "Submit", "OK" |
| Plain, specific errors | "Post not found" | "Error 404: resource unavailable" |
| Second person | "Your posts" | "User's posts" |
| No jargon in user copy | "Couldn't save your post" | "Mutation failed with status 500" |

Dates use `date-fns` as `MMM d, yyyy`. Relative time is reserved for activity feeds.

## Iconography

`lucide-react` is the icon set. (`@radix-ui/react-icons` ships as a dependency of the Radix
themes package and should not be introduced in new code.)

16–20px inline with text, 24px standalone; icons inherit `currentColor`; an icon-only control
needs an `aria-label`; icons decorate, never carry meaning alone.

---

## Accessibility

Semantic markup and a global focus ring are in place; **no audit has been run**
([GAP-18](../product/roadmap.md#gap-18)).

| Area | Requirement |
|------|-------------|
| Structure | One `<h1>` per page; heading levels descend without skipping |
| Landmarks | `<header>`, `<nav>`, `<main>`, `<footer>` used for their purpose |
| Focus | Visible on every interactive element; never `outline: none` without a replacement |
| Keyboard | Every action reachable; modals trap focus and close on Escape (Radix handles this) |
| Contrast | 4.5:1 body, 3:1 large text and UI boundaries, **in both themes** |
| Images | Meaningful images carry `alt`; decorative use `alt=""` |
| Controls | Icon-only buttons carry `aria-label`; toggles expose `aria-pressed` |
| Forms | Labels programmatically associated; errors linked with `aria-describedby` |
| Motion | Respect `prefers-reduced-motion` beyond a colour fade |
| Live regions | Toasts announce through `aria-live` |

**Before merging a UI change:** tab through with no mouse, toggle both themes, check contrast
on any new pairing, resize to 375px.

---

## Performance conventions

| Practice | Detail |
|----------|--------|
| Code splitting | Every page lazily loaded via `lazyPage` |
| Vendor chunks | `vendor`, `radix`, `editor` split in `vite.config.js` |
| Images | Always set `alt`; `GlobalStyles` applies `max-width: 100%` |
| Lists | Stable entity-id keys, never an array index |
| Memoisation | Only for measured problems |
| Fonts | System stacks only — do not add a web font without measuring |

---

## Extending the system

**A token** — add to `tokens.js` (mode-independent) or to *both* theme files
(mode-dependent). A key in only one theme causes an undefined value in the other.

**A primitive** — create `components/ui/<Name>.jsx`, export named, add to `index.js`, document
its props above.

**A variant** — extend the variant map inside the component, not at the call site.

**Never** — inline a raw colour, spacing value, radius or z-index in a page component.

---

## Component checklist

- [ ] All values from theme tokens — no inline hex, px spacing or raw z-index
- [ ] Reuses a `components/ui` primitive rather than restyling a raw element
- [ ] Loading, empty and error states handled
- [ ] Works at 375px, 768px and 1440px
- [ ] Works in both themes
- [ ] Keyboard operable with a visible focus ring
- [ ] Interactive elements have accessible names
- [ ] Styling props are `$`-prefixed transient props
- [ ] No business logic inside a `components/ui` primitive
