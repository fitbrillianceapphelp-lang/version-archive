import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import {
  TrendingUp,
  BarChart2,
  DollarSign,
  Activity,
  Users,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  analyticsMockService,
  MonthlyGrowthMetric,
  FunnelStageMetric,
  KanbanFunnelStage,
} from "../lib/analytics";

interface AnalyticsBoardProps {
  stageCounts?: Record<KanbanFunnelStage, number>;
  onRefresh?: () => void;
}

export const AnalyticsBoard: React.FC<AnalyticsBoardProps> = ({
  stageCounts,
  onRefresh,
}) => {
  const [metricKey, setMetricKey] = useState<"projects" | "revenue" | "userEngagement">("projects");

  const monthlyGrowth = useMemo(() => {
    return analyticsMockService.getMonthlyGrowth();
  }, []);

  const funnelData = useMemo(() => {
    return analyticsMockService.getFunnelMetrics(stageCounts);
  }, [stageCounts]);

  const engagement = useMemo(() => {
    return analyticsMockService.getUserEngagement();
  }, []);

  const totalDeals = funnelData.reduce((acc, curr) => acc + curr.count, 0);
  const totalValue = funnelData.reduce((acc, curr) => acc + curr.value, 0);

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1017]/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 text-right">
          <p className="font-bold text-white mb-1.5 border-b border-slate-700/60 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tip-${index}`} className="flex items-center justify-between gap-4 py-0.5">
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
    <div className="space-y-6 text-right animate-in fade-in duration-300">
      {/* Header and Filter Controls */}
      <div className="bg-[#0a0f18]/90 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#ef4444]" />
              <span>لوحة التحليلات المرئية ونمو المشاريع (Analytics Board)</span>
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sovereign Engine Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            رسم بياني خطي لمتابعة نمو المشاريع الشهرية ورسم بياني شريطي لحالة مراحل قمع الاستشارات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold ml-1">المؤشر النشط:</span>
          <div className="bg-[#05080c] p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setMetricKey("projects")}
              className={`px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                metricKey === "projects"
                  ? "bg-[#dc2626] text-white shadow-md shadow-red-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              المشاريع
            </button>
            <button
              onClick={() => setMetricKey("revenue")}
              className={`px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                metricKey === "revenue"
                  ? "bg-[#dc2626] text-white shadow-md shadow-red-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              الإيرادات ($)
            </button>
            <button
              onClick={() => setMetricKey("userEngagement")}
              className={`px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                metricKey === "userEngagement"
                  ? "bg-[#dc2626] text-white shadow-md shadow-red-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              التفاعل
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#0c131f] to-[#070b12] border border-slate-800/90 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#ef4444]" />
              <span>إجمالي قيمة القمع (Pipeline)</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">+38%</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ${totalValue.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
            إجمالي {totalDeals} صفقة واستشارة مسجلة
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0c131f] to-[#070b12] border border-slate-800/90 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>مشاريع التنفيذ الفعلي</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">In-Production</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stageCounts?.["In-Production"] ?? 9}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
            مشاريع تحت إشراف منظومة سراج
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0c131f] to-[#070b12] border border-slate-800/90 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>متوسط الـ ROAS الميداني</span>
            </span>
            <span className="text-amber-400 font-mono text-[11px]">4.8x</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            4.8x
          </div>
          <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
            مضاعف العائد بعد عزل الهدر الإعلاني
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0c131f] to-[#070b12] border border-slate-800/90 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>متوسط زمن الجلسة</span>
            </span>
            <span className="text-cyan-400 font-mono text-[11px]">{engagement.avgSessionDuration}</span>
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {engagement.diagnosticCompletionRate}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
            معدل إكمال التشخيص الاستراتيجي
          </p>
        </div>
      </div>

      {/* LINE CHART: MONTHLY GROWTH */}
      <div className="bg-[#090e17] border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ef4444]" />
              <span>الرسم البياني الخطي: مسار النمو الشهري (Monthly Growth LineChart)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تتبع تصاعد المشاريع الفعلية مقارنة بالمستهدف الاستراتيجي المخطط.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyGrowth}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) =>
                  metricKey === "revenue" ? `$${val / 1000}k` : `${val}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                formatter={(val) => <span className="text-slate-300 font-bold">{val}</span>}
              />

              {metricKey === "projects" && (
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

              {metricKey === "revenue" && (
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="الإيرادات الشهرية ($)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              )}

              {metricKey === "userEngagement" && (
                <Line
                  type="monotone"
                  dataKey="userEngagement"
                  name="مؤشر تفاعل العملاء (Score / 100)"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART: CONSULTATION PIPELINE STATUS */}
      <div className="bg-[#090e17] border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>الرسم البياني الشريطي: حالة مراحل قمع الاستشارات (Consultation Pipeline BarChart)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              توزيع الاستشارات عبر المراحل الخمس المعتمدة: Lead، Discovery، Proposal، In-Production، Completed.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
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
                        <p className="font-bold text-white mb-1 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
                          <span>{data.label}</span>
                        </p>
                        <div className="space-y-1 text-slate-300 font-mono">
                          <p>عدد الصفقات: <span className="font-bold text-white">{data.count}</span></p>
                          <p>القيمة التقديرية: <span className="font-bold text-emerald-400">${data.value.toLocaleString()}</span></p>
                          <p>معدل التحويل: <span className="font-bold text-cyan-400">{data.conversionRate}%</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" name="عدد الصفقات" radius={[6, 6, 0, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel Stage Summary Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4 pt-3 border-t border-slate-800">
          {funnelData.map((stage) => (
            <div
              key={stage.stage}
              className="bg-[#05080c] p-2.5 rounded-xl border border-slate-800 text-center"
            >
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.fill }} />
                <span>{stage.stage}</span>
              </div>
              <div className="text-base font-black font-mono text-white mt-1">
                {stage.count} <span className="text-[10px] text-slate-500 font-normal">صفقة</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                ${Math.round(stage.value / 1000)}k
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsBoard;
