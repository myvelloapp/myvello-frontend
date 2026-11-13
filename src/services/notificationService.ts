import apiClient from "@/lib/api";
import { ApiResponse } from "@/types";

export interface NotificationEmiSummary {
  id: number;
  loan_name: string;
  loan_category: string;
  lender_name: string;
}

export interface NotificationItem {
  id: number;
  type: "reminder" | "urgent" | "success" | "family" | "system";
  title: string;
  message: string;
  action_url?: string | null;
  action_label?: string | null;
  trigger_key?: string | null;
  is_read: boolean;
  timestamp: string;
  created_at: string;
  emi_id?: number | null;
  emi?: NotificationEmiSummary | null;
}

export interface NotificationListResponse {
  unread_count: number;
  notifications: NotificationItem[];
}

export type NotificationFilter = "all" | "unread" | "reminders" | "family";

export const notificationService = {
  /**
   * Fetch all notifications with optional category filter
   */
  async getNotifications(filter: NotificationFilter = "all"): Promise<NotificationListResponse> {
    const response = await apiClient.get<ApiResponse<NotificationListResponse>>("/notifications", {
      params: { filter },
    });
    return response.data.data;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: number): Promise<void> {
    await apiClient.post(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.post("/notifications/mark-all-read");
  },

  /**
   * Delete / dismiss an individual notification
   */
  async deleteNotification(id: number): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },

  /**
   * Clear all read notifications
   */
  async clearRead(): Promise<void> {
    await apiClient.delete("/notifications/clear-read");
  },
};
