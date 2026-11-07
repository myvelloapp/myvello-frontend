"use client";

import React from "react";
import { Layers, Calendar, Coins, CheckCircle2 } from "lucide-react";
import { emiSummaryStats } from "@/lib/mockData";

export function StatCardRow() {
  const cards = [
    {
      title: "Active EMIs",
      value: emiSummaryStats.activeEmis,
      icon: Layers,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50 border-indigo-100/60",
    },
    {
      title: "Monthly EMI",
      value: `₹${emiSummaryStats.monthlyEmi.toLocaleString()}`,
      icon: Calendar,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-100/60",
    },
    {
      title: "Outstanding",
      value: `₹${emiSummaryStats.totalOutstanding.toLocaleString()}`,
      icon: Coins,
      iconColor: "text-pink-600",
      bgColor: "bg-pink-50 border-pink-100/60",
    },
    {
      title: "Paid EMIs",
      value: emiSummaryStats.paidEmis,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-100/60",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition-all hover:shadow-sm flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {c.title}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 block">
                {c.value}
              </span>
            </div>
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${c.bgColor}`}
            >
              <Icon className={`w-5 h-5 ${c.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
