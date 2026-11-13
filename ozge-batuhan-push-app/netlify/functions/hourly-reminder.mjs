import { getStore } from "@netlify/blobs";
import webpush from "web-push";

export default async () => {
  const configStore = getStore("ob-push-config");
  const keys = await configStore.get("vapid-keys", { type: "json" });
  if (!keys) {
    console.error("VAPID keys are not initialized yet. Open the site and enable notifications first.");
    return;
  }

  webpush.setVapidDetails(
    process.env.URL || "https://netlify.com",
    keys.publicKey,
    keys.privateKey
  );

  const weekday = new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    timeZone: "Europe/Istanbul"
  }).format(new Date());

  const payload = JSON.stringify({
    title: "Özge ♥ Batuhan 🌼",
    body: `Bugün günlerden ${weekday}. Güzel bir gün olsun! ❤️`,
    url: "/"
  });

  const subscriptionsStore = getStore("ob-push-subscriptions");
  const { blobs } = await subscriptionsStore.list();

  const results = await Promise.allSettled(blobs.map(async ({ key }) => {
    const subscription = await subscriptionsStore.get(key, { type: "json" });
    if (!subscription) return;
    try {
      await webpush.sendNotification(subscription, payload, { TTL: 3600 });
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await subscriptionsStore.delete(key);
      } else {
        console.error("Push delivery failed:", error.statusCode || error.message);
      }
    }
  }));

  console.log(`Hourly ÖB reminder processed for ${blobs.length} subscription(s).`, results.length);
};

export const config = { schedule: "@hourly" };
