"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { DateRange } from "@/types/dateRange";
import { CustomCalendar } from "./CustomCalendar";

type Props = {
  range: DateRange;
  setRange: (v: DateRange) => void;
  className?: string;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
  minYear?: number;
  maxYear?: number;
  fromLabel?: string;
  toLabel?: string;
  noLabel?: boolean;
};

export default function InlineRangePicker({
  range,
  setRange,
  className,
  disableFutureDates,
  disablePastDates,
  minYear,
  maxYear,
  fromLabel = "From",
  toLabel = "To",
  noLabel = false,
}: Props) {
  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);

  const fmt = (d?: Date) => (d ? format(d, "yyyy-MM-dd") : "");

  const handleFromSelect = (d: Date) => {
    // if selecting a "from" that is after current "to", push "to" to same day
    const to = range.endDate && d > range.endDate ? d : range.endDate;
    setRange({ startDate: d, endDate: to || d });
    setOpenFrom(false);
  };

  const handleToSelect = (d: Date) => {
    // if selecting a "to" that is before current "from", pull "from" to same day
    const from =
      range.startDate && d < range.startDate ? d : range.startDate || d;
    setRange({ startDate: from, endDate: d });
    setOpenTo(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* FROM */}
      <div className="flex items-center gap-2">
        {!noLabel && (
          <span className="text-xs text-muted-foreground">{fromLabel}</span>
        )}
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 w-35 justify-start text-muted-foreground"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="truncate">
                {range.startDate
                  ? fmt(range.startDate)
                  : noLabel && !range.startDate
                  ? "From Date"
                  : "Pick date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <CustomCalendar
              value={range.startDate}
              onChange={handleFromSelect}
              disableFutureDates={disableFutureDates}
              disablePastDates={disablePastDates}
              minYear={minYear}
              maxYear={maxYear}
              className="p-2"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* TO */}
      <div className="flex items-center gap-2">
        {!noLabel && (
          <span className="text-xs text-muted-foreground">{toLabel}</span>
        )}
        <Popover open={openTo} onOpenChange={setOpenTo}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 w-35 justify-start text-muted-foreground"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="truncate">
                {range.endDate
                  ? fmt(range.endDate)
                  : noLabel && !range.endDate
                  ? "To Date"
                  : "Pick date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <CustomCalendar
              value={range.endDate}
              onChange={handleToSelect}
              disableFutureDates={disableFutureDates}
              disablePastDates={disablePastDates}
              minYear={minYear}
              maxYear={maxYear}
              className="p-2"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
