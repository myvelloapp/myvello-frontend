"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomDatePickerProps {
  value: string; // ISO date string "YYYY-MM-DD"
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  hasError?: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date...",
  minDate: _minDate,
  maxDate: _maxDate,
  disabled = false,
  required = false,
  className,
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view month/year from current value or today
  const initialDate = useMemo(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
    return new Date();
  }, [value]);

  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth()); // 0-indexed

  // When value prop updates, sync view
  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setViewYear(parseInt(parts[0], 10));
        setViewMonth(parseInt(parts[1], 10) - 1);
      }
    }
  }, [value]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen]);

  // Auto-detect if popover should open upwards
  useEffect(() => {
    if (isOpen && containerRef.current && typeof window !== "undefined") {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 320 && rect.top > spaceBelow) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
  }, [isOpen]);

  // Navigate months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Quick Jump Today
  const handleToday = () => {
    const today = new Date();
    const str = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    onChange(str);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Format date for button display: "08 Nov, 2026"
  const formattedDisplay = useMemo(() => {
    if (!value) return "";
    const parts = value.split("-");
    if (parts.length !== 3) return value;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, m, d);
    if (isNaN(dateObj.getTime())) return value;
    return dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [value]);

  // Calendar Days Computation
  const calendarCells = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const cells: {
      day: number;
      monthOffset: number; // -1 prev, 0 current, 1 next
      dateStr: string;
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Fill leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevM = viewMonth === 0 ? 12 : viewMonth;
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = `${prevY}-${String(prevM).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        day: d,
        monthOffset: -1,
        dateStr,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value,
      });
    }

    // Fill current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        day: d,
        monthOffset: 0,
        dateStr,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value,
      });
    }

    // Fill trailing days to complete rows (multiples of 7)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextM = viewMonth === 11 ? 1 : viewMonth + 2;
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${nextY}-${String(nextM).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        day: d,
        monthOffset: 1,
        dateStr,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value,
      });
    }

    return cells;
  }, [viewYear, viewMonth, value]);

  const handleSelectDay = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block w-full text-left", className)}>
      {/* Trigger Button Input */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] px-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all select-none cursor-pointer group shadow-2xs active:scale-[0.99] touch-manipulation",
          hasError
            ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20 text-rose-900"
            : isOpen
            ? "bg-white border-indigo-500 ring-2 ring-indigo-500/20 text-slate-900"
            : "bg-white hover:bg-slate-50/50 border-slate-200/90 text-slate-800 hover:border-slate-300",
          disabled && "opacity-50 cursor-not-allowed bg-slate-50"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon
            className={cn(
              "w-4 h-4 sm:w-3.5 sm:h-3.5 transition-colors shrink-0",
              isOpen || value ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"
            )}
          />
          {value ? (
            <span className="font-bold text-slate-900 tracking-tight">{formattedDisplay}</span>
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {value && !disabled && (
            <span
              onClick={handleClear}
              className="p-1.5 sm:p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center active:scale-95 touch-manipulation"
              title="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </button>

      {/* Floating Modern Calendar Popover */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-[min(calc(100vw-2.5rem),19rem)] sm:w-72 bg-white rounded-2xl border border-slate-200/90",
            "shadow-[0_12px_36px_-6px_rgba(15,23,42,0.14),0_4px_14px_-2px_rgba(15,23,42,0.06)]",
            "p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-150 right-0 sm:right-auto left-auto sm:left-0",
            openUpwards ? "bottom-full mb-1.5" : "top-full mt-1.5"
          )}
        >
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-9 h-9 sm:w-7 sm:h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-xs font-black text-[#0B132B] tracking-tight">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-9 h-9 sm:w-7 sm:h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Row */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="text-[10px] font-extrabold text-slate-400 uppercase py-0.5">
                {w}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {calendarCells.map((cell) => {
              const isCurrentMonth = cell.monthOffset === 0;

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => handleSelectDay(cell.dateStr)}
                  className={cn(
                    "h-9 sm:h-7 w-full rounded-lg flex items-center justify-center text-xs font-semibold transition-all cursor-pointer active:scale-95 touch-manipulation",
                    cell.isSelected
                      ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25 scale-[1.02]"
                      : isCurrentMonth
                      ? cell.isToday
                        ? "bg-indigo-50/80 text-indigo-700 font-black border border-indigo-200/80"
                        : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                      : "text-slate-300 hover:text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Quick Footer Action Row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer py-1 px-2 rounded-lg active:scale-95 touch-manipulation"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer flex items-center gap-1 py-1 px-2 rounded-lg active:scale-95 touch-manipulation"
            >
              <span>Today</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
