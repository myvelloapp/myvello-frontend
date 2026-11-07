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
