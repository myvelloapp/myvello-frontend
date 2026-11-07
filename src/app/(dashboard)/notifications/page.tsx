"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Bell,
  CheckCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Settings,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { mockNotifications, MockNotification } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<MockNotification[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "reminders" | "family">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filtered = notifications.filter((item) => {
    if (activeFilter === "unread") return !item.isRead;
    if (activeFilter === "reminders") return item.type === "reminder" || item.type === "urgent";
    if (activeFilter === "family") return item.type === "family";
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case "reminder":
        return <Clock className="w-5 h-5 text-indigo-600" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "family":
        return <Users className="w-5 h-5 text-teal-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700 font-semibold">Notification Center</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Notifications & Reminders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Automated alerts before payment deadlines, overdue warnings, and vault activity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="gap-1.5 text-xs font-semibold"
              >
                <CheckCheck className="w-3.5 h-3.5 text-indigo-600" />
                Mark all as read
              </Button>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Preferences
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 w-fit">
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeFilter === "all"
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeFilter === "unread"
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveFilter("reminders")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeFilter === "reminders"
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            EMI Reminders
          </button>
          <button
            onClick={() => setActiveFilter("family")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeFilter === "family"
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Family Updates
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={cn(
                "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4",
                !item.isRead
                  ? "bg-white border-indigo-200/90 shadow-xs ring-1 ring-indigo-500/10"
                  : "bg-white/80 border-slate-200/70 hover:bg-white"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                  item.type === "urgent"
                    ? "bg-rose-50 border-rose-100"
                    : item.type === "success"
                    ? "bg-emerald-50 border-emerald-100"
                    : item.type === "family"
                    ? "bg-teal-50 border-teal-100"
                    : "bg-indigo-50 border-indigo-100"
                )}
              >
                {getNotificationIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {item.title}
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </h4>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.message}
                </p>

                {item.emiId && (
                  <div className="mt-3">
                    <Link
                      href={`/emis/${item.emiId}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      View EMI Breakdown
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <Bell className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No notifications to display</p>
              <p className="text-xs">You are completely up to date with your EMI schedules.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
