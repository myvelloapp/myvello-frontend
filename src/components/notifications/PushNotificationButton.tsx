"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  isPushSupported,
  getExistingSubscription,
  subscribeToPush,
  sendTestNotification,
} from "@/lib/pushNotifications";
import { cn } from "@/lib/utils";

interface PushNotificationButtonProps {
  className?: string;
  variant?: "header" | "banner";
}

export function PushNotificationButton({
  className,
  variant = "header",
}: PushNotificationButtonProps) {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const checkStatus = async () => {
    if (typeof window === "undefined") return;
    const isSupp = isPushSupported();
    setSupported(isSupp);

    if (isSupp && "Notification" in window) {
      setPermission(Notification.permission);
      const sub = await getExistingSubscription();
      setSubscription(sub);

      // Auto-sync active subscription to backend
      if (sub && Notification.permission === "granted") {
        import("@/lib/api").then(({ apiClient }) => {
          apiClient
            .post("/push/subscribe", {
              ...sub.toJSON(),
              device_type: "ios",
            })
            .catch(() => {});
        });
      }
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleEnablePush = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await subscribeToPush();
      if (res.success && res.subscription) {
        setSubscription(res.subscription);
        setPermission("granted");
        setFeedback("Push active!");
        setTimeout(() => setFeedback(null), 4000);

        // Auto dispatch test notification to confirm
        sendTestNotification(res.subscription).catch(() => {});
      } else {
        setFeedback(res.error || "Permission required");
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (err: any) {
      setFeedback(err?.message || "Failed to allow notifications");
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    setFeedback(null);

    try {
      let sub = subscription;
      if (!sub) {
        sub = await getExistingSubscription();
      }

      if (!sub) {
        await handleEnablePush();
        return;
      }

      // Re-sync to backend before testing
      import("@/lib/api").then(({ apiClient }) => {
        apiClient
          .post("/push/subscribe", {
            ...sub!.toJSON(),
            device_type: "ios",
          })
          .catch(() => {});
      });

      const res = await sendTestNotification(sub);
      if (res.success) {
        setFeedback("Alert sent! Check lock screen");
      } else {
        setFeedback("Failed to send alert");
      }
    } catch {
      setFeedback("Delivery error");
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  if (!supported) return null;

  // Variant: Top Slim Banner (great on mobile right above filter pills)
  if (variant === "banner") {
    if (permission === "granted") {
      return (
        <div
          className={cn(
            "flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-xs shadow-2xs transition-all",
            className
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold truncate">
              {feedback || "Lock-Screen Notifications Active"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSendTest}
            disabled={isSendingTest}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1 active:scale-95 touch-manipulation shrink-0 disabled:opacity-50"
          >
            {isSendingTest ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            <span>{isSendingTest ? "Sending..." : "Test"}</span>
          </button>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-900 text-xs shadow-2xs transition-all",
          className
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <BellRing className="w-4 h-4 text-indigo-600 shrink-0 animate-bounce" />
          <span className="font-semibold text-slate-800 truncate">
            {feedback || "Receive EMI & family alerts on lock screen"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleEnablePush}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 touch-manipulation shrink-0 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Bell className="w-3.5 h-3.5" />
          )}
          <span>{isLoading ? "Enabling..." : "Allow Notifications"}</span>
        </button>
      </div>
    );
  }

  // Variant: Header Button (desktop header & mobile action)
  if (permission === "granted") {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <button
          type="button"
          onClick={handleSendTest}
          disabled={isSendingTest}
          title="Push notifications active - Tap to test lock screen alert"
          className="h-9 px-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/60 text-emerald-800 font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap disabled:opacity-50"
        >
          {isSendingTest ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span>{feedback || (isSendingTest ? "Sending..." : "Push Active • Test")}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleEnablePush}
      disabled={isLoading}
      title="Tap to allow lock-screen push notifications"
      className={cn(
        "h-9 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap disabled:opacity-50",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <BellRing className="w-3.5 h-3.5" />
      )}
      <span>{isLoading ? "Enabling..." : (feedback || "Allow Notifications")}</span>
    </button>
  );
}
