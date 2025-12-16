import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface InputProps extends React.ComponentProps<'input'> {
  isSearchable?: boolean;
}

function Input({ className, type = 'text', isSearchable = false, max, min, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {isSearchable && (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <input
        type={type}
        data-slot="input"
        max={max}
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          isSearchable ? 'pl-9' : '', // extra left padding for icon
          className
        )}
        onInput={(e) => {
          if (type === 'number' && (max !== undefined || min !== undefined)) {
            const target = e.target as HTMLInputElement;
            const value = Number(target.value);
            if (value > Number(max)) {
              target.value = String(max);
            }
            if (value < Number(min)) {
              target.value = String(min);
            }
          }
        }}
        {...props}
      />
    </div>
  );
}

export { Input };
