'use client';

import React, { useMemo, useState, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
  setYear as dfSetYear,
  setMonth as dfSetMonth,
} from 'date-fns';
import type { DateRange } from '@/types/dateRange';

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
  minYear?: number;
  maxYear?: number;
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function RangeCalendarWithDropdowns({
  value,
  onChange,
  className,
  disableFutureDates = false,
  disablePastDates = false,
  minYear,
  maxYear,
}: Props) {
  const today = new Date();

  // Display state: which month/year is currently shown
  const initialMonthKey = format(value.startDate || today, 'MMM-yyyy');
  const [monthKey, setMonthKey] = useState(initialMonthKey);

  // Hover state for "preview" range while selecting end date
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // "MMM-yyyy" -> Date (first day of that month)
  const firstDayOfMonth = parse(monthKey, 'MMM-yyyy', new Date());
  const monthStart = startOfMonth(firstDayOfMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const dateGrid = eachDayOfInterval({ start: startDate, end: endDate });

  const years = useMemo(() => {
    const currentYear = today.getFullYear();
    const from = minYear ?? 1970;
    const to = maxYear ?? currentYear + 10;
    const arr: number[] = [];
    for (let y = from; y <= to; y++) arr.push(y);
    return arr;
  }, [minYear, maxYear]);

  function setViewBy(year: number, monthIndex: number) {
    const base = startOfMonth(new Date());
    const withYear = dfSetYear(base, year);
    const withMonth = dfSetMonth(withYear, monthIndex);
    setMonthKey(format(withMonth, 'MMM-yyyy'));
  }

  function previousMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setMonthKey(format(add(firstDayOfMonth, { months: -1 }), 'MMM-yyyy'));
  }

  function nextMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setMonthKey(format(add(firstDayOfMonth, { months: 1 }), 'MMM-yyyy'));
  }

  function isDisabled(d: Date) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (disableFutureDates && d > startOfToday) return true;
    if (disablePastDates && d < startOfToday) return true;
    return false;
  }

  // Range helpers
  const hasStart = Boolean(value.startDate);
  const hasEnd = Boolean(value.endDate);
  const selectingEnd = hasStart && !hasEnd;

  function handleDayClick(d: Date, e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled(d)) return;

    if (!hasStart || (hasStart && hasEnd)) {
      // Begin new range
      onChange({ startDate: d, endDate: undefined });
      setHoverDate(null);
      return;
    }

    // Choosing end date; if clicked before start, swap
    const start = value.startDate!;
    if (isBefore(d, start)) {
      onChange({ startDate: d, endDate: start });
    } else {
      onChange({ startDate: start, endDate: d });
    }
    setHoverDate(null);
  }

  function handleMouseEnter(d: Date) {
    if (selectingEnd && !isDisabled(d)) {
      setHoverDate(d);
    }
  }

  function handleMouseLeave() {
    if (selectingEnd) setHoverDate(null);
  }

  // Is a date inside the "current (confirmed or preview) range"
  function inRange(d: Date) {
    const start = value.startDate;
    const end = value.endDate ?? (selectingEnd && hoverDate ? hoverDate : null);
    if (!start || !end) return false;

    const [minD, maxD] = isAfter(start, end) ? [end, start] : [start, end];
    return (isAfter(d, minD) || isSameDay(d, minD)) && (isBefore(d, maxD) || isSameDay(d, maxD));
  }

  const currentYear = firstDayOfMonth.getFullYear();
  const currentMonthIndex = firstDayOfMonth.getMonth();

  return (
    <div className={cn('p-3 bg-white rounded-md shadow-md select-none', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          onMouseDown={(e) => e.stopPropagation()}
          className="h-7 w-7"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>

        <div className="flex items-center gap-2">
          <select
            className="h-8 rounded-md border px-2 text-sm outline-none"
            value={currentMonthIndex}
            onChange={(e) => setViewBy(currentYear, Number(e.target.value))}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="h-8 rounded-md border px-2 text-sm outline-none"
            value={currentYear}
            onChange={(e) => setViewBy(Number(e.target.value), currentMonthIndex)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          onMouseDown={(e) => e.stopPropagation()}
          className="h-7 w-7"
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      {/* Week header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2">
        {dateGrid.map((d) => {
          const disabled = isDisabled(d);
          const isCurMonth = isSameMonth(d, firstDayOfMonth);
          const isStart = value.startDate ? isSameDay(d, value.startDate) : false;
          const isEnd = value.endDate ? isSameDay(d, value.endDate) : false;
          const isSelectedEdge = isStart || isEnd;
          const isBetween = inRange(d) && !isSelectedEdge;

          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={disabled}
              onMouseEnter={() => handleMouseEnter(d)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleDayClick(d, e)}
              onMouseDown={(e) => e.stopPropagation()}
              className={cn(
                'h-8 w-8 rounded-md text-sm flex items-center justify-center',
                'transition-colors',
                !isCurMonth && 'text-muted-foreground opacity-50',
                disabled && 'opacity-40 cursor-not-allowed',
                isBetween && 'bg-blue-100',
                isSelectedEdge && 'bg-blue-500 text-white',
                !isSelectedEdge && !isBetween && 'hover:bg-accent hover:text-accent-foreground',
                isToday(d) && !isSelectedEdge && 'border border-blue-500'
              )}
            >
              <time dateTime={format(d, 'yyyy-MM-dd')}>{format(d, 'd')}</time>
            </button>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex items-center justify-between mt-3">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => onChange({ startDate: undefined, endDate: undefined })}
        >
          Clear
        </Button>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => {
              const start = startOfWeek(today);
              const end = endOfWeek(today);
              onChange({ startDate: start, endDate: end });
              setMonthKey(format(start, 'MMM-yyyy'));
            }}
          >
            This Week
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => {
              const start = startOfMonth(today);
              const end = endOfMonth(today);
              onChange({ startDate: start, endDate: end });
              setMonthKey(format(start, 'MMM-yyyy'));
            }}
          >
            This Month
          </Button>
        </div>
      </div>
    </div>
  );
}
