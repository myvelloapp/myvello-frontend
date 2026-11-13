"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/modules/authentication/AuthContext";
import { emiService, CalendarEventItem } from "@/services/emiService";

interface MiniCalendarProps {
  onSelectEvent?: (event: CalendarEventItem) => void;
}

export function MiniCalendar({ onSelectEvent: _onSelectEvent }: MiniCalendarProps) {
  const { user } = useAuth();
  const currency = user?.preferred_currency || "INR";
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(() => new Date().getDate());
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
    setSelectedDay(null);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Load live calendar events
  const loadCalendarEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await emiService.getCalendarEvents(year, month);
      setEvents(data.items || []);
    } catch {
      // Fallback silently if offline
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadCalendarEvents();
  }, [loadCalendarEvents]);

  // Days in month calculation
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDayOffset = new Date(year, month - 1, 1).getDay(); // 0=Sun, 6=Sat

  // Map real events by day
  const eventsByDay = events.reduce<Record<number, CalendarEventItem>>((acc, item) => {
    acc[item.day] = item;
    return acc;
  }, {});

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Selected day details
  const activeEvent = selectedDay ? eventsByDay[selectedDay] : null;

  return (
    <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 transition-all hover:shadow-md">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-8 h-8 min-w-[36px] min-h-[36px] rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black text-[#0B132B] tracking-tight">
            {monthNames[month - 1]} {year}
          </span>
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="w-8 h-8 min-w-[36px] min-h-[36px] rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-slate-400 mb-2">
        {weekdays.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {/* Blank offset cells */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`blank-${i}`} className="h-7.5 w-7.5" />
        ))}

        {/* Days 1 to N */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const realItem = eventsByDay[day];
          const isSelected = selectedDay === day;

          // Status styling
          const isDueSoon =
            realItem?.status === "due_soon" ||
            realItem?.status === "overdue";
          const isUpcoming = realItem?.status === "upcoming";
          const isPaid = realItem?.status === "paid";

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={cn(
                "h-7.5 w-7.5 min-w-[30px] min-h-[30px] mx-auto rounded-full flex items-center justify-center text-[11px] font-semibold transition-all relative cursor-pointer touch-manipulation active:scale-90",
                isSelected
                  ? "bg-[#4F46E5] text-white font-black shadow-xs ring-2 ring-indigo-200"
                  : isDueSoon
                  ? "bg-rose-50 text-rose-700 font-bold"
                  : isUpcoming
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : isPaid
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selected Day Info Popup */}
      {activeEvent && (
        <div className="mt-3.5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-1 animate-fade-in">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span className="truncate max-w-[170px]">{activeEvent.loan_name}</span>
            <span suppressHydrationWarning className="text-indigo-600 font-black">
              {formatCurrency(activeEvent.amount, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {activeEvent.lender_name} • Due on {activeEvent.due_date}
            </span>
            <Link
              href={`/emis/${activeEvent.emi_id}`}
              className="text-indigo-600 hover:text-indigo-800 font-extrabold inline-flex items-center gap-0.5"
            >
              <span>View</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
