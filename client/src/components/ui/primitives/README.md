# UI Primitives - Categorized Structure

The UI primitives have been reorganized into categorized folders for better maintainability and discoverability. Each category contains related primitives that serve similar purposes.

## 📁 Folder Structure

```
primitives/
├── layout/              # Layout and positioning primitives
├── typography/          # Text and heading primitives
├── forms/              # Form-related primitives
├── interactive/        # Interactive elements (buttons, menus, etc.)
├── surfaces/           # Cards, chips, and surface elements
├── media/              # Media-related primitives
├── feedback/           # Status, loading, and feedback primitives
├── navigation/         # Navigation and wayfinding primitives
├── accessibility/      # Accessibility helper primitives
└── index.js           # Main export file
```

## 🎯 Categories

### 📐 Layout (`/layout`)
Primitives for structuring and positioning content:
- **`Box`** - Flexible container with spacing, colors, and layout props
- **`Container`** - Responsive container with max-width
- **`Flex`** - Flexbox layout container
- **`Stack`** - Vertical/horizontal stacking container
- **`Grid`** - CSS Grid layout container
- **`AspectRatio`** - Maintains aspect ratios for content
- **Semantic Elements**: `Section`, `Article`, `Aside`, `Header`, `Footer`, `Main`, `Nav`

### ✏️ Typography (`/typography`)
Text and heading primitives:
- **`Text`** - Base text component with variants (`Muted`, `LinkText`)
- **`H1-H6`** - Semantic heading components

### 📝 Forms (`/forms`)
Form-related primitives:
- **`Form`** - Form container with consistent spacing
- **`FormSection`** - Groups related form fields
- **`FormRow`** - Horizontal form field layout
- **`FormActions`** - Container for form buttons
- **`Input`** - Text input primitive
- **`TextArea`** - Textarea primitive
- **`Select`** - Select dropdown primitive
- **`FieldLabel`** - Form field labels
- **`FieldError`** - Form error messages
- **`Checkbox`** - Checkbox primitive
- **`Radio`** - Radio button primitive
- **`Switch`** - Toggle switch primitive

### 🎮 Interactive (`/interactive`)
Interactive elements and controls:
- **`Button`** - Button primitive with variants
- **`IconButton`** - Icon-only button
- **`Tooltip`** - Tooltip overlay
- **`Menu`** - Dropdown menu system
- **`Tabs`** - Tab navigation system
- **`Accordion`** - Collapsible content sections

### 🎨 Surfaces (`/surfaces`)
Cards, chips, and surface elements:
- **`Card`** - Card container with header, body, footer
- **`Paper`** - Simple elevated surface
- **`Badge`** - Small status/count indicator
- **`Chip`** - Interactive tag/chip element
- **`Divider`** - Visual separator
- **`IconWrapper`** - Icon container with variants

### 🖼️ Media (`/media`)
Media-related primitives:
- **`Avatar`** - User avatar component

### 💬 Feedback (`/feedback`)
Status, loading, and feedback primitives:
- **`Loader`** - Loading spinner
- **`Alert`** - Alert message system
- **`Skeleton`** - Loading placeholder skeletons
- **`EmptyState`** - Empty state placeholder
- **`ProgressBar`** - Progress indicator

### 🧭 Navigation (`/navigation`)
Navigation and wayfinding primitives:
- **`Breadcrumbs`** - Breadcrumb navigation
- **`SearchInput`** - Search input with features

### ♿ Accessibility (`/accessibility`)
Accessibility helper primitives:
- **`VisuallyHidden`** - Screen reader only content

## 📦 Usage

### Import from Main Index (Recommended)
```jsx
import { 
  Box, 
  Button, 
  Card, 
  Text, 
  Form,
  AspectRatio 
} from '@/components/ui/primitives';
```

### Import from Category (Optional)
```jsx
import { Box, Flex, Grid } from '@/components/ui/primitives/layout';
import { Button, Menu } from '@/components/ui/primitives/interactive';
import { Card, Badge } from '@/components/ui/primitives/surfaces';
```

## 🔄 Migration

The main index file exports all primitives, so **existing imports continue to work without changes**:

```jsx
// ✅ This still works exactly the same
import { Box, Button, Card, Text } from '@/components/ui/primitives';
```

## 🎨 Benefits of Categorization

1. **Better Organization**: Related primitives are grouped together
2. **Easier Discovery**: Find primitives by their purpose/category
3. **Maintainability**: Easier to maintain and update related components
4. **Scalability**: Easy to add new primitives to appropriate categories
5. **Documentation**: Clear separation of concerns
6. **Tree Shaking**: Better bundle optimization with category imports

## 📋 Category Guidelines

When adding new primitives, follow these guidelines:

### Layout
- Components that control positioning, spacing, or layout structure
- Examples: containers, grids, flexbox utilities

### Typography  
- Text-related components
- Examples: headings, paragraphs, text variants

### Forms
- Form controls and form-related utilities
- Examples: inputs, labels, validation, form structure

### Interactive
- Components that respond to user interaction
- Examples: buttons, menus, tabs, accordions

### Surfaces
- Visual containers and surface elements
- Examples: cards, chips, badges, dividers

### Media
- Media display and handling components
- Examples: avatars, images, videos

### Feedback
- Status communication and loading states
- Examples: alerts, loaders, progress bars, skeletons

### Navigation
- Wayfinding and navigation components
- Examples: breadcrumbs, search, navigation menus

### Accessibility
- Accessibility helper components
- Examples: screen reader utilities, focus management

## 🚀 Future Additions

New primitives should be added to the appropriate category folder with:
1. The primitive component file
2. Export in the category's `index.js`
3. Documentation of the primitive's purpose

This structure ensures the primitive library remains organized and maintainable as it grows.