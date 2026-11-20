"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FamilySetupSkeleton } from "./page";

export default function FamilySetupLoading() {
  return (
    <DashboardLayout isPopup={true}>
      <FamilySetupSkeleton />
    </DashboardLayout>
  );
}
