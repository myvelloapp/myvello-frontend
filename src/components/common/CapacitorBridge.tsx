"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function CapacitorBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect if running inside native Capacitor Android/iOS shell
    import("@capacitor/core").then(({ Capacitor }) => {
      if (!Capacitor.isNativePlatform()) return;

      // 1. Configure Native Status Bar (Mint background with dark icons)
      import("@capacitor/status-bar").then(({ StatusBar, Style }) => {
        StatusBar.setBackgroundColor({ color: "#EDF8F2" }).catch(() => {});
        StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      });

      // 2. Hide Native Splash Screen smoothly once UI renders
      import("@capacitor/splash-screen").then(({ SplashScreen }) => {
        SplashScreen.hide().catch(() => {});
      });

      // 3. Android Hardware Back Button & Gesture Navigation
      import("@capacitor/app").then(({ App }) => {
        const backListenerPromise = App.addListener("backButton", ({ canGoBack }) => {
          // If any modal/dialog is currently open, dismiss it via Escape
          const openModals = document.querySelectorAll("[role='dialog'], .fixed.inset-0.z-50");
          if (openModals.length > 0) {
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Escape", code: "Escape" })
            );
            return;
          }

          // If on primary root/home screen, exit app cleanly
          const isMainPage = pathname === "/emis" || pathname === "/dashboard" || pathname === "/";
          if (isMainPage) {
            App.exitApp();
          } else if (canGoBack && window.history.length > 1) {
            window.history.back();
          } else {
            router.push("/emis");
          }
        });

        return () => {
          backListenerPromise.then((h) => h.remove()).catch(() => {});
        };
      });
    });
  }, [router, pathname]);

  return null;
}
