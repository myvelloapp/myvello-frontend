"use client";

import React, { useEffect, useState } from "react";
import { Shield, Lock, Layers } from "lucide-react";

export function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-[#172554] flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <p className="text-sm font-medium text-slate-600">
              © {year} Myvello (www.myvello.in). All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              Family Vault Architecture
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              Private & Encrypted
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Modular Release (Phase 1)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
