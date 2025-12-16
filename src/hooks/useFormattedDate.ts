// hooks/useFormattedDate.ts
import { useCallback } from 'react';
import { format, parseISO, isValid } from 'date-fns';

export const useFormattedDate = () => {
  /**
   * Formats a given date or time using a specified format pattern.
   * @param date - Date object | ISO string | timestamp
   * @param dateFormat - e.g. 'dd MMM yyyy', 'HH:mm', etc.
   * @returns formatted date string or '-' if invalid
   */
  const formatDate = useCallback((date: Date | string | number, dateFormat = 'dd MMM yyyy') => {
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
      if (!isValid(parsedDate)) return '-';
      // If the format is 'HH:mm', use UTC hours/minutes
      if (dateFormat === 'HH:mm') {
        const hours = String(parsedDate.getUTCHours()).padStart(2, '0');
        const minutes = String(parsedDate.getUTCMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      return format(parsedDate, dateFormat);
    } catch (error) {
      console.error('Invalid date:', error);
      return '-';
    }
  }, []);
  const formatDateWithMonth = useCallback((date: Date | string | number) => {
    if (!date) return '-';
    const parsed = new Date(date);
    if (!isValid(parsed)) return '-';
    try {
      return format(parsed, 'dd MMM, yyyy');
    } catch {
      return '-';
    }
  }, []);

  return { formatDate, formatDateWithMonth };
};
