"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { FamilySummary } from "@/services/familyService";
import { MemberAvatarStack } from "@/components/common/MemberAvatarStack";
import { cn } from "@/lib/utils";

interface FamilyWorkspaceSelectorProps {
  families: FamilySummary[];
  selectedId: number | null | undefined;
  onSelect: (familyId: number) => void;
  error?: string;
  className?: string;
}

export const FamilyWorkspaceSelector: React.FC<FamilyWorkspaceSelectorProps> = ({
  families,
  selectedId,
  onSelect,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedFamily =
    families.find((f) => f.id === selectedId) || families[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!families || families.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-2.5 min-h-[48px] rounded-xl border bg-white hover:bg-slate-50/80 transition-all cursor-pointer text-left shadow-2xs group active:scale-[0.99] touch-manipulation",
          isOpen
            ? "border-indigo-500 ring-2 ring-indigo-500/10 bg-slate-50/60"
            : error
            ? "border-rose-400 focus:border-rose-500"
            : "border-slate-200/90 hover:border-slate-300"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <MemberAvatarStack
            members={selectedFamily?.members_preview}
            count={selectedFamily?.members_count}
            type="family"
            size="md"
          />
          <div className="min-w-0">
            <span className="font-extrabold text-slate-900 text-xs block truncate leading-tight">
              {selectedFamily?.name}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 block leading-tight mt-0.5 truncate">
              Family Vault • {selectedFamily?.members_count || 1} member
              {(selectedFamily?.members_count || 1) > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 group-hover:text-slate-600",
            isOpen && "rotate-180 text-indigo-600"
          )}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200/90 rounded-2xl shadow-[0_16px_36px_-6px_rgba(15,23,42,0.18),0_4px_12px_-2px_rgba(15,23,42,0.08)] p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-2.5 py-1 text-[10px] uppercase font-black text-slate-400 tracking-wider">
            <span>Available Households</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              {families.length} Vault{families.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1 pt-0.5">
            {families.map((f) => {
              const isSelected = selectedFamily?.id === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onSelect(f.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 min-h-[44px] rounded-xl text-xs transition-all cursor-pointer text-left group active:scale-[0.99] touch-manipulation",
                    isSelected
                      ? "bg-indigo-50 text-indigo-900 border border-indigo-100/80 shadow-2xs"
                      : "text-slate-700 hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MemberAvatarStack
                      members={f.members_preview}
                      count={f.members_count}
                      type="family"
                      size="sm"
                    />
                    <div className="min-w-0">
                      <span
                        className={cn(
                          "block truncate text-xs",
                          isSelected
                            ? "font-extrabold text-indigo-950"
                            : "font-bold text-slate-800 group-hover:text-slate-900"
                        )}
                      >
                        {f.name}
                      </span>
                      <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                        {f.members_count || 1} member
                        {(f.members_count || 1) > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
