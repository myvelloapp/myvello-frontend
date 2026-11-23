import apiClient from "@/lib/api";

export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BFgkbj5k7-sHNUp5bxltVu6ishLE2Ui99kJJ-r8wB-fqNhdJeBbI_yrTfVNyBqcP9AmUrAoDv0VuccXTl-IZjTQ";

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  try {
    const registration =
      (await navigator.serviceWorker.ready) ||
      (await navigator.serviceWorker.getRegistration("/")) ||
      (await navigator.serviceWorker.getRegistration());
    if (!registration) return null;
    return await registration.pushManager.getSubscription();
  } catch (err) {
    console.error("Error checking push subscription:", err);
    return null;
  }
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) return null;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    if (registration) {
      registration.update().catch(() => {});
    }
    return registration;
  } catch (err) {
    console.error("Service Worker registration failed:", err);
    return null;
  }
}

export async function syncPushSubscriptionToBackend(
  existingSub?: PushSubscription | null
): Promise<boolean> {
  if (!isPushSupported()) return false;
  try {
    const sub = existingSub || (await getExistingSubscription());
    if (!sub) return false;

    const isDesktop =
      typeof window !== "undefined" &&
      !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    await apiClient.post("/push/subscribe", {
      ...sub.toJSON(),
      device_type: isDesktop ? "desktop" : "mobile",
    });
    return true;
  } catch (err) {
    console.warn("Could not sync push subscription to backend:", err);
    return false;
  }
}

export async function subscribeToPush(): Promise<{
  success: boolean;
  subscription?: PushSubscription;
  error?: string;
}> {
  if (!isPushSupported()) {
    return { success: false, error: "Push notifications are not supported on this browser." };
  }

  try {
    // 1. Request permission (MUST be in response to user click on iOS)
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { success: false, error: "Notification permission was denied. Please allow notifications in your phone Settings." };
    }

    // 2. Register Service Worker
    const registration = await registerServiceWorker();
    if (!registration) {
      return { success: false, error: "Could not register background notification service." };
    }

    // Wait until service worker is active
    await navigator.serviceWorker.ready;

    // 3. Subscribe to Push Manager
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });

    // 4. Save to Backend Database
    await syncPushSubscriptionToBackend(subscription);

    try {
      await fetch("/api/push/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          subscription: subscription.toJSON(),
        }),
      });
    } catch {
      // ignore
    }

    return { success: true, subscription };
  } catch (err: any) {
    console.error("Error subscribing to push:", err);
    return { success: false, error: err?.message || "Failed to activate push notifications." };
  }
}

export async function sendTestNotification(subscription: PushSubscription): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const res = await fetch("/api/push/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send",
        subscription: subscription.toJSON(),
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to deliver test notification." };
    }

    return { success: true, message: data.message };
  } catch (err: any) {
    console.error("Error sending test push:", err);
    return { success: false, error: err?.message || "Could not reach push delivery service." };
  }
}
