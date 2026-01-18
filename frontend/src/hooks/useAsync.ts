/**
 * useAsync - Custom hook for managing async data fetching.
 *
 * Provides consistent handling of loading, error, and success states
 * for any async operation.
 *
 * @example
 * function ClientList() {
 *   const { data, loading, error, execute } = useAsync(
 *     () => clientService.list(),
 *     { immediate: true }
 *   );
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error} />;
 *   return <ClientTable clients={data?.items ?? []} />;
 * }
 */
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAsyncOptions {
  /** Execute the async function immediately on mount */
  immediate?: boolean;
  /** Reset data when executing again */
  resetOnExecute?: boolean;
}

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncReturn<T, Args extends unknown[]> extends UseAsyncState<T> {
  /** Execute the async function */
  execute: (...args: Args) => Promise<T | null>;
  /** Reset state to initial values */
  reset: () => void;
  /** Set data manually */
  setData: (data: T | null) => void;
}

/**
 * Custom hook for managing async operations with loading/error states.
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T, Args> {
  const { immediate = false, resetOnExecute = false } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  // Track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);

  // Store latest asyncFunction to avoid stale closures
  const asyncFunctionRef = useRef(asyncFunction);

  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      if (resetOnExecute) {
        setState({ data: null, loading: true, error: null });
      } else {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }

      try {
        const result = await asyncFunctionRef.current(...args);

        if (mountedRef.current) {
          setState({ data: result, loading: false, error: null });
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';

        if (mountedRef.current) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
        }

        return null;
      }
    },
    [resetOnExecute]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  // Execute immediately if option is set
  useEffect(() => {
    if (immediate) {
      const timer = setTimeout(() => {
        execute(...([] as unknown as Args));
      }, 0);
      return () => clearTimeout(timer);
    }
    return;
  }, [immediate, execute]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

export default useAsync;
