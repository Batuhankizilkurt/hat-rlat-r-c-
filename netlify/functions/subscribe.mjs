import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

export default async (request) => {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const subscription = await request.json();
    if (!subscription?.endpoint?.startsWith("https://") || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return new Response("Invalid push subscription", { status: 400 });
    }
    const id = createHash("sha256").update(subscription.endpoint).digest("hex");
    const store = getStore("ob-push-subscriptions");
    await store.setJSON(id, subscription);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Subscription save failed:", error);
    return new Response("Could not save subscription", { status: 500 });
  }
};
