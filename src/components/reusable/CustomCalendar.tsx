'use client';

import { useState, type MouseEvent, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  setMonth as dfSetMonth,
  setYear as dfSetYear,
} from 'date-fns';

interface CustomCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
  /** Optional year bounds for the year dropdown */
  minYear?: number;
  maxYear?: number;
}

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

export function CustomCalendar({
  value,
  onChange,
  className,
  disableFutureDates = false,
  disablePastDates = false,
  minYear,
  maxYear,
}: CustomCalendarProps) {
  const today = new Date();

  // initial month: either selected value's month or today
  const initialMonthKey = format(value || today, 'MMM-yyyy');
  const [monthKey, setMonthKey] = useState(initialMonthKey);

  // parse the "MMM-yyyy" key into a Date representing the first day of that month
  const firstDayOfMonth = parse(monthKey, 'MMM-yyyy', new Date());

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthStart = startOfMonth(firstDayOfMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  // Year dropdown range (defaults to 1970..current+10 if not provided)
  const years = useMemo(() => {
    const currentYear = today.getFullYear();
    const from = minYear ?? 1970;
    const to = maxYear ?? currentYear + 10;
    const arr: number[] = [];
    for (let y = from; y <= to; y++) arr.push(y);
    return arr;
  }, [minYear, maxYear]);

  function setViewBy(year: number, monthIndex: number) {
    const base = startOfMonth(new Date()); // any date; we'll override y/m
    const withYear = dfSetYear(base, year);
    const withMonth = dfSetMonth(withYear, monthIndex);
    setMonthKey(format(withMonth, 'MMM-yyyy'));
  }

  function previousMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const prev = add(firstDayOfMonth, { months: -1 });
    setMonthKey(format(prev, 'MMM-yyyy'));
  }

  function nextMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const next = add(firstDayOfMonth, { months: 1 });
    setMonthKey(format(next, 'MMM-yyyy'));
  }

  function isDateDisabled(date: Date) {
    if (disableFutureDates && date > today) return true;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (disablePastDates && date < startOfToday) return true;
    return false;
  }

  function handleDateSelect(date: Date, e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    onChange?.(date);
  }

  function handleCalendarClick(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  const currentYear = firstDayOfMonth.getFullYear();
  const currentMonthIndex = firstDayOfMonth.getMonth();

  return (
    <div
      className={cn('p-3 bg-white rounded-md shadow-md', className)}
      onClick={handleCalendarClick}
      onMouseDown={handleCalendarClick}
    >
      {/* Header with arrows + month/year dropdowns */}
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
          {/* Month select */}
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

          {/* Year select */}
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

      {/* Weekday row */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-2">
        {dateRange.map((date, i) => {
          const isSelected = value ? isEqual(date, value) : false;
          const isCurrentMonth = isSameMonth(date, firstDayOfMonth);
          const disabled = isDateDisabled(date);

          return (
            <Button
              key={i}
              variant={isSelected ? 'default' : 'ghost'}
              size="sm"
              type="button"
              className={cn(
                'h-6 w-6 p-0 font-normal',
                !isCurrentMonth && 'text-muted-foreground opacity-50',
                isSelected && 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white',
                isToday(date) && !isSelected && 'border border-blue-500',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={disabled}
              onClick={(e) => !disabled && handleDateSelect(date, e)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <time dateTime={format(date, 'yyyy-MM-dd')}>{format(date, 'd')}</time>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
