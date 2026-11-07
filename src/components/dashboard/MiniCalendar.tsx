"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MiniCalendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(10);

  // November 2025: starts on Saturday (column index 6), has 30 days
  const daysInMonth = 30;
  const startDayOffset = 6; // Saturday is 6th index (0=Sun)

  // Highlighted EMI markers matching the design image
  const emiMarkers: Record<number, { type: "due_soon" | "upcoming" | "paid"; title: string; amount: number }> = {
    10: { type: "due_soon", title: "Home Loan (HDFC)", amount: 18500 },
    15: { type: "upcoming", title: "Car Loan (SBI)", amount: 14000 },
    20: { type: "upcoming", title: "Personal Loan (ICICI)", amount: 8000 },
    25: { type: "upcoming", title: "Bike Loan (Axis)", amount: 2000 },
    28: { type: "paid", title: "Advance Settlement", amount: 5000 },
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition-all hover:shadow-sm">
      {/* Month Navigation Header matching screenshot */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-slate-900 tracking-tight">
          November 2025
        </span>
        <button
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-2">
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
          <div key={`blank-${i}`} className="h-7 w-7" />
        ))}

        {/* Days 1 to 30 */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const marker = emiMarkers[day];
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "h-7 w-7 mx-auto rounded-full flex items-center justify-center text-[11px] font-medium transition-all relative cursor-pointer",
                marker?.type === "due_soon"
                  ? "bg-[#4F46E5] text-white font-bold ring-2 ring-indigo-200"
                  : marker?.type === "upcoming"
                  ? "bg-indigo-100/80 text-indigo-700 font-bold"
                  : marker?.type === "paid"
                  ? "bg-emerald-100 text-emerald-800 font-bold"
                  : "text-slate-700 hover:bg-slate-100",
                isSelected && !marker && "ring-2 ring-slate-400 font-bold"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selected Day Info Popup */}
      {selectedDay && emiMarkers[selectedDay] && (
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <div className="font-semibold text-slate-800 flex items-center justify-between">
            <span>{emiMarkers[selectedDay].title}</span>
            <span className="text-indigo-600 font-bold">
              ₹{emiMarkers[selectedDay].amount.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Due on {selectedDay} November 2025
          </div>
        </div>
      )}

      {/* Legend matching screenshot */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-[10px] font-medium text-slate-500">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
          <span>Due Soon</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-300" />
          <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Paid</span>
        </div>
      </div>
    </div>
  );
}
