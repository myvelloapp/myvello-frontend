"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: (DropdownOption | string)[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  disabled?: boolean;
  align?: "left" | "right";
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
  triggerClassName,
  menuClassName,
  icon,
  size = "sm",
  disabled = false,
  align = "left",
  searchable = false,
  searchPlaceholder = "Search...",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect if menu should open upwards to prevent viewport overflow
  useEffect(() => {
    if (isOpen && containerRef.current && typeof window !== "undefined") {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 280 && rect.top > spaceBelow) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
    if (!isOpen) {
      setSearchQuery("");
    } else if (searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  // Normalize options to DropdownOption shape
  const normalizedOptions: DropdownOption[] = useMemo(
    () => options.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt)),
    [options]
  );

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.badge && opt.badge.toLowerCase().includes(q))
    );
  }, [normalizedOptions, searchable, searchQuery]);

  // Find currently selected option (with case-insensitive and friendly fallback)
  const currentOption = normalizedOptions.find(
    (opt) => opt.value === value || opt.value.toLowerCase() === (value || "").toLowerCase()
  );
  const displayLabel = currentOption
    ? currentOption.label
    : value && value.trim()
    ? value.replace(/_/g, " ")
    : placeholder;

  // Handle outside click to close
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const isSmall = size === "sm";

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-left", className)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            if (spaceBelow < 240 && spaceAbove > spaceBelow) {
              setOpenUpwards(true);
            } else {
              setOpenUpwards(false);
            }
          }
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-[8px] border transition-all cursor-pointer select-none touch-manipulation active:scale-[0.98]",
          isSmall ? "h-9 sm:h-8 min-h-[36px] sm:min-h-[32px] text-xs px-2.5 font-semibold" : "h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs px-3 font-semibold",
          isOpen
            ? "bg-white border-indigo-500 ring-2 ring-indigo-500/15 shadow-xs text-slate-900"
            : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300",
          disabled && "opacity-50 cursor-not-allowed bg-slate-50",
          triggerClassName
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
          {currentOption?.icon && (
            <span className="shrink-0">{currentOption.icon}</span>
          )}
          <span className="truncate">{displayLabel}</span>
        </div>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-1",
            isOpen && "rotate-180 text-indigo-600"
          )}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 min-w-full sm:min-w-[220px] max-h-72 flex flex-col",
            openUpwards ? "bottom-full mb-1.5" : "top-full mt-1.5",
            "bg-white/98 backdrop-blur-md rounded-[14px] border border-slate-200/90",
            "shadow-[0_12px_36px_-6px_rgba(15,23,42,0.14),0_4px_12px_-2px_rgba(15,23,42,0.06)]",
            "p-1.5 animate-in fade-in zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0",
            menuClassName
          )}
          role="listbox"
        >
          {searchable && (
            <div className="p-1 pb-1.5 border-b border-slate-100 bg-white/95 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  inputMode="search"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-11 sm:h-8 pl-9 pr-8 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl sm:rounded-[8px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400 touch-manipulation"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer touch-manipulation active:scale-95"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="overflow-y-auto flex-1 space-y-0.5 pt-1">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-center text-xs font-medium text-slate-400">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full px-3 sm:px-2.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[32px] rounded-xl sm:rounded-[8px] text-xs font-semibold flex items-center justify-between text-left transition-colors cursor-pointer group touch-manipulation active:scale-[0.99]",
                      isSelected
                        ? "bg-indigo-50/90 text-indigo-700 font-bold"
                        : "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      {option.icon && (
                        <span className="shrink-0">{option.icon}</span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {option.badge && (
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.2 rounded-md",
                          option.badge === "Suggested"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-500"
                        )}>
                          {option.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" strokeWidth={2.5} />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
