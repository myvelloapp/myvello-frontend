"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, Users } from "lucide-react";
import {
  notificationService,
  NotificationItem,
  NotificationFilter,
} from "@/services/notificationService";
import { useAuth } from "@/modules/authentication/AuthContext";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  filter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  fetchNotifications: (filterOverrideOrSilent?: NotificationFilter | boolean, isSilent?: boolean) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  clearRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper for deep equality checking of notifications to avoid unnecessary virtual DOM re-renders & page flicker
function areNotificationsEqual(a: NotificationItem[], b: NotificationItem[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const itemB = b[i];
    if (
      itemA.id !== itemB.id ||
      itemA.is_read !== itemB.is_read ||
      itemA.title !== itemB.title ||
      itemA.message !== itemB.message ||
      itemA.type !== itemB.type ||
      itemA.action_url !== itemB.action_url ||
      itemA.action_label !== itemB.action_label ||
      itemA.trigger_key !== itemB.trigger_key ||
      itemA.emi_id !== itemB.emi_id ||
      itemA.emi?.id !== itemB.emi?.id ||
      itemA.emi?.loan_name !== itemB.emi?.loan_name ||
      itemA.emi?.loan_category !== itemB.emi?.loan_category ||
      itemA.emi?.lender_name !== itemB.emi?.lender_name
    ) {
      return false;
    }
  }
  return true;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [incomingToast, setIncomingToast] = useState<NotificationItem | null>(null);

  const notificationsRef = useRef<NotificationItem[]>(notifications);
  const unreadCountRef = useRef<number>(unreadCount);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    unreadCountRef.current = unreadCount;
  }, [unreadCount]);

  const prevUnreadCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const isFetchingRef = useRef<boolean>(false);

  // Broadcast helper for real-time multi-tab syncing
  const broadcastSync = (type: string) => {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("myvello_notifications");
        channel.postMessage({ type, timestamp: Date.now() });
        channel.close();
      }
    } catch {
      // ignore
    }
  };

  const fetchNotifications = useCallback(
    async (filterOverrideOrSilent?: NotificationFilter | boolean, isSilentParam?: boolean) => {
      // Normalize parameter: supports fetchNotifications(true) or fetchNotifications(filter, true)
      const isSilent = typeof filterOverrideOrSilent === "boolean" ? filterOverrideOrSilent : (isSilentParam ?? false);

      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        setIsLoading(false);
        notificationsRef.current = [];
        unreadCountRef.current = 0;
        return;
      }

      // Concurrency guard: avoid duplicate in-flight requests
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      // Only show initial skeleton if we have zero notifications loaded in memory
      if (!isSilent && notificationsRef.current.length === 0) {
        setIsLoading(true);
      }

      try {
        const data = await notificationService.getNotifications("all");
        const newNotifications = data.notifications || [];
        const newUnreadCount = data.unread_count ?? newNotifications.filter((n) => !n.is_read).length;

        // Detect if brand-new unread notifications arrived while the user is active
        if (!isInitialLoadRef.current) {
          const prevIds = new Set(notificationsRef.current.map((n) => n.id));
          const brandNewItems = newNotifications.filter((n) => !prevIds.has(n.id) && !n.is_read);

          if (brandNewItems.length > 0) {
            const newest = brandNewItems[0];
            setIncomingToast(newest);

            // Automatically trigger instant data refreshes across all open views without page reload
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("myvello:live_data_update", { detail: newest }));
              window.dispatchEvent(new CustomEvent("myvello:refresh_workspaces"));

              const titleLower = (newest.title || "").toLowerCase();
              if (
                newest.type === "family" ||
                titleLower.includes("family") ||
                titleLower.includes("workspace") ||
                titleLower.includes("member") ||
                titleLower.includes("joined") ||
                titleLower.includes("invitation")
              ) {
                window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
              }

              if (
                newest.type === "success" ||
                titleLower.includes("payment") ||
                titleLower.includes("reconciled") ||
                newest.emi_id
              ) {
                window.dispatchEvent(new CustomEvent("myvello:refresh_emis"));
                window.dispatchEvent(new CustomEvent("myvello:refresh_payments"));
                window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
              }
            }
          }
        }

        isInitialLoadRef.current = false;
        prevUnreadCountRef.current = newUnreadCount;

        // Deep equality check: only update React state if items or unread count actually changed
        const unchanged =
          newUnreadCount === unreadCountRef.current &&
          areNotificationsEqual(notificationsRef.current, newNotifications);

        if (!unchanged) {
          setNotifications(newNotifications);
          setUnreadCount(newUnreadCount);
          notificationsRef.current = newNotifications;
          unreadCountRef.current = newUnreadCount;
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    },
    [user]
  );

  // Initial fetch on mount / user change
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Live real-time background sync & instant window focus revalidation
  useEffect(() => {
    if (!user) return;

    let timer: NodeJS.Timeout;

    // Passive heartbeat (relaxed from aggressive polling to 30s-60s)
    const tick = async () => {
      if (!document.hidden) {
        await fetchNotifications(true);
      }
      timer = setTimeout(tick, document.hidden ? 60000 : 30000);
    };

    timer = setTimeout(tick, 30000);

    const handleFocus = () => {
      fetchNotifications(true);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNotifications(true);
      }
    };

    const handleEventDrivenRefresh = () => {
      fetchNotifications(true);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("myvello:refresh_notifications", handleEventDrivenRefresh);
    window.addEventListener("myvello:live_data_update", handleEventDrivenRefresh);
    window.addEventListener("myvello:refresh_emis", handleEventDrivenRefresh);
    window.addEventListener("myvello:refresh_payments", handleEventDrivenRefresh);
    window.addEventListener("myvello:refresh_family", handleEventDrivenRefresh);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("myvello:refresh_notifications", handleEventDrivenRefresh);
      window.removeEventListener("myvello:live_data_update", handleEventDrivenRefresh);
      window.removeEventListener("myvello:refresh_emis", handleEventDrivenRefresh);
      window.removeEventListener("myvello:refresh_payments", handleEventDrivenRefresh);
      window.removeEventListener("myvello:refresh_family", handleEventDrivenRefresh);
    };
  }, [user, fetchNotifications]);

  // Multi-tab real-time synchronization
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel("myvello_notifications");
    channel.onmessage = () => {
      fetchNotifications(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
        window.dispatchEvent(new CustomEvent("myvello:refresh_workspaces"));
        window.dispatchEvent(new CustomEvent("myvello:refresh_emis"));
        window.dispatchEvent(new CustomEvent("myvello:refresh_payments"));
      }
    };

    return () => {
      channel.close();
    };
  }, [fetchNotifications]);

  // Auto-dismiss floating instant notification banner after 6 seconds
  useEffect(() => {
    if (!incomingToast) return;
    const toastTimer = setTimeout(() => {
      setIncomingToast(null);
    }, 6000);
    return () => clearTimeout(toastTimer);
  }, [incomingToast]);

  const markAsRead = async (id: number) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    unreadCountRef.current = Math.max(0, unreadCountRef.current - 1);
    prevUnreadCountRef.current = Math.max(0, prevUnreadCountRef.current - 1);

    try {
      await notificationService.markAsRead(id);
      broadcastSync("MARK_READ");
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      await fetchNotifications(true);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    unreadCountRef.current = 0;
    prevUnreadCountRef.current = 0;

    try {
      await notificationService.markAllAsRead();
      broadcastSync("MARK_ALL_READ");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      await fetchNotifications(true);
    }
  };

  const deleteNotification = async (id: number) => {
    const target = notificationsRef.current.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
      unreadCountRef.current = Math.max(0, unreadCountRef.current - 1);
      prevUnreadCountRef.current = Math.max(0, prevUnreadCountRef.current - 1);
    }

    try {
      await notificationService.deleteNotification(id);
      broadcastSync("DELETE");
    } catch (err) {
      console.error("Failed to delete notification:", err);
      await fetchNotifications(true);
    }
  };

  const clearRead = async () => {
    setNotifications((prev) => prev.filter((n) => !n.is_read));

    try {
      await notificationService.clearRead();
      broadcastSync("CLEAR_READ");
    } catch (err) {
      console.error("Failed to clear read notifications:", err);
      await fetchNotifications(true);
    }
  };

  const handleSetFilter = (newFilter: NotificationFilter) => {
    setFilter(newFilter);
  };

  const handleToastClick = async () => {
    if (!incomingToast) return;
    const toast = incomingToast;
    setIncomingToast(null);
    if (!toast.is_read) {
      await markAsRead(toast.id);
    }
    if (toast.action_url) {
      if (typeof window !== "undefined" && window.location.pathname === toast.action_url.split("?")[0]) {
        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
      }
      router.push(toast.action_url);
    } else {
      router.push("/notifications");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        filter,
        setFilter: handleSetFilter,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearRead,
      }}
    >
      {children}

      {/* Instant Floating Live Notification Popup Banner */}
      {incomingToast && (
        <div className="fixed top-[max(0.75rem,calc(0.5rem+env(safe-area-inset-top)))] inset-x-3.5 max-w-[420px] mx-auto sm:top-20 sm:right-8 sm:left-auto sm:max-w-sm sm:w-full sm:mx-0 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            onClick={handleToastClick}
            className="p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-indigo-200/90 hover:border-indigo-400 transition-all cursor-pointer flex items-start gap-3 sm:gap-3.5 group ring-4 ring-indigo-500/10"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 group-hover:scale-105 transition-transform">
              {incomingToast.type === "family" ? (
                <Users className="w-4 h-4 text-white" />
              ) : (
                <Bell className="w-4 h-4 text-white animate-bounce" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  New Alert
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Just now</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {incomingToast.title}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5 leading-snug">
                {incomingToast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIncomingToast(null);
              }}
              className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 -mr-1 -mt-1 active:scale-95 touch-manipulation"
              aria-label="Dismiss notification alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
