import { NextResponse } from "next/server";
import { setVapidDetails, sendNotification } from "web-push";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BFgkbj5k7-sHNUp5bxltVu6ishLE2Ui99kJJ-r8wB-fqNhdJeBbI_yrTfVNyBqcP9AmUrAoDv0VuccXTl-IZjTQ";

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || "VsAytfTayC2Rqxr9L8_rn6BEAM3VwWEiYAvC54yJ8Vw";

const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:support@myvello.app";

const RELAY_SECRET = process.env.PUSH_RELAY_SECRET || "myvello_push_secret_2026_secure";

setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { secret, subscriptions, subscription, payload } = body;

    // Secure handshake between Hostinger backend and Vercel Next.js
    if (secret !== RELAY_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized push relay request" },
        { status: 401 }
      );
    }

    const subsList: any[] = [];
    if (Array.isArray(subscriptions)) {
      subsList.push(...subscriptions);
    } else if (subscription && subscription.endpoint) {
      subsList.push(subscription);
    }

    // Deduplicate subscriptions by unique endpoint to avoid duplicate toasts on the client
    const seenEndpoints = new Set<string>();
    const uniqueSubs = subsList.filter((sub) => {
      const ep = sub?.endpoint;
      if (!ep || seenEndpoints.has(ep)) return false;
      seenEndpoints.add(ep);
      return true;
    });

    if (uniqueSubs.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid subscriptions provided" },
        { status: 400 }
      );
    }

    const title = payload?.title || "Myvello Alert";
    const bodyText = payload?.body || "";
    const tag = payload?.tag || "";

    // STRICT SAFETY SUPPRESSION: Never deliver payment history, logs, or receipts as push notifications
    const isPaymentAlert =
      /payment\s*(logged|reconciled|history|recorded)/i.test(title) ||
      /payment\s*(of|successfully|logged)/i.test(bodyText) ||
      /payment_/i.test(tag);

    if (isPaymentAlert) {
      return NextResponse.json({
        success: true,
        message: "Payment push notifications are permanently suppressed.",
        sent_count: 0,
      });
    }

    const jsonPayload = JSON.stringify({
      title,
      body: bodyText,
      icon: payload?.icon || "/icons/icon-192x192.png",
      badge: payload?.badge || "/icons/icon-192x192.png",
      url: payload?.url || "/notifications",
      tag: tag || `myvello-${title ? title.replace(/\s+/g, '-').toLowerCase() : "alert"}`,
    });

    const expiredEndpoints: string[] = [];
    let sentCount = 0;

    await Promise.allSettled(
      uniqueSubs.map(async (sub) => {
        try {
          const endpoint = sub.endpoint;
          const p256dh = sub.p256dh || (sub.keys && sub.keys.p256dh);
          const auth = sub.auth || (sub.keys && sub.keys.auth);

          if (!endpoint || !p256dh || !auth) return;

          await sendNotification(
            {
              endpoint,
              keys: { p256dh, auth },
            },
            jsonPayload
          );
          sentCount++;
        } catch (err: any) {
          console.warn("Push delivery to endpoint failed:", err?.statusCode, err?.message);
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            expiredEndpoints.push(sub.endpoint);
          }
        }
      })
    );

    return NextResponse.json({
      success: true,
      sent_count: sentCount,
      expired_endpoints: expiredEndpoints,
    });
  } catch (err: any) {
    console.error("Error in push relay route:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Internal relay error",
      },
      { status: 500 }
    );
  }
}
