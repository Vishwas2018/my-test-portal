import { useCallback, useState } from 'react';

/**
 * Custom hook for handling async errors in functional components
 * 
 * @returns {Object} Error handling utilities
 */
const useErrorHandler = () => {
  const [error, setError] = useState(null);

  /**
   * Executes an async function and handles any errors
   * 
   * @param {Function} asyncFn - The async function to execute
   * @param {Object} options - Configuration options
   * @param {Function} options.onSuccess - Callback for successful execution
   * @param {Function} options.onError - Callback for error handling
   * @param {boolean} options.resetOnTry - Whether to reset error state before execution
   * @returns {Promise<any>} - Result of the async function or undefined on error
   */
  const handleAsyncError = useCallback(async (asyncFn, options = {}) => {
    const { 
      onSuccess, 
      onError,
      resetOnTry = true 
    } = options;

    if (resetOnTry && error) {
      setError(null);
    }

    try {
      const result = await asyncFn();
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      console.error('Async operation failed:', err);
      return undefined;
    }
  }, [error]);

  /**
   * Reset the error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    resetError,
    handleAsyncError
  };
};

export default useErrorHandler;