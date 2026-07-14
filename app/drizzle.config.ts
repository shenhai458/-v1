import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL || "file:./data/local.db";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: connectionString,
    authToken: process.env.DATABASE_AUTH_TOKEN || "",
  },
});
