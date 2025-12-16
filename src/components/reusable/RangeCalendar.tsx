'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isEqual,
  isAfter,
  isBefore,
  isValid,
  add,
} from 'date-fns';

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

interface RangeCalendarProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

export function RangeCalendar({ value, onChange }: RangeCalendarProps) {
  const today = new Date();
  const initialDate = value?.startDate && isValid(value.startDate) ? value.startDate : today;
  const [month, setMonth] = useState(format(initialDate, 'MMM-yyyy'));

  const [selection, setSelection] = useState<DateRange>(value || {});

  useEffect(() => {
    setSelection(value || {});
  }, [value]);

  const firstDayOfMonth = parse(month, 'MMM-yyyy', new Date());
  const monthStart = startOfMonth(firstDayOfMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const daysInGrid = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  function previousMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const prevMonth = add(firstDayOfMonth, { months: -1 });
    setMonth(format(prevMonth, 'MMM-yyyy'));
  }

  function nextMonth(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const nextMonth = add(firstDayOfMonth, { months: 1 });
    setMonth(format(nextMonth, 'MMM-yyyy'));
  }

  function handleDateSelect(date: Date, e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!selection.startDate || (selection.startDate && selection.endDate)) {
      setSelection({ startDate: date, endDate: undefined });
      onChange?.({ startDate: date, endDate: undefined });
      return;
    }

    if (selection.startDate && !selection.endDate) {
      if (isBefore(date, selection.startDate)) {
        setSelection({ startDate: date, endDate: selection.startDate });
        onChange?.({ startDate: date, endDate: selection.startDate });
      } else {
        setSelection({ startDate: selection.startDate, endDate: date });
        onChange?.({ startDate: selection.startDate, endDate: date });
      }
      return;
    }
  }

  function isInRange(date: Date) {
    if (!selection.startDate || !selection.endDate) return false;
    return (
      (isAfter(date, selection.startDate) || isEqual(date, selection.startDate)) &&
      (isBefore(date, selection.endDate) || isEqual(date, selection.endDate))
    );
  }

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="p-3 bg-white rounded-md shadow-md w-72 select-none">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={previousMonth} type="button">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <h2 className="font-medium text-sm">{format(firstDayOfMonth, 'MMMM yyyy')}</h2>
        <Button variant="ghost" size="icon" onClick={nextMonth} type="button">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-muted-foreground">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInGrid.map((date) => {
          const isSelectedStart = selection.startDate && isEqual(date, selection.startDate);
          const isSelectedEnd = selection.endDate && isEqual(date, selection.endDate);
          const isInSelectedRange = isInRange(date);
          const isCurrentMonth = isSameMonth(date, firstDayOfMonth);
          const isTodayDate = isToday(date);

          return (
            <Button
              key={date.toISOString()}
              size="sm"
              variant={isSelectedStart || isSelectedEnd ? 'default' : 'ghost'}
              className={`h-8 w-8 p-0 font-normal
                ${!isCurrentMonth ? 'text-muted-foreground opacity-50' : ''}
                ${isSelectedStart || isSelectedEnd ? 'bg-blue-500 text-white   ' : ''}
                ${isInSelectedRange && !(isSelectedStart || isSelectedEnd) ? 'bg-blue-200 text-blue-900' : ''}
                ${isTodayDate && !(isSelectedStart || isSelectedEnd) ? 'border border-blue-500' : ''}
              `}
              onClick={(e) => handleDateSelect(date, e)}
              type="button"
            >
              <time dateTime={format(date, 'yyyy-MM-dd')}>{format(date, 'd')}</time>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
