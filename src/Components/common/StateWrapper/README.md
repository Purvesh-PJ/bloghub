# StateWrapper Component

This component provides a standardized way to handle loading, error, and normal states for all components in the blogging platform while maintaining consistent dimensions during state transitions.

## Features

- Maintains component dimensions during loading and error states
- Provides consistent loading spinners across the application
- Standardizes error handling with retry functionality
- Ensures responsive design with customizable min/max widths
- Prevents layout shifts when components change states

## Usage

### Basic Usage

```jsx
import StateWrapper, { ComponentWrapper } from '../components/common/StateWrapper';

const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        const response = await fetchSomeData();
        setData(response);
        
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

  const handleRetry = () => {
    // Reset states and trigger the useEffect again
    setLoading(true);
    setError(null);
  };

  return (
    <ComponentWrapper minWidth="320px" maxWidth="800px" width="100%">
      <StateWrapper 
        loading={loading} 
        error={error} 
        onRetry={handleRetry}
        loadingText="Loading data..."
        errorTitle="Error Loading Data"
        minHeight="200px"
      >
        {/* Your component content here */}
        <div>
          {data.map(item => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      </StateWrapper>
    </ComponentWrapper>
  );
};
```

### Props

#### StateWrapper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| loading | boolean | - | Whether the component is in loading state |
| error | string | null | Error message to display (null means no error) |
| onRetry | function | - | Function to call when retry button is clicked |
| loadingText | string | 'Loading...' | Text to display during loading |
| errorTitle | string | 'Error' | Title for the error message |
| minHeight | string | '200px' | Minimum height of the component |
| style | object | {} | Additional styles to apply |
| children | node | - | Content to render when not in error state |

#### ComponentWrapper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| minWidth | string | '200px' | Minimum width of the component |
| maxWidth | string | '100%' | Maximum width of the component |
| minHeight | string | 'auto' | Minimum height of the component |
| maxHeight | string | 'none' | Maximum height of the component |
| width | string | '100%' | Width of the component |
| height | string | 'auto' | Height of the component |
| mobileMinWidth | string | minWidth or '100%' | Minimum width on mobile devices |
| mobileMaxWidth | string | maxWidth or '100%' | Maximum width on mobile devices |

## Best Practices

1. **Always set a minHeight**: This ensures the component maintains its dimensions during loading and error states.
2. **Use ComponentWrapper for responsive design**: This helps maintain consistent dimensions across different screen sizes.
3. **Provide meaningful error messages**: Error messages should be clear and actionable.
4. **Always include a retry function**: This gives users a way to recover from errors.
5. **Disable interactive elements during loading**: Prevent users from interacting with components while they're loading.
