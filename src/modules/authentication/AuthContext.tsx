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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getAuthenticatedUser();
      setUser(currentUser);
    } catch {
      setUser(null);
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
