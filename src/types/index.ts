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
  currency: string;
  loan_start_date: string;
  first_emi_date: string;
  due_day: number;
  loan_tenure_months: number;
  total_emis: number;
  payment_method?: string | null;
  reminder_enabled: boolean;
  status: EmiStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
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
}

export interface EmiPayment {
  id: number;
  emi_id: number;
  emi_schedule_id: number;
  user_id: number;
  amount: string | number;
  payment_date: string;
  payment_method: string;
  transaction_reference?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}
