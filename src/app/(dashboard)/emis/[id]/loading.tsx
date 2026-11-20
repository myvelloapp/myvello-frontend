"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmiDetailSkeleton } from "./page";

export default function EmiDetailLoading() {
  return (
    <DashboardLayout>
      <EmiDetailSkeleton />
    </DashboardLayout>
  );
}
