"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NewEmiSkeleton } from "./page";

export default function AddNewEmiLoading() {
  return (
    <DashboardLayout isPopup={true}>
      <NewEmiSkeleton />
    </DashboardLayout>
  );
}
