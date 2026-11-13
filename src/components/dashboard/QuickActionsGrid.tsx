"use client";

import React from "react";
import Link from "next/link";
import { Plus, FileText, BarChart3, Bell, Zap } from "lucide-react";

export function QuickActionsGrid() {
  const actions = [
    {
      label: "Add EMI",
      href: "/emis/new",
      icon: Plus,
      color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
    },
    {
      label: "View History",
      href: "/payment-history",
      icon: FileText,
      color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
    },
    {
      label: "Reports",
      href: "/emis",
      icon: BarChart3,
      color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
    },
    {
      label: "Reminders",
      href: "/notifications",
      icon: Bell,
      color: "text-amber-600 bg-amber-50 hover:bg-amber-100",
    },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-slate-200/80 p-5 shadow-[0_2px_10px_-3px_rgba(15,23,42,0.05)] transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-2 mb-4 text-[#0B132B]">
        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
        </div>
        <h3 className="text-sm font-extrabold tracking-tight text-[#0B132B]">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.label}
              href={act.href}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-100/90 hover:border-slate-200 hover:shadow-2xs transition-all group text-center"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${act.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                {act.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
