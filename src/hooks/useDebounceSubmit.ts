import { useRef, useState, useCallback, useEffect } from 'react';

interface UseDebounceSubmitOptions {
  debounceMs?: number;
}

/**
 * Hook to prevent multiple form submissions
 * @param debounceMs - Delay in milliseconds before allowing next submission (default: 1000ms)
 * @returns Object with isSubmitting state and debouncedSubmit wrapper function
 */
export function useDebounceSubmit(options: UseDebounceSubmitOptions = {}) {
  const { debounceMs = 1000 } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSubmit = useCallback(
    async <T>(submitFn: () => Promise<T> | T): Promise<T | undefined> => {
      // Prevent multiple submissions
      if (isSubmitting) {
        return undefined;
      }

      setIsSubmitting(true);

      try {
        const result = await submitFn();
        return result;
      } catch (error) {
        throw error;
      } finally {
        // Re-enable submission after delay
        timeoutRef.current = setTimeout(() => {
          setIsSubmitting(false);
        }, debounceMs);
      }
    },
    [isSubmitting, debounceMs]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isSubmitting, debouncedSubmit };
}

// Usage example:
// const { isSubmitting, debouncedSubmit } = useDebounceSubmit({ debounceMs: 1000 });
//
// const onSubmit = async (data: FormValues) => {
//   await debouncedSubmit(async () => {
//     const response = await axiosInstance.post(API.CREATE_WORKFLOW, data);
//     // handle response...
//   });
// };
