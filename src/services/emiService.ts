import apiClient from "@/lib/api";
import { ApiResponse, Emi, EmiSchedule, EmiPayment } from "@/types";

export interface EmiListItem {
  id: number;
  loan_name: string;
  loan_category: string;
  lender_name: string;
  loan_reference?: string | null;
  original_loan_amount: number;
  emi_amount: number;
  outstanding_principal: number;
  currency: string;
  total_emis: number;
  paid_emis: number;
  progress_percentage: number;
  status: "active" | "completed" | "closed" | "defaulted";
  ownership_type: "personal" | "family_shared";
  payment_method?: string | null;
  debit_bank_name?: string | null;
  debit_account_number?: string | null;
  next_schedule_id?: number | null;
  next_due_date?: string | null;
  next_due_amount?: number | null;
  days_remaining?: number | null;
  next_due_status: "upcoming" | "due_soon" | "due_today" | "overdue";
}

export interface EmiSummaryStats {
  active_emis: number;
  monthly_emi: number;
  outstanding: number;
  paid_emis: number;
  completed_emis?: number;
  archived_emis?: number;
}

export interface NextEmiHeroData {
  schedule_id: number;
  emi_id: number;
  loan_name: string;
  loan_category?: string;
  lender_name: string;
  amount: number;
  due_date: string;
  due_date_iso: string;
  days_remaining: number;
  status: "upcoming" | "due_soon" | "overdue";
}

export interface EmiIndexResponse {
  summary: EmiSummaryStats;
  next_emi_hero: NextEmiHeroData | null;
  emis: EmiListItem[];
}

export interface CalendarEventItem {
  schedule_id: number;
  emi_id: number;
  loan_name: string;
  lender_name: string;
  category: string;
  day: number;
  due_date: string;
  amount: number;
  status: string;
}

export interface CalendarResponse {
  year: number;
  month: number;
  items: CalendarEventItem[];
}

export interface CreateEmiPayload {
  loan_name: string;
  loan_category: string;
  lender_name: string;
  loan_reference?: string;
  description?: string;
  original_loan_amount: number;
  emi_amount: number;
  interest_rate?: number;
  outstanding_principal?: number;
  currency?: string;
  loan_start_date: string;
  first_emi_date: string;
  due_day: number;
  loan_tenure_months: number;
  total_emis: number;
  paid_emis_count?: number;
  processing_fee?: number;
  processing_fee_type?: "deducted" | "financed";
  first_emi_amount?: number;
  first_emi_type?: "bpi" | "reamortize";
  net_disbursed_amount?: number;
  payment_method?: string;
  debit_bank_name?: string;
  debit_account_number?: string;
  reminder_enabled?: boolean;
  reminder_days_before?: number[];
  ownership_type: "personal" | "family_shared";
  family_id?: number | null;
  notes?: string;
}

export interface MarkAsPaidPayload {
  paid_amount: number;
  payment_date: string;
  payment_method: string;
  transaction_reference?: string;
  notes?: string;
  paid_by_user_id?: number;
}

export interface ForeclosurePayload {
  settlement_amount: number;
  foreclosure_charges?: number;
  payment_date: string;
  payment_method: string;
  transaction_reference?: string;
  notes?: string;
  paid_by_user_id?: number;
}

export const emiService = {
  /**
   * Fetch all EMIs with summary stats and next EMI hero
   */
  async getEmis(params?: {
    status?: string;
    category?: string;
    bank?: string;
    search?: string;
    family_id?: string | number;
  }): Promise<EmiIndexResponse> {
    const response = await apiClient.get<ApiResponse<EmiIndexResponse>>("/emis", { params });
    return response.data.data;
  },

  /**
   * Create a new EMI
   */
  async createEmi(payload: CreateEmiPayload): Promise<Emi> {
    const response = await apiClient.post<ApiResponse<Emi>>("/emis", payload);
    return response.data.data;
  },

  /**
   * Get single EMI details with schedules and payment history
   */
  async getEmi(id: number): Promise<Emi & { schedules: EmiSchedule[]; payments: EmiPayment[]; family?: { id: number; name: string } | null }> {
    const response = await apiClient.get<ApiResponse<Emi & { schedules: EmiSchedule[]; payments: EmiPayment[]; family?: { id: number; name: string } | null }>>(`/emis/${id}`);
    return response.data.data;
  },

  /**
   * Update an existing EMI
   */
  async updateEmi(id: number, payload: Partial<CreateEmiPayload>): Promise<Emi & { schedules: EmiSchedule[]; payments: EmiPayment[] }> {
    const response = await apiClient.put<ApiResponse<Emi & { schedules: EmiSchedule[]; payments: EmiPayment[] }>>(`/emis/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle archive status for an EMI (active <-> closed)
   */
  async archiveEmi(id: number): Promise<{ id: number; status: string }> {
    const response = await apiClient.post<ApiResponse<{ id: number; status: string }>>(`/emis/${id}/archive`);
    return response.data.data;
  },

  /**
   * Delete an EMI permanently
   */
  async deleteEmi(id: number): Promise<void> {
    await apiClient.delete(`/emis/${id}`);
  },

  /**
   * Mark a schedule installment as paid
   */
  async markScheduleAsPaid(emiId: number, scheduleId: number, payload: MarkAsPaidPayload): Promise<void> {
    await apiClient.post(`/emis/${emiId}/schedules/${scheduleId}/mark-paid`, payload);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("myvello:refresh_notifications"));
      try {
        if ("BroadcastChannel" in window) {
          const channel = new BroadcastChannel("myvello_notifications");
          channel.postMessage({ type: "PAYMENT_RECORDED", timestamp: Date.now() });
          channel.close();
        }
      } catch {
        // ignore
      }
    }
  },

  /**
   * Foreclose / pre-close an EMI loan early
   */
  async forecloseEmi(emiId: number, payload: ForeclosurePayload): Promise<Emi> {
    const response = await apiClient.post<ApiResponse<Emi>>(`/emis/${emiId}/foreclose`, payload);
    return response.data.data;
  },

  /**
   * Get calendar schedule events for a specific month
   */
  async getCalendarEvents(year: number, month: number): Promise<CalendarResponse> {
    const response = await apiClient.get<ApiResponse<CalendarResponse>>("/emis/calendar", {
      params: { year, month },
    });
    return response.data.data;
  },

  /**
   * Get global payment history
   */
  async getPaymentHistory(
    page = 1,
    perPage = 25,
    familyId?: string | number
  ): Promise<{ data: EmiPayment[]; current_page: number; last_page: number; total: number; per_page?: number }> {
    const params: Record<string, unknown> = { page, per_page: perPage };
    if (familyId) {
      params.family_id = familyId;
    }
    const response = await apiClient.get<ApiResponse<{ data: EmiPayment[]; current_page: number; last_page: number; total: number; per_page?: number }>>("/emis/payment-history", {
      params,
    });
    return response.data.data;
  },
};

export default emiService;
