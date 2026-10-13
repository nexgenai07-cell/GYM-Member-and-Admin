import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * useAsync - handles async actions with loading and error states.
 */
export function useAsync(asyncFn, options = {}) {
  const { showSuccess = false, successMessage = 'Success', showError = true } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn(...args);
        if (showSuccess) toast.success(successMessage);
        return result;
      } catch (e) {
        const msg = e.response?.data?.detail || e.message || 'Something went wrong';
        setError(msg);
        if (showError) toast.error(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn, showSuccess, successMessage, showError]
  );

  return { execute, loading, error };
}