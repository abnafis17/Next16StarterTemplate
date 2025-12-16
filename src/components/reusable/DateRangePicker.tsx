"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

import { RangeCalendar } from "./RangeCalendar";
import { DateRange } from "@/types/dateRange";
import { CalendarRange } from "lucide-react";

export default function DateRangePicker({
  range,
  setRange,
  className = "",
  ...props
}: {
  range: DateRange;
  setRange: (range: DateRange) => void;
  className?: string;
  [key: string]: any;
}) {
  const formattedRange =
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
      <PopoverTrigger asChild className={`${className}`}>
        <Button
          variant="outline"
          className={`w-full  ${
            range.startDate || range.endDate
              ? ""
              : "bg-primary text-muted-foreground"
          }`}
        >
          <CalendarRange className="mr-2 h-4 w-4" /> {formattedRange}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <RangeCalendar value={range} onChange={setRange} />
      </PopoverContent>
    </Popover>
  );
}
