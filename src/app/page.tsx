"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/authentication/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? "/emis" : "/register");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#EDF8F2] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
    </div>
  );
}
