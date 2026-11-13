import { getStore } from "@netlify/blobs";
import webpush from "web-push";

export default async () => {
  const store = getStore("ob-push-config");
  let keys = await store.get("vapid-keys", { type: "json" });
  if (!keys) {
    const generated = webpush.generateVAPIDKeys();
    await store.setJSON("vapid-keys", generated, { onlyIfNew: true });
    keys = await store.get("vapid-keys", { type: "json" });
  }
  return Response.json({ publicKey: keys.publicKey }, {
    headers: { "Cache-Control": "public, max-age=3600" }
  });
};

export const config = { path: "/api/vapid-public-key" };
