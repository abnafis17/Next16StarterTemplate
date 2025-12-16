"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "@/types/dateRange";
import { RangeCalendarWithDropdowns } from "./RangeCalendarWithDropdowns";

type Props = {
  range: DateRange;
  setRange: (r: DateRange) => void;
  className?: string;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
  minYear?: number;
  maxYear?: number;
  [key: string]: any;
};

export default function DateRangePickerWithDropdowns({
  range,
  setRange,
  className = "",
  disableFutureDates = false,
  disablePastDates = false,
  minYear,
  maxYear,
  ...props
}: Props) {
  const formatted =
    range.startDate && range.endDate
      ? `${format(range.startDate, "MMM dd, yyyy")} - ${format(
          range.endDate,
          "MMM dd, yyyy"
        )}`
      : range.startDate
      ? format(range.startDate, "MMM dd, yyyy")
      : "Select date range";

  return (
    <Popover>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          className={`w-full ${
            range.startDate || range.endDate
              ? ""
              : "bg-primary text-muted-foreground"
          }`}
        >
          <CalendarRange className="mr-2 h-4 w-4" /> {formatted}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <RangeCalendarWithDropdowns
          value={range}
          onChange={setRange}
          disableFutureDates={disableFutureDates}
          disablePastDates={disablePastDates}
          minYear={minYear}
          maxYear={maxYear}
        />
      </PopoverContent>
    </Popover>
  );
}
