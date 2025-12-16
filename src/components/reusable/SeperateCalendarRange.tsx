"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, subMonths } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export interface SeperateCalendarRangeProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (range: { startDate?: Date; endDate?: Date }) => void;
}

const SeperateCalendarRange: React.FC<SeperateCalendarRangeProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const handleSelectStart = (date?: Date) => {
    onChange({ startDate: date, endDate });
    setOpenFrom(false);
  };

  const handleSelectEnd = (date?: Date) => {
    onChange({ startDate, endDate: date });
    setOpenTo(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Date From */}
      <Popover open={openFrom} onOpenChange={setOpenFrom}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal w-32.5"
          >
            <CalendarIcon className="mr-1 h-4 w-4" />
            {startDate ? format(startDate, "MMM dd, yyyy") : "Date From"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            defaultMonth={startDate ?? subMonths(new Date(), 1)}
            onSelect={handleSelectStart}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Date To */}
      <Popover open={openTo} onOpenChange={setOpenTo}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal w-32.5"
          >
            <CalendarIcon className="mr-1 h-4 w-4" />
            {endDate ? format(endDate, "MMM dd, yyyy") : "Date To"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            defaultMonth={endDate ?? new Date()}
            onSelect={handleSelectEnd}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SeperateCalendarRange;
