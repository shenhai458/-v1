import "dotenv/config";

export const env = {
  appSecret: process.env.APP_SECRET || "gov-project-default-secret-2025",
  isProduction: (process.env.NODE_ENV || "production") === "production",
  databaseUrl: process.env.DATABASE_URL || "file:./data/local.db",
  databaseAuthToken: process.env.DATABASE_AUTH_TOKEN || "",
};
