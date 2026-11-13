import apiClient from "@/lib/api";
import { User, ApiResponse } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms: boolean;
  privacy: boolean;
  preferred_currency?: string;
  timezone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthSuccessData {
  user: User;
  token: string;
  email_verified: boolean;
}

/**
 * Synchronize authentication token with browser cookies for server-side Next.js route protection
 */
export function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `myvello_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
  }
}

export function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `myvello_token=; path=/; max-age=0; SameSite=Lax`;
  }
}

export const authService = {
  /**
   * Register a new user
   */
  async register(payload: RegisterPayload): Promise<AuthSuccessData> {
    const response = await apiClient.post<ApiResponse<AuthSuccessData>>("/auth/register", payload);
    if (response.data.data.token) {
      localStorage.setItem("myvello_token", response.data.data.token);
      setAuthCookie(response.data.data.token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.token}`;
    }
    return response.data.data;
  },

  /**
   * Login with email and password
   */
  async login(payload: LoginPayload): Promise<AuthSuccessData> {
    const response = await apiClient.post<ApiResponse<AuthSuccessData>>("/auth/login", payload);
    if (response.data.data.token) {
      localStorage.setItem("myvello_token", response.data.data.token);
      setAuthCookie(response.data.data.token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.token}`;
    }
    return response.data.data;
  },

  /**
   * Fetch current authenticated user
   */
  async getAuthenticatedUser(): Promise<User> {
    const token = typeof window !== "undefined" ? localStorage.getItem("myvello_token") : null;
    if (token) {
      setAuthCookie(token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      clearAuthCookie();
    }
    const response = await apiClient.get<ApiResponse<{ user: User; email_verified: boolean }>>("/auth/user");
    return response.data.data.user;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("myvello_token");
        clearAuthCookie();
      }
      delete apiClient.defaults.headers.common["Authorization"];
    }
  },

  /**
   * Send password reset email
   */
  async forgotPassword(email: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<null>>("/auth/forgot-password", { email });
    return response.data.message || "Password reset instructions sent.";
  },

  /**
   * Verify email link
   */
  async verifyEmail(id: number, hash: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(`/auth/verify-email/${id}/${hash}`);
    return response.data.data.user;
  },

  /**
   * Resend verification email
   */
  async resendVerification(): Promise<string> {
    const response = await apiClient.post<ApiResponse<null>>("/auth/resend-verification");
    return response.data.message || "Verification email sent.";
  },

  /**
   * Get Google OAuth Redirect URL
   */
  async getGoogleLoginUrl(): Promise<string> {
    const response = await apiClient.get<{ success: boolean; redirect_url: string }>("/auth/google/redirect");
    return response.data.redirect_url;
  },
};

export default authService;
