'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';

interface ReusableSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  iconClassName?: string;
  onDebouncedChange?: (value: string) => void;
  debounceDelay?: number;
  clearValue?: any;
}

const ReusableSearchInput = React.forwardRef<HTMLInputElement, ReusableSearchInputProps>(
  (
    {
      placeholder = 'Search...',
      containerClassName,
      iconClassName,
      className,
      onDebouncedChange,
      debounceDelay = 300,
      clearValue,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce(value, debounceDelay);

    useEffect(() => {
      if (onDebouncedChange) {
        onDebouncedChange(debouncedValue);
      }
    }, [debouncedValue, onDebouncedChange]);

    useEffect(() => {
      setValue('');
    }, [clearValue]);

    return (
      <div className={cn('relative w-full', containerClassName)}>
        <Search
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
            iconClassName
          )}
        />
        <Input
          ref={ref}
          type="text"
          className={cn(
            'pl-9',
            className,
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
          )}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
      </div>
    );
  }
);

ReusableSearchInput.displayName = 'ReusableSearchInput';
export default ReusableSearchInput;
