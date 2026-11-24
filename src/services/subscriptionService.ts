export * from "@/types/subscription";
import { apiClient } from "@/lib/api";
import {
  Subscription,
  SubscriptionCategory,
  SubscriptionPayment,
  SubscriptionPriceHistory,
  SubscriptionDiscovery,
  GmailStatusResponse,
  SubscriptionDashboardSummary,
  SubscriptionCalendarData,
  SubscriptionAnalyticsData,
} from "@/types/subscription";

export interface SubscriptionListParams {
  status?: string;
  category_id?: string | number;
  billing_cycle?: string;
  workspace_type?: string;
  family_id?: string | number;
  search?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface SubscriptionListResponse {
  summary: {
    active_count: number;
    paused_count: number;
    cancelled_count: number;
    monthly_total: number;
    annual_total: number;
  };
  subscriptions: Subscription[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface DiscoveryListResponse {
  discoveries: SubscriptionDiscovery[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  summary: {
    pending: number;
    approved: number;
    ignored: number;
    total: number;
  };
}

export const subscriptionService = {
  // Categories
  async getCategories(): Promise<SubscriptionCategory[]> {
    const res = await apiClient.get<{ success: boolean; data: SubscriptionCategory[] }>(
      "/subscription-categories"
    );
    return res.data.data;
  },

  async createCategory(data: { name: string; color?: string; icon?: string }): Promise<SubscriptionCategory> {
    const res = await apiClient.post<{ success: boolean; data: SubscriptionCategory }>(
      "/subscription-categories",
      data
    );
    return res.data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/subscription-categories/${id}`);
  },

  // Subscriptions CRUD
  async getSubscriptions(params?: SubscriptionListParams): Promise<SubscriptionListResponse> {
    const res = await apiClient.get<{ success: boolean; data: SubscriptionListResponse }>(
      "/subscriptions",
      { params }
    );
    return res.data.data;
  },

  async getSubscription(id: number): Promise<Subscription> {
    const res = await apiClient.get<{ success: boolean; data: Subscription }>(
      `/subscriptions/${id}`
    );
    return res.data.data;
  },

  async createSubscription(data: Partial<Subscription>): Promise<Subscription> {
    const res = await apiClient.post<{ success: boolean; data: Subscription }>(
      "/subscriptions",
      data
    );
    return res.data.data;
  },

  async updateSubscription(id: number, data: Partial<Subscription>): Promise<Subscription> {
    const res = await apiClient.put<{ success: boolean; data: Subscription }>(
      `/subscriptions/${id}`,
      data
    );
    return res.data.data;
  },

  async deleteSubscription(id: number): Promise<void> {
    await apiClient.delete(`/subscriptions/${id}`);
  },

  async pauseSubscription(id: number): Promise<Subscription> {
    const res = await apiClient.post<{ success: boolean; data: Subscription }>(
      `/subscriptions/${id}/pause`
    );
    return res.data.data;
  },

  async resumeSubscription(id: number): Promise<Subscription> {
    const res = await apiClient.post<{ success: boolean; data: Subscription }>(
      `/subscriptions/${id}/resume`
    );
    return res.data.data;
  },

  async cancelSubscription(id: number): Promise<Subscription> {
    const res = await apiClient.post<{ success: boolean; data: Subscription }>(
      `/subscriptions/${id}/cancel`
    );
    return res.data.data;
  },

  async archiveSubscription(id: number): Promise<Subscription> {
    const res = await apiClient.post<{ success: boolean; data: Subscription }>(
      `/subscriptions/${id}/archive`
    );
    return res.data.data;
  },

  // Payments & Price History
  async getPayments(
    subscriptionId: number,
    page = 1
  ): Promise<{
    payments: SubscriptionPayment[];
    summary: { total_paid: number; count: number };
    pagination: any;
  }> {
    const res = await apiClient.get<{
      success: boolean;
      data: {
        payments: SubscriptionPayment[];
        summary: { total_paid: number; count: number };
        pagination: any;
      };
    }>(`/subscriptions/${subscriptionId}/payments`, { params: { page } });
    return res.data.data;
  },

  async recordPayment(
    subscriptionId: number,
    data: {
      amount: number;
      payment_date: string;
      currency?: string;
      payment_status?: string;
      reference_number?: string;
      notes?: string;
    }
  ): Promise<{ payment: SubscriptionPayment; next_payment_date: string }> {
    const res = await apiClient.post<{
      success: boolean;
      data: { payment: SubscriptionPayment; next_payment_date: string };
    }>(`/subscriptions/${subscriptionId}/payments`, data);
    return res.data.data;
  },

  async deletePayment(subscriptionId: number, paymentId: number): Promise<void> {
    await apiClient.delete(`/subscriptions/${subscriptionId}/payments/${paymentId}`);
  },

  async getPriceHistory(subscriptionId: number): Promise<SubscriptionPriceHistory[]> {
    const res = await apiClient.get<{ success: boolean; data: SubscriptionPriceHistory[] }>(
      `/subscriptions/${subscriptionId}/price-history`
    );
    return res.data.data;
  },

  // Dashboard & Analytics
  async getDashboard(params?: {
    family_id?: string | number;
    workspace_type?: string;
  }): Promise<SubscriptionDashboardSummary> {
    const res = await apiClient.get<{ success: boolean; data: SubscriptionDashboardSummary }>(
      "/subscriptions/dashboard",
      { params }
    );
    return res.data.data;
  },

  async getCalendar(params?: {
    month?: string;
    family_id?: string | number;
    workspace_type?: string;
  }): Promise<SubscriptionCalendarData> {
    const res = await apiClient.get<{ success: boolean; data: SubscriptionCalendarData }>(
      "/subscriptions/calendar",
      { params }
    );
    return res.data.data;
  },

  async getAnalytics(params?: {
    family_id?: string | number;
    workspace_type?: string;
  }): Promise<SubscriptionAnalyticsData> {
    const res = await apiClient.get<{ success: boolean; data: SubscriptionAnalyticsData }>(
      "/subscriptions/analytics",
      { params }
    );
    return res.data.data;
  },

  // Gmail Smart Discovery & OAuth Integration
  async getGmailStatus(): Promise<GmailStatusResponse> {
    const res = await apiClient.get<{ success: boolean; data: GmailStatusResponse }>(
      "/integrations/gmail/status"
    );
    return res.data.data;
  },

  async getGmailConnectUrl(): Promise<string> {
    const res = await apiClient.get<{ success: boolean; data: { auth_url: string } }>(
      "/integrations/gmail/connect"
    );
    return res.data.data.auth_url;
  },

  async disconnectGmail(): Promise<void> {
    await apiClient.post("/integrations/gmail/disconnect");
  },

  async scanGmail(params?: { max_emails?: number; async?: boolean }): Promise<any> {
    const res = await apiClient.post<{ success: boolean; message: string; data: any }>(
      "/subscriptions/discover/scan",
      params
    );
    return res.data;
  },

  async getDiscoveries(params?: { status?: string; page?: number }): Promise<DiscoveryListResponse> {
    const res = await apiClient.get<{ success: boolean; data: DiscoveryListResponse }>(
      "/subscriptions/discoveries",
      { params }
    );
    return res.data.data;
  },

  async approveDiscovery(
    id: number,
    data?: {
      name?: string;
      category_id?: number;
      amount?: number;
      currency?: string;
      billing_cycle?: string;
      start_date?: string;
      next_payment_date?: string;
      ownership_type?: string;
      family_id?: number | null;
      create_payment?: boolean;
      notes?: string;
    }
  ): Promise<{ subscription: Subscription; discovery: SubscriptionDiscovery }> {
    const res = await apiClient.post<{
      success: boolean;
      data: { subscription: Subscription; discovery: SubscriptionDiscovery };
    }>(`/subscriptions/discoveries/${id}/approve`, data);
    return res.data.data;
  },

  async ignoreDiscovery(id: number): Promise<SubscriptionDiscovery> {
    const res = await apiClient.post<{
      success: boolean;
      data: { discovery: SubscriptionDiscovery };
    }>(`/subscriptions/discoveries/${id}/ignore`);
    return res.data.data.discovery;
  },

  async deleteDiscovery(id: number): Promise<void> {
    await apiClient.delete(`/subscriptions/discoveries/${id}`);
  },

  async getSyncLogs(): Promise<any[]> {
    const res = await apiClient.get<{ success: boolean; data: { logs: any[] } }>(
      "/subscriptions/sync-logs"
    );
    return res.data.data.logs;
  },
};
