# State Management Implementation Guide

This guide explains how to implement consistent state management (loading, error, and normal states) across all components in your blogging platform.

## Available Tools

We've created three different ways to implement state management in your components:

1. **StateWrapper Component** - A component wrapper for simple cases
2. **withStateManagement HOC** - A higher-order component for class components or complex cases
3. **useStateManagement Hook** - A custom hook for functional components (recommended approach)

## Implementation Examples

### Method 1: Using StateWrapper Component

```jsx
import React, { useState, useEffect } from 'react';
import StateWrapper, { ComponentWrapper } from '../components/Resuable-Components/StateWrapper';

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

### Method 2: Using withStateManagement HOC

```jsx
import React, { useEffect } from 'react';
import withStateManagement from '../components/Resuable-Components/withStateManagement';

const MyComponent = ({ stateManagement, ...props }) => {
  const { loading, setLoading, error, setError } = stateManagement;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data from API
        const response = await fetch('/api/data');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch data');
        }
        
        // Process data
        
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message || 'An error occurred while fetching data');
      }
    };
    
    fetchData();
  }, [setLoading, setError]);
  
  return (
    <div>
      {/* Your component content here */}
      {!loading && !error && <div>Your content goes here</div>}
    </div>
  );
};

// Configure the HOC with options
export default withStateManagement(MyComponent, {
  minWidth: '320px',
  maxWidth: '1200px',
  minHeight: '300px',
  loadingText: 'Loading content...',
  errorTitle: 'Error Loading Content'
});
```

### Method 3: Using useStateManagement Hook (Recommended)

```jsx
import React, { useEffect } from 'react';
import useStateManagement from '../components/Resuable-Components/useStateManagement';
import { ComponentWrapper } from '../components/Resuable-Components/StateWrapper';

const MyComponent = () => {
  const { 
    loading, 
    error, 
    executeWithLoading, 
    handleRetry 
  } = useStateManagement();
  
  const [data, setData] = useState([]);
  
  const fetchData = async () => {
    const result = await executeWithLoading(async () => {
      const response = await fetch('/api/data');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch data');
      }
      
      setData(data);
      return data;
    }, {
      errorMessage: 'Failed to load data. Please try again.',
    });
    
    return result;
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <ComponentWrapper minWidth="320px" maxWidth="1200px">
      <StateWrapper
        loading={loading}
        error={error}
        onRetry={() => handleRetry(fetchData)}
        loadingText="Loading data..."
        errorTitle="Error Loading Data"
        minHeight="300px"
      >
        <div>
          {data.map(item => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      </StateWrapper>
    </ComponentWrapper>
  );
};

export default MyComponent;
```

## Best Practices

1. **Always set a minHeight**: This ensures the component maintains its dimensions during loading and error states.
2. **Use ComponentWrapper for responsive design**: This helps maintain consistent dimensions across different screen sizes.
3. **Provide meaningful error messages**: Error messages should be clear and actionable.
4. **Always include a retry function**: This gives users a way to recover from errors.
5. **Disable interactive elements during loading**: Prevent users from interacting with components while they're loading.
6. **Use the useStateManagement hook for new components**: It provides the cleanest API and most functionality.

## Implementing Across Your Application

To implement state management across your entire application, follow these steps:

1. **For new components**: Use the useStateManagement hook approach (Method 3).
2. **For existing simple components**: Use the StateWrapper component (Method 1).
3. **For complex components or class components**: Use the withStateManagement HOC (Method 2).

## Example Implementation for Admin Dashboard

```jsx
import React, { useEffect, useState } from 'react';
import useStateManagement from '../components/Resuable-Components/useStateManagement';
import StateWrapper, { ComponentWrapper } from '../components/Resuable-Components/StateWrapper';
import { Chart } from 'react-chartjs-2';

const AdminDashboard = () => {
  const { loading, error, executeWithLoading, handleRetry } = useStateManagement();
  const [dashboardData, setDashboardData] = useState({
    userStats: {},
    postStats: {},
    recentActivity: []
  });

  const fetchDashboardData = async () => {
    await executeWithLoading(async () => {
      // In a real app, these would be separate API calls
      const userStatsResponse = await fetch('/api/admin/stats/users');
      const userStats = await userStatsResponse.json();
      
      const postStatsResponse = await fetch('/api/admin/stats/posts');
      const postStats = await postStatsResponse.json();
      
      const recentActivityResponse = await fetch('/api/admin/activity/recent');
      const recentActivity = await recentActivityResponse.json();
      
      setDashboardData({
        userStats,
        postStats,
        recentActivity
      });
    }, {
      errorMessage: 'Failed to load dashboard data. Please try again.'
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <ComponentWrapper minWidth="320px" maxWidth="1200px" width="100%">
      <StateWrapper
        loading={loading}
        error={error}
        onRetry={() => handleRetry(fetchDashboardData)}
        loadingText="Loading dashboard data..."
        errorTitle="Error Loading Dashboard"
        minHeight="500px"
      >
        <div className="dashboard-grid">
          <div className="stats-card">
            <h3>User Statistics</h3>
            <Chart type="bar" data={dashboardData.userStats} />
          </div>
          
          <div className="stats-card">
            <h3>Post Statistics</h3>
            <Chart type="line" data={dashboardData.postStats} />
          </div>
          
          <div className="activity-card">
            <h3>Recent Activity</h3>
            <ul>
              {dashboardData.recentActivity.map(activity => (
                <li key={activity.id}>
                  {activity.user} {activity.action} at {activity.timestamp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </StateWrapper>
    </ComponentWrapper>
  );
};

export default AdminDashboard;
```
