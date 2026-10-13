// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * useApi — a simple data-fetching hook with loading/error/refetch.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(
 *     () => nutritionService.nutritionists(),
 *     []
 *   );
 */
export function useApi(fetcher, deps = [], options = {}) {
  const {
    immediate = true,
    showError = true,
    initialData = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (e) {
      // Ignore 404s for optional endpoints (no plan, no DEXA)
      const status = e?.response?.status;
      const silent = !showError || status === 404;

      if (!silent) {
        const msg =
          e?.response?.data?.detail ||
          e?.message ||
          'Failed to fetch data';
        toast.error(msg);
      }

      setError(e);
      return null; // don't throw — prevents unhandled rejections
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
}

export default useApi;