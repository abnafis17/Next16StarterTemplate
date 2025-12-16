"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface YearMonthPickerProps {
  value?: { startDate: Date; endDate: Date };
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  startYear?: number;
  endYear?: number;
  width?: string;
}

const YearMonthPicker: React.FC<YearMonthPickerProps> = ({
  value,
  onChange,
  startYear,
  endYear,
  width,
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0–11

  const minYear = startYear ?? currentYear - 50;
  const maxYear = endYear ?? currentYear + 10;

  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    value?.startDate.getFullYear() ?? currentYear
  );
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    value?.startDate.getMonth()
  );

  const [decadeStart, setDecadeStart] = useState(() => {
    const baseYear = selectedYear ?? currentYear;
    const calculatedStart = Math.floor(baseYear / 12) * 12;
    return Math.max(minYear, Math.min(calculatedStart, maxYear - 11));
  });

  const years = useMemo(() => {
    const allYears = Array.from({ length: 12 }, (_, i) => decadeStart + i);
    return allYears.filter((y) => y >= minYear && y <= maxYear);
  }, [decadeStart, minYear, maxYear]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  const handlePrev = () => {
    setDecadeStart((prev) => Math.max(minYear, prev - 12));
  };

  const handleNext = () => {
    setDecadeStart((prev) => Math.min(maxYear - 11, prev + 12));
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);

    // Start of month in UTC
    const startDate = new Date(Date.UTC(selectedYear, monthIndex, 1, 0, 0, 0));

    // End of month in UTC
    const endDate = new Date(
      Date.UTC(selectedYear, monthIndex + 1, 0, 23, 59, 59)
    );

    onChange({ startDate, endDate });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-start text-left font-normal ${
            width ?? "w-40"
          } transition-all duration-300 hover:shadow-md`}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
          {selectedYear !== undefined && selectedMonth !== undefined
            ? `${months[selectedMonth]} ${selectedYear}`
            : "Select Month & Year"}
        </Button>
      </PopoverTrigger>

      <AnimatePresence>
        {open && (
          <PopoverContent
            className="w-auto p-3 rounded-xl shadow-lg border border-gray-200 bg-white/90 backdrop-blur-md transition-all duration-300"
            align="start"
            asChild
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Year navigation */}
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-blue-100 transition"
                  onClick={handlePrev}
                  disabled={decadeStart <= minYear}
                >
                  <ChevronLeft className="h-4 w-4 text-blue-600" />
                </Button>
                <span className="font-medium text-sm text-gray-700">
                  {years[0]} - {years[years.length - 1]}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-blue-100 transition"
                  onClick={handleNext}
                  disabled={years[years.length - 1] >= maxYear}
                >
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                </Button>
              </div>

              {/* Year Grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {years.map((y) => (
                  <Button
                    key={y}
                    variant="outline"
                    className={`w-full transition-all duration-200 rounded-lg border shadow-sm hover:shadow-md
                      ${
                        y === selectedYear
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                          : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
                      }`}
                    disabled={y < minYear || y > maxYear}
                    onClick={() => handleYearSelect(y)}
                  >
                    {y}
                  </Button>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-3 gap-2">
                {months.map((m, index) => (
                  <Button
                    key={m}
                    variant="outline"
                    className={`w-full text-sm transition-all duration-200 rounded-lg border shadow-sm hover:shadow-md
                      ${
                        index === selectedMonth && selectedYear
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                          : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
                      }`}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
};

export default YearMonthPicker;
