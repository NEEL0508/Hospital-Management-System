import { useState, useCallback } from 'react';

/**
 * useApi - generic hook for making API calls with loading/error state management.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(apiFn);
 *   await execute(arg1, arg2);
 */
const useApi = (apiFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFn(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || 'Something went wrong';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useApi;
