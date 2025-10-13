# UI Primitives Library

Complete design system primitives for the blogging platform. All components are 100% themeable and follow consistent patterns.

---

## 📦 Components Overview

### Feedback & Status

- **Alert** - Success/error/warning/info messages
- **Skeleton** - Loading placeholders
- **EmptyState** - No data displays
- **Loader** - Spinning loader

### Surfaces

- **Card** - Content cards with Header/Body/Footer
- **Paper** - Lighter surface variant
- **Badge** - Status badges
- **Divider** - Horizontal rules

### Navigation & Interaction

- **Chip** - Dismissible tags
- **Tooltip** - Hover information
- **IconWrapper** - Consistent icon sizing
- **Button** - Primary/secondary/ghost buttons

### Layout

- **Container** - Max-width content wrapper
- **Flex** - Flexbox layouts
- **Stack** - Vertical/horizontal stacks
- **Grid** - CSS Grid layouts

### Typography

- **Headings** (H1-H6)
- **Text** - Body text
- **Muted** - Secondary text
- **LinkText** - Styled links

### Form Elements

- **Input, TextArea, Select**
- **Checkbox, Radio, Switch**
- **FieldLabel, FieldError**

### Media

- **Avatar** - User avatars

---

## 🎨 Usage Examples

### Alert

```jsx
import { Alert } from '@/ui';

// Simple alert
<Alert $variant="success">
  Operation completed successfully!
</Alert>

// Complex alert with parts
<Alert $variant="error" $dismissible>
  <Alert.Icon>⚠️</Alert.Icon>
  <Alert.Content>
    <Alert.Title>Error Occurred</Alert.Title>
    <Alert.Description>
      Something went wrong. Please try again.
    </Alert.Description>
  </Alert.Content>
  <Alert.Close onClick={handleClose}>×</Alert.Close>
</Alert>

// Variants: success, error, warning, info
<Alert $variant="warning">Warning message</Alert>
```

**Props:**

- `$variant` - "success" | "error" | "warning" | "info"
- `$dismissible` - Adds padding for close button

---

### Skeleton

```jsx
import { Skeleton } from '@/ui';

// Basic skeleton
<Skeleton $width="100%" $height={40} />

// Text skeleton (3 lines)
<Skeleton.Text $lines={3} $lastWidth="60%" />

// Circle (for avatars)
<Skeleton.Circle $size={48} />

// Card skeleton
<Skeleton.Card />

// Custom skeleton
<Skeleton $width="200px" $height={100} $radius="xl" $animate={false} />
```

**Props:**

- `$width` - Width (string or number)
- `$height` - Height (string or number)
- `$radius` - Border radius from theme
- `$animate` - Enable/disable shimmer (default: true)
- `$lines` - Number of text lines (Skeleton.Text)
- `$size` - Circle size (Skeleton.Circle)

---

### Tooltip

```jsx
import { Tooltip } from '@/ui';

<Tooltip content="This is helpful info" $placement="top">
  <Button>Hover me</Button>
</Tooltip>

// Different placements
<Tooltip content="Top tooltip" $placement="top">...</Tooltip>
<Tooltip content="Bottom" $placement="bottom">...</Tooltip>
<Tooltip content="Left" $placement="left">...</Tooltip>
<Tooltip content="Right" $placement="right">...</Tooltip>

// Control width and wrapping
<Tooltip
  content="Long text that might wrap"
  $nowrap={false}
  $maxWidth="300px"
>
  <IconButton />
</Tooltip>
```

**Props:**

- `content` - Tooltip text (required)
- `$placement` - "top" | "bottom" | "left" | "right"
- `$nowrap` - Prevent text wrapping (default: true)
- `$maxWidth` - Maximum width (default: "200px")
- `$delay` - Hover delay in ms (default: 200)

---

### IconWrapper

```jsx
import { IconWrapper } from '@/ui';
import { SearchIcon } from 'lucide-react';

// Consistent icon sizing
<IconWrapper $size="sm"><SearchIcon /></IconWrapper>
<IconWrapper $size="md"><SearchIcon /></IconWrapper>
<IconWrapper $size="lg"><SearchIcon /></IconWrapper>
<IconWrapper $size="xl"><SearchIcon /></IconWrapper>

// With color
<IconWrapper $size="lg" $color="primary.main">
  <SearchIcon />
</IconWrapper>

// Circle background
<IconWrapper.Circle $size="md" $bg="primary.light">
  <SearchIcon />
</IconWrapper.Circle>

// Square background
<IconWrapper.Square $size="lg" $bg="grey.100" $padding={3}>
  <SearchIcon />
</IconWrapper.Square>
```

**Sizes:** xs(12px), sm(16px), md(20px), lg(24px), xl(32px), 2xl(40px), 3xl(48px)

**Props:**

- `$size` - Size preset
- `$color` - Icon color
- `$bg` - Background color (Circle/Square)
- `$padding` - Padding (Circle/Square)

---

### EmptyState

```jsx
import { EmptyState } from '@/ui';
import { SearchIcon } from 'lucide-react';

<EmptyState>
  <EmptyState.Icon $size="64px">
    <SearchIcon />
  </EmptyState.Icon>
  <EmptyState.Title>No results found</EmptyState.Title>
  <EmptyState.Description>
    Try adjusting your search terms or filters
  </EmptyState.Description>
  <EmptyState.Action>
    <Button onClick={handleReset}>Clear filters</Button>
  </EmptyState.Action>
</EmptyState>

// Minimal empty state
<EmptyState $minHeight="200px">
  <EmptyState.Title>No posts yet</EmptyState.Title>
  <EmptyState.Action>
    <Button>Create your first post</Button>
  </EmptyState.Action>
</EmptyState>
```

**Props:**

- `$minHeight` - Minimum height (default: "300px")

---

### Chip

```jsx
import { Chip } from '@/ui';

// Basic chip
<Chip>React</Chip>

// With variant
<Chip $variant="primary">Featured</Chip>
<Chip $variant="success">Active</Chip>
<Chip $variant="error">Urgent</Chip>

// Dismissible chip
<Chip $variant="secondary" $clickable>
  <Chip.Icon>🏷️</Chip.Icon>
  JavaScript
  <Chip.Delete onClick={handleDelete}>×</Chip.Delete>
</Chip>

// With avatar
<Chip>
  <Chip.Avatar src="/avatar.jpg" alt="User" />
  John Doe
</Chip>

// Sizes
<Chip $size="sm">Small</Chip>
<Chip $size="md">Medium</Chip>
<Chip $size="lg">Large</Chip>
```

**Props:**

- `$variant` - "default" | "primary" | "secondary" | "success" | "error" | "warning"
- `$size` - "sm" | "md" | "lg"
- `$clickable` - Add hover effects
- `$disabled` - Disable interaction

---

### Card

```jsx
import { Card } from '@/ui';

// Simple card
<Card>
  Content goes here
</Card>

// Structured card
<Card $elevated>
  <Card.Header $divider>
    <div>
      <Card.Title>Card Title</Card.Title>
      <Card.Description>Optional description</Card.Description>
    </div>
    <Card.Actions>
      <IconButton />
      <IconButton />
    </Card.Actions>
  </Card.Header>

  <Card.Body>
    Main content area
  </Card.Body>

  <Card.Footer $divider $justify="space-between">
    <Button $variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </Card.Footer>
</Card>

// No padding card
<Card $p={0}>
  <img src="..." alt="..." />
</Card>
```

**Card Props:**

- `$elevated` - Larger shadow
- `$p` - Padding (number or string, 0 for none)
- `$overflow` - CSS overflow property

**Card.Header Props:**

- `$divider` - Show bottom border
- `$align` - Alignment
- `$p` - Custom padding

**Card.Footer Props:**

- `$divider` - Show top border
- `$justify` - Justify content
- `$p` - Custom padding

---

### Paper

```jsx
import { Paper } from '@/ui';

// Lighter surface variant
<Paper>
  Content with subtle elevation
</Paper>

<Paper $elevated>
  Content with more elevation
</Paper>

<Paper $p={6}>
  Custom padding
</Paper>
```

---

### Button

```jsx
import { Button, IconButton } from '@/ui';

// Variants
<Button $variant="primary">Primary</Button>
<Button $variant="secondary">Secondary</Button>
<Button $variant="ghost">Ghost</Button>
<Button $variant="danger">Delete</Button>

// Sizes
<Button $size="sm">Small</Button>
<Button $size="md">Medium</Button>
<Button $size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>

// Icon button
<IconButton $size="md">
  <SearchIcon />
</IconButton>
```

---

### Layout Components

```jsx
import { Container, Flex, Stack, Grid } from '@/ui';

// Container - max-width wrapper
<Container $max="1200px">
  Content
</Container>

// Flex - flexbox layouts
<Flex $gap={4} $align="center" $justify="space-between">
  <div>Left</div>
  <div>Right</div>
</Flex>

// Stack - vertical/horizontal stacks
<Stack $gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

<Stack $direction="row" $gap={2}>
  <Button>One</Button>
  <Button>Two</Button>
</Stack>

// Grid - CSS Grid
<Grid $cols="repeat(3, 1fr)" $gap={4}>
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</Grid>
```

---

## 🎯 Design Patterns

### Consistent Prop Naming

All primitives use `$` prefix for styled props to avoid DOM warnings:

```jsx
// ✅ Good - styled props
<Card $elevated $p={6}>

// ❌ Bad - non-standard props
<Card elevated padding={6}>
```

### Theme Integration

All components use theme tokens:

```jsx
// Colors
theme.palette.primary.main;
theme.palette.text.secondary;
theme.palette.grey[200];

// Spacing
theme.spacing(4); // 16px

// Border Radius
theme.radii.lg;

// Typography
theme.typography.size.md;
theme.typography.weight.semibold;

// Shadows
theme.shadows.lg;
```

### Composition Pattern

Components with sub-components use dot notation:

```jsx
<Alert>
  <Alert.Icon />
  <Alert.Content>
    <Alert.Title />
    <Alert.Description />
  </Alert.Content>
  <Alert.Close />
</Alert>
```

---

## 📊 When to Use What

### Alert vs Toast

- **Alert** - Static messages in page content
- **Toast** - Temporary notifications (use react-toastify)

### Card vs Paper

- **Card** - Structured content with header/footer
- **Paper** - Simple elevated surface

### Skeleton vs Loader

- **Skeleton** - Content placeholders (preferred)
- **Loader** - Generic loading spinner

### Chip vs Badge

- **Chip** - Interactive, dismissible tags
- **Badge** - Static status indicators

---

## 🚀 Migration Guide

### Replace Custom Alerts

**Before:**

```jsx
const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 12px;
  border-radius: 8px;
`;
```

**After:**

```jsx
<Alert $variant="error">{errorMessage}</Alert>
```

### Replace Custom Loading States

**Before:**

```jsx
{
  loading && <div>Loading...</div>;
}
{
  !loading && <div>{content}</div>;
}
```

**After:**

```jsx
{
  loading ? <Skeleton.Text $lines={3} /> : <div>{content}</div>;
}
```

### Replace Custom Empty States

**Before:**

```jsx
{
  items.length === 0 && (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <p>No items found</p>
    </div>
  );
}
```

**After:**

```jsx
{
  items.length === 0 && (
    <EmptyState>
      <EmptyState.Title>No items found</EmptyState.Title>
    </EmptyState>
  );
}
```

---

## ✅ Best Practices

1. **Always use theme tokens** - Never hardcode colors/spacing
2. **Use semantic variants** - `$variant="success"` not `$color="#10b981"`
3. **Compose when needed** - Use sub-components for complex structures
4. **Keep it simple** - Don't over-engineer simple use cases
5. **Accessible by default** - Components include ARIA attributes
6. **Mobile-first** - All components are responsive

---

## 📝 Contributing New Primitives

When adding new primitives:

1. ✅ Use 100% theme tokens
2. ✅ Follow `$prop` naming convention
3. ✅ Add TypeScript-style prop comments
4. ✅ Include ARIA attributes for accessibility
5. ✅ Export from `ui/index.js`
6. ✅ Document in this README
7. ✅ Provide usage examples

---

**Total Primitives:** 40+ components  
**Theme Integration:** 100%  
**Accessibility:** ARIA-compliant  
**Documentation:** Complete
