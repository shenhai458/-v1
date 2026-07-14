import { handle } from "@hono/node-server/vercel";
import { createApp, seedDatabase } from "../server/boot";

console.log("[api/[[...route]]] Function loaded, creating app...");

const app = createApp();

console.log("[api/[[...route]]] App created, seeding database...");

seedDatabase()
  .then(() => console.log("[api/[[...route]]] Seed completed"))
  .catch((err) => console.error("[api/[[...route]]] Seed error:", err));

const handler = handle(app);
console.log("[api/[[...route]]] Handler created successfully");

export default handler;
