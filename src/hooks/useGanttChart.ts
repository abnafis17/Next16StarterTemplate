import { useMemo, useCallback } from 'react';
import { addMonths, subDays } from 'date-fns';

const COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#ef4444',
  '#f97316',
  '#3b82f9',
];

export interface ModuleDetail {
  module_id: string;
  start_date?: string | null;
  end_date?: string | null;
  total?: number;
  complete?: number;
}

export const useGanttChart = (modules: ModuleDetail[], dayWidth = 50) => {
  /** ──────────────────────────────────────────────────────────────
   *  Date Range + Module Color Calculation
   *  ────────────────────────────────────────────────────────────── */
  const { startDate, endDate, dateRange, moduleColors } = useMemo(() => {
    if (!modules.length) {
      const year = new Date().getFullYear();
      const min = new Date(year, 0, 1);
      const max = new Date(year, 11, 31);
      return { startDate: min, endDate: max, dateRange: [], moduleColors: {} };
    }

    const colors = Object.fromEntries(
      modules.map((m, i) => [m.module_id, COLORS[i % COLORS.length]])
    );

    const moduleDates = modules.map((m) => ({
      start: m.start_date ? new Date(m.start_date) : subDays(new Date(), 15),
      end: m.end_date ? new Date(m.end_date) : addMonths(new Date(), 1),
    }));

    const minDate = new Date(Math.min(...moduleDates.map((d) => d.start.getTime())));
    const maxDate = new Date(Math.max(...moduleDates.map((d) => d.end.getTime())));
    minDate.setDate(minDate.getDate() - 1);
    maxDate.setDate(maxDate.getDate() + 1);

    const range: Date[] = [];
    const cursor = new Date(minDate);
    while (cursor <= maxDate) {
      range.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    return { startDate: minDate, endDate: maxDate, dateRange: range, moduleColors: colors };
  }, [modules]);

  /** ──────────────────────────────────────────────────────────────
   *  Utility Helpers
   *  ────────────────────────────────────────────────────────────── */
  const normalizeDate = useCallback((date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const getDayDiff = useCallback(
    (date1: Date, date2: Date) => {
      const d1 = normalizeDate(date1).getTime();
      const d2 = normalizeDate(date2).getTime();
      return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
    },
    [normalizeDate]
  );

  const calculatePosition = useCallback(
    (date: Date) => {
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      return (daysPassed / totalDays) * 100;
    },
    [startDate, endDate]
  );

  const calculateWidth = useCallback(
    (start: Date, end: Date) => calculatePosition(end) - calculatePosition(start),
    [calculatePosition]
  );

  const calculateLeftPx = useCallback(
    (date: Date) => getDayDiff(date, startDate) * dayWidth,
    [getDayDiff, startDate, dayWidth]
  );

  const calculateWidthPx = useCallback(
    (start: Date, end: Date) => Math.max(1, getDayDiff(end, start) + 1) * dayWidth,
    [getDayDiff, dayWidth]
  );

  const formatDate = useCallback(
    (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    []
  );

  return {
    startDate,
    endDate,
    dateRange,
    moduleColors,
    calculatePosition,
    calculateWidth,
    calculateLeftPx,
    calculateWidthPx,
    formatDate,
  };
};
