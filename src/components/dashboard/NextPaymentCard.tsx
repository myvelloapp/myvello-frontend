"use client";

import React, { useState } from "react";
import { Calendar, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { nextPaymentHighlight, mockEmis } from "@/lib/mockData";
import { MarkAsPaidModal } from "@/components/common/MarkAsPaidModal";

export function NextPaymentCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const homeLoan = mockEmis.find((e) => e.id === nextPaymentHighlight.loanId) || mockEmis[0];

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition-all hover:shadow-sm">
        {/* Card Header matching screenshot */}
        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold tracking-tight text-slate-900">
            Next EMI Payment
          </h3>
        </div>

        {/* Content Box */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">
                {nextPaymentHighlight.loanName}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  ₹{nextPaymentHighlight.amount.toLocaleString()}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {nextPaymentHighlight.daysLeft} days left
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs font-medium text-slate-500 flex items-center justify-between pt-1">
            <span>Due on {nextPaymentHighlight.dueDate}</span>
            <span className="text-[11px] text-slate-400">{homeLoan.bankName}</span>
          </div>

          {/* Action Button matching screenshot */}
          <Button
            variant="secondary"
            className="w-full h-11 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold shadow-xs"
            onClick={() => setIsModalOpen(true)}
          >
            Mark as Paid
          </Button>
        </div>
      </div>

      <MarkAsPaidModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        emi={homeLoan}
        onSuccess={(data) => {
          alert(`Recorded payment of ₹${data.amount.toLocaleString()} for ${homeLoan.loanName}!`);
        }}
      />
    </>
  );
}
