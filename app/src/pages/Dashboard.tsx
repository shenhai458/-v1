import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FolderOpen, Clock, CheckCircle2, CircleDollarSign, Plus, RefreshCw, Download, AlertTriangle,
} from "lucide-react";
const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#6b7280"];
const STATUS_LABELS: Record<string, string> = { ok: "已通过", failed: "未通过", in_progress: "进行中", pending: "待审核" };

export default function Dashboard() {
  const utils = trpc.useUtils();

  const { data: stats } = trpc.project.stats.useQuery();
  const { data: projectsData } = trpc.project.list.useQuery({ page: 1, pageSize: 5 });
  const { data: analytics } = trpc.analytics.overview.useQuery();
  const { data: monthlyTrend } = trpc.analytics.monthlyTrend.useQuery();
  const { data: statusData } = trpc.analytics.statusAnalysis.useQuery();

  const projects = projectsData?.list || [];

  const formatAmount = (val: string | null) => {
    if (!val) return "-";
    if (val === "荣誉") return "荣誉";
    const num = parseFloat(val);
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    return `${num}`;
  };

  const statusPieData = statusData || [];

  const trendData = (monthlyTrend || []).map((m) => ({
    name: m.month,
    申报项目: m.applyCount,
    完成项目: m.successCount,
  }));

  const totalAmount = stats?.totalAmount || 0;
  const totalAmountWan = totalAmount >= 10000 ? `${(totalAmount / 10000).toFixed(1)}万` : `${totalAmount}`;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">项目申报管理仪表板</h2>
          <p className="text-sm text-gray-500 mt-1">实时监控项目进度与状态</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/projects"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建项目
          </Link>
          <button
            onClick={() => {
              utils.project.stats.invalidate();
              utils.project.list.invalidate();
              utils.analytics.overview.invalidate();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            同步数据
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm">总项目数</p>
            <FolderOpen className="w-5 h-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold">{stats?.total || 0}</p>
          <p className="text-white/60 text-xs mt-1">实时更新</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm">进行中项目</p>
            <Clock className="w-5 h-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold">{stats?.inProgress || 0}</p>
          <p className="text-white/60 text-xs mt-1">实时更新</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm">已完成项目</p>
            <CheckCircle2 className="w-5 h-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold">{stats?.completed || 0}</p>
          <p className="text-white/60 text-xs mt-1">实时更新</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm">总金额</p>
            <CircleDollarSign className="w-5 h-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold">{totalAmountWan}</p>
          <p className="text-white/60 text-xs mt-1">实时更新</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">项目状态分布</h3>
            <button className="text-blue-600 text-xs hover:underline">刷新</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
              >
                {statusPieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {statusPieData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">月度申报趋势</h3>
            <button className="text-blue-600 text-xs hover:underline">刷新</button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorApply" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="申报项目" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApply)" />
              <Area type="monotone" dataKey="完成项目" stroke="#10b981" fillOpacity={1} fill="url(#colorDone)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">最近添加</h3>
            <RefreshCw className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
          </div>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{project.name}</p>
                  <p className="text-xs text-gray-500">{project.department}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    project.status === "ok"
                      ? "bg-emerald-100 text-emerald-700"
                      : project.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {STATUS_LABELS[project.status] || project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">即将到期</h3>
            <RefreshCw className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
          </div>
          {projects.filter((p) => p.deadline && new Date(p.deadline) > new Date()).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <p className="text-sm">暂无即将到期的项目</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects
                .filter((p) => p.deadline && new Date(p.deadline) > new Date())
                .slice(0, 5)
                .map((project) => (
                  <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{project.name}</p>
                      <p className="text-xs text-gray-500">
                        截止: {project.deadline ? new Date(project.deadline).toLocaleDateString("zh-CN") : "-"}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">
                      {Math.ceil((new Date(project.deadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}天
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">快速统计</h3>
            <RefreshCw className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">本月新增</span>
              <span className="text-sm font-semibold text-blue-600">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">本月完成</span>
              <span className="text-sm font-semibold text-emerald-600">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">成功率</span>
              <span className="text-sm font-semibold text-purple-600">
                {analytics?.successRate || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">平均处理时间</span>
              <span className="text-sm font-semibold text-amber-600">134天</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project List Table */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">项目列表</h3>
          <Link to="/projects" className="text-blue-600 text-xs hover:underline">
            查看全部
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-gray-600 font-medium">项目名称</th>
                <th className="text-left py-3 px-2 text-gray-600 font-medium">对接部门</th>
                <th className="text-left py-3 px-2 text-gray-600 font-medium">申报金额</th>
                <th className="text-left py-3 px-2 text-gray-600 font-medium">截止时间</th>
                <th className="text-left py-3 px-2 text-gray-600 font-medium">状态</th>
                <th className="text-left py-3 px-2 text-gray-600 font-medium">申报人</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-800">{project.name}</td>
                  <td className="py-3 px-2 text-gray-600">{project.department || "-"}</td>
                  <td className="py-3 px-2 text-gray-600">{formatAmount(project.applyAmount)}</td>
                  <td className="py-3 px-2 text-gray-600">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString("zh-CN") : "-"}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        project.status === "ok"
                          ? "bg-emerald-100 text-emerald-700"
                          : project.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : project.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {STATUS_LABELS[project.status] || project.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{project.applicant || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
