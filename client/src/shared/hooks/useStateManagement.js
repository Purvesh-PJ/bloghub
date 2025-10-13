import { useState, useCallback } from 'react';

/**
 * Custom hook for managing loading, error, and normal states in components.
 *
 * @param {Object} options - Configuration options
 * @returns {Object} - State management functions and values
 */
const useStateManagement = (options = {}) => {
  const { initialLoading = false, initialError = null } = options;

  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);

  /**
   * Wraps an async function with loading and error handling
   * @param {Function} asyncFn - The async function to execute
   * @param {Object} options - Options for the execution
   * @returns {Promise<any>} - The result of the async function
   */
  const executeWithLoading = useCallback(async (asyncFn, options = {}) => {
    const {
      errorMessage = 'An error occurred. Please try again.',
      resetErrorOnStart = true,
      setLoadingOnStart = true,
      finallyCallback = null,
    } = options;

    try {
      if (setLoadingOnStart) setLoading(true);
      if (resetErrorOnStart) setError(null);

      const result = await asyncFn();
      return result;
    } catch (err) {
      console.error('Error in executeWithLoading:', err);
      setError(err.message || errorMessage);
      return null;
    } finally {
      setLoading(false);
      if (finallyCallback) finallyCallback();
    }
  }, []);

  /**
   * Reset both loading and error states
   */
  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  /**
   * Handle retry attempts
   * @param {Function} retryFn - Function to execute on retry
   */
  const handleRetry = useCallback((retryFn) => {
    setLoading(true);
    setError(null);

    if (typeof retryFn === 'function') {
      retryFn();
    }
  }, []);

  return {
    loading,
    setLoading,
    error,
    setError,
    executeWithLoading,
    resetState,
    handleRetry,
  };
};

export default useStateManagement;
