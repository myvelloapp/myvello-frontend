"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FamilyWorkspaceSkeleton } from "./page";

export default function FamilyLoading() {
  return (
    <DashboardLayout>
      <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-2.5 sm:space-y-5">
          <FamilyWorkspaceSkeleton />
        </div>
      </div>
    </DashboardLayout>
  );
}
