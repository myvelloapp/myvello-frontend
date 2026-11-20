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
 * Synchronize authentication token with browser cookies for server-side Next.js route protection.
 * Uses 10-year expiration so users remain continuously logged in across app/browser restarts until explicit logout.
 */
export function setAuthCookie(token: string) {
  if (typeof document !== "undefined" && token) {
    const maxAge = 315360000; // 10 years in seconds
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    document.cookie = `myvello_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; expires=${expires}; SameSite=Lax`;
  }
}

export function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `myvello_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
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
    if (response.data.data.user && typeof window !== "undefined") {
      try {
        localStorage.setItem("myvello_user", JSON.stringify(response.data.data.user));
      } catch {}
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
    if (response.data.data.user && typeof window !== "undefined") {
      try {
        localStorage.setItem("myvello_user", JSON.stringify(response.data.data.user));
      } catch {}
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("myvello_user");
      }
      throw new Error("No authentication token found");
    }
    const response = await apiClient.get<ApiResponse<{ user: User; email_verified: boolean }>>("/auth/user");
    const user = response.data.data.user;
    if (user && typeof window !== "undefined") {
      try {
        localStorage.setItem("myvello_user", JSON.stringify(user));
      } catch {}
    }
    return user;
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
        localStorage.removeItem("myvello_user");
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
   * Verify email using 6-digit OTP code
   */
  async verifyOtp(otp: string, email?: string): Promise<AuthSuccessData> {
    const response = await apiClient.post<ApiResponse<AuthSuccessData>>("/auth/verify-otp", {
      otp: otp.trim(),
      ...(email ? { email: email.trim().toLowerCase() } : {}),
    });
    if (response.data.data.token) {
      localStorage.setItem("myvello_token", response.data.data.token);
      setAuthCookie(response.data.data.token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.token}`;
    }
    if (response.data.data.user && typeof window !== "undefined") {
      try {
        localStorage.setItem("myvello_user", JSON.stringify(response.data.data.user));
      } catch {}
    }
    return response.data.data;
  },

  /**
   * Verify email link
   */
  async verifyEmail(id: number, hash: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(`/auth/verify-email/${id}/${hash}`);
    return response.data.data.user;
  },

  /**
   * Resend verification email with 6-digit OTP code
   */
  async resendVerification(email?: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<null>>("/auth/resend-verification", {
      ...(email ? { email: email.trim().toLowerCase() } : {}),
    });
    return response.data.message || "A fresh verification code has been sent.";
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
