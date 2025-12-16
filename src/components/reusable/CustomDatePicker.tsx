'use client';

import { useState, useRef, useEffect, useLayoutEffect, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { CustomCalendar } from './CustomCalendar';

interface DatePickerProps {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Convert string value to Date if needed
  const parsedDate: Date | undefined = (() => {
    if (typeof value === 'string') {
      const parsed = parse(value, 'yyyy-MM-dd', new Date());
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return value;
  })();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside as any, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any, true);
    };
  }, [open]);

  const recomputePlacement = () => {
    if (!containerRef.current) return;
    const triggerRect = containerRef.current.getBoundingClientRect();

    const estimatedHeight = 320;
    const calHeight =
      popoverRef.current?.offsetHeight && popoverRef.current.offsetHeight > 0
        ? popoverRef.current.offsetHeight
        : estimatedHeight;

    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    if (spaceBelow < calHeight && spaceAbove > spaceBelow) {
      setPlacement('top');
    } else {
      setPlacement('bottom');
    }
  };

  useLayoutEffect(() => {
    if (open) {
      recomputePlacement();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onResizeOrScroll = () => recomputePlacement();
    window.addEventListener('resize', onResizeOrScroll, { passive: true });
    window.addEventListener('scroll', onResizeOrScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener('resize', onResizeOrScroll);
      window.removeEventListener('scroll', onResizeOrScroll, true);
    };
  }, [open]);

  const handleDateChange = (date: Date) => {
    onChange(date);
  };

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((v) => !v);
  };

  return (
    <div
      className={cn('relative', className)}
      ref={containerRef}
      onClick={handleContainerClick}
      onMouseDown={handleContainerClick}
    >
      <Button
        type="button"
        variant="outline"
        className={cn('w-full pl-3 text-left font-normal', !parsedDate && 'text-muted-foreground')}
        onClick={handleToggle}
        onMouseDown={(e) => e.stopPropagation()}
        disabled={disabled}
      >
        {parsedDate ? format(parsedDate, 'PPP') : placeholder}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>

      {open && (
        <div
          ref={popoverRef}
          className={cn(
            'absolute z-100',
            placement === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
          )}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <CustomCalendar value={parsedDate} onChange={handleDateChange} />
        </div>
      )}
    </div>
  );
}
