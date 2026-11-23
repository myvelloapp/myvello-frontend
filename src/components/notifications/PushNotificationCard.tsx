"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  isPushSupported,
  getExistingSubscription,
  subscribeToPush,
  syncPushSubscriptionToBackend,
} from "@/lib/pushNotifications";
import { cn } from "@/lib/utils";

interface PushNotificationCardProps {
  className?: string;
  compact?: boolean;
}

export function PushNotificationCard({
  className,
  compact = false,
}: PushNotificationCardProps) {
  const [supported, setSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isSupp = isPushSupported();
    setSupported(isSupp);

    if (isSupp && "Notification" in window) {
      setPermission(Notification.permission);
      getExistingSubscription().then(async (sub) => {
        setSubscription(sub);
        if (sub) {
          await syncPushSubscriptionToBackend(sub);
        } else if (Notification.permission === "granted") {
          const res = await subscribeToPush();
          if (res.success && res.subscription) {
            setSubscription(res.subscription);
          }
        }
      });
    }
  }, []);

  const handleEnablePush = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    setIsError(false);

    try {
      const res = await subscribeToPush();
      if (res.success && res.subscription) {
        setSubscription(res.subscription);
        setPermission("granted");
        setStatusMessage("Desktop & mobile push alerts active!");
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setIsError(true);
        setStatusMessage(res.error || "Could not activate notifications.");
      }
    } catch (err: any) {
      setIsError(true);
      setStatusMessage(err?.message || "Unexpected error enabling push notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  // If running in browser where push is unsupported (e.g. old desktop safari)
  if (!supported) {
    return null;
  }

  const isSubscribed = Boolean(subscription) && permission === "granted";
  const isBlocked = permission === "denied";

  return (
    <div
      className={cn(
        "rounded-[14px] border transition-all select-none shadow-2xs p-3 sm:p-3.5",
        isSubscribed
          ? "bg-emerald-50/25 border-emerald-300/80"
          : "bg-white border-slate-200/90 hover:border-slate-300/80",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Icon & Text Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 border transition-colors",
              isSubscribed
                ? "bg-emerald-100/80 text-emerald-800 border-emerald-300/90"
                : isBlocked
                ? "bg-amber-50 text-amber-700 border-amber-200/80"
                : "bg-emerald-50 text-emerald-800 border-emerald-200/70"
            )}
          >
            {isSubscribed ? (
              <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2]" />
            ) : (
              <Smartphone className="w-4.5 h-4.5 stroke-[2.2]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Desktop & Mobile Push Alerts
              </h3>
              {isSubscribed ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active
                </span>
              ) : isBlocked ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                  Blocked in Browser
                </span>
              ) : (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                  Desktop & Mobile
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
              {isSubscribed
                ? "Desktop and lock-screen alerts enabled for EMI repayment deadlines."
                : isBlocked
                ? "Notifications blocked in browser. Unblock in your browser address bar settings."
                : "Receive EMI due reminders directly on your desktop even when the app is minimized."}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        {!isSubscribed && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleEnablePush}
              disabled={isLoading || isBlocked}
              className="min-h-[34px] h-8.5 px-3.5 rounded-[10px] btn-gradient-glow text-white text-xs font-bold shadow-xs shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Enabling...</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Enable</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Status / Feedback Message */}
      {statusMessage && (
        <div
          className={cn(
            "mt-2 pt-2 border-t text-[11px] font-medium flex items-center gap-1.5 animate-in fade-in duration-200",
            isError
              ? "border-rose-100 text-rose-600"
              : "border-emerald-100 text-emerald-700"
          )}
        >
          {isError ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          )}
          <span className="leading-tight">{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
