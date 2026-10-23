import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  Clock,
  Sparkles,
  PieChart as PieIcon,
  BarChart2,
  RefreshCw,
  Zap,
  Target,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CrmLead, CRM_STAGES, CrmFunnelStage } from "../../lib/crmFirestore";
import {
  analyticsMockService,
  MonthlyGrowthMetric,
  FunnelStageMetric,
  KanbanFunnelStage,
} from "../../lib/analytics";

interface AdminAnalyticsBoardProps {
  leads: CrmLead[];
  isLiveFirestore: boolean;
  onRefresh?: () => void;
}

export const AdminAnalyticsBoard: React.FC<AdminAnalyticsBoardProps> = ({
  leads,
  isLiveFirestore,
  onRefresh,
}) => {
  const [activeMetricView, setActiveMetricView] = useState<"projects" | "revenue" | "engagement">("projects");

  // Fetch data from mock analytics service in src/lib/analytics.ts
  const monthlyGrowthData = useMemo(() => {
    return analyticsMockService.getMonthlyGrowth();
  }, []);

  const engagementSummary = useMemo(() => {
    return analyticsMockService.getUserEngagement();
  }, []);

  // Compute live stage counts from leads prop, with fallback to mock service
  const funnelStageData: FunnelStageMetric[] = useMemo(() => {
    const liveCounts: Record<KanbanFunnelStage, number> = {
      Lead: 0,
      Discovery: 0,
      Proposal: 0,
      "In-Production": 0,
      Completed: 0,
    };

    leads.forEach((l) => {
      if (liveCounts[l.stage] !== undefined) {
        liveCounts[l.stage]++;
      } else {
        liveCounts.Lead++;
      }
    });

    // If leads are present, use live counts, otherwise fall back to mock service defaults
    if (leads.length > 0) {
      return analyticsMockService.getFunnelMetrics(liveCounts);
    }
    return analyticsMockService.getFunnelMetrics();
  }, [leads]);

  // Aggregate KPIs
  const kpis = useMemo(() => {
    const totalPipeline = leads.reduce((acc, curr) => acc + (curr.budgetValue || 25000), 0);
    const activeProjects = leads.filter((l) => l.stage === "In-Production" || l.stage === "Completed").length;
    const totalLeads = leads.length || 34;
    const conversion = Math.round(((activeProjects || 6) / totalLeads) * 100);

    return {
      totalPipeline: totalPipeline || 580000,
      activeProjects: activeProjects || 9,
      avgRoas: 4.8,
      conversionRate: conversion || 26,
    };
  }, [leads]);

  // Custom Dark Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1017]/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 text-right">
          <p className="font-bold text-white mb-2 border-b border-slate-700/50 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono font-bold text-white">
                {typeof entry.value === "number" && entry.value > 1000
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-right">
      {/* Top Header & Live Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0a0f18]/90 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#ef4444]" />
              <span>لوحة التحليلات المرئية ونمو المشاريع (Recharts Analytics)</span>
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                isLiveFirestore
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLiveFirestore ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              {isLiveFirestore ? "Firestore Live Data" : "Mock Analytics Service"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            رسم بياني خطي لتصاعد المشاريع الشهرية وتفاعل المستخدمين، مع رسم بياني شريطي لمراحل قمع الاستشارات.
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            title="تحديث مؤشرات التحليلات"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-gradient-to-br from-[#0c131f] to-[#070b12] border border-slate-800/90 rounded-2xl p-4 sm:p-5 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#ef4444]" />
              <span>إجمالي قيمة قمع الصفقات</span>
            </span>
            <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +32.5%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ${kpis.totalPipeline.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800 pt-1.5">
            مجموع الصفقات والاستشارات تحت التدقيق
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-gradient-to-br from-[#0c131f] to-[#070b12] border border-slate-800/90 rounded-2xl p-4 sm:p-5 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>المشاريع قيد التنفيذ (In-Production)</span>
            </span>
            <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              نشط
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono flex items-baseline gap-2">
            <span>{kpis.activeProjects}</span>
            <span className="text-xs text-slate-400 font-normal">مشروع نشط ومكتمل</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800 pt-1.5">
            تخضع لإشراف كوتش سراج الميداني
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-gradient-to-br from-[#0c131f] to-[#070b12] border border-slate-800/90 rounded-2xl p-4 sm:p-5 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>متوسط الـ ROAS الميداني</span>
            </span>
            <span className="text-amber-400 text-[11px] font-mono flex items-center gap-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              +3.5x
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {kpis.avgRoas}x
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800 pt-1.5">
            عائد الحملات بعد عزل الهدر التشغيلي
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-gradient-to-br from-[#0c131f] to-[#070b12] border border-slate-800/90 rounded-2xl p-4 sm:p-5 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>معدل التحويل النهائي</span>
            </span>
            <span className="text-cyan-400 text-[11px] font-mono">Lead to Client</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
            {kpis.conversionRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800 pt-1.5">
            نسبة إغلاق العقود من إجمالي الاستشارات
          </p>
        </div>
      </div>

      {/* CHART 1: RESPONSIVE LINE CHART FOR MONTHLY PROJECT GROWTH & USER ENGAGEMENT */}
      <div className="bg-[#090e17] border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ef4444]" />
              <span>الرسم البياني الخطي: نمو المشاريع الشهرية ومؤشر تفاعل المستخدمين</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تتبع مسار تصاعد المشاريع المنفذة شهرياً مع مؤشر تفاعل العملاء وزيارات المنصة عبر الزمن.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold ml-1">عرض المحور:</span>
            <div className="bg-[#05080c] p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveMetricView("projects")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  activeMetricView === "projects"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                المشاريع
              </button>
              <button
                onClick={() => setActiveMetricView("revenue")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  activeMetricView === "revenue"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                الإيرادات ($)
              </button>
              <button
                onClick={() => setActiveMetricView("engagement")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  activeMetricView === "engagement"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                تفاعل المستخدمين
              </button>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyGrowthData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) =>
                  activeMetricView === "revenue" ? `$${val / 1000}k` : `${val}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                formatter={(val) => <span className="text-slate-300 font-bold">{val}</span>}
              />

              {activeMetricView === "projects" && (
                <>
                  <Line
                    type="monotone"
                    dataKey="projects"
                    name="المشاريع المنفذة"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", r: 4 }}
                    activeDot={{ r: 6, fill: "#dc2626" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="targetProjects"
                    name="المستهدف المخطط"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: "#10b981", r: 3 }}
                  />
                </>
              )}

              {activeMetricView === "revenue" && (
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="الإيرادات الشهرية ($)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6, fill: "#059669" }}
                />
              )}

              {activeMetricView === "engagement" && (
                <>
                  <Line
                    type="monotone"
                    dataKey="userEngagement"
                    name="مؤشر تفاعل المستخدمين (Score / 100)"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="activeVisitors"
                    name="إجمالي الزوار النشطين"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ fill: "#f59e0b", r: 3 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: RESPONSIVE BAR CHART FOR CONSULTATION FUNNEL STAGES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Funnel Bar Chart */}
        <div className="lg:col-span-2 bg-[#090e17] border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>الرسم البياني الشريطي: قمع مراحل الاستشارات (Consultation Funnel)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                توزيع الصفقات عبر المراحل الخمس المعتمدة: Lead، Discovery، Proposal، In-Production، Completed.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              5 مراحل استراتيجية
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelStageData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="stage" stroke="#64748b" tick={{ fontSize: 11, fontWeight: "bold" }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data: FunnelStageMetric = payload[0].payload;
                      return (
                        <div className="bg-[#0b1017] border border-slate-700 p-3 rounded-xl text-xs shadow-xl text-right">
                          <p className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
                            <span>{data.label}</span>
                          </p>
                          <div className="space-y-1 text-slate-300 font-mono">
                            <p>عدد الصفقات: <span className="font-bold text-white">{data.count}</span></p>
                            <p>قيمة المرحلة: <span className="font-bold text-emerald-400">${data.value.toLocaleString()}</span></p>
                            <p>معدل التحويل: <span className="font-bold text-cyan-400">{data.conversionRate}%</span></p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" name="عدد الصفقات" radius={[6, 6, 0, 0]}>
                  {funnelStageData.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stage Badges Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-800">
            {funnelStageData.map((stage) => (
              <div
                key={stage.stage}
                className="bg-[#05080c] p-2 rounded-xl border border-slate-800 text-center"
              >
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.fill }} />
                  <span>{stage.stage}</span>
                </div>
                <div className="text-sm font-black font-mono text-white mt-1">
                  {stage.count} <span className="text-[10px] text-slate-500 font-normal">صفقة</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 col): User Engagement Summary */}
        <div className="bg-[#090e17] border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>مؤشرات تفاعل الزوار والمنصة</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              مقاييس التفاعل الحي مع أدوات التشخيص وحاسبة العائد.
            </p>

            <div className="space-y-3">
              <div className="bg-[#05080c] p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">متوسط مدة الجلسة (Session Duration):</span>
                <div className="text-base font-black text-white font-mono flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{engagementSummary.avgSessionDuration}</span>
                </div>
              </div>

              <div className="bg-[#05080c] p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">نسبة إكمال التشخيص الاستراتيجي:</span>
                <div className="text-base font-black text-emerald-400 font-mono flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>{engagementSummary.diagnosticCompletionRate}%</span>
                </div>
              </div>

              <div className="bg-[#05080c] p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">تفاعلات حاسبة عزل الهدر (ROI):</span>
                <div className="text-base font-black text-amber-400 font-mono">
                  {engagementSummary.roiCalculatorInteractions.toLocaleString()} عملية
                </div>
              </div>

              <div className="bg-[#05080c] p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">فترة ذروة التفاعل اليومي:</span>
                <div className="text-xs font-bold text-slate-200 font-mono">
                  {engagementSummary.peakEngagementHour}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
            تحديث لحظي عبر منظومة التحليلات السيادية © 2026
          </div>
        </div>
      </div>
    </div>
  );
};
