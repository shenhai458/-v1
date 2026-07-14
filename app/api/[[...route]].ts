import { handle } from "@hono/node-server/vercel";
import { createApp, seedDatabase } from "../dist/server-bundle.js";

const app = createApp();
seedDatabase().catch((err) => console.error("Seed error:", err));

export default handle(app);
