export type SubscriptionStatus = "active" | "paused" | "cancelled" | "archived";
export type OwnershipType = "personal" | "family_shared";
export type BillingCycle = "daily" | "weekly" | "monthly" | "quarterly" | "half_yearly" | "yearly" | "custom";
export type ConfidenceLevel = "high" | "medium" | "low";
export type DiscoveryStatus = "pending" | "approved" | "ignored" | "duplicate";

export interface SubscriptionCategory {
  id: number;
  user_id?: number | null;
  name: string;
  slug: string;
  icon?: string | null;
  color?: string | null;
  is_default: boolean;
}

export interface Subscription {
  id: number;
  user_id: number;
  family_id?: number | null;
  category_id?: number | null;
  ownership_type: OwnershipType;
  name: string;
  merchant: string;
  description?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  amount: number;
  currency: string;
  billing_cycle: BillingCycle;
  billing_interval: number;
  start_date: string;
  next_payment_date: string;
  expiry_date?: string | null;
  payment_method?: string | null;
  auto_renewal: boolean;
  status: SubscriptionStatus;
  source: "manual" | "gmail";
  reminder_enabled: boolean;
  reminder_days_before?: number[] | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;

  // Appended / Eager-loaded attributes
  monthly_equivalent?: number;
  annual_equivalent?: number;
  days_until_due?: number;
  category?: SubscriptionCategory | null;
  family?: { id: number; name: string } | null;
  user?: { id: number; name: string; email: string } | null;
  payments?: SubscriptionPayment[];
  price_histories?: SubscriptionPriceHistory[];
}

export interface SubscriptionPayment {
  id: number;
  subscription_id: number;
  amount: number;
  currency: string;
  payment_date: string;
  payment_status: "paid" | "pending" | "failed" | "refunded";
  reference_number?: string | null;
  source: "manual" | "gmail";
  notes?: string | null;
  created_at: string;
  subscription?: {
    id: number;
    name: string;
    merchant: string;
  };
}

export interface SubscriptionPriceHistory {
  id: number;
  subscription_id: number;
  old_amount: number;
  new_amount: number;
  currency: string;
  effective_date: string;
  reason?: string | null;
  created_at: string;
}

export interface SubscriptionDiscovery {
  id: number;
  user_id: number;
  integration_id: number;
  subscription_id?: number | null;
  merchant: string;
  email_sender?: string | null;
  email_subject: string;
  email_message_id: string;
  amount?: number | null;
  currency: string;
  billing_cycle?: string | null;
  transaction_date?: string | null;
  next_payment_date?: string | null;
  confidence: number;
  confidence_level: ConfidenceLevel;
  detection_source: string;
  status: DiscoveryStatus;
  raw_metadata?: {
    sender?: string;
    subject?: string;
    snippet?: string;
    detected_cycle?: string;
  } | null;
  reviewed_at?: string | null;
  created_at: string;
  subscription?: {
    id: number;
    name: string;
    status: SubscriptionStatus;
  } | null;
  integration?: {
    id: number;
    email_address: string;
  } | null;
}

export interface SubscriptionIntegration {
  id: number;
  user_id: number;
  provider: string;
  email_address: string;
  status: "active" | "expired" | "revoked" | "error";
  last_synced_at?: string | null;
  last_error?: string | null;
}

export interface GmailStatusResponse {
  connected: boolean;
  email_address?: string | null;
  status: string;
  last_synced_at?: string | null;
  is_syncing: boolean;
  last_error?: string | null;
}

export interface SubscriptionDashboardSummary {
  active_count: number;
  paused_count: number;
  cancelled_count: number;
  total_count: number;
  monthly_spend: number;
  annual_spend: number;
  next_payment_hero: {
    id: number;
    name: string;
    merchant: string;
    amount: number;
    currency: string;
    due_date: string;
    days_remaining: number;
    status: "today" | "urgent" | "soon" | "upcoming";
    category: SubscriptionCategory | null;
  } | null;
  upcoming_7_days: Array<{
    id: number;
    name: string;
    merchant: string;
    amount: number;
    currency: string;
    due_date: string;
    days_remaining: number;
    status: string;
    category: SubscriptionCategory | null;
  }>;
  upcoming_30_days_count: number;
}

export interface SubscriptionCalendarData {
  month: string;
  month_label: string;
  total_due: number;
  due_count: number;
  days: Record<
    string,
    Array<{
      id: number;
      name: string;
      merchant: string;
      amount: number;
      currency: string;
      status: string;
      billing_cycle: string;
      category: SubscriptionCategory | null;
    }>
  >;
}

export interface SubscriptionWasteAlert {
  type: "duplicate" | "price_hike" | "high_cost";
  title: string;
  message: string;
  severity: "high" | "medium" | "low";
  subscription_id?: number | null;
}

export interface SubscriptionAnalyticsData {
  total_monthly_spend: number;
  total_annual_spend: number;
  categories: Array<{
    category_id: number;
    name: string;
    color: string;
    icon?: string;
    count: number;
    monthly_spend: number;
    percentage: number;
  }>;
  top_merchants: Array<{
    merchant: string;
    count: number;
    monthly_spend: number;
    percentage: number;
  }>;
  billing_cycles: Array<{
    cycle: string;
    count: number;
    monthly_equivalent: number;
  }>;
  monthly_projection: Array<{
    month: string;
    label: string;
    projected_spend: number;
  }>;
  waste_detector: SubscriptionWasteAlert[];
  member_breakdown?: Array<{
    user_id: number;
    name: string;
    email?: string | null;
    count: number;
    monthly_spend: number;
    percentage: number;
  }>;
}
