"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { authService, LoginPayload, RegisterPayload } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Instant synchronous hydration from localStorage - zero waiting on initial page load
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("myvello_token");
        const cachedUser = localStorage.getItem("myvello_user");
        if (token && cachedUser) {
          return JSON.parse(cachedUser);
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("myvello_token");
      const cachedUser = localStorage.getItem("myvello_user");
      // If token and cached user exist, session is ALREADY verified! Instant load!
      if (token && cachedUser) {
        return false;
      }
      // If no token exists at all, user is definitely unauthenticated, don't show verifying spinner!
      if (!token) {
        return false;
      }
    }
    return true;
  });

  const refreshUser = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("myvello_token") : null;
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await Promise.race([
        authService.getAuthenticatedUser(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Session verification timeout")), 4000)
        ),
      ]);
      setUser(currentUser);
      if (typeof window !== "undefined" && currentUser) {
        try {
          localStorage.setItem("myvello_user", JSON.stringify(currentUser));
        } catch {}
      }
    } catch {
      // If verification genuinely failed (e.g. 401 token expired)
      if (typeof window !== "undefined" && !localStorage.getItem("myvello_token")) {
        setUser(null);
        try {
          localStorage.removeItem("myvello_user");
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (payload: LoginPayload) => {
    const data = await authService.login(payload);
    setUser(data.user);
    try {
      sessionStorage.removeItem("myvello_pwa_dismissed_session");
      localStorage.removeItem("myvello_pwa_dismissed");
    } catch {
      // ignore
    }
    if (!data.email_verified) {
      router.push("/verify-email");
    } else {
      // If user came via a copied link with redirect parameter, send them back to that page safely
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect");
        if (redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")) {
          router.push(redirectParam);
          return;
        }
      }
      router.push("/emis");
    }
  };

  const register = async (payload: RegisterPayload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    try {
      sessionStorage.removeItem("myvello_pwa_dismissed_session");
      localStorage.removeItem("myvello_pwa_dismissed");
    } catch {
      // ignore
    }
    router.push("/verify-email");
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    try {
      sessionStorage.removeItem("myvello_pwa_dismissed_session");
      localStorage.removeItem("myvello_pwa_dismissed");
    } catch {
      // ignore
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isEmailVerified: Boolean(user?.email_verified_at),
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
