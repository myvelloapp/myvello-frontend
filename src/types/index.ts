export type Role = "owner" | "admin" | "member";
export type MembershipStatus = "active" | "inactive" | "removed";
export type OwnershipType = "personal" | "family_shared";

export type EmiStatus = "active" | "completed" | "closed" | "defaulted";
export type ScheduleStatus = "upcoming" | "due_soon" | "due_today" | "paid" | "overdue" | "skipped";

export interface User {
  id: number;
  name: string;
  email: string;
  google_id?: string | null;
  profile_photo?: string | null;
  email_verified_at?: string | null;
  preferred_currency: string;
  timezone: string;
  has_completed_onboarding?: boolean;
  is_currency_locked?: boolean;
  active_emis_count?: number;
  status: "active" | "suspended" | "pending";
  created_at: string;
  updated_at: string;
  owned_families?: Family[];
  families?: Family[];
}

export interface Family {
  id: number;
  name: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
  owner?: User;
  members?: FamilyMember[];
}

export interface FamilyMember {
  id: number;
  family_id: number;
  user_id: number;
  role: Role;
  membership_status: MembershipStatus;
  joined_at: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface FamilyInvitation {
  id: number;
  family_id: number;
  invited_by: number;
  email: string;
  role: "admin" | "member";
  expires_at: string;
  accepted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Emi {
  id: number;
  user_id: number;
  family_id?: number | null;
  ownership_type: OwnershipType;
  loan_name: string;
  loan_category: string;
  lender_name: string;
  loan_reference?: string | null;
  description?: string | null;
  original_loan_amount: string | number;
  emi_amount: string | number;
  interest_rate?: string | number | null;
  outstanding_principal?: string | number | null;
  processing_fee?: string | number | null;
  processing_fee_type?: "deducted" | "financed" | null;
  first_emi_amount?: string | number | null;
  first_emi_type?: "bpi" | "reamortize" | null;
  net_disbursed_amount?: string | number | null;
  currency: string;
  loan_start_date: string;
  first_emi_date: string;
  due_day: number;
  loan_tenure_months: number;
  total_emis: number;
  reminder_days_before?: number[] | null;
  payment_method?: string | null;
  debit_bank_name?: string | null;
  debit_account_number?: string | null;
  reminder_enabled: boolean;
  status: EmiStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  user?: PaymentUserSummary | null;
  family?: EmiFamilySummary | null;
}

export interface PaymentUserSummary {
  id: number;
  name: string;
  email: string;
  profile_photo?: string | null;
}

export interface FamilyMemberWithUser {
  id: number;
  family_id: number;
  user_id: number;
  role: "owner" | "admin" | "member";
  membership_status?: string;
  joined_at?: string;
  user?: PaymentUserSummary;
}

export interface EmiFamilySummary {
  id: number;
  name: string;
  members?: FamilyMemberWithUser[];
}

export interface EmiSchedule {
  id: number;
  emi_id: number;
  user_id: number;
  installment_number: number;
  due_date: string;
  due_amount: string | number;
  paid_amount: string | number;
  paid_date?: string | null;
  status: ScheduleStatus;
  created_at: string;
  updated_at: string;
  payment?: (EmiPayment & { user?: PaymentUserSummary | null }) | null;
}

export interface EmiPaymentEmiSummary {
  id: number;
  loan_name: string;
  lender_name: string;
  loan_category: string;
  currency?: string;
  original_loan_amount?: string | number;
  emi_amount?: string | number;
}

export interface EmiPaymentScheduleSummary {
  id: number;
  installment_number: number;
  due_date?: string;
  due_amount?: string | number;
}

export interface EmiPayment {
  id: number;
  emi_id: number;
  emi_schedule_id: number;
  user_id: number;
  amount: string | number;
  paid_amount?: string | number;
  payment_date: string;
  payment_method: string;
  transaction_reference?: string | null;
  receipt_path?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  emi?: EmiPaymentEmiSummary | null;
  schedule?: EmiPaymentScheduleSummary | null;
  loan_name?: string;
  lender_name?: string;
  installment_number?: number;
  user?: PaymentUserSummary | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}
