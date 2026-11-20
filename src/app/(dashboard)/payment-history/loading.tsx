"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PaymentHistorySkeleton } from "./page";

export default function PaymentHistoryLoading() {
  return (
    <DashboardLayout>
      <PaymentHistorySkeleton />
    </DashboardLayout>
  );
}
