"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationsSkeleton } from "./page";

export default function NotificationsLoading() {
  return (
    <DashboardLayout>
      <NotificationsSkeleton />
    </DashboardLayout>
  );
}
