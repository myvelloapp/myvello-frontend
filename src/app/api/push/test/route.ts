import { NextResponse } from "next/server";
import { setVapidDetails, sendNotification } from "web-push";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BFgkbj5k7-sHNUp5bxltVu6ishLE2Ui99kJJ-r8wB-fqNhdJeBbI_yrTfVNyBqcP9AmUrAoDv0VuccXTl-IZjTQ";

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || "VsAytfTayC2Rqxr9L8_rn6BEAM3VwWEiYAvC54yJ8Vw";

const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:support@myvello.app";

setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, subscription } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { success: false, error: "Invalid subscription payload" },
        { status: 400 }
      );
    }

    if (action === "send") {
      const payload = JSON.stringify({
        title: "Myvello: EMI Due Alert",
        body: "Your upcoming EMI of ₹3,670 is scheduled soon. Lock-screen push notifications are successfully active!",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        url: "/emis",
        tag: "myvello-test-alert",
      });

      await sendNotification(subscription, payload);

      return NextResponse.json({
        success: true,
        message: "Test notification dispatched to your phone lock screen!",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription registered successfully.",
    });
  } catch (err: any) {
    console.error("Error in push test API route:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to deliver push notification",
      },
      { status: 500 }
    );
  }
}
