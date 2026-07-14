import { getDb } from "../api/queries/connection";
import { users, projects, settings } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const db = getDb();

  // Clear existing data
  await db.delete(projects);
  await db.delete(users);
  await db.delete(settings);

  // Seed admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(users).values([
    {
      username: "admin",
      password: hashedPassword,
      realName: "系统管理员",
      role: "admin" as const,
      department: "科技局",
      status: "active" as const,
      lastLogin: new Date(),
    },
    {
      username: "lianhaibin",
      password: await bcrypt.hash("123456", 10),
      realName: "连海滨",
      role: "user" as const,
      department: "发改委",
      status: "active" as const,
      lastLogin: new Date("2025-01-15T10:15:00"),
    },
    {
      username: "lufuxing",
      password: await bcrypt.hash("123456", 10),
      realName: "卢福星",
      role: "user" as const,
      department: "人社局",
      status: "active" as const,
      lastLogin: new Date("2025-01-14T16:20:00"),
    },
    {
      username: "linzhirong",
      password: await bcrypt.hash("123456", 10),
      realName: "林智荣",
      role: "user" as const,
      department: "商务局",
      status: "disabled" as const,
      lastLogin: new Date("2025-01-10T09:30:00"),
    },
  ]);

  // Seed projects
  await db.insert(projects).values([
    {
      name: "2024年科技保险补贴",
      deadline: new Date("2025-05-30"),
      department: "厦门市科学技术局",
      applyAmount: "41800",
      receiveAmount: null,
      status: "ok" as const,
      applicant: "连海滨",
      applyDate: new Date("2024-12-01"),
      receiveDate: null,
      noticeUrl: "",
      publicUrl: "",
      notes: "",
      warning: "normal" as const,
    },
    {
      name: "未来产业典型应用场景征集",
      deadline: new Date("2025-01-10"),
      department: "发改委",
      applyAmount: "荣誉",
      receiveAmount: null,
      status: "failed" as const,
      applicant: "连海滨",
      applyDate: new Date("2024-11-15"),
      receiveDate: null,
      noticeUrl: "",
      publicUrl: "",
      notes: "",
      warning: "normal" as const,
    },
    {
      name: "创业带动就业补贴—俊为",
      deadline: new Date("2025-04-10"),
      department: "人社局",
      applyAmount: "19000",
      receiveAmount: "19000",
      status: "ok" as const,
      applicant: "连海滨",
      applyDate: new Date("2024-10-20"),
      receiveDate: new Date("2025-03-01"),
      noticeUrl: "",
      publicUrl: "",
      notes: "",
      warning: "normal" as const,
    },
    {
      name: "厦门市高质量人才基地申报",
      deadline: new Date("2025-01-15"),
      department: "商务局",
      applyAmount: "荣誉",
      receiveAmount: null,
      status: "failed" as const,
      applicant: "连海滨",
      applyDate: new Date("2024-09-01"),
      receiveDate: null,
      noticeUrl: "",
      publicUrl: "",
      notes: "",
      warning: "normal" as const,
    },
    {
      name: "2025年超长期国债申报",
      deadline: new Date("2025-02-20"),
      department: "发改委",
      applyAmount: "7960000",
      receiveAmount: "7960000",
      status: "ok" as const,
      applicant: "连海滨",
      applyDate: new Date("2024-08-15"),
      receiveDate: new Date("2025-02-01"),
      noticeUrl: "",
      publicUrl: "",
      notes: "",
      warning: "normal" as const,
    },
  ]);

  // Seed default settings
  await db.insert(settings).values({
    systemName: "政府项目申报管理系统",
    timezone: "Asia/Shanghai",
    emailNotification: "on",
    expiryReminder: "on",
    reminderDays: 7,
    passwordComplexity: "on",
    loginLock: "on",
    sessionTimeout: 30,
    autoBackup: "off",
    backupFrequency: "daily",
    backupRetention: 30,
  });

  console.log("Seed completed!");
}

seed().catch(console.error);
