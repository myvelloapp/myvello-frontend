import apiClient from "@/lib/api";
import { ApiResponse } from "@/types";

export interface FamilyMemberPreview {
  id: number;
  name: string;
  profile_photo?: string | null;
}

export interface FamilySummary {
  id: number;
  name: string;
  invite_code?: string;
  owner_id: number;
  owner?: { id: number; name: string; email: string; profile_photo?: string | null };
  is_owner: boolean;
  my_role: "owner" | "admin" | "member";
  members_count: number;
  members_preview?: FamilyMemberPreview[];
  created_at: string;
}

export interface FamilyMemberItem {
  id: number;
  user_id: number;
  name: string;
  email: string;
  profile_photo?: string | null;
  role: "owner" | "admin" | "member";
  joined_at: string;
}

export interface PendingInvitationItem {
  id: number;
  email: string;
  role: "admin" | "member";
  invited_by: string;
  expires_at: string;
  created_at: string;
}

export interface IncomingInvitationItem {
  id: number;
  family_id: number;
  family_name: string;
  role: "admin" | "member";
  invited_by_name: string;
  invited_by_photo?: string | null;
  expires_at: string;
  created_at: string;
}

export interface SharedEmiItem {
  id: number;
  loan_name: string;
  loan_category: string;
  lender_name: string;
  emi_amount: number;
  outstanding_principal: number;
  status: string;
  created_by: string;
}

export interface FamilyDetail {
  id: number;
  name: string;
  invite_code?: string;
  owner_id: number;
  my_role: "owner" | "admin" | "member";
  is_owner: boolean;
  is_admin: boolean;
  members: FamilyMemberItem[];
  pending_invitations: PendingInvitationItem[];
  shared_emis?: SharedEmiItem[];
  created_at: string;
}

export const familyService = {
  /**
   * List user's families
   */
  async getFamilies(): Promise<FamilySummary[]> {
    const response = await apiClient.get<ApiResponse<FamilySummary[]>>("/families");
    return response.data.data;
  },

  /**
   * Create a new family workspace
   */
  async createFamily(name: string): Promise<FamilySummary> {
    const response = await apiClient.post<ApiResponse<FamilySummary>>("/families", { name });
    return response.data.data;
  },

  /**
   * Get family workspace details with members
   */
  async getFamily(id: number): Promise<FamilyDetail> {
    const response = await apiClient.get<ApiResponse<FamilyDetail>>(`/families/${id}`);
    return response.data.data;
  },

  /**
   * Invite a new member via email
   */
  async inviteMember(familyId: number, email: string, role: "admin" | "member"): Promise<{ id: number; email: string; role: string; invitation_token: string }> {
    const response = await apiClient.post<ApiResponse<{ id: number; email: string; role: string; invitation_token: string }>>(`/families/${familyId}/invite`, {
      email,
      role,
    });
    return response.data.data;
  },

  /**
   * Accept an invitation using the plain token
   */
  async acceptInvitation(token: string): Promise<{ family_id: number; family_name: string; role: string }> {
    const response = await apiClient.post<ApiResponse<{ family_id: number; family_name: string; role: string }>>("/families/accept-invite", {
      token,
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("myvello:refresh_notifications"));
      try {
        if ("BroadcastChannel" in window) {
          const channel = new BroadcastChannel("myvello_notifications");
          channel.postMessage({ type: "INVITATION_ACCEPTED", timestamp: Date.now() });
          channel.close();
        }
      } catch {
        // ignore
      }
    }
    return response.data.data;
  },

  /**
   * List all pending invitations sent to the current user
   */
  async getMyInvitations(): Promise<IncomingInvitationItem[]> {
    const response = await apiClient.get<ApiResponse<IncomingInvitationItem[]>>("/families/my-invitations");
    return response.data.data;
  },

  /**
   * 1-Click Accept an invitation by ID
   */
  async acceptInvitationById(invitationId: number): Promise<{ family_id: number; family_name: string; role: string }> {
    const response = await apiClient.post<ApiResponse<{ family_id: number; family_name: string; role: string }>>(
      `/families/invitations/${invitationId}/accept`
    );
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("myvello:refresh_notifications"));
      try {
        if ("BroadcastChannel" in window) {
          const channel = new BroadcastChannel("myvello_notifications");
          channel.postMessage({ type: "INVITATION_ACCEPTED", timestamp: Date.now() });
          channel.close();
        }
      } catch {
        // ignore
      }
    }
    return response.data.data;
  },

  /**
   * 1-Click Decline an invitation by ID
   */
  async declineInvitationById(invitationId: number): Promise<void> {
    await apiClient.post(`/families/invitations/${invitationId}/decline`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("myvello:refresh_notifications"));
      try {
        if ("BroadcastChannel" in window) {
          const channel = new BroadcastChannel("myvello_notifications");
          channel.postMessage({ type: "INVITATION_DECLINED", timestamp: Date.now() });
          channel.close();
        }
      } catch {
        // ignore
      }
    }
  },

  /**
   * Remove a member from the family workspace
   */
  async removeMember(familyId: number, memberId: number): Promise<void> {
    await apiClient.delete(`/families/${familyId}/members/${memberId}`);
  },

  /**
   * Update a member's role
   */
  async updateMemberRole(familyId: number, memberId: number, role: "admin" | "member"): Promise<{ id: number; role: string }> {
    const response = await apiClient.patch<ApiResponse<{ id: number; role: string }>>(`/families/${familyId}/members/${memberId}/role`, {
      role,
    });
    return response.data.data;
  },

  /**
   * Rename family workspace (owner only)
   */
  async updateFamily(familyId: number, name: string): Promise<{ id: number; name: string }> {
    const response = await apiClient.put<ApiResponse<{ id: number; name: string }>>(`/families/${familyId}`, {
      name,
    });
    return response.data.data;
  },

  /**
   * Cancel / revoke a pending invitation
   */
  async cancelInvitation(familyId: number, invitationId: number): Promise<void> {
    await apiClient.delete(`/families/${familyId}/invitations/${invitationId}`);
  },

  /**
   * Leave family workspace (non-owners)
   */
  async leaveFamily(familyId: number): Promise<void> {
    await apiClient.post(`/families/${familyId}/leave`);
  },

  /**
   * Delete a family workspace (owner only)
   */
  async deleteFamily(familyId: number): Promise<void> {
    try {
      await apiClient.delete(`/families/${familyId}`);
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number } };
      if (errorObj?.response?.status === 405) {
        await apiClient.post(`/families/${familyId}/delete`);
        return;
      }
      throw err;
    }
  },
};

export default familyService;
