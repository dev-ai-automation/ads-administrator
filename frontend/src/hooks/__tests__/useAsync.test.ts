import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('should start in idle state if immediate is false', () => {
    const { result } = renderHook(() => useAsync(async () => 'test'));
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should execute immediately if immediate is true', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsync(mockFn, { immediate: true }));

    // Initial state (loading should be true initially)
    expect(result.current.loading).toBe(true);

    // Wait for update
    await waitFor(() => {
      expect(result.current.data).toBe('success');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle success state manually', async () => {
    const mockFn = jest.fn().mockResolvedValue('manual success');
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('manual success');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle error state', async () => {
    const mockError = new Error('Failed');
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed');
  });

  it('should maintain stable function references between renders', () => {
    const mockFn = jest.fn().mockResolvedValue('test');
    const { result, rerender } = renderHook(() => useAsync(mockFn));
    
    const initialExecute = result.current.execute;
    const initialReset = result.current.reset;
    const initialSetData = result.current.setData;
    
    rerender();
    
    expect(result.current.execute).toBe(initialExecute);
    expect(result.current.reset).toBe(initialReset);
    expect(result.current.setData).toBe(initialSetData);
  });
});
