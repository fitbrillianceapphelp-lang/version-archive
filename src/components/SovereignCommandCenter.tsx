import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Briefcase,
  Calculator,
  FileText,
  Cloud,
  LogOut,
  ExternalLink,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  BarChart2,
  Kanban,
  UserPlus,
  UserCheck,
  Activity,
  RefreshCw,
  Radio,
  Globe,
  ShieldAlert,
} from "lucide-react";
import { findProjectByCode, getStoredProjects, saveProjects } from "../lib/projectEmbed";
import { ProtectedProject } from "../types";
import { AdminAnalyticsBoard } from "./admin/AdminAnalyticsBoard";
import { AnalyticsBoard } from "./AnalyticsBoard";
import { AdminCrmKanban } from "./admin/AdminCrmKanban";
import { subscribeToCrmLeads, CrmLead } from "../lib/crmFirestore";
import {
  getAuthorizedAdmins,
  addCorporateAdmin,
  removeCorporateAdmin,
  toggleChannelActivation,
  CorporateAdmin,
} from "../lib/corporateAdmins";

export interface SovereignSubmission {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  status: "جديد" | "تم التواصل" | "قيد التنفيذ" | "مكتمل";
  budget?: string;
  notes?: string;
}

export interface SovereignProjectRecord {
  id: string;
  code: string;
  clientName: string;
  serviceType: string;
  budget: string;
  startDate: string;
  status: "قيد التأسيس" | "قيد التنفيذ" | "مكتمل" | "معلق";
  notes?: string;
}

interface SovereignCommandCenterProps {
  onClose: () => void;
}

export interface LiveVisitsData {
  totalVisits: number;
  todayVisits: number;
  hqAttemptsCount: number;
  loggedVisitsCount: number;
  recentHqAttempts: Array<{
    id: string;
    timestamp: string;
    ip: string;
    path: string;
    method: string;
    userAgent: string;
    referrer: string;
    isHqAttempt: boolean;
    metadata?: any;
  }>;
  recentVisits: Array<{
    id: string;
    timestamp: string;
    ip: string;
    path: string;
    method: string;
    userAgent: string;
    referrer: string;
    isHqAttempt: boolean;
    metadata?: any;
  }>;
  serverTime: string;
}

export const SovereignCommandCenter: React.FC<SovereignCommandCenterProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "visits" | "analytics" | "crm" | "admins" | "submissions" | "projects" | "roi" | "contracts" | "cloud"
  >("visits");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Visits Radar State
  const [liveVisits, setLiveVisits] = useState<LiveVisitsData | null>(null);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);
  const [visitsFilter, setVisitsFilter] = useState<"all" | "hq_only" | "today">("all");

  const fetchLiveVisits = async () => {
    setIsLoadingVisits(true);
    try {
      const res = await fetch("/api/analytics/live-visits");
      if (res.ok) {
        const data = await res.json();
        setLiveVisits(data);
      }
    } catch (e) {
      console.error("Failed to load live visits:", e);
    } finally {
      setIsLoadingVisits(false);
    }
  };

  useEffect(() => {
    fetchLiveVisits();
    const interval = setInterval(fetchLiveVisits, 12000);
    return () => clearInterval(interval);
  }, []);

  // Corporate Admins State
  const [adminsList, setAdminsList] = useState<CorporateAdmin[]>(() => getAuthorizedAdmins());
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    corporateEmail: "",
    phoneOrChannel: "",
    pin: "",
    role: "operations_lead" as CorporateAdmin["role"],
  });
  const [adminSuccessMsg, setAdminSuccessMsg] = useState("");

  // Live CRM & Firestore State
  const [crmLeads, setCrmLeads] = useState<CrmLead[]>([]);
  const [isLiveFirestore, setIsLiveFirestore] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCrmLeads((data, isLive) => {
      setCrmLeads(data);
      setIsLiveFirestore(isLive);
    });
    return () => unsub();
  }, []);

  // Submissions State
  const [submissions, setSubmissions] = useState<SovereignSubmission[]>(() => {
    try {
      const saved = localStorage.getItem("fb_admin_submissions");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "SUB-101",
        name: "عبدالرحمن الشهري",
        phone: "+966501234567",
        service: "تشخيص استراتيجي وتحول رقمي لمؤسسة تجارية",
        date: new Date().toISOString().split("T")[0],
        status: "جديد",
        budget: "15,000 $",
        notes: "مهتم بهيكلة العمليات الإعلانية وتقليل الهدر، يفضل المتابعة عبر الواتساب.",
      },
      {
        id: "SUB-102",
        name: "م. كريم عبدالفتاح",
        phone: "+201098765432",
        service: "إنتاج سينمائي 4K للفعاليات وإعادة هندسة المحتوى",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        status: "تم التواصل",
        budget: "8,000 $",
        notes: "طلب استعراض باقة تصوير المؤتمر السنوي وتوثيق الـ SOPs الميدانية.",
      },
    ];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedSubmission, setSelectedSubmission] = useState<SovereignSubmission | null>(null);

  // Projects State
  const [projects, setProjects] = useState<SovereignProjectRecord[]>(() => {
    try {
      const saved = localStorage.getItem("fb_admin_projects");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "1",
        code: "FB-90D-1040",
        clientName: "مطعم XYZ المأكولات الشرقية",
        serviceType: "تطوير وتشغيل منظومة الـ 90 يوماً",
        budget: "25,000 ج",
        startDate: "2026-03-01",
        status: "قيد التنفيذ",
        notes: "تم عزل الهدر الإعلاني وبدء المرحلة الثانية لزيادة المبيعات المباشرة.",
      },
      {
        id: "2",
        code: "FB-PRJ-2026-ALEX",
        clientName: "مجمع النخبة الطبي المتخصص",
        serviceType: "هندسة المحتوى والاستحواذ الرقمي",
        budget: "45,000 ج",
        startDate: "2026-02-15",
        status: "قيد التنفيذ",
        notes: "الـ ROAS تخطى 4.2x مع استقرار في الحجوزات اليومية.",
      },
    ];
  });

  const [newProject, setNewProject] = useState({
    clientName: "",
    serviceType: "تطوير وتشغيل منظومة الـ 90 يوماً",
    budget: "",
    status: "قيد التأسيس" as SovereignProjectRecord["status"],
    notes: "",
  });

  // ROI Calculator State
  const [monthlyBudget, setMonthlyBudget] = useState(3000);
  const [currentCPA, setCurrentCPA] = useState(45);
  const [estimatedWastePercent, setEstimatedWastePercent] = useState(35);
  const [targetMarginPercent, setTargetMarginPercent] = useState(40);

  // Contracts Studio State
  const [contractType, setContractType] = useState<"consulting" | "nda" | "partnership">("consulting");
  const [secondPartyName, setSecondPartyName] = useState("");
  const [contractValue, setContractValue] = useState("");
  const [contractDuration, setContractDuration] = useState("3 أشهر (خطة الـ 90 يوماً)");

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem("fb_admin_submissions", JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem("fb_admin_projects", JSON.stringify(projects));
      window.dispatchEvent(new Event("fitbrilliance_projects_updated"));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.clientName.trim()) return;

    const generatedCode = `FB-PR-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: SovereignProjectRecord = {
      id: Date.now().toString(),
      code: generatedCode,
      clientName: newProject.clientName.trim(),
      serviceType: newProject.serviceType,
      budget: newProject.budget ? `${newProject.budget} ج` : "غير محدد",
      startDate: new Date().toISOString().split("T")[0],
      status: newProject.status,
      notes: newProject.notes.trim(),
    };

    setProjects([record, ...projects]);
    setNewProject({
      clientName: "",
      serviceType: "تطوير وتشغيل منظومة الـ 90 يوماً",
      budget: "",
      status: "قيد التأسيس",
      notes: "",
    });
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المشروع من السجل؟")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleUpdateProjectStatus = (id: string, status: SovereignProjectRecord["status"]) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery) ||
        item.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "الكل" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const handleUpdateSubmissionStatus = (id: string, status: SovereignSubmission["status"]) => {
    setSubmissions(submissions.map((s) => (s.id === id ? { ...s, status } : s)));
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status });
    }
  };

  const handleDeleteSubmission = (id: string) => {
    if (window.confirm("هل تريد حذف هذا الطلب نهائياً من السجل؟")) {
      setSubmissions(submissions.filter((s) => s.id !== id));
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
    }
  };

  const handleExportCsv = () => {
    if (submissions.length === 0) {
      alert("لا توجد بيانات مسجلة للتصدير حالياً.");
      return;
    }
    const headers = "الكود,الاسم,الهاتف,الخدمة المطلوبة,الحالة,التاريخ,الميزانية\n";
    const rows = submissions
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.phone}","${s.service}","${s.status}","${s.date}","${s.budget || "-"}"`
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `طلبات_عملاء_سراج_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSampleSubmission = () => {
    const sample: SovereignSubmission = {
      id: `SUB-${Date.now().toString().slice(-4)}`,
      name: "أحمد عبد الله",
      phone: "+201234567890",
      service: "تشخيص مصفوفة الـ 99 سؤالاً وخطة تحول 90 يوماً",
      date: new Date().toISOString().split("T")[0],
      status: "جديد",
      budget: "25,000 ج",
      notes: "مشروع ملابس وتجارة إلكترونية، يريد وقف النزيف الإعلاني وتصوير محتوى 4K.",
    };
    setSubmissions([sample, ...submissions]);
  };

  // ROI Calculations
  const monthlyRecoveredWaste = Math.round(monthlyBudget * (estimatedWastePercent / 100));
  const annualSavings = monthlyRecoveredWaste * 12;
  const targetCPA = Math.round(currentCPA * (1 - (estimatedWastePercent / 100) * 0.7));
  const expectedAnnualAddedRevenue = Math.round(annualSavings * 2.8);

  const getContractText = () => {
    const clientName = secondPartyName.trim() || "[اسم العميل / المؤسسة الشريكة]";
    const value = contractValue.trim() || "[المقابل المالي المتفق عليه]";
    const dateFormatted = new Date().toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (contractType === "nda") {
      return `اتفاقية سرية المعلومات وحماية الملكية الفكرية (Sovereign NDA)
════════════════════════════════════════════════════════════════
حررت هذه الاتفاقية في تاريخ: ${dateFormatted}

الطرف الأول: منظومة Fit Brilliance للاستشارات والحلول التنفيذية (يمثلها: كوتش مصطفى سراج Onda)
الطرف الثاني: ${clientName}

تمهيد:
نظراً لرغبة الطرفين في دراسة وتطبيق إطار عمل التحول التجاري (90-Day Transformation Framework) المبتكر والمملوك فكرياً لكوتش سراج منذ 2011 (DIMC Verified)، فقد تم الاتفاق الملزم على الآتي:
1. يلتزم الطرف الثاني التزاماً قانونياً ومطلقاً بعدم إفشاء أو نسخ أو تكرار أو إعادة إنتاج أي نموذج من مصفوفات الأسئلة، أو أساليب التحليل، أو لوائح الـ SOPs الميدانية.
2. تظل كافة الأسرار التجارية، ومعادلات عزل الهدر المالي، واستراتيجيات الاستحواذ ملكية حصرية لكوتش سراج.
3. تسري هذه الاتفاقية طوال فترة التعامل ولمدة 5 سنوات من تاريخ توقيعها، وتخضع للقوانين المعمول بها في حماية الملكية الفكرية.

عن الطرف الأول: كوتش سراج (Fit Brilliance Sovereign) ✍️
عن الطرف الثاني: ${clientName} ✍️`;
    }

    if (contractType === "partnership") {
      return `مذكرة تفاهم وشراكة عمل استراتيجية (MOU Partnership)
════════════════════════════════════════════════════════════
التاريخ: ${dateFormatted}

بين كل من:
1. الطرف الأول: كوتش سراج أوندا — المستشار التنفيذي ومؤسس منظومة Fit Brilliance
2. الطرف الثاني: ${clientName}

بنود التفاهم والعمل المشترك:
- الغرض: إرساء شراكة نمو مؤسسي، وقيادة العمليات الإعلانية والإنتاج السينمائي 4K المشترك.
- مدة الاتفاق: ${contractDuration}.
- التزامات الطرف الأول: تقديم الإشراف الميداني، صياغة خطة الـ 90 يوماً، ومراقبة الـ ROAS أسبوعياً.
- التزامات الطرف الثاني: توفير الوصول للبيانات والفرق التشغيلية، والالتزام بالإجراءات القياسية (SOPs).
- العائد والربحية: استثمار تشغيلي مشترك بمقابل تعاقدي يقدر بـ (${value}) مع نسبة نمو متفق عليها.

اعتماد الطرفين:
كوتش سراج | Fit Brilliance ✍️
${clientName} ✍️`;
    }

    return `عقد تقديم خدمات استشارية وتنفيذية احترافية — خطة الـ 90 يوماً
════════════════════════════════════════════════════════════════
التاريخ: ${dateFormatted}

الطرف الأول (مقدم الخدمة): منظومة Fit Brilliance — إدارة كوتش مصطفى سراج
الطرف الثاني (العميل): ${clientName}

نطاق العمل والخدمات المعتمدة:
1. التدقيق التشريحي الشامل وعزل الهدر المالي الميداني في ميزانيات الإعلانات.
2. هندسة منظومة الاستحواذ المباشر وتدريب مسؤولي المبيعات على الـ SOPs وسرعة الإغلاق.
3. التوثيق البصري السينمائي بجودة 4K لأصول النشاط عبر Pioneers Media Hub.
4. فتح شاشة رادار الـ CRM الحية للعميل لمتابعة الـ ROAS والمخرجات بكود مشروعه 24/7.

المقابل المالي والمدة:
- مدة التعاقد: ${contractDuration}.
- إجمالي القيمة التعاقدية: ${value}.
- آلية الدفع: 50% دفعة مقدمة عند التوقيع، و50% بعد اكتمال مرحلة التأسيس الشهرية.

السرية وحفظ الحقوق:
تحفظ حقوق الطرف الثاني في سرية بياناته، وتبقى النماذج الاستراتيجية وحقوق الإرشاد للمقدم © 2026.

توقيع واعتماد الطرف الأول:
كوتش سراج — Fit Brilliance ✍️

توقيع واعتماد الطرف الثاني:
${clientName} ✍️`;
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#05080c]/98 text-slate-100 flex flex-col font-sans overflow-hidden animate-in fade-in duration-200">
      {/* Top Sovereign Command Bar */}
      <header className="border-b border-[#dc2626]/30 bg-[#080d14]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dc2626]/20 to-black border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444] shadow-lg shadow-[#dc2626]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
                غرفة قيادة العمليات والتحكم التنفيذي (Sovereign Command Center)
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                الاعتماد: سيادي موثق ومشفّر
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              إشراف وإدارة كوتش مصطفى سراج | Fit Brilliance Executive Command
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            title="قفل غرفة القيادة والخروج"
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-500/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>قفل الجلسة (خروج)</span>
          </button>
        </div>
      </header>

      {/* Module Selector Navigation Bar */}
      <div className="bg-[#0b1017] border-b border-slate-800 px-4 sm:px-8 py-2 flex items-center gap-2 overflow-x-auto shrink-0 text-xs font-bold">
        <button
          onClick={() => setActiveTab("visits")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "visits"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] font-black"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>رادار الزيارات الحي والمراقبة (Live Traffic)</span>
          {liveVisits && (
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full font-bold">
              {liveVisits.totalVisits.toLocaleString()}
            </span>
          )}
          {liveVisits && liveVisits.hqAttemptsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-red-600 text-white font-mono text-[9px] rounded-full font-bold animate-bounce">
              {liveVisits.hqAttemptsCount} HQ
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "analytics"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] font-black"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <BarChart2 className="w-4 h-4 text-[#ef4444]" />
          <span>لوحة التحليلات المرئية (Recharts)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveTab("crm")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "crm"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] font-black"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>قمع الصفقات وإدارة العملاء (CRM Kanban)</span>
          {crmLeads.length > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full font-mono">
              {crmLeads.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("admins")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "admins"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] font-black"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <UserCheck className="w-4 h-4 text-purple-400" />
          <span>إدارة المديرين (Admins)</span>
          <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full font-mono">
            {adminsList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "submissions"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <FileText className="w-4 h-4 text-slate-300" />
          <span>طلبات واستشارات العملاء</span>
          {submissions.length > 0 && (
            <span className="px-1.5 py-0.2 bg-white text-black text-[10px] font-black rounded-full">
              {submissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "projects"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>المشاريع والأكواد (Sync)</span>
          {projects.length > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full font-mono">
              {projects.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("roi")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "roi"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Calculator className="w-4 h-4 text-cyan-400" />
          <span>حاسبة العائد وعزل الهدر المالي</span>
        </button>

        <button
          onClick={() => setActiveTab("contracts")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "contracts"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <FileText className="w-4 h-4 text-rose-400" />
          <span>استوديو العقود والمواثيق السيادية</span>
        </button>

        <button
          onClick={() => setActiveTab("cloud")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "cloud"
              ? "bg-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Cloud className="w-4 h-4 text-indigo-400" />
          <span>البوابات السحابية وقواعد البيانات</span>
        </button>
      </div>

      {/* Main Command Workspace */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full text-right">
        {/* TAB -1: LIVE VISITS & HQ SECURITY AUDIT RADAR */}
        {activeTab === "visits" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header & Controls */}
            <div className="bg-[#0b1018] border border-red-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">رادار الزيارات الحي والمراقبة الميدانية</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                      LIVE RADAR
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    فحص فوري لكافة الزيارات ومحاولات فتح رابط <span className="text-red-400 font-mono font-bold">#HQ</span> المشفر.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto">
                <button
                  type="button"
                  onClick={fetchLiveVisits}
                  disabled={isLoadingVisits}
                  className="w-full md:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingVisits ? "animate-spin" : ""}`} />
                  <span>تحديث الفحص الفوري</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#080d14] border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>إجمالي الزيارات المسجلة</span>
                  <Globe className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {liveVisits ? liveVisits.totalVisits.toLocaleString() : "..."}
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Total Platform Requests</p>
              </div>

              <div className="bg-[#080d14] border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>زيارات اليوم (Active Today)</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {liveVisits ? liveVisits.todayVisits.toLocaleString() : "..."}
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Unique Daily Sessions</p>
              </div>

              <div className="bg-[#080d14] border border-red-900/50 rounded-2xl p-5 space-y-2 bg-gradient-to-br from-red-950/20 to-transparent">
                <div className="flex items-center justify-between text-red-300 text-xs font-bold">
                  <span>محاولات فتح رابط #HQ</span>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-black text-red-400 font-mono">
                  {liveVisits ? liveVisits.hqAttemptsCount : 0}
                </div>
                <p className="text-[10px] text-red-300/70 font-mono">مقفلة خلف جدار التشفير SHA-256</p>
              </div>

              <div className="bg-[#080d14] border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>حالة التشفير والحظر</span>
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-sm font-black text-emerald-400 font-mono flex items-center gap-1.5 pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>SHA-256 ARMED</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">5 محاولات كحد أقصى قبل القفل 15 دقيقة</p>
              </div>
            </div>

            {/* Warning if HQ attempts occurred */}
            {liveVisits && liveVisits.hqAttemptsCount > 0 && (
              <div className="bg-red-950/40 border border-red-600/60 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-200">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm text-red-100">
                    تم رصد ({liveVisits.hqAttemptsCount}) محاولة وصول لرابط القيادة #HQ!
                  </p>
                  <p className="text-[11px] leading-relaxed text-red-300/90">
                    البوابة المشفرة تصدت لكافة الطلبات غير المصرح بها بنجاح. لا يمكن لأي متطفل تجاوز شاشة كلمة المرور المشفرة بـ SHA-256.
                  </p>
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setVisitsFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  visitsFilter === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                جميع الزيارات ({liveVisits?.recentVisits?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setVisitsFilter("hq_only")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  visitsFilter === "hq_only"
                    ? "bg-red-600 text-white font-black"
                    : "text-red-400 hover:text-red-300"
                }`}
              >
                محاولات #HQ فقط ({liveVisits?.recentHqAttempts?.length || 0})
              </button>
            </div>

            {/* Visits Stream Table */}
            <div className="bg-[#080d14] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>سجل الزيارات والطلبات اللحظي (Live Stream)</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">آخر 50 حدث مرصود</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#0b1018] border-b border-slate-800 text-slate-400 font-bold">
                    <tr>
                      <th className="py-3 px-4">التوقيت</th>
                      <th className="py-3 px-4">المسار / الهدف</th>
                      <th className="py-3 px-4">عنوان الـ IP</th>
                      <th className="py-3 px-4">الجهاز والمتصفح</th>
                      <th className="py-3 px-4">الحالة الأمنية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {(() => {
                      const list =
                        visitsFilter === "hq_only"
                          ? liveVisits?.recentHqAttempts || []
                          : liveVisits?.recentVisits || [];

                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-500 text-xs font-sans">
                              لا توجد محاولات مشبوهة أو زيارات مطابقة للفلتر المحدد حالياً.
                            </td>
                          </tr>
                        );
                      }

                      return list.map((visit) => (
                        <tr
                          key={visit.id}
                          className={`hover:bg-white/[0.02] transition-colors ${
                            visit.isHqAttempt ? "bg-red-950/20" : ""
                          }`}
                        >
                          <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                            {new Date(visit.timestamp).toLocaleTimeString("ar-EG", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                visit.isHqAttempt
                                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                  : "bg-slate-800 text-slate-300"
                              }`}
                            >
                              {visit.path || "/"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 text-[11px] whitespace-nowrap">
                            {visit.ip || "127.0.0.1"}
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[10px] max-w-xs truncate font-sans">
                            {visit.userAgent || "متصفح ويب معتمد"}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-sans">
                            {visit.isHqAttempt ? (
                              <span className="inline-flex items-center gap-1 text-red-400 text-[10px] font-bold">
                                <Lock className="w-3 h-3" />
                                <span>محاولة فتح #HQ (مغلقة)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>زيارة طبيعية</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 0: VISUAL ANALYTICS */}
        {activeTab === "analytics" && (
          <AdminAnalyticsBoard
            leads={crmLeads}
            isLiveFirestore={isLiveFirestore}
          />
        )}

        {/* TAB 0.5: CRM PIPELINE KANBAN */}
        {activeTab === "crm" && (
          <AdminCrmKanban
            leads={crmLeads}
            isLiveFirestore={isLiveFirestore}
            onNavigateToContracts={(clientName, budget) => {
              setActiveTab("contracts");
              setSecondPartyName(clientName);
              setContractValue(budget);
            }}
          />
        )}

        {/* TAB 0.7: CORPORATE ADMINS MANAGEMENT */}
        {activeTab === "admins" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Card */}
            <div className="bg-[#0a0f18]/90 border border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                  <span>إدارة المديرين السياديين وقنوات الاتصال الرسمية</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  إضافة واعتماد مديري منظومة Fit Brilliance بالبريد المؤسسي وقنوات الاتصال والرقم السري الخاص بكل مسؤول.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>الظهور السري: كتابة &quot;start smart&quot; أو الرمز السيادي</span>
              </div>
            </div>

            {/* Add New Admin Form */}
            <div className="bg-[#090e17] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-black text-white flex items-center gap-2 mb-3">
                <UserPlus className="w-4 h-4 text-[#ef4444]" />
                <span>اعتماد مدير تنفيذي جديد في المنظومة</span>
              </h3>

              {adminSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{adminSuccessMsg}</span>
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newAdmin.name.trim() || !newAdmin.corporateEmail.trim() || !newAdmin.pin.trim()) return;
                  const added = await addCorporateAdmin({
                    name: newAdmin.name,
                    corporateEmail: newAdmin.corporateEmail,
                    phoneOrChannel: newAdmin.phoneOrChannel,
                    pin: newAdmin.pin,
                    role: newAdmin.role,
                  });
                  setAdminsList(getAuthorizedAdmins());
                  setNewAdmin({
                    name: "",
                    corporateEmail: "",
                    phoneOrChannel: "",
                    pin: "",
                    role: "operations_lead",
                  });
                  setAdminSuccessMsg(`تم اعتماد المدير (${added.name}) وحفظ رقمه السري بنجاح.`);
                  setTimeout(() => setAdminSuccessMsg(""), 4000);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs"
              >
                <div>
                  <label className="text-slate-300 font-bold block mb-1">اسم المسؤول / المدير *</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="مثال: م. أحمد حسني"
                    className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">البريد المؤسسي (Company Email) *</label>
                  <input
                    type="email"
                    required
                    value={newAdmin.corporateEmail}
                    onChange={(e) => setNewAdmin({ ...newAdmin, corporateEmail: e.target.value })}
                    placeholder="admin@fitbrilliance.com"
                    className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">قناة الاتصال / رقم الواتساب المعتمد</label>
                  <input
                    type="text"
                    value={newAdmin.phoneOrChannel}
                    onChange={(e) => setNewAdmin({ ...newAdmin, phoneOrChannel: e.target.value })}
                    placeholder="+966... أو +20..."
                    className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">الرقم السري السيادي (PIN) *</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.pin}
                    onChange={(e) => setNewAdmin({ ...newAdmin, pin: e.target.value })}
                    placeholder="أدخل الرمز السري المطلوب للتعيين"
                    className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none font-mono tracking-widest"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500">
                    يحق للمدير المضاف فتح غرفة القيادة السرية بالرقم السري الخاص به عبر اختصار &quot;start smart&quot;.
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/25"
                  >
                    <Plus className="w-4 h-4" />
                    <span>اعتماد وحفظ المدير</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 1. Sovereign Lead Card (Coach Serag) */}
            <div className="bg-gradient-to-r from-red-950/40 via-[#0d141f] to-[#070b12] border-2 border-red-600/50 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-lg shadow-red-950/50">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">كوتش مصطفى سراج (القيادة والسيادة التنفيذية)</h3>
                    <span className="px-2 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-[10px] font-bold">
                      SUPER ADMIN • PERMANENT
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    البريد المعتمد: <span className="text-red-400 font-bold">serag@fitbrilliance.store</span> • التشفير السيادي: <span className="text-emerald-400 font-bold">مشفر بـ SHA-256 (محمي)</span>
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>مفعل دائم بأعلى الصلاحيات</span>
              </div>
            </div>

            {/* 2. The 11 Ecosystem & Department Channels Matrix */}
            <div className="bg-[#090e17] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#ef4444]" />
                    <span>مصفوفة قنوات التواصل والإدارات الـ 11 التابعة للمنظومة</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    جميع القنوات تظل (غير مفعلة) للدخول وحجب الصلاحيات إلا من خلال تفعيل كوتش سراج بعد تعيين المديرين.
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-2.5 py-1 rounded-lg">
                  11 Channels Directorate
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-[#05080c] text-slate-400 border-b border-slate-800">
                      <th className="p-3.5">الإدارة / القناة</th>
                      <th className="p-3.5">البريد المؤسسي</th>
                      <th className="p-3.5">المدير المسؤول</th>
                      <th className="p-3.5">حالة التفعيل</th>
                      <th className="p-3.5 text-center">إجراءات كوتش سراج</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {adminsList
                      .filter((adm) => adm.id !== "admin-master-serag")
                      .map((channel) => {
                        const isActive = channel.status === "active";
                        return (
                          <tr key={channel.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-white">{channel.name}</div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {channel.departmentName || "إدارة مركزية"}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-red-400 font-bold">
                              {channel.corporateEmail}
                            </td>
                            <td className="p-3.5 font-mono text-slate-300">
                              {isActive ? channel.name : "لم يتم التعيين بعد"}
                            </td>
                            <td className="p-3.5">
                              {isActive ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  مفعلة ونشطة
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  معلقة (غير مفعلة)
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-center">
                              {isActive ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`هل ترغب في تعليق قناة (${channel.corporateEmail}) وإلغاء تفعيلها؟`)) {
                                      const updated = toggleChannelActivation(channel.id);
                                      setAdminsList(updated);
                                    }
                                  }}
                                  className="px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 font-bold text-[11px] transition-all cursor-pointer"
                                >
                                  إيقاف مؤقت / تعليق
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const managerName = window.prompt(
                                      `تعيين مدير جديد لقناة (${channel.corporateEmail}):\\nأدخل اسم المدير المسؤول:`
                                    );
                                    if (!managerName || !managerName.trim()) return;
                                    const pin = window.prompt(
                                      `أدخل الرقم السري المعتمد للمدير (${managerName}):`
                                    );
                                    if (!pin || !pin.trim()) return;

                                    const updated = toggleChannelActivation(
                                      channel.id,
                                      managerName.trim(),
                                      pin.trim()
                                    );
                                    setAdminsList(updated);
                                    alert(`تم تعيين المدير (${managerName}) وتفعيل قناة (${channel.corporateEmail}) بنجاح.`);
                                  }}
                                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                                >
                                  تعيين مدير وتفعيل القناة
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: SUBMISSIONS DESK */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0b121d] border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400">إجمالي الطلبات الواردة</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">{submissions.length}</div>
              </div>
              <div className="bg-[#0b121d] border border-amber-500/30 rounded-2xl p-4">
                <div className="text-xs text-amber-400">طلبات جديدة قيد المراجعة</div>
                <div className="text-2xl font-black text-amber-300 mt-1 font-mono">
                  {submissions.filter((s) => s.status === "جديد").length}
                </div>
              </div>
              <div className="bg-[#0b121d] border border-cyan-500/30 rounded-2xl p-4">
                <div className="text-xs text-cyan-400">تم التواصل والمتابعة</div>
                <div className="text-2xl font-black text-cyan-300 mt-1 font-mono">
                  {submissions.filter((s) => s.status === "تم التواصل").length}
                </div>
              </div>
              <div className="bg-[#0b121d] border border-emerald-500/30 rounded-2xl p-4">
                <div className="text-xs text-emerald-400">تحويل لتعاقد الـ 90 يوماً</div>
                <div className="text-2xl font-black text-emerald-300 mt-1 font-mono">
                  {submissions.filter((s) => s.status === "قيد التنفيذ" || s.status === "مكتمل").length}
                </div>
              </div>
            </div>

            {/* Filter & Action Bar */}
            <div className="bg-[#0b121d] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="بحث بالاسم أو رقم الهاتف أو الخدمة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#05080c] border border-slate-700 focus:border-[#ef4444] rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#05080c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="الكل">كل الحالات</option>
                    <option value="جديد">جديد</option>
                    <option value="تم التواصل">تم التواصل</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتمل">مكتمل</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تصدير كشيت CSV</span>
                </button>
                <button
                  onClick={handleAddSampleSubmission}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#991b1b] hover:from-[#ef4444] hover:to-[#b91c1c] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إدراج طلب تجريبي</span>
                </button>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-[#0b121d] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#070b10] text-slate-400 border-b border-slate-800 font-bold">
                    <tr>
                      <th className="py-3 px-4">كود الطلب</th>
                      <th className="py-3 px-4">اسم العميل</th>
                      <th className="py-3 px-4">رقم التواصل (واتساب)</th>
                      <th className="py-3 px-4">الخدمة المطلوبة</th>
                      <th className="py-3 px-4">الميزانية</th>
                      <th className="py-3 px-4">التاريخ</th>
                      <th className="py-3 px-4">الحالة</th>
                      <th className="py-3 px-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#ef4444]">{sub.id}</td>
                        <td className="py-3 px-4 font-bold text-white">{sub.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-300" dir="ltr">
                          <a
                            href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `السلام عليكم أستاذ ${sub.name}، معك كوتش سراج أوندا من منظومة Fit Brilliance بخصوص استشارتك كود ${sub.id}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-400 flex items-center gap-1 justify-end"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{sub.phone}</span>
                          </a>
                        </td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{sub.service}</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold font-mono">{sub.budget || "-"}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono">{sub.date}</td>
                        <td className="py-3 px-4">
                          <select
                            value={sub.status}
                            onChange={(e) => handleUpdateSubmissionStatus(sub.id, e.target.value as any)}
                            className={`text-[11px] font-bold rounded-lg px-2.5 py-1 bg-black/50 border focus:outline-none ${
                              sub.status === "جديد"
                                ? "border-amber-500/50 text-amber-400"
                                : sub.status === "تم التواصل"
                                ? "border-cyan-500/50 text-cyan-400"
                                : sub.status === "قيد التنفيذ"
                                ? "border-emerald-500/50 text-emerald-400"
                                : "border-slate-500/50 text-slate-400"
                            }`}
                          >
                            <option value="جديد">جديد</option>
                            <option value="تم التواصل">تم التواصل</option>
                            <option value="قيد التنفيذ">قيد التنفيذ</option>
                            <option value="مكتمل">مكتمل</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              التفاصيل
                            </button>
                            <button
                              onClick={() => handleDeleteSubmission(sub.id)}
                              className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Details Modal */}
            {selectedSubmission && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000] flex items-center justify-center p-4">
                <div className="bg-[#0b121d] border border-[#dc2626]/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ef4444]" />
                      <span>ملف استشارة العميل: {selectedSubmission.name}</span>
                    </h3>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">كود الطلب:</span>
                      <span className="text-[#ef4444] font-mono font-bold text-sm">{selectedSubmission.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">رقم الهاتف للتواصل:</span>
                      <span className="text-white font-mono" dir="ltr">{selectedSubmission.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">نوع الاستشارة المطلوبة:</span>
                      <span className="text-amber-300 font-semibold">{selectedSubmission.service}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">الميزانية المقدرة:</span>
                      <span className="text-emerald-400 font-bold font-mono">{selectedSubmission.budget || "غير محدد"}</span>
                    </div>
                    {selectedSubmission.notes && (
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block mb-1">ملاحظات وتشخيص العميل:</span>
                        <p className="text-slate-200 leading-relaxed">{selectedSubmission.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <a
                      href={`https://wa.me/${selectedSubmission.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>محادثة واتساب مباشرة</span>
                    </a>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                    >
                      إغلاق النافذة
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROJECTS & CRM SYNC */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {/* Create Project Card */}
            <div className="bg-[#0b121d] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>إدراج مشروع جديد وتوليد كود المتابعة للـ CRM الحي</span>
              </h2>
              <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">اسم المنشأة أو العميل *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سلسلة مطاعم النيل"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    className="w-full bg-[#05080c] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">المسار الاستشاري</label>
                  <select
                    value={newProject.serviceType}
                    onChange={(e) => setNewProject({ ...newProject, serviceType: e.target.value })}
                    className="w-full bg-[#05080c] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="تطوير وتشغيل منظومة الـ 90 يوماً">تطوير وتشغيل منظومة الـ 90 يوماً</option>
                    <option value="تدقيق هدر الحملات وضبط الـ ROAS">تدقيق هدر الحملات وضبط الـ ROAS</option>
                    <option value="إنتاج سينمائي 4K وتغطية الفعاليات">إنتاج سينمائي 4K وتغطية الفعاليات</option>
                    <option value="أتمتة العمليات وهندسة الـ SOPs الميدانية">أتمتة العمليات وهندسة الـ SOPs الميدانية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">الميزانية أو القيمة التعاقدية</label>
                  <input
                    type="text"
                    placeholder="مثال: 35,000"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    className="w-full bg-[#05080c] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>توليد الكود واعتماد المشروع</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-[#0b121d] border border-slate-800 hover:border-[#dc2626]/40 rounded-2xl p-5 space-y-4 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#ef4444] bg-[#dc2626]/15 border border-[#ef4444]/30 px-2.5 py-1 rounded-lg">
                        {proj.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(proj.code, proj.id)}
                        title="نسخ كود المشروع"
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        {copiedId === proj.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <select
                      value={proj.status}
                      onChange={(e) => handleUpdateProjectStatus(proj.id, e.target.value as any)}
                      className="text-[11px] font-bold rounded-lg px-2 py-0.5 bg-black/40 border border-slate-700 text-slate-300 focus:outline-none"
                    >
                      <option value="قيد التأسيس">قيد التأسيس</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="معلق">معلق</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{proj.clientName}</h3>
                    <p className="text-xs text-slate-400 mt-1">{proj.serviceType}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">القيمة التعاقدية:</span>
                      <span className="font-bold text-emerald-400">{proj.budget}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">تاريخ البدء:</span>
                      <span className="text-slate-400">{proj.startDate}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ROI & FINANCIAL WASTE CALCULATOR */}
        {activeTab === "roi" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#0b121d] border border-slate-800 rounded-2xl p-6 space-y-5 lg:col-span-1">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>محددات التحليل المالي والنزيف الإعلاني</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>الميزانية الإعلانية الشهرية ($):</span>
                    <span className="font-bold text-amber-400 font-mono">{monthlyBudget.toLocaleString()} $</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="w-full accent-[#dc2626] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>تكلفة الاستحواذ الحالية CPA ($):</span>
                    <span className="font-bold text-cyan-400 font-mono">{currentCPA} $</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={currentCPA}
                    onChange={(e) => setCurrentCPA(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>نسبة الهدر التقديري في الحملات:</span>
                    <span className="font-bold text-rose-400 font-mono">{estimatedWastePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="65"
                    step="5"
                    value={estimatedWastePercent}
                    onChange={(e) => setEstimatedWastePercent(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>هامش الربح التشغيلي المستهدف:</span>
                    <span className="font-bold text-emerald-400 font-mono">{targetMarginPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="70"
                    step="5"
                    value={targetMarginPercent}
                    onChange={(e) => setTargetMarginPercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0b121d] border border-rose-500/30 rounded-2xl p-5">
                  <div className="text-xs text-rose-400 font-bold">الهدر المالي المسترد شهرياً</div>
                  <div className="text-3xl font-black text-rose-300 mt-2 font-mono">
                    {monthlyRecoveredWaste.toLocaleString()} $
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">سيولة مهدرة تُحجب فورياً وتُعاد للتحويل المباشر.</p>
                </div>

                <div className="bg-[#0b121d] border border-emerald-500/30 rounded-2xl p-5">
                  <div className="text-xs text-emerald-400 font-bold">التوفير السنوي التراكمي</div>
                  <div className="text-3xl font-black text-emerald-300 mt-2 font-mono">
                    {annualSavings.toLocaleString()} $
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">قيمة صافية تضاف لأرباح المنشأة دون زيادة قرش واحد.</p>
                </div>

                <div className="bg-[#0b121d] border border-cyan-500/30 rounded-2xl p-5">
                  <div className="text-xs text-cyan-400 font-bold">تكلفة الاستحواذ المستهدفة (CPA)</div>
                  <div className="text-3xl font-black text-cyan-300 mt-2 font-mono">{targetCPA} $</div>
                  <p className="text-[11px] text-slate-400 mt-1">انخفاض مباشر من {currentCPA}$ بفضل الـ SOPs الميدانية.</p>
                </div>

                <div className="bg-[#0b121d] border border-amber-500/30 rounded-2xl p-5">
                  <div className="text-xs text-amber-400 font-bold">العائد الإضافي المتوقع سنوياً</div>
                  <div className="text-3xl font-black text-amber-300 mt-2 font-mono">
                    +{expectedAnnualAddedRevenue.toLocaleString()} $
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">بناءً على إعادة تدوير السيولة في القنوات الأكثر ربحية.</p>
                </div>
              </div>

              {/* Recommendation Quote */}
              <div className="bg-[#0b121d] border border-[#dc2626]/40 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#ef4444]">
                  <Sparkles className="w-4 h-4 text-[#ef4444]" />
                  <span>توصية كوتش سراج الميدانية الصارمة:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  مع ميزانية شهرية تبلغ <strong className="text-white">{monthlyBudget.toLocaleString()}$</strong>، فإن ضخ المزيد من الأموال في الإعلانات قبل إصلاح مسار التحويل البيعي وتدريب فريق الإغلاق يؤدي إلى حرق مباشر لـ{" "}
                  <strong className="text-rose-400">{monthlyRecoveredWaste.toLocaleString()}$</strong> شهرياً. الأولوية التشغيلية في خطة الـ 90 يوماً تقتضي عزل الهدر أول أسبوعين، وضبط رحلة العميل قبل مضاعفة الميزانية.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTRACTS & NDA STUDIO */}
        {activeTab === "contracts" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#0b121d] border border-slate-800 rounded-2xl p-6 space-y-4 lg:col-span-1">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-400" />
                <span>إعدادات وثيقة التعاقد</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">نوع الوثيقة القانونية</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as any)}
                    className="w-full bg-[#05080c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="consulting">عقد خدمات استشارية وتنفيذية (90 يوم)</option>
                    <option value="nda">اتفاقية سرية وحماية ملكية فكرية (NDA)</option>
                    <option value="partnership">مذكرة تفاهم وشراكة استراتيجية (MOU)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">اسم الطرف الثاني (العميل أو الشريك)</label>
                  <input
                    type="text"
                    placeholder="مثال: شركة الآفاق الرقمية"
                    value={secondPartyName}
                    onChange={(e) => setSecondPartyName(e.target.value)}
                    className="w-full bg-[#05080c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">القيمة المالية للاتفاقية</label>
                  <input
                    type="text"
                    placeholder="مثال: 45,000 جنيه مصري"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    className="w-full bg-[#05080c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">مدة التعاقد</label>
                  <input
                    type="text"
                    value={contractDuration}
                    onChange={(e) => setContractDuration(e.target.value)}
                    className="w-full bg-[#05080c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => copyToClipboard(getContractText(), "contract-copy")}
                    className="w-full bg-gradient-to-r from-[#dc2626] to-[#991b1b] hover:from-[#ef4444] hover:to-[#b91c1c] text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#dc2626]/20"
                  >
                    {copiedId === "contract-copy" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>تم نسخ الوثيقة بالكامل للحافظة</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ نص الوثيقة المعتمدة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#0b121d] border border-slate-800 rounded-2xl p-6 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-[#ef4444]">معاينة نص الوثيقة المعتمدة</span>
                <span className="text-[11px] text-slate-400">جاهزة للطباعة والتوقيع</span>
              </div>
              <pre className="w-full p-4 bg-[#05080c] border border-slate-800 rounded-xl text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap select-all overflow-y-auto max-h-[500px]">
                {getContractText()}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 5: CLOUD HUB */}
        {activeTab === "cloud" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cloud className="w-4 h-4 text-indigo-400" />
                <span>البوابات السحابية والأنظمة التقنية المعتمدة للمنظومة</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                وصول مباشر وسريع لكافة البنى التحتية، المستودعات، والبريد المهني المشفر.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="https://github.com/fitbrillianceapphelp-lang/Supbess"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0b121d] border border-slate-800 hover:border-[#dc2626]/50 p-5 rounded-2xl transition-all group block shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-[#ef4444] transition-colors">
                    مستودع المنصة الرئيسي (GitHub)
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#ef4444]" />
                </div>
                <div className="font-mono text-[11px] text-slate-400 mt-1">fitbrillianceapphelp-lang/Supbess</div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  الكود المصدري للموقع العام، صفحات التشخيص، وبوابة العملاء.
                </p>
              </a>

              <a
                href="https://mail.hostinger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0b121d] border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all group block shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    البريد المهني الرسمي (Hostinger)
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400]" />
                </div>
                <div className="font-mono text-[11px] text-emerald-400 mt-1">mail.fitbrilliance.store</div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  صندوق الوارد المهني لمراسلات العقود، عروض الأسعار، وتأكيدات الشركاء.
                </p>
              </a>

              <a
                href="https://app.botpress.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0b121d] border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl transition-all group block shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                    لوحة تحكم Botpress الذكية
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <div className="font-mono text-[11px] text-indigo-400 mt-1">Botpress Cloud Studio</div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  إدارة حوارات المساعد الذكي وتدريب قاعدة المعرفة.
                </p>
              </a>

              <a
                href="https://fitbrilliance.store"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0b121d] border border-slate-800 hover:border-[#dc2626]/50 p-5 rounded-2xl transition-all group block shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-[#ef4444] transition-colors">
                    المنصة المباشرة على الويب
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#ef4444]" />
                </div>
                <div className="font-mono text-[11px] text-amber-400 mt-1">fitbrilliance.store</div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  الواجهة العامة النشطة لاستقبال زوار المنصة وعملاء الاستشارات والتقييم.
                </p>
              </a>

              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0b121d] border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl transition-all group block shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    لوحة استضافة Vercel
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                </div>
                <div className="font-mono text-[11px] text-cyan-400 mt-1">Vercel Deployments</div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  مراقبة النشر التلقائي، سجلات التشغيل، وأمان شهادات SSL.
                </p>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
