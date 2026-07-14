import { trpc } from "@/providers/trpc";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from "recharts";
import { TrendingUp, Trophy, Clock, Zap, RefreshCw, Download } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Analytics() {
  const { data: overview } = trpc.analytics.overview.useQuery();
  const { data: monthlyTrend } = trpc.analytics.monthlyTrend.useQuery();
  const { data: deptDist } = trpc.analytics.departmentDistribution.useQuery();
  const { data: statusAnalysis } = trpc.analytics.statusAnalysis.useQuery();
  const { data: applicantPerf } = trpc.analytics.applicantPerformance.useQuery();
  const { data: monthlyAmount } = trpc.analytics.monthlyAmount.useQuery();
  const { data: deptSuccess } = trpc.analytics.departmentSuccess.useQuery();

  const trendData = (monthlyTrend || []).map((m) => ({
    month: m.month,
    申报数量: m.applyCount,
    成功数量: m.successCount,
  }));

  const totalApplyWan = overview?.totalApplyAmount
    ? overview.totalApplyAmount >= 10000
      ? `${(overview.totalApplyAmount / 10000).toFixed(1)}万`
      : `${overview.totalApplyAmount}`
    : "0";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">数据分析</h2>
          <p className="text-sm text-gray-500 mt-1">深度分析项目申报数据与趋势</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
            <RefreshCw className="w-4 h-4" />
            刷新数据
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm">总申报金额</p>
            <TrendingUp className="w-5 h-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold">{totalApplyWan}</p>
          <p className="text-white/60 text-xs mt-1">所有项目合计</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm">成功率</p>
            <Trophy className="w-5 h-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold">{overview?.successRate || 0}%</p>
          <p className="text-white/60 text-xs mt-1">已通过项目占比</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm">平均处理时间</p>
            <Clock className="w-5 h-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold">134天</p>
          <p className="text-white/60 text-xs mt-1">从申报到结果</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm">活跃项目</p>
            <Zap className="w-5 h-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold">{overview?.activeProjects || 0}</p>
          <p className="text-white/60 text-xs mt-1">未截止项目数</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Monthly Trend */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">申报趋势分析</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="申报数量" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="成功数量" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">部门项目分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={deptDist || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {(deptDist || []).map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Analysis */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">项目状态分析</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusAnalysis || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Applicant Performance */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">申报人绩效分析</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={applicantPerf || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="项目数量" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="成功数量" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Amount */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">月度金额趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyAmount || []}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => v >= 10000 ? `${(v / 10000).toFixed(1)}万` : `${v}`} />
              <Area type="monotone" dataKey="amount" name="申报金额" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorAmt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Success Rate */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">部门成功率对比</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptSuccess || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="rate" name="成功率" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
