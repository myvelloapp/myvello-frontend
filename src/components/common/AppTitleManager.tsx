"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Myvello",
  "/dashboard": "Dashboard - Myvello",
  "/emis": "EMIs & Loans - Myvello",
  "/emis/new": "Add New Loan - Myvello",
  "/payment-history": "Payment History - Myvello",
  "/notifications": "Reminders - Myvello",
  "/family": "Household Workspace - Myvello",
  "/family/setup": "Setup Group - Myvello",
  "/account": "Account Settings - Myvello",
  "/documents": "Documents Vault - Myvello",
  "/login": "Sign In - Myvello",
  "/register": "Create Account - Myvello",
  "/forgot-password": "Reset Password - Myvello",
  "/auth/callback": "Signing In - Myvello",
  "/verify-email": "Verify Email - Myvello",
};

export function AppTitleManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/emis/") && pathname !== "/emis/new") {
      document.title = "Loan Details - Myvello";
    } else if (ROUTE_TITLES[pathname]) {
      document.title = ROUTE_TITLES[pathname];
    } else {
      document.title = "Myvello";
    }
  }, [pathname]);

  return null;
}
