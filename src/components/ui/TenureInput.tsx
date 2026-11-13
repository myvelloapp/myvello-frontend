"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Clock, ChevronDown, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TenureInputProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const SHORT_TENURES = [
  { label: "6 Months", months: "6", subtitle: "0.5 yr" },
  { label: "1 Year", months: "12", subtitle: "12 mos" },
  { label: "2 Years", months: "24", subtitle: "24 mos" },
  { label: "3 Years", months: "36", subtitle: "36 mos" },
  { label: "4 Years", months: "48", subtitle: "48 mos" },
  { label: "5 Years", months: "60", subtitle: "60 mos" },
];

const LONG_TENURES = [
  { label: "7 Years", months: "84", subtitle: "84 mos" },
  { label: "10 Years", months: "120", subtitle: "120 mos" },
  { label: "15 Years", months: "180", subtitle: "180 mos" },
  { label: "20 Years", months: "240", subtitle: "240 mos" },
  { label: "25 Years", months: "300", subtitle: "300 mos" },
  { label: "30 Years", months: "360", subtitle: "360 mos" },
];

export const TenureInput: React.FC<TenureInputProps> = ({
  value,
  onChange,
  hasError = false,
  required = false,
  placeholder = "e.g. 60",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [yearsInput, setYearsInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const monthsNum = parseInt(value, 10) || 0;

  // Format years representation
  const yearsDisplay = useMemo(() => {
    if (!monthsNum || monthsNum <= 0) return null;
    const y = monthsNum / 12;
    if (Number.isInteger(y)) return `${y} ${y === 1 ? "yr" : "yrs"}`;
    return `${y.toFixed(1)} yrs`;
  }, [monthsNum]);

  // Handle outside click to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelectPreset = (months: string) => {
    onChange(months);
    setIsOpen(false);
  };

  const handleApplyYears = () => {
    const y = parseFloat(yearsInput);
    if (!isNaN(y) && y > 0) {
      onChange(String(Math.round(y * 12)));
      setYearsInput("");
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Input Field with Right Embedded Preset Selector */}
      <div className="relative flex items-center">
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max="600"
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm pl-3.5 pr-28 rounded-xl border transition-all placeholder:text-slate-400 font-bold shadow-2xs focus:outline-none touch-manipulation",
            hasError
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20 text-rose-900"
              : "border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
          )}
        />

        {/* Embedded Inside Button for Quick Presets / Years conversion */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "h-8 sm:h-7 px-2.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border select-none shadow-2xs active:scale-95 touch-manipulation",
              isOpen
                ? "bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-500/20"
                : monthsNum > 0
                ? "bg-indigo-50 hover:bg-indigo-100/90 text-indigo-700 border-indigo-200/70"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 border-slate-200/60"
            )}
            title="Pick tenure preset or convert years"
          >
            <Clock className={cn("w-3 h-3", isOpen ? "text-white" : monthsNum > 0 ? "text-indigo-600" : "text-slate-500")} />
            <span>{yearsDisplay ? yearsDisplay : "Presets"}</span>
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform duration-150",
                isOpen && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Floating Preset Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-[min(calc(100vw-2.5rem),20rem)] sm:w-80 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
            <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Select Loan Tenure</span>
            </span>
            {monthsNum > 0 && (
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {monthsNum} mos ({yearsDisplay})
              </span>
            )}
          </div>

          <div className="space-y-3">
            {/* Quick Convert from Years */}
            <div className="p-2 rounded-xl bg-slate-50/90 border border-slate-200/70 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                In Years:
              </span>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0.5"
                max="50"
                placeholder="e.g. 5 or 2.5"
                value={yearsInput}
                onChange={(e) => setYearsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyYears();
                  }
                }}
                className="w-24 h-8 sm:h-7 px-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-900 text-xs text-center focus:outline-none focus:border-indigo-500 touch-manipulation"
              />
              <button
                type="button"
                onClick={handleApplyYears}
                className="h-8 sm:h-7 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation"
              >
                Apply
              </button>
            </div>

            {/* Short Term (1 to 5 Yrs) */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Personal & Auto (1 – 5 Yrs)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {SHORT_TENURES.map((item) => {
                  const isSelected = value === item.months;
                  return (
                    <button
                      key={item.months}
                      type="button"
                      onClick={() => handleSelectPreset(item.months)}
                      className={cn(
                        "min-h-[44px] sm:min-h-[38px] px-2 py-1.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-95 touch-manipulation",
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                          : "bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-200 border-slate-200/70 text-slate-700"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={cn(
                            "text-xs font-bold leading-tight",
                            isSelected ? "text-white" : "text-slate-800"
                          )}
                        >
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-semibold mt-0.5",
                          isSelected ? "text-indigo-100" : "text-slate-400"
                        )}
                      >
                        {item.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Long Term (7 to 30 Yrs) */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Home & Mortgage (7 – 30 Yrs)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {LONG_TENURES.map((item) => {
                  const isSelected = value === item.months;
                  return (
                    <button
                      key={item.months}
                      type="button"
                      onClick={() => handleSelectPreset(item.months)}
                      className={cn(
                        "min-h-[44px] sm:min-h-[38px] px-2 py-1.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-95 touch-manipulation",
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                          : "bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-200 border-slate-200/70 text-slate-700"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={cn(
                            "text-xs font-bold leading-tight",
                            isSelected ? "text-white" : "text-slate-800"
                          )}
                        >
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-semibold mt-0.5",
                          isSelected ? "text-indigo-100" : "text-slate-400"
                        )}
                      >
                        {item.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Or type custom months in box</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
