import { handle } from "@hono/node-server/vercel";
import { Hono } from "hono";

const app = new Hono();

app.get("/api/health", (c) => c.json({ status: "ok", from: "hono-minimal" }));
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default handle(app);
