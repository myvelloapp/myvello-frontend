import { ForgotPasswordSkeleton } from "./page";

export default function ForgotPasswordLoading() {
  return (
    <div className="min-h-dvh w-full flex flex-col lg:flex-row bg-white relative overflow-x-hidden select-none">
      {/* Mobile top accent gradient bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#b0fd01] via-[#10b981] to-[#02361b] z-50 pointer-events-none" />

      {/* Left Column: Form Section Skeleton */}
      <div className="w-full lg:w-[460px] xl:w-[500px] 2xl:w-[560px] shrink-0 min-h-dvh bg-white relative flex flex-col justify-between px-4 sm:px-8 lg:px-10 xl:px-12 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,calc(1rem+env(safe-area-inset-bottom)))] overflow-y-auto">
        {/* Top Header Placeholder */}
        <div className="pt-2 sm:pt-0">
          <div className="w-11 h-11 rounded-[14px] sm:rounded-[16px] bg-slate-100 border border-slate-200/70" />
        </div>

        {/* Skeleton Form */}
        <ForgotPasswordSkeleton />

        {/* Empty bottom space to balance vertical alignment */}
        <div className="h-4 sm:h-6" />
      </div>

      {/* Right Column: Fixed Brand Gradient Background with Pattern Overlay (Desktop Only) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-dvh bg-theme-gradient flex-col justify-between p-10 xl:p-14 2xl:p-16 text-white select-none">
        <div className="absolute inset-0 bg-auth-pattern" />
      </div>
    </div>
  );
}
