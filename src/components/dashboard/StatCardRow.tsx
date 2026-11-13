"use client";

import React from "react";
import { Layers, Calendar, Wallet, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/modules/authentication/AuthContext";
import { cn } from "@/lib/utils";

export interface StatCardRowProps {
  stats?: {
    activeEmis: number;
    monthlyEmi: number;
    totalOutstanding: number;
    paidEmis: number;
  };
  isLoading?: boolean;
}

export function StatCardRow({ stats, isLoading }: StatCardRowProps) {
  const { user } = useAuth();
  const currency = user?.preferred_currency || "INR";
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[16px] p-3 sm:p-4.5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100/90 flex items-center gap-2.5 sm:gap-3.5 animate-pulse min-h-[76px] sm:min-h-[86px]"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-100 shrink-0" />
            <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
              <div className="h-2.5 bg-slate-200/80 rounded w-14 sm:w-16" />
              <div className="h-4 sm:h-6 bg-slate-200 rounded w-20 sm:w-24" />
              <div className="h-2 sm:h-2.5 bg-slate-100 rounded w-16 sm:w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const currentStats = stats || {
    activeEmis: 0,
    monthlyEmi: 0,
    totalOutstanding: 0,
    paidEmis: 0,
  };

  const cards = [
    {
      title: "ACTIVE EMIS",
      value: currentStats.activeEmis,
      subtitle: currentStats.activeEmis === 1 ? "Active commitment" : "Active commitments",
      icon: Layers,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50/90 text-indigo-600 border border-indigo-100/70",
    },
    {
      title: "MONTHLY EMI",
      value: formatCurrency(currentStats.monthlyEmi, currency),
      subtitle: "Due this month",
      icon: Calendar,
      iconColor: "text-sky-500",
      iconBg: "bg-sky-50/90 text-sky-500 border border-sky-100/70",
    },
    {
      title: "OUTSTANDING",
      value: formatCurrency(currentStats.totalOutstanding, currency),
      subtitle: "Remaining balance",
      icon: Wallet,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50/90 text-rose-500 border border-rose-100/70",
    },
    {
      title: "PAID EMIS",
      value: currentStats.paidEmis,
      subtitle: "Settled instalments",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50/90 text-emerald-500 border border-emerald-100/70",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="bg-white rounded-[16px] p-3 sm:p-4.5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2.5 sm:gap-3.5 group min-h-[76px] sm:min-h-[86px]"
          >
            {/* Left Icon Container */}
            <div
              className={cn(
                "w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-300 group-hover:scale-105",
                c.iconBg
              )}
            >
              <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>

            {/* Right Text Content */}
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 tracking-wider uppercase block truncate">
                {c.title}
              </span>
              <span
                suppressHydrationWarning
                className="text-base sm:text-xl xl:text-2xl font-black text-[#0B132B] tracking-tight block truncate mt-0.5"
              >
                {c.value}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block truncate mt-0.5">
                {c.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
