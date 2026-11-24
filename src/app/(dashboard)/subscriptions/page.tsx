"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Calendar as CalendarIcon,
  PieChart,
  Layers,
  Sparkles,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  Subscription,
  SubscriptionCategory,
  SubscriptionDiscovery,
  GmailStatusResponse,
  SubscriptionDashboardSummary,
  SubscriptionAnalyticsData,
  SubscriptionCalendarData,
} from "@/types/subscription";
import { subscriptionService } from "@/services/subscriptionService";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { GmailConnectionCard } from "@/components/subscriptions/GmailConnectionCard";
import { DiscoveryReviewCard } from "@/components/subscriptions/DiscoveryReviewCard";
import { AddEditSubscriptionModal } from "@/components/subscriptions/AddEditSubscriptionModal";
import { RecordSubscriptionPaymentModal } from "@/components/subscriptions/RecordSubscriptionPaymentModal";
import { SubscriptionWasteDetectorCard } from "@/components/subscriptions/SubscriptionWasteDetectorCard";

type ActiveTab = "subscriptions" | "discovery" | "analytics" | "calendar";

export default function SubscriptionsPage() {
  const { activeWorkspace } = useWorkspace();

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>("subscriptions");

  // Core Data
  const [dashboard, setDashboard] = useState<SubscriptionDashboardSummary | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<SubscriptionCategory[]>([]);
  const [discoveries, setDiscoveries] = useState<SubscriptionDiscovery[]>([]);
  const [discoverySummary, setDiscoverySummary] = useState({ pending: 0, approved: 0, ignored: 0, total: 0 });
  const [gmailStatus, setGmailStatus] = useState<GmailStatusResponse | null>(null);
  const [analytics, setAnalytics] = useState<SubscriptionAnalyticsData | null>(null);
  const [calendarData, setCalendarData] = useState<SubscriptionCalendarData | null>(null);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cycleFilter, setCycleFilter] = useState("all");

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedSubForEdit, setSelectedSubForEdit] = useState<Subscription | null>(null);
  const [initialModalData, setInitialModalData] = useState<Partial<Subscription> | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSubForPayment, setSelectedSubForPayment] = useState<Subscription | null>(null);

  // Fetch all subscription data for current workspace
  const loadData = useCallback(async () => {
    setLoading(true);
    const workspaceParam = {
      workspace_type: activeWorkspace?.type || "personal",
      family_id: activeWorkspace?.type === "family" ? activeWorkspace.id : undefined,
    };

    try {
      const [dashRes, subsRes, catsRes, discRes, gmRes] = await Promise.all([
        subscriptionService.getDashboard(workspaceParam).catch(() => null),
        subscriptionService.getSubscriptions({ ...workspaceParam, status: "all" }).catch(() => null),
        subscriptionService.getCategories().catch(() => []),
        subscriptionService.getDiscoveries({ status: "pending" }).catch(() => null),
        subscriptionService.getGmailStatus().catch(() => null),
      ]);

      setDashboard(dashRes);
      if (subsRes) {
        setSubscriptions(subsRes.subscriptions || []);
      }
      setCategories(catsRes || []);
      if (discRes) {
        setDiscoveries(discRes.discoveries || []);
        setDiscoverySummary(discRes.summary);
      }
      setGmailStatus(gmRes);

      // Lazy load analytics or calendar if active
      if (activeTab === "analytics") {
        subscriptionService.getAnalytics(workspaceParam).then(setAnalytics).catch(console.error);
      } else if (activeTab === "calendar") {
        subscriptionService.getCalendar(workspaceParam).then(setCalendarData).catch(console.error);
      }
    } catch (e) {
      console.error("Failed to load subscription data", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeWorkspace, activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load analytics when switching to analytics tab
  useEffect(() => {
    if (activeTab === "analytics" && !analytics) {
      const workspaceParam = {
        workspace_type: activeWorkspace?.type || "personal",
        family_id: activeWorkspace?.type === "family" ? activeWorkspace.id : undefined,
      };
      subscriptionService.getAnalytics(workspaceParam).then(setAnalytics).catch(console.error);
    } else if (activeTab === "calendar" && !calendarData) {
      const workspaceParam = {
        workspace_type: activeWorkspace?.type || "personal",
        family_id: activeWorkspace?.type === "family" ? activeWorkspace.id : undefined,
      };
      subscriptionService.getCalendar(workspaceParam).then(setCalendarData).catch(console.error);
    }
  }, [activeTab, activeWorkspace, analytics, calendarData]);

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = sub.name.toLowerCase().includes(q);
        const matchMerchant = sub.merchant.toLowerCase().includes(q);
        if (!matchName && !matchMerchant) return false;
      }
      // Status
      if (statusFilter !== "all" && sub.status !== statusFilter) {
        return false;
      }
      // Category
      if (categoryFilter !== "all" && String(sub.category_id) !== String(categoryFilter)) {
        return false;
      }
      // Billing cycle
      if (cycleFilter !== "all" && sub.billing_cycle !== cycleFilter) {
        return false;
      }
      return true;
    });
  }, [subscriptions, searchQuery, statusFilter, categoryFilter, cycleFilter]);

  // Handle status toggle (pause, resume, cancel)
  const handleStatusChange = async (sub: Subscription, action: "pause" | "resume" | "cancel") => {
    try {
      if (action === "pause") {
        await subscriptionService.pauseSubscription(sub.id);
      } else if (action === "resume") {
        await subscriptionService.resumeSubscription(sub.id);
      } else if (action === "cancel") {
        if (!window.confirm(`Are you sure you want to cancel '${sub.name}'?`)) return;
        await subscriptionService.cancelSubscription(sub.id);
      }
      loadData();
    } catch (e: any) {
      alert(e?.response?.data?.message || `Failed to ${action} subscription.`);
    }
  };

  const handleDelete = async (sub: Subscription) => {
    if (!window.confirm(`Are you sure you want to delete '${sub.name}'?`)) return;
    try {
      await subscriptionService.deleteSubscription(sub.id);
      loadData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to delete subscription.");
    }
  };

  const handleEditAndApproveDiscovery = (discovery: SubscriptionDiscovery) => {
    setInitialModalData({
      name: discovery.merchant,
      merchant: discovery.merchant,
      amount: discovery.amount || 0,
      currency: discovery.currency || "INR",
      billing_cycle: (discovery.billing_cycle as any) || "monthly",
      start_date: discovery.transaction_date || new Date().toISOString().split("T")[0],
      next_payment_date: discovery.next_payment_date || undefined,
      notes: `Discovered from Gmail: ${discovery.email_subject}`,
    });
    setSelectedSubForEdit(null);
    setIsAddEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#02361B] tracking-tight">
                Subscription Management
              </h1>
              {activeWorkspace?.type === "family" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <Users className="w-3 h-3" /> {activeWorkspace.name}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track recurring subscriptions, auto-detect Gmail renewals, and optimize household spend.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                loadData();
              }}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedSubForEdit(null);
                setInitialModalData(null);
                setIsAddEditModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Subscription
            </button>
          </div>
        </div>

        {/* Top Stat KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white rounded-2xl border border-emerald-100/80 p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Monthly Commitments
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#02361B] mt-1">
              ₹{Number(dashboard?.monthly_spend || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Average recurring / month
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-100/80 p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Annual Projected Spend
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#02361B] mt-1">
              ₹{Number(dashboard?.annual_spend || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Across all billing cycles
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-100/80 p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Subscriptions
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#02361B] mt-1">
              {dashboard?.active_count || 0}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {dashboard?.paused_count || 0} paused
            </span>
          </div>

          <div
            onClick={() => setActiveTab("discovery")}
            className="bg-white rounded-2xl border border-emerald-100/80 p-4 shadow-2xs cursor-pointer hover:border-emerald-300 transition-colors"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              Gmail Discoveries
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#02361B] mt-1 flex items-center gap-2">
              {discoverySummary.pending}
              {discoverySummary.pending > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
                  Review
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Awaiting confirmation
            </span>
          </div>
        </div>

        {/* Next Renewal Hero Banner (if upcoming) */}
        {dashboard?.next_payment_hero && (
          <div className="bg-gradient-to-r from-emerald-800 to-[#02361B] rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/10 text-emerald-300">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                    Next Due Renewal
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200">
                    {dashboard.next_payment_hero.days_remaining <= 0
                      ? "Today"
                      : `${dashboard.next_payment_hero.days_remaining}d left`}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {dashboard.next_payment_hero.name} &bull; ₹
                  {Number(dashboard.next_payment_hero.amount).toFixed(2)}
                </h3>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  Due on {new Date(dashboard.next_payment_hero.due_date).toLocaleDateString()} &bull; {dashboard.next_payment_hero.merchant}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const sub = subscriptions.find((s) => s.id === dashboard.next_payment_hero?.id);
                if (sub) {
                  setSelectedSubForPayment(sub);
                  setIsPaymentModalOpen(true);
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#02361B] hover:bg-emerald-50 transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Record Renewal
            </button>
          </div>
        )}

        {/* Gmail Connection Integration Card */}
        <GmailConnectionCard
          status={gmailStatus}
          onRefresh={loadData}
          onScanComplete={() => {
            setActiveTab("discovery");
            loadData();
          }}
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 text-xs sm:text-sm font-bold overflow-x-auto pb-px">
          <button
            type="button"
            onClick={() => setActiveTab("subscriptions")}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "subscriptions"
                ? "border-emerald-600 text-[#02361B]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            All Subscriptions ({subscriptions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("discovery")}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "discovery"
                ? "border-emerald-600 text-[#02361B]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Discovery Center
            {discoverySummary.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {discoverySummary.pending}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "analytics"
                ? "border-emerald-600 text-[#02361B]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <PieChart className="w-4 h-4" />
            Analytics & Waste
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "calendar"
                ? "border-emerald-600 text-[#02361B]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Calendar
          </button>
        </div>

        {/* TAB 1: ALL SUBSCRIPTIONS */}
        {activeTab === "subscriptions" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search subscription or merchant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="paused">Paused Only</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={cycleFilter}
                  onChange={(e) => setCycleFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white"
                >
                  <option value="all">All Cycles</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            {/* Subscription Grid */}
            {filteredSubscriptions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-emerald-100 p-12 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-[#02361B]">No Subscriptions Found</h4>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  {subscriptions.length === 0
                    ? "Connect your Gmail account or add your recurring subscriptions manually to get started."
                    : "No subscriptions match the selected search and filter criteria."}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Subscription
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubscriptions.map((sub) => (
                  <SubscriptionCard
                    key={sub.id}
                    subscription={sub}
                    onEdit={(s) => {
                      setSelectedSubForEdit(s);
                      setIsAddEditModalOpen(true);
                    }}
                    onRecordPayment={(s) => {
                      setSelectedSubForPayment(s);
                      setIsPaymentModalOpen(true);
                    }}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DISCOVERY CENTER */}
        {activeTab === "discovery" && (
          <div className="space-y-4">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Pending Review Queue:</span> These potential recurring commitments were identified from your connected Gmail inbox. In accordance with MyVello privacy principles, subscriptions are never activated until you review and confirm them.
            </div>

            {discoveries.length === 0 ? (
              <div className="bg-white rounded-3xl border border-emerald-100 p-12 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-[#02361B]">All Caught Up!</h4>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  No pending discoveries found. Click &quot;Scan Inbox&quot; in the Gmail card above to check for recent renewal notices.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discoveries.map((disc) => (
                  <DiscoveryReviewCard
                    key={disc.id}
                    discovery={disc}
                    onApprove={() => loadData()}
                    onEditAndApprove={handleEditAndApproveDiscovery}
                    onIgnore={() => loadData()}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ANALYTICS & WASTE DETECTOR */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Waste Detector Section */}
            <div>
              <h3 className="text-sm font-black text-[#02361B] mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Smart Subscription Waste & Review Detector
              </h3>
              <SubscriptionWasteDetectorCard
                alerts={analytics?.waste_detector || []}
                onReview={(id) => {
                  if (id) {
                    const found = subscriptions.find((s) => s.id === id);
                    if (found) {
                      setSelectedSubForEdit(found);
                      setIsAddEditModalOpen(true);
                    }
                  }
                }}
              />
            </div>

            {/* Category Spend Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-2xs">
                <h4 className="text-sm font-bold text-[#02361B] mb-3">
                  Spend by Category
                </h4>
                <div className="space-y-3">
                  {(analytics?.categories || []).map((cat) => (
                    <div key={cat.category_id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                        <span className="font-bold text-[#02361B]">
                          ₹{Number(cat.monthly_spend).toFixed(2)}/mo ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color || "#10B981",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {(!analytics?.categories || analytics.categories.length === 0) && (
                    <p className="text-xs text-slate-400 py-4 text-center">No category data yet.</p>
                  )}
                </div>
              </div>

              {/* Top Merchants */}
              <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-2xs">
                <h4 className="text-sm font-bold text-[#02361B] mb-3">
                  Top Merchants by Volume
                </h4>
                <div className="space-y-3">
                  {(analytics?.top_merchants || []).map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                      <div>
                        <span className="font-bold text-slate-800">{m.merchant}</span>
                        <p className="text-[10px] text-slate-400">{m.count} subscription(s)</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#02361B]">₹{Number(m.monthly_spend).toFixed(2)}/mo</span>
                        <p className="text-[10px] text-slate-400">{m.percentage}% of total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Member Breakdown (if in family workspace) */}
            {analytics?.member_breakdown && analytics.member_breakdown.length > 0 && (
              <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-2xs">
                <h4 className="text-sm font-bold text-[#02361B] mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Family Member Spend Distribution
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {analytics.member_breakdown.map((mem) => (
                    <div key={mem.user_id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                      <span className="text-xs font-bold text-slate-800">{mem.name}</span>
                      <div className="text-base font-black text-[#02361B] mt-1">
                        ₹{Number(mem.monthly_spend).toFixed(2)} /mo
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {mem.count} subscription(s) &bull; {mem.percentage}% of group
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CALENDAR */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-[#02361B]">
                  {calendarData?.month_label || "Payment Calendar"}
                </h4>
                <p className="text-xs text-slate-500">
                  Total due this month: ₹{Number(calendarData?.total_due || 0).toFixed(2)} ({calendarData?.due_count || 0} renewals)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {calendarData && Object.keys(calendarData.days).length > 0 ? (
                Object.entries(calendarData.days).map(([date, events]) => (
                  <div key={date} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                      {new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short", weekday: "short" })}
                    </span>
                    <div className="space-y-1.5">
                      {events.map((ev) => (
                        <div key={ev.id} className="p-2 rounded-lg bg-white border border-slate-100 text-xs flex items-center justify-between">
                          <span className="font-semibold text-slate-800 truncate mr-2">{ev.name}</span>
                          <span className="font-bold text-[#02361B] shrink-0">₹{Number(ev.amount).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-xs text-slate-400">
                  No renewals scheduled for this month.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals */}
        <AddEditSubscriptionModal
          isOpen={isAddEditModalOpen}
          onClose={() => {
            setIsAddEditModalOpen(false);
            setSelectedSubForEdit(null);
            setInitialModalData(null);
          }}
          onSuccess={loadData}
          subscriptionToEdit={selectedSubForEdit}
          initialData={initialModalData}
        />

        <RecordSubscriptionPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedSubForPayment(null);
          }}
          onSuccess={loadData}
          subscription={selectedSubForPayment}
        />
      </div>
    </DashboardLayout>
  );
}
