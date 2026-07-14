import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  mysqlEnum,
  int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  realName: varchar("real_name", { length: 100 }).notNull(),
  role: mysqlEnum("role", ["admin", "user", "visitor"]).notNull().default("user"),
  department: varchar("department", { length: 100 }),
  status: mysqlEnum("status", ["active", "disabled"]).notNull().default("active"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  deadline: timestamp("deadline"),
  department: varchar("department", { length: 100 }),
  applyAmount: varchar("apply_amount", { length: 50 }),
  receiveAmount: varchar("receive_amount", { length: 50 }),
  status: mysqlEnum("status", ["ok", "failed", "in_progress", "pending"]).notNull().default("pending"),
  applicant: varchar("applicant", { length: 100 }),
  applyDate: timestamp("apply_date"),
  receiveDate: timestamp("receive_date"),
  noticeUrl: varchar("notice_url", { length: 500 }),
  publicUrl: varchar("public_url", { length: 500 }),
  notes: text("notes"),
  warning: mysqlEnum("warning", ["normal", "7days", "15days", "30days"]).default("normal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const settings = mysqlTable("settings", {
  id: serial("id").primaryKey(),
  systemName: varchar("system_name", { length: 255 }).default("政府项目申报管理系统"),
  timezone: varchar("timezone", { length: 50 }).default("Asia/Shanghai"),
  emailNotification: mysqlEnum("email_notification", ["on", "off"]).default("on"),
  expiryReminder: mysqlEnum("expiry_reminder", ["on", "off"]).default("on"),
  reminderDays: int("reminder_days").default(7),
  passwordComplexity: mysqlEnum("password_complexity", ["on", "off"]).default("on"),
  loginLock: mysqlEnum("login_lock", ["on", "off"]).default("on"),
  sessionTimeout: int("session_timeout").default(30),
  autoBackup: mysqlEnum("auto_backup", ["on", "off"]).default("off"),
  backupFrequency: varchar("backup_frequency", { length: 50 }).default("daily"),
  backupRetention: int("backup_retention").default(30),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
