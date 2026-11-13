import apiClient from "@/lib/api";
import { ApiResponse } from "@/types";

export interface NotificationPreferences {
  email_enabled: boolean;
  rem_7_days: boolean;
  rem_3_days: boolean;
  rem_1_day: boolean;
  rem_due_date: boolean;
  rem_overdue: boolean;
}

export interface ProfileDetails {
  id: number;
  name: string;
  email: string;
  google_id?: string | null;
  is_google_linked: boolean;
  has_password: boolean;
  profile_photo?: string | null;
  email_verified_at?: string | null;
  preferred_currency: string;
  timezone: string;
  has_completed_onboarding?: boolean;
  is_currency_locked?: boolean;
  active_emis_count?: number;
  notification_preferences: NotificationPreferences;
  created_at: string;
  owned_families?: Array<{ id: number; name: string }>;
  families?: Array<{ id: number; name: string }>;
}

export const profileService = {
  /**
   * Get user profile and account settings
   */
  async getProfile(): Promise<ProfileDetails> {
    const response = await apiClient.get<ApiResponse<{ user: ProfileDetails }>>("/profile");
    return response.data.data.user;
  },

  /**
   * Update name, preferred currency, and timezone
   */
  async updateProfile(data: {
    name: string;
    preferred_currency: string;
    timezone: string;
    profile_photo?: string;
  }): Promise<ProfileDetails> {
    const response = await apiClient.put<ApiResponse<{ user: ProfileDetails }>>("/profile", data);
    return response.data.data.user;
  },

  /**
   * Complete initial onboarding setup (currency & timezone)
   */
  async completeOnboarding(data: {
    preferred_currency: string;
    timezone: string;
  }): Promise<ProfileDetails> {
    const response = await apiClient.post<ApiResponse<{ user: ProfileDetails }>>(
      "/profile/onboarding",
      data
    );
    return response.data.data.user;
  },

  /**
   * Upload cropped avatar (base64 or File)
   */
  async uploadAvatar(avatarData: string | File): Promise<string> {
    if (typeof avatarData === "string") {
      const response = await apiClient.post<ApiResponse<{ profile_photo: string }>>("/profile/avatar", {
        avatar_base64: avatarData,
      });
      return response.data.data.profile_photo;
    } else {
      const formData = new FormData();
      formData.append("avatar", avatarData);
      const response = await apiClient.post<ApiResponse<{ profile_photo: string }>>("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data.profile_photo;
    }
  },

  /**
   * Delete user avatar
   */
  async deleteAvatar(): Promise<void> {
    await apiClient.delete("/profile/avatar");
  },

  /**
   * Update notification cadence settings
   */
  async updateNotifications(preferences: NotificationPreferences): Promise<NotificationPreferences> {
    const response = await apiClient.put<ApiResponse<{ notification_preferences: NotificationPreferences }>>(
      "/profile/notifications",
      preferences
    );
    return response.data.data.notification_preferences;
  },

  /**
   * Update account password
   */
  async updatePassword(data: {
    current_password?: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await apiClient.put("/profile/password", data);
  },

  /**
   * Export all vault data as JSON file
   */
  async exportData(): Promise<Blob> {
    const response = await apiClient.get<ApiResponse<unknown>>("/profile/export");
    const jsonStr = JSON.stringify(response.data.data, null, 2);
    return new Blob([jsonStr], { type: "application/json" });
  },

  /**
   * Delete account and personal vault
   */
  async deleteAccount(confirmPassword?: string): Promise<void> {
    await apiClient.delete("/profile", {
      data: { confirm_password: confirmPassword },
    });
  },
};

export default profileService;
