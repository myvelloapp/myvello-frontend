import axios from "axios";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${BACKEND_BASE_URL}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

// Automatically attach Bearer token and CSRF token if present
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("myvello_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global response interceptor to handle unauthenticated sessions (e.g. copied links in new browsers, expired tokens)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("myvello_token");
      document.cookie = "myvello_token=; path=/; max-age=0; SameSite=Lax";

      const pathname = window.location.pathname;
      const isPublicPath = ["/login", "/register", "/forgot-password", "/verify-email", "/auth"].some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      );

      if (!isPublicPath && pathname !== "/") {
        window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Initializes CSRF protection cookie via Laravel Sanctum
 */
export async function getCsrfCookie(): Promise<void> {
  await axios.get(`${BACKEND_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

/**
 * Health check helper for backend API
 */
export interface SystemHealthResponse {
  status: "ok" | "degraded";
  app: string;
  version: string;
  environment: string;
  timestamp: string;
  timezone: string;
  database: {
    status: string;
    connection: string;
    error: string | null;
  };
}

export async function checkBackendHealth(): Promise<SystemHealthResponse> {
  const response = await apiClient.get<SystemHealthResponse>("/health");
  return response.data;
}

export default apiClient;
