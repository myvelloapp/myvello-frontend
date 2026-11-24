"use client";

import React from "react";
import { AlertTriangle, TrendingUp, Copy, CheckCircle } from "lucide-react";
import { SubscriptionWasteAlert } from "@/types/subscription";

interface SubscriptionWasteDetectorCardProps {
  alerts: SubscriptionWasteAlert[];
  onReview?: (subscriptionId?: number | null) => void;
}

export function SubscriptionWasteDetectorCard({
  alerts,
  onReview,
}: SubscriptionWasteDetectorCardProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#02361B]">Clean Subscription Health</h4>
          <p className="text-[11px] text-slate-500">
            No redundant duplicate services, unexpected price increases, or runaway subscriptions detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {alerts.map((alert, index) => {
        const icon =
          alert.type === "duplicate" ? (
            <Copy className="w-4 h-4 text-amber-600" />
          ) : alert.type === "price_hike" ? (
            <TrendingUp className="w-4 h-4 text-red-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          );

        const cardBg =
          alert.severity === "high"
            ? "bg-red-50/70 border-red-200 text-red-900"
            : "bg-amber-50/70 border-amber-200 text-amber-900";

        return (
          <div
            key={index}
            className={`rounded-2xl border p-4 flex items-start justify-between gap-3 ${cardBg}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{icon}</div>
              <div>
                <h5 className="text-xs font-bold">{alert.title}</h5>
                <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>

            {onReview && (
              <button
                type="button"
                onClick={() => onReview(alert.subscription_id)}
                className="shrink-0 text-[11px] font-bold px-3 py-1 rounded-lg bg-white/80 hover:bg-white border border-black/5 shadow-2xs transition-colors cursor-pointer"
              >
                Review
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
