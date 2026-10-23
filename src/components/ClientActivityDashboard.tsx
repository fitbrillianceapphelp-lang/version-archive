import React, { useState } from "react";
import {
  Activity,
  TrendingUp,
  ShieldCheck,
  Download,
  PhoneCall,
  Calendar,
  DollarSign,
  Layers,
  FileText,
  Video,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
  Lock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { downloadSecureReportPdf } from "../lib/secureReportGenerator";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";

export interface ProjectActivityData {
  projectCode: string;
  clientName: string;
  businessName: string;
  businessType: string;
  currentWeek: number; // 1 to 12
  overallProgress: number; // 0 to 100%
  totalAdSpendEGP: number;
  grossRevenueEGP: number;
  currentRoas: number;
  wasteStoppedEGP: number;
  inboundLeads: number;
  costPerLeadEGP: number;
  activeCampaigns: {
    id: string;
    name: string;
    platform: string;
    status: "active" | "optimizing" | "completed";
    roas: number;
    leads: number;
  }[];
  weeklyMilestones: {
    week: string;
    title: string;
    status: "completed" | "in_progress" | "upcoming";
    kpi: string;
  }[];
  dailyPerformance: {
    day: string;
    spend: number;
    revenue: number;
    roas: number;
  }[];
  deliverables: {
    id: string;
    title: string;
    type: "video_4k" | "sop_book" | "ad_creative" | "diagnostic_report";
    status: "ready" | "in_review";
    sizeOrDuration: string;
  }[];
}

// Built-in verified seed projects for instant demo or lookup
const SAMPLE_PROJECTS: Record<string, ProjectActivityData> = {
  "FB-90D-1040": {
    projectCode: "FB-90D-1040",
    clientName: "محمد أحمد",
    businessName: "مطعم XYZ المأكولات الشرقية",
    businessType: "مطاعم وأغذية وضيافة",
    currentWeek: 4,
    overallProgress: 35,
    totalAdSpendEGP: 9200,
    grossRevenueEGP: 33120,
    currentRoas: 3.6,
    wasteStoppedEGP: 16400,
    inboundLeads: 58,
    costPerLeadEGP: 158,
    activeCampaigns: [
      { id: "c1", name: "حملة الاستحواذ الجغرافي (قطر 5 كم)", platform: "ميتا (إنستجرام/فيسبوك)", status: "active", roas: 3.8, leads: 34 },
      { id: "c2", name: "عرض باقات العائلات VIP ومجموعات العمل", platform: "تيك توك وميتا", status: "active", roas: 3.4, leads: 24 },
    ],
    weeklyMilestones: [
      { week: "أسبوع 1", title: "التدقيق الميداني ووقف النزيف الإعلاني", status: "completed", kpi: "عزل الإعلانات غير المجدية وتوفير 5,000 ج" },
      { week: "أسبوع 2", title: "إعادة بناء العرض وتصوير الأصول 4K", status: "completed", kpi: "إنتاج 3 ريلز بجودة سينمائية للأطباق الرئيسية" },
      { week: "أسبوع 3", title: "إطلاق حملة الاستحواذ الجغرافي", status: "completed", kpi: "تحقيق أول 30 حجز مباشر دون وسطاء" },
      { week: "أسبوع 4", title: "تدريب مسؤولي المبيعات على سرعة الإغلاق", status: "in_progress", kpi: "رفع نسبة التحويل من 14% إلى 28%" },
      { week: "أسبوع 5", title: "توسيع الحملات الناجحة ورفع الميزانية", status: "upcoming", kpi: "مضاعفة الحجوزات اليومية" },
      { week: "أسبوع 6", title: "تفعيل برنامج إحالة العملاء الدائمين", status: "upcoming", kpi: "تحقيق عائد ROAS يتجاوز 4.0x" },
    ],
    dailyPerformance: [
      { day: "السبت", spend: 1100, revenue: 3850, roas: 3.5 },
      { day: "الأحد", spend: 1250, revenue: 4750, roas: 3.8 },
      { day: "الاثنين", spend: 1300, revenue: 4550, roas: 3.5 },
      { day: "الثلاثاء", spend: 1400, revenue: 5320, roas: 3.8 },
      { day: "الأربعاء", spend: 1350, revenue: 4995, roas: 3.7 },
      { day: "الخميس", spend: 1500, revenue: 5850, roas: 3.9 },
      { day: "الجمعة", spend: 1300, revenue: 3805, roas: 2.9 },
    ],
    deliverables: [
      { id: "d1", title: "فيديو التغطية السينمائية 4K للأطباق الرئيسية", type: "video_4k", status: "ready", sizeOrDuration: "01:24 دقيقة (4K UHD)" },
      { id: "d2", title: "دليل إجراءات التشغيل القياسية (SOPs) لفريق الردود", type: "sop_book", status: "ready", sizeOrDuration: "ملف تنفيذي من 8 صفحات" },
      { id: "d3", title: "مخطط الحملات الإعلانية لشهر التحول الثاني", type: "ad_creative", status: "ready", sizeOrDuration: "6 تصاميم بدقة عالية" },
    ],
  },
  "FB-PRJ-2026-ALEX": {
    projectCode: "FB-PRJ-2026-ALEX",
    clientName: "د. طارق المنشاوي",
    businessName: "مجمع النخبة الطبي المتخصص",
    businessType: "خدمات طبية ورعاية صحية",
    currentWeek: 6,
    overallProgress: 50,
    totalAdSpendEGP: 18400,
    grossRevenueEGP: 77280,
    currentRoas: 4.2,
    wasteStoppedEGP: 31000,
    inboundLeads: 114,
    costPerLeadEGP: 161,
    activeCampaigns: [
      { id: "c1", name: "حملة استشارات الأسنان والجراحة المباشرة", platform: "جوجل بحث + ميتا", status: "active", roas: 4.4, leads: 72 },
      { id: "c2", name: "إعلانات التعريف بالفريق الطبي والتقنيات", platform: "تيك توك وإنستجرام", status: "active", roas: 3.9, leads: 42 },
    ],
    weeklyMilestones: [
      { week: "أسبوع 1-2", title: "إعادة هيكلة مسار المريض وحجز المواعيد", status: "completed", kpi: "تقليل وقت الانتظار وتثبيت كفاءة الاستقبال" },
      { week: "أسبوع 3-4", title: "إنتاج محتوى وثائقي 4K للأطباء والمعدات", status: "completed", kpi: "بث الثقة لدى الجمهور المستهدف" },
      { week: "أسبوع 5-6", title: "إطلاق حملات الكلمات المفتاحية عالية القيمة", status: "in_progress", kpi: "تحقيق ROAS يتجاوز 4x" },
    ],
    dailyPerformance: [
      { day: "السبت", spend: 2200, revenue: 9460, roas: 4.3 },
      { day: "الأحد", spend: 2400, revenue: 10560, roas: 4.4 },
      { day: "الاثنين", spend: 2500, revenue: 10250, roas: 4.1 },
      { day: "الثلاثاء", spend: 2600, revenue: 11440, roas: 4.4 },
      { day: "الأربعاء", spend: 2800, revenue: 11760, roas: 4.2 },
      { day: "الخميس", spend: 3100, revenue: 13330, roas: 4.3 },
      { day: "الجمعة", spend: 2800, revenue: 10480, roas: 3.7 },
    ],
    deliverables: [
      { id: "d1", title: "جلسة التوثيق السينمائي لغرف العمليات والعيادات 4K", type: "video_4k", status: "ready", sizeOrDuration: "3 مقاطع سينمائية 4K" },
      { id: "d2", title: "بروتوكول حجز المواعيد والمتابعة الطبية", type: "sop_book", status: "ready", sizeOrDuration: "SOP Book معتمد" },
    ],
  },
};

interface ClientActivityDashboardProps {
  initialCode?: string;
  lang?: Language;
}

export const ClientActivityDashboard: React.FC<ClientActivityDashboardProps> = ({
  initialCode = "FB-90D-1040",
  lang = "ar",
}) => {
  const t = getTranslation(lang);
  const [projectCodeInput, setProjectCodeInput] = useState(initialCode);
  const [activeCode, setActiveCode] = useState(initialCode);
  const [activeTab, setActiveTab] = useState<"overview" | "ads" | "milestones" | "vault">("overview");
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Resolve project from sample database or dynamic synthetic code
  const project: ProjectActivityData =
    SAMPLE_PROJECTS[activeCode.toUpperCase()] || {
      projectCode: activeCode.toUpperCase(),
      clientName: "شريك أعمال معتمد",
      businessName: `مشروع كود (${activeCode.toUpperCase()})`,
      businessType: "نشاط تجاري قيد التحول",
      currentWeek: 3,
      overallProgress: 25,
      totalAdSpendEGP: 6500,
      grossRevenueEGP: 21450,
      currentRoas: 3.3,
      wasteStoppedEGP: 11200,
      inboundLeads: 36,
      costPerLeadEGP: 180,
      activeCampaigns: [
        { id: "gen1", name: "حملة إعادة التموضع المباشر", platform: "ميتا وتيك توك", status: "active", roas: 3.3, leads: 36 },
      ],
      weeklyMilestones: [
        { week: "أسبوع 1", title: "التدقيق الميداني ووقف الهدر", status: "completed", kpi: "عزل قنوات النزيف المالي" },
        { week: "أسبوع 2", title: "إعادة بناء رسائل العرض والإنتاج البصري", status: "completed", kpi: "اعتماد أصول المحتوى" },
        { week: "أسبوع 3", title: "تفعيل الحملات الموجهة ومتابعة الإغلاق", status: "in_progress", kpi: "الوصول لـ ROAS 3.0x فما فوق" },
      ],
      dailyPerformance: [
        { day: "السبت", spend: 900, revenue: 2970, roas: 3.3 },
        { day: "الأحد", spend: 950, revenue: 3230, roas: 3.4 },
        { day: "الاثنين", spend: 1000, revenue: 3200, roas: 3.2 },
        { day: "الثلاثاء", spend: 1100, revenue: 3740, roas: 3.4 },
        { day: "الأربعاء", spend: 1050, revenue: 3360, roas: 3.2 },
        { day: "الخميس", spend: 1200, revenue: 4200, roas: 3.5 },
        { day: "الجمعة", spend: 1100, revenue: 3300, roas: 3.0 },
      ],
      deliverables: [
        { id: "gen_d1", title: "أصول المحتوى المرئي وتصاميم الهوية", type: "ad_creative", status: "ready", sizeOrDuration: "حزمة أصول معتمدة" },
        { id: "gen_d2", title: "خريطة طريق الـ 90 يوماً والـ SOPs", type: "sop_book", status: "ready", sizeOrDuration: "تقرير تشغيلي" },
      ],
    };

  const handleSearchCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const code = projectCodeInput.trim().toUpperCase();
    if (!code) {
      setErrorMessage("يرجى كتابة كود المشروع للمتابعة.");
      return;
    }
    setActiveCode(code);
  };

  const handleExportSecurePdf = async () => {
    try {
      setIsExportingPdf(true);
      await downloadSecureReportPdf({
        clientName: project.clientName,
        businessName: project.businessName,
        phone: "+201274879442",
        projectCode: project.projectCode,
        financialWastePercent: 32,
        monthlyWasteEstimateEGP: project.wasteStoppedEGP,
        projectedRoasMultiplier: project.currentRoas,
        criticalLeaks: [
          "خلل في تتبع العائد المالي المباشر لكل حملة تم تداركه بنجاح.",
          "تسريب سابق في سرعة استجابة فريق الردود تم ضبطه وفق بروتوكول الـ SOPs.",
          "إعادة توجيه الميزانية من الإعلانات العامة نحو الجمهور الجغرافي المستهدف.",
        ],
        operationalChokepoints: [
          "تحديث رحلة العميل المباشرة وإزالة الوسطاء لزيادة صافي الربح.",
          "حماية الأصول الرقمية والتصوير بجودة 4K لبناء أصل تجاري غير قابل للتقليد.",
        ],
        ninetyDayPhases: [
          { phase: "المرحلة الأولى (الشهر 1)", focus: "وقف النزيف المالي وتصحيح العرض", targetKPI: "خفض تكلفة العميل الجديد بـ 30%" },
          { phase: "المرحلة الثانية (الشهر 2)", focus: "التكثيف الميداني ومضاعفة الحجوزات", targetKPI: "تثبيت معدل الـ ROAS عند 3.5x فما فوق" },
          { phase: "المرحلة الثالثة (الشهر 3)", focus: "الهيمنة وتأصيل أنظمة الولاء واسترداد التكاليف", targetKPI: "استدامة الأرباح الصافية بنمو +60%" },
        ],
      });
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="w-full bg-[#0a0f16]/95 border border-[#dc2626]/30 rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden text-right">
      {/* Background Neon Glow Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#dc2626]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dc2626]/15 border border-[#dc2626]/40 text-[#ef4444] text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
            <span>رادار متابعة المشروعات والنشاط الإعلاني الحي (Live Project Cockpit)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <span>لوحة التحكم الإعلاني والتنفيذي:</span>
            <span className="text-[#ef4444] font-mono">{project.projectCode}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مشروع: <strong className="text-slate-200">{project.businessName}</strong> — رائد الأعمال:{" "}
            <span className="text-slate-300">{project.clientName}</span>
          </p>
        </div>

        {/* Search by Project Code input */}
        <form onSubmit={handleSearchCode} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={projectCodeInput}
            onChange={(e) => setProjectCodeInput(e.target.value)}
            placeholder="أدخل كود مشروعك (مثال: FB-90D-1040)"
            className="bg-[#05080c] border border-slate-700 focus:border-[#ef4444] text-white px-3.5 py-2 rounded-xl text-xs font-mono outline-none w-full md:w-64 text-center tracking-wider transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white text-xs font-bold rounded-xl hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer whitespace-nowrap"
          >
            عرض الرادار
          </button>
        </form>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-800/80 text-xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "overview"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              : "bg-slate-900/60 text-slate-400 hover:text-white"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>نظرة عامة والـ ROAS</span>
        </button>

        <button
          onClick={() => setActiveTab("ads")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "ads"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              : "bg-slate-900/60 text-slate-400 hover:text-white"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>الحملات الإعلانية الحية ({project.activeCampaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("milestones")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "milestones"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              : "bg-slate-900/60 text-slate-400 hover:text-white"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>مسار الـ 90 يوماً (أسبوع {project.currentWeek} من 12)</span>
        </button>

        <button
          onClick={() => setActiveTab("vault")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "vault"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              : "bg-slate-900/60 text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>خزانة المخرجات وميديا 4K ({project.deliverables.length})</span>
        </button>
      </div>

      {/* 4 Top KPI Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {/* Metric 1: ROAS */}
        <div className="bg-[#0e1622] border border-slate-800 hover:border-[#ef4444]/40 p-4 rounded-2xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>العائد على الإنفاق (ROAS)</span>
            <span className="text-emerald-400 flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> 3.6x
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {project.currentRoas}x
          </div>
          <div className="text-[10px] text-emerald-400/90 mt-1">
            كل جنيه إعلانات يحقق {project.currentRoas} ج مبيعات
          </div>
        </div>

        {/* Metric 2: Waste Stopped */}
        <div className="bg-[#0e1622] border border-slate-800 hover:border-[#ef4444]/40 p-4 rounded-2xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>هدر مالي تم إيقافه</span>
            <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#ef4444] font-mono">
            {project.wasteStoppedEGP.toLocaleString()} ج
          </div>
          <div className="text-[10px] text-slate-400 mt-1">أموال وُفرت من الضياع العشوائي</div>
        </div>

        {/* Metric 3: Total Spend vs Revenue */}
        <div className="bg-[#0e1622] border border-slate-800 hover:border-[#ef4444]/40 p-4 rounded-2xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>صافي المبيعات المباشرة</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {project.grossRevenueEGP.toLocaleString()} ج
          </div>
          <div className="text-[10px] text-slate-400 mt-1">مقابل صرف {project.totalAdSpendEGP.toLocaleString()} ج</div>
        </div>

        {/* Metric 4: Inbound Leads */}
        <div className="bg-[#0e1622] border border-slate-800 hover:border-[#ef4444]/40 p-4 rounded-2xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>استفسارات الشراء المؤكدة</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
            {project.inboundLeads} عميل
          </div>
          <div className="text-[10px] text-slate-400 mt-1">متوسط تكلفة العميل: {project.costPerLeadEGP} ج</div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Interactive Recharts Graph: Daily Performance */}
          <div className="bg-[#070b10] border border-slate-800 p-4 sm:p-5 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#ef4444]" />
                  <span>منحنى التفاعل الإعلاني والعائد اليومي (Ad Spend vs Revenue)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  تتبع يومي لميزانية الإعلانات المصروفة مقارنة بالإيرادات المباشرة المحققة.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" /> الصرف (جنيه)
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> العائد (جنيه)
                </span>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={project.dailyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0b121d",
                      borderColor: "#dc2626",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                      textAlign: "right",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    name="الإنفاق اليومي (ج)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#spendColor)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="العائد اليومي (ج)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 90-Day Milestone Progress Stepper Bar */}
          <div className="bg-[#070b10] border border-slate-800 p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#ef4444]" />
                <span>مستوى الإنجاز في خطة الـ 90 يوماً</span>
              </span>
              <span className="text-[#ef4444] font-mono font-bold">{project.overallProgress}% مكتمل</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-emerald-500 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                style={{ width: `${project.overallProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>الأسبوع 1: التأسيس والتصحيح</span>
              <span className="text-white font-bold">أنت الآن في: الأسبوع {project.currentWeek}</span>
              <span>الأسبوع 12: الاستدامة ومضاعفة الأرباح</span>
            </div>
          </div>
        </div>
      )}

      {/* Ads Tab */}
      {activeTab === "ads" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>الحملات الإعلانية النشطة والموجهة بالذكاء الاصطناعي</span>
            <span className="text-emerald-400 font-bold">المتابعة الميدانية مستمرة 24/7</span>
          </div>

          {project.activeCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-[#0e1622] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="text-sm font-bold text-white">{camp.name}</h4>
                </div>
                <p className="text-xs text-slate-400">
                  المنصة: <span className="text-slate-200">{camp.platform}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">العائد (ROAS)</span>
                  <span className="text-emerald-400 font-bold text-sm">{camp.roas}x</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">الاستفسارات المحققة</span>
                  <span className="text-cyan-400 font-bold text-sm">{camp.leads} طلب</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === "milestones" && (
        <div className="space-y-3">
          {project.weeklyMilestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                m.status === "completed"
                  ? "bg-slate-900/60 border-emerald-500/30 text-slate-300"
                  : m.status === "in_progress"
                  ? "bg-[#dc2626]/10 border-[#dc2626]/50 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                  : "bg-slate-950/40 border-slate-800/60 text-slate-500"
              }`}
            >
              <div className="pt-0.5">
                {m.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : m.status === "in_progress" ? (
                  <Activity className="w-4 h-4 text-[#ef4444] animate-pulse" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-white font-bold">{m.week}: {m.title}</strong>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : m.status === "in_progress"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {m.status === "completed" ? "منجز" : m.status === "in_progress" ? "جارٍ التنفيذ" : "مجدول"}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{m.kpi}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vault Tab (Deliverables & 4K Media) */}
      {activeTab === "vault" && (
        <div className="space-y-3">
          {project.deliverables.map((item) => (
            <div
              key={item.id}
              className="bg-[#0e1622] border border-slate-800 hover:border-[#dc2626]/40 p-4 rounded-2xl flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#ef4444] shrink-0">
                  {item.type === "video_4k" ? (
                    <Video className="w-5 h-5" />
                  ) : item.type === "sop_book" ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.sizeOrDuration}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>معتمد للعميل</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Footer: PDF Download & Direct VIP Link */}
      <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Export Secure PDF Locally */}
        <button
          onClick={handleExportSecurePdf}
          disabled={isExportingPdf}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 transition-all cursor-pointer shadow-lg"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>
            {isExportingPdf
              ? "جاري إنشاء التقرير المشفر محلياً..."
              : "تحميل التقرير المشفر محلياً (PDF)"}
          </span>
        </button>

        {/* Direct WhatsApp Hotline to Coach Serag */}
        <a
          href={`https://wa.me/201274879442?text=${encodeURIComponent(
            `السلام عليكم كوتش سراج، أتابع مشروعي على المنظومة بكود: ${project.projectCode} وأرغب في مراجعة الخطة والنشاط الإعلاني.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#991b1b] hover:from-[#ef4444] hover:to-[#b91c1c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all cursor-pointer"
        >
          <PhoneCall className="w-4 h-4" />
          <span>تواصل مباشر مع كوتش سراج (VIP Hotline)</span>
        </a>
      </div>
    </div>
  );
};
