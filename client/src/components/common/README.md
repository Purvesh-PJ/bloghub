# Common Components

A comprehensive library of reusable UI components built using base primitives and the application's theme system. These components are domain-agnostic and can be used across all features of the LMS application.

## Design Principles

1. **Built on Primitives**: All components use existing primitives (`Box`, `Flex`, `Button`, etc.)
2. **Theme Integration**: Colors, spacing, typography, and other design tokens come from the theme system
3. **Domain Agnostic**: Components are generic and reusable across different features
4. **Prop-Driven**: Content, behavior, and variations are controlled through props
5. **Accessible**: Components follow accessibility best practices
6. **TypeScript Ready**: All components include PropTypes for type safety

## Component Categories

### 📝 Form Components (`/form`)

Complete form field components with labels, validation, and error handling. All forms should use the **Form primitive** instead of regular HTML `<form>` elements.

#### Form Primitives (from `/ui/primitives`)

- **`Form`** - Styled form container with consistent spacing and layout
- **`FormSection`** - Section within a form for grouping related fields
- **`FormRow`** - Horizontal row for side-by-side fields
- **`FormActions`** - Container for form action buttons

#### Form Field Components

- **`InputField`** - Text input with label and error display
- **`TextareaField`** - Textarea with label and error display
- **`SelectDropdown`** - Select dropdown with options
- **`MultiSelectDropdown`** - Multi-select with tags and search
- **`CheckboxField`** - Checkbox with label and description
- **`RadioGroup`** - Radio button group with options
- **`SwitchToggle`** - Toggle switch with label
- **`FileUploader`** - File upload with drag & drop
- **`DatePickerField`** - Date/time picker input

#### Example Forms

- **`LoginForm`** - Simple login form example
- **`ContactForm`** - Contact form with sections
- **`ExampleForm`** - Comprehensive form showing all features

### 🏗️ Layout Components (`/layout`)

Structural components for organizing content and creating layouts.

- **`FlexCard`** - Flexible card with customizable flex layout
- **`ResponsiveContainer`** - Container with responsive max-widths
- **`PageSection`** - Semantic section with consistent spacing
- **`GridSection`** - Responsive CSS grid layout
- **`Modal`** - Modal dialog with overlay and focus management
- **`SidePanel`** - Sliding side panel (drawer)

### 🧭 Navigation Components (`/navigation`)

Components for site navigation and wayfinding.

- **`TopNavigationBar`** - Responsive top navigation bar
- **`SideNavigation`** - Collapsible sidebar navigation
- **`BreadcrumbNavigation`** - Breadcrumb trail navigation

### 📊 Table & List Components (`/table`)

Components for displaying and interacting with data.

- **`DataTable`** - Feature-rich data table with sorting and search
- **`TablePagination`** - Pagination controls for tables
- **`ListComponent`** - Flexible list component for data display

### 🖼️ Media Components (`/media`)

Components for displaying media content and user information.

- **`UserAvatar`** - User avatar with status and info display
- **`ImageCard`** - Card with image and content
- **`ContentCard`** - Versatile content card for posts/articles

### 💬 Feedback Components (`/feedback`)

Components for user feedback, status, and notifications.

- **`LoadingSpinner`** - Loading indicators (spinner, dots, pulse)
- **`AlertMessage`** - Alert messages with auto-dismiss
- **`StatusBadge`** - Status badges with color coding
- **`ToastNotification`** - Toast notifications with progress

## Usage Examples

### Form Components

**⚠️ Important: Use Form primitive instead of HTML `<form>`**

```jsx
import {
  Form,
  FormSection,
  FormRow,
  FormActions,
  InputField,
  SelectDropdown,
  CheckboxField,
  Button,
} from '@/components/common';

// ❌ Don't use regular HTML form
function OldForm() {
  return (
    <form onSubmit={handleSubmit}>
      <InputField label="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}

// ✅ Use Form primitive with consistent spacing and layout
function NewForm() {
  return (
    <Form onSubmit={handleSubmit} $gap={4}>
      <FormSection $gap={3}>
        <InputField
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <FormRow $gap={4} $stackOnMobile $equalWidth>
          <SelectDropdown
            label="Category"
            options={[
              { value: 'tech', label: 'Technology' },
              { value: 'design', label: 'Design' },
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <InputField
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
        </FormRow>

        <CheckboxField
          label="Subscribe to newsletter"
          checked={subscribe}
          onChange={(e) => setSubscribe(e.target.checked)}
        />
      </FormSection>

      <FormActions $justify="flex-end" $divider>
        <Button type="button" $variant="ghost">
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </FormActions>
    </Form>
  );
}
```

### Form Primitive Features

```jsx
// Basic form with gap and styling
<Form $gap={4} $p={6} $bg="surface" $radius="lg">
  <InputField label="Name" />
  <Button type="submit">Submit</Button>
</Form>

// Form sections for grouping
<Form $gap={5}>
  <FormSection $gap={3}>
    <H3>Personal Info</H3>
    <InputField label="Name" />
    <InputField label="Email" />
  </FormSection>

  <FormSection $gap={3} $border $p={4} $bg="subtle">
    <H3>Preferences</H3>
    <CheckboxField label="Newsletter" />
  </FormSection>
</Form>

// Responsive form rows
<FormRow $gap={4} $stackOnMobile $equalWidth>
  <InputField label="First Name" />
  <InputField label="Last Name" />
</FormRow>

// Form actions with divider
<FormActions $divider $justify="space-between" $stackOnMobile>
  <Button $variant="ghost">Save Draft</Button>
  <Button type="submit">Submit</Button>
</FormActions>
```

### Layout Components

```jsx
import { ResponsiveContainer, GridSection, Modal } from '@/components/common';

function MyPage() {
  return (
    <ResponsiveContainer size="lg">
      <GridSection columns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        <Card>Content 1</Card>
        <Card>Content 2</Card>
        <Card>Content 3</Card>
      </GridSection>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Action">
        <p>Are you sure you want to continue?</p>
      </Modal>
    </ResponsiveContainer>
  );
}
```

### Navigation Components

```jsx
import { TopNavigationBar, SideNavigation } from '@/components/common';

function Layout() {
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', active: true },
    { label: 'Courses', href: '/courses' },
    { label: 'Students', href: '/students' },
  ];

  return (
    <>
      <TopNavigationBar
        logo="LMS Platform"
        navItems={navItems}
        user={{ name: 'John Doe', avatar: '/avatar.jpg' }}
      />

      <SideNavigation
        navGroups={[
          {
            title: 'Main',
            items: navItems,
          },
        ]}
      />
    </>
  );
}
```

### Data Display

```jsx
import { DataTable, UserAvatar, StatusBadge } from '@/components/common';

function UsersTable() {
  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (_, row) => <UserAvatar user={row.user} showName showEmail />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  return <DataTable columns={columns} data={users} searchable sortable />;
}
```

### Feedback & Status

```jsx
import { LoadingSpinner, AlertMessage, ToastNotification } from '@/components/common';

function MyComponent() {
  return (
    <>
      {loading && <LoadingSpinner text="Loading data..." centered />}

      {error && <AlertMessage variant="error" title="Error" message={error.message} dismissible />}

      <ToastNotification
        isOpen={showToast}
        variant="success"
        title="Success!"
        message="Data saved successfully"
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
```

## Theming

All components automatically use the application's theme system:

- **Colors**: `theme.palette.*`
- **Spacing**: `theme.spacing.*`
- **Typography**: `theme.typography.*`
- **Border Radius**: `theme.radii.*`
- **Shadows**: `theme.shadows.*`
- **Breakpoints**: `theme.breakpoints.*`

## Accessibility

Components include accessibility features:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader support
- Color contrast compliance

## Customization

Components can be customized through:

1. **Props**: Control behavior and appearance
2. **Theme**: Modify global design tokens
3. **Styled Components**: Extend components with additional styles
4. **Composition**: Combine components for complex layouts

## Migration Guide: HTML Forms → Form Primitive

### Before (HTML form)

```jsx
<form onSubmit={handleSubmit} className="my-form">
  <div className="form-group">
    <label>Name</label>
    <input type="text" />
  </div>
  <div className="form-group">
    <label>Email</label>
    <input type="email" />
  </div>
  <div className="form-actions">
    <button type="button">Cancel</button>
    <button type="submit">Submit</button>
  </div>
</form>
```

### After (Form primitive)

```jsx
<Form onSubmit={handleSubmit} $gap={4}>
  <InputField label="Name" type="text" />
  <InputField label="Email" type="email" />

  <FormActions $justify="flex-end" $gap={3}>
    <Button type="button" $variant="ghost">
      Cancel
    </Button>
    <Button type="submit">Submit</Button>
  </FormActions>
</Form>
```

### Benefits of Form Primitive

- **Consistent spacing** with `$gap` prop
- **Theme integration** for colors, spacing, typography
- **Responsive design** built-in
- **Accessibility** features included
- **Less CSS** needed - styling through props
- **Semantic structure** with FormSection, FormRow, FormActions

## Best Practices

1. **Use Form primitive**: Replace all HTML `<form>` elements with `<Form>`
2. **Use semantic HTML**: Components render appropriate HTML elements
3. **Provide labels**: Always include labels for form fields
4. **Handle errors**: Display validation errors clearly
5. **Consider loading states**: Show loading indicators for async operations
6. **Test accessibility**: Verify keyboard navigation and screen reader support
7. **Group related fields**: Use `FormSection` for logical grouping
8. **Responsive layouts**: Use `FormRow` with `$stackOnMobile` for mobile-friendly forms

## File Structure

```
components/common/
├── form/                 # Form components
├── layout/              # Layout components
├── navigation/          # Navigation components
├── table/               # Table & list components
├── media/               # Media components
├── feedback/            # Feedback components
├── index.js             # Main exports
└── README.md            # This documentation
```

Each category has its own `index.js` file for organized exports, making imports clean and predictable.
