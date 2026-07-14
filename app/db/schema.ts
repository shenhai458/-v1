import {
  sqliteTable,
  integer,
  text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  realName: text("real_name").notNull(),
  role: text("role", { enum: ["admin", "user", "visitor"] }).notNull().default("user"),
  department: text("department"),
  status: text("status", { enum: ["active", "disabled"] }).notNull().default("active"),
  lastLogin: integer("last_login", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  deadline: integer("deadline", { mode: "timestamp" }),
  department: text("department"),
  applyAmount: text("apply_amount"),
  receiveAmount: text("receive_amount"),
  status: text("status", { enum: ["ok", "failed", "in_progress", "pending"] }).notNull().default("pending"),
  applicant: text("applicant"),
  applyDate: integer("apply_date", { mode: "timestamp" }),
  receiveDate: integer("receive_date", { mode: "timestamp" }),
  noticeUrl: text("notice_url"),
  publicUrl: text("public_url"),
  notes: text("notes"),
  warning: text("warning", { enum: ["normal", "7days", "15days", "30days"] }).default("normal"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  systemName: text("system_name").default("政府项目申报管理系统"),
  timezone: text("timezone").default("Asia/Shanghai"),
  emailNotification: text("email_notification", { enum: ["on", "off"] }).default("on"),
  expiryReminder: text("expiry_reminder", { enum: ["on", "off"] }).default("on"),
  reminderDays: integer("reminder_days").default(7),
  passwordComplexity: text("password_complexity", { enum: ["on", "off"] }).default("on"),
  loginLock: text("login_lock", { enum: ["on", "off"] }).default("on"),
  sessionTimeout: integer("session_timeout").default(30),
  autoBackup: text("auto_backup", { enum: ["on", "off"] }).default("off"),
  backupFrequency: text("backup_frequency").default("daily"),
  backupRetention: integer("backup_retention").default(30),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});
