"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  User,
  Bell,
  Lock,
  Globe,
  Shield,
  Download,
  Trash2,
  Check,
  CheckCircle2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { currentUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");

  const [name, setName] = useState(currentUser.name);
  const [email] = useState(currentUser.email);
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  // Notifications State matching PRD Section 9.3
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [rem7Days, setRem7Days] = useState(true);
  const [rem3Days, setRem3Days] = useState(true);
  const [rem1Day, setRem1Day] = useState(true);
  const [remDueDate, setRemDueDate] = useState(true);
  const [remOverdue, setRemOverdue] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings updated successfully!");
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
          <span className="text-slate-700 font-semibold">Account Settings</span>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile, notification schedule, and vault preferences.
          </p>
        </div>

        {/* Settings Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 w-fit">
          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "profile"
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <User className="w-3.5 h-3.5" />
            Profile & Regional
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "notifications"
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Bell className="w-3.5 h-3.5" />
            EMI Reminders
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "security"
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Lock className="w-3.5 h-3.5" />
            Security & Vault
          </button>
        </div>

        {/* TAB 1: Profile */}
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-indigo-500/20">
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{currentUser.name}</h3>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  Verified Account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="INR">INR (₹) - Indian Rupee (Default)</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="AED">AED (د.إ) - UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30) - Default</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="secondary" size="sm" className="px-6">
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: Notifications */}
        {activeTab === "notifications" && (
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Automated Notification Cadence</h3>
              <p className="text-xs text-slate-500">
                Choose when Myvello should alert you about upcoming due dates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Email Reminders</span>
                <span className="text-[11px] text-slate-500">Receive schedule summaries via email</span>
              </div>
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Instalment Due Date Alerts
              </h4>

              {[
                { label: "7 days before due date", state: rem7Days, set: setRem7Days },
                { label: "3 days before due date", state: rem3Days, set: setRem3Days },
                { label: "1 day before due date", state: rem1Day, set: setRem1Day },
                { label: "On the due date (morning alert)", state: remDueDate, set: setRemDueDate },
                { label: "1 day after due date if unpaid (grace period reminder)", state: remOverdue, set: setRemOverdue },
              ].map((item, idx) => (
                <label key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.set(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                </label>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="secondary" size="sm" className="px-6">
                Update Reminder Preferences
              </Button>
            </div>
          </form>
        )}

        {/* TAB 3: Security & Privacy */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Password & Authentication</h3>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Google Connected Account</span>
                  <span className="text-[11px] text-slate-500">Connected with rahul.sharma@myvello.life</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Linked
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Data Export & Account Management</h3>
              <p className="text-xs text-slate-500">
                You can download an export of all your EMI schedules, payments, and vault metadata at any time.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => alert("Preparing your confidential data export...")}
                >
                  <Download className="w-3.5 h-3.5" />
                  Export All My Data (JSON)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
