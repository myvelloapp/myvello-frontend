"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  isPushSupported,
  getExistingSubscription,
  subscribeToPush,
  sendTestNotification,
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
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isSupp = isPushSupported();
    setSupported(isSupp);

    if (isSupp && "Notification" in window) {
      setPermission(Notification.permission);
      getExistingSubscription().then((sub) => {
        setSubscription(sub);
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
        setStatusMessage(
          "Lock-screen push notifications are now active! Tap 'Send Test Notification' to verify."
        );
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

  const handleSendTest = async () => {
    if (!subscription) return;
    setIsSendingTest(true);
    setStatusMessage(null);
    setIsError(false);

    try {
      const res = await sendTestNotification(subscription);
      if (res.success) {
        setStatusMessage(
          "Test alert dispatched! Lock your iPhone now or check your notification center."
        );
      } else {
        setIsError(true);
        setStatusMessage(res.error || "Could not deliver test notification.");
      }
    } catch (err: any) {
      setIsError(true);
      setStatusMessage(err?.message || "Error sending test alert.");
    } finally {
      setIsSendingTest(false);
    }
  };

  // If running in browser where push is unsupported (e.g. old desktop safari)
  if (!supported) {
    return null;
  }

  const isSubscribed = Boolean(subscription) && permission === "granted";

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all select-none overflow-hidden",
        isSubscribed
          ? "bg-gradient-to-br from-emerald-50/50 via-white to-slate-50/40 border-emerald-200/70 shadow-xs"
          : "bg-gradient-to-br from-indigo-50/60 via-white to-slate-50/50 border-indigo-200/70 shadow-xs",
        compact ? "p-3.5 sm:p-4" : "p-4 sm:p-5",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon & Text Info */}
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
              isSubscribed
                ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200"
                : "bg-indigo-100/80 text-indigo-700 border border-indigo-200"
            )}
          >
            {isSubscribed ? (
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Smartphone className="w-5 h-5 stroke-[2.2]" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                {isSubscribed
                  ? "Lock-Screen Push Notifications Active"
                  : "Enable Lock-Screen Notifications"}
              </h3>
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                  isSubscribed
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200/80"
                )}
              >
                {isSubscribed ? "Active" : "iOS & Android"}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
              {isSubscribed
                ? "Your phone will alert you on your lock screen for 7-day, 3-day, and due-today EMI payments, even when the app is closed."
                : "Receive real lock-screen alerts with sounds and banners before your EMI due dates. Tap to enable."}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
          {isSubscribed ? (
            <button
              type="button"
              onClick={handleSendTest}
              disabled={isSendingTest}
              className="min-h-[42px] px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-bold shadow-2xs hover:border-slate-300 active:scale-95 touch-manipulation transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Sending Alert...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Send Test Notification</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEnablePush}
              disabled={isLoading}
              className="min-h-[42px] px-5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 touch-manipulation transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Activating...</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Enable Push Notifications</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Status / Feedback Message */}
      {statusMessage && (
        <div
          className={cn(
            "mt-3 pt-2.5 border-t text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200",
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
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
