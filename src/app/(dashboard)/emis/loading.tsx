import React from "react";
import { StatCardRow } from "@/components/dashboard/StatCardRow";
import { NextPaymentCard } from "@/components/dashboard/NextPaymentCard";

export default function EmiManagementLoading() {
  return (
    <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
      <div className="relative z-10 max-w-[1500px] mx-auto space-y-2.5 sm:space-y-5">
        {/* Page Heading Skeleton */}
        <div className="flex items-center justify-between gap-3 min-h-[36px] animate-pulse">
          <div className="flex items-center gap-2.5">
            <div className="h-7 sm:h-8 w-48 rounded-lg bg-slate-200/80" />
            <div className="hidden sm:block h-6 w-36 rounded-full bg-slate-100 border border-slate-200/60" />
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-6">
          {/* Left Column: Stat Cards, Mobile Next Due, Toolbar, Table/Cards */}
          <div className="flex-1 min-w-0 space-y-3.5 sm:space-y-5 w-full">
            {/* 4 Stat Cards Row Skeleton */}
            <StatCardRow isLoading />

            {/* Mobile Next Due Stacked Banner Skeleton (lg:hidden) */}
            <div className="w-full lg:hidden animate-pulse">
              <div className="h-[62px] w-full rounded-[16px] bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] p-3.5 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-32 rounded bg-slate-200/80" />
                    <div className="h-2.5 w-24 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-7 w-16 rounded-full bg-slate-100 shrink-0" />
              </div>
            </div>

            {/* Toolbar Skeleton */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 animate-pulse">
              <div className="flex items-center gap-1.5">
                <div className="h-9 w-24 sm:w-28 rounded-[8px] bg-white border border-slate-200/80" />
                <div className="hidden sm:block h-9 w-24 rounded-[8px] bg-white border border-slate-200/80" />
              </div>
              <div className="h-9 w-20 sm:w-28 rounded-[12px] bg-slate-200/80" />
            </div>

            {/* Table & Cards Skeleton */}
            <div className="bg-white rounded-[16px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] overflow-hidden animate-pulse">
              {/* Desktop Toolbar Row */}
              <div className="hidden sm:flex px-4 py-2.5 border-b border-slate-100 items-center justify-between gap-2.5 bg-white">
                <div className="h-8 w-56 rounded-[10px] bg-slate-100" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-20 rounded-[8px] bg-slate-100" />
                  <div className="h-8 w-16 rounded-[8px] bg-slate-100" />
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-3.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8.5 h-8.5 rounded-[10px] bg-slate-100 shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-32 rounded bg-slate-200/80" />
                        <div className="h-2.5 w-20 rounded bg-slate-100" />
                      </div>
                    </div>
                    <div className="h-4 w-16 rounded bg-slate-200/70" />
                    <div className="hidden sm:block h-4 w-20 rounded bg-slate-100" />
                    <div className="hidden sm:block h-5 w-16 rounded-full bg-slate-100" />
                    <div className="h-7 w-16 rounded-[8px] bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Desktop Only): Next Payment Card & Mini Calendar Skeletons */}
          <div className="hidden lg:block w-[350px] xl:w-[380px] shrink-0 space-y-5 animate-pulse">
            <NextPaymentCard isLoading />
            <div className="h-[280px] w-full rounded-[16px] bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 rounded bg-slate-200/80" />
                <div className="flex gap-1.5">
                  <div className="h-6 w-6 rounded bg-slate-100" />
                  <div className="h-6 w-6 rounded bg-slate-100" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 my-auto">
                {Array.from({ length: 28 }).map((_, idx) => (
                  <div key={idx} className="h-6 w-6 rounded-full bg-slate-100 mx-auto" />
                ))}
              </div>
              <div className="h-3 w-36 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
