import React, { useState } from 'react';
import StateWrapper, { ComponentWrapper } from './StateWrapper';

/**
 * Higher-Order Component (HOC) that adds loading, error, and normal state management
 * to any component in the application.
 * 
 * @param {React.Component} WrappedComponent - The component to enhance with state management
 * @param {Object} options - Configuration options for the HOC
 * @returns {React.Component} - Enhanced component with state management
 */
const withStateManagement = (WrappedComponent, options = {}) => {
  const {
    minWidth = '320px',
    maxWidth = '1200px',
    minHeight = '200px',
    loadingText = 'Loading...',
    errorTitle = 'Error',
    initialLoading = false,
    initialError = null,
  } = options;

  return function WithStateManagement(props) {
    const [loading, setLoading] = useState(initialLoading);
    const [error, setError] = useState(initialError);

    // Function to handle retry attempts
    const handleRetry = () => {
      setLoading(true);
      setError(null);
      
      // If the component provides a custom retry handler, call it
      if (props.onRetry) {
        props.onRetry();
      }
    };

    // Enhanced props to pass to the wrapped component
    const enhancedProps = {
      ...props,
      stateManagement: {
        loading,
        setLoading,
        error,
        setError,
        handleRetry,
      },
    };

    return (
      <ComponentWrapper 
        minWidth={minWidth} 
        maxWidth={maxWidth}
        minHeight={minHeight}
        width="100%"
      >
        <StateWrapper
          loading={loading}
          error={error}
          onRetry={handleRetry}
          loadingText={loadingText}
          errorTitle={errorTitle}
          minHeight={minHeight}
        >
          <WrappedComponent {...enhancedProps} />
        </StateWrapper>
      </ComponentWrapper>
    );
  };
};

export default withStateManagement;
