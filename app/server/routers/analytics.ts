import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { projects } from "../../db/schema";
// analytics router

export const analyticsRouter = createRouter({
  overview: publicQuery.query(async () => {
    const db = getDb();
    const allProjects = await db.select().from(projects);

    const total = allProjects.length;
    const okProjects = allProjects.filter((p) => p.status === "ok");
    const completed = okProjects.length;
    const failed = allProjects.filter((p) => p.status === "failed").length;

    let totalApply = 0;
    let totalReceive = 0;
    allProjects.forEach((p) => {
      if (p.applyAmount && !isNaN(parseFloat(p.applyAmount))) {
        totalApply += parseFloat(p.applyAmount);
      }
      if (p.receiveAmount && !isNaN(parseFloat(p.receiveAmount))) {
        totalReceive += parseFloat(p.receiveAmount);
      }
    });

    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const now = new Date();
    const activeProjects = allProjects.filter((p) => {
      if (!p.deadline) return false;
      return new Date(p.deadline) > now;
    }).length;

    return {
      totalApplyAmount: totalApply,
      totalReceiveAmount: totalReceive,
      successRate,
      activeProjects,
      totalProjects: total,
      completedProjects: completed,
      failedProjects: failed,
    };
  }),

  monthlyTrend: publicQuery.query(async () => {
    const db = getDb();
    const allProjects = await db.select().from(projects);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

    return months.map((month, idx) => {
      const monthProjects = allProjects.filter((p) => {
        if (!p.applyDate) return false;
        const d = new Date(p.applyDate);
        return d.getMonth() + 1 === month;
      });
      const successProjects = monthProjects.filter((p) => p.status === "ok");
      return {
        month: monthNames[idx],
        applyCount: monthProjects.length,
        successCount: successProjects.length,
      };
    });
  }),

  departmentDistribution: publicQuery.query(async () => {
    const db = getDb();
    const allProjects = await db.select().from(projects);
    const deptMap: Record<string, number> = {};
    allProjects.forEach((p) => {
      const dept = p.department || "未知";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    return Object.entries(deptMap).map(([name, value]) => ({ name, value }));
  }),

  statusAnalysis: publicQuery.query(async () => {
    const db = getDb();
    const allProjects = await db.select().from(projects);
    const statusMap: Record<string, number> = {};
    allProjects.forEach((p) => {
      const label = p.status === "ok" ? "已通过" : p.status === "failed" ? "未通过" : p.status === "in_progress" ? "进行中" : "待审核";
      statusMap[label] = (statusMap[label] || 0) + 1;
    });
    return Object.entries(statusMap).map(([name, value]) => ({ name, value }));
  }),

  applicantPerformance: publicQuery.query(async () => {
    const db = getDb();
    const allProjects = await db.select().from(projects);
    const appMap: Record<string, { count: number; success: number }> = {};
    allProjects.forEach((p) => {
      const app = p.applicant || "未知";
      if (!appMap[app]) appMap[app] = { count: 0, success: 0 };
      appMap[app].count++;
      if (p.status === "ok") appMap[app].success++;
    });
    return Object.entries(appMap).map(([name, data]) => ({
      name,
      count: data.count,
      success: data.success,
    }));
  }),

  monthlyAmount: publicQuery.query(async () => {
    const db = getDb();
    const allProjects = await db.select().from(projects);
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

    return Array.from({ length: 12 }, (_, i) => i + 1).map((month, idx) => {
      const monthProjects = allProjects.filter((p) => {
        if (!p.applyDate) return false;
        const d = new Date(p.applyDate);
        return d.getMonth() + 1 === month;
      });
      let amount = 0;
      monthProjects.forEach((p) => {
        if (p.applyAmount && !isNaN(parseFloat(p.applyAmount))) {
          amount += parseFloat(p.applyAmount);
        }
      });
      return { month: monthNames[idx], amount };
    });
  }),

  departmentSuccess: publicQuery.query(async () => {
    const db = getDb();
    const allProjects = await db.select().from(projects);
    const deptMap: Record<string, { total: number; success: number }> = {};
    allProjects.forEach((p) => {
      const dept = p.department || "未知";
      if (!deptMap[dept]) deptMap[dept] = { total: 0, success: 0 };
      deptMap[dept].total++;
      if (p.status === "ok") deptMap[dept].success++;
    });
    return Object.entries(deptMap).map(([name, data]) => ({
      name,
      rate: data.total > 0 ? Math.round((data.success / data.total) * 100) : 0,
    }));
  }),
});
