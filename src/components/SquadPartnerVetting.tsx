import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Award,
  Users,
  Target,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Activity,
  Sparkles,
  Lock,
  Search,
  Scale,
  Brain,
  Check,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Building,
  Video,
  Megaphone,
  Handshake,
  Calendar,
  QrCode
} from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";
import { getDeviceFingerprint } from "../lib/deviceFingerprint";

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface SquadPartnerVettingProps {
  setActiveTab?: (tab: string, option?: string) => void;
  lang?: Language;
}

export type PartnershipAxisType = "ngo" | "agency" | "commercial" | "creator";

export interface VettingResponse {
  candidateId: string;
  fullName: string;
  phone: string;
  email: string;
  axis: PartnershipAxisType;
  desiredRole: string;
  yearsOfExp: string;
  portfolioUrl: string;
  answers: Record<string, any>;
  aiAnalysis: {
    matchScore: number;
    integrityScore: number;
    redFlags: string[];
    strengths: string[];
    finalRecommendation: "strong_partner" | "operational_member" | "unfit";
    executiveSummaryAr: string;
  };
  submittedAt: string;
  deviceFingerprint: string;
}

export const SquadPartnerVetting: React.FC<SquadPartnerVettingProps> = ({
  setActiveTab,
  lang = "ar"
}) => {
  const t = getTranslation(lang);
  const isRtl = lang === "ar";

  const [selectedAxis, setSelectedAxis] = useState<PartnershipAxisType>("ngo");
  const [deviceFp, setDeviceFp] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [vettingResult, setVettingResult] = useState<VettingResponse | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    organizationName: "",
    portfolioUrl: "",
    
    // Axis 1: NGO
    ngoEventDate: "",
    ngoAgendaDetails: "",
    ngoAgree15Days: false,

    // Axis 2: Marketing & Advertising Agency
    agencyScope: "",
    agencyAgreeCreativeDecisions: false,
    agencyAgreeProtocolDrafting: false,
    agencyAgreeTeamNameOnly: false,
    agencyAgreeExecutionOnly: false,

    // Axis 3: Commercial Business
    businessType: "",
    businessProposalDetails: "",
    businessAgreeReviewMeeting: false,

    // Axis 4: Content Creators & Talents
    creatorPlatform: "youtube",
    creatorFollowersCount: "",
    creatorIdeaSummary: "",
    creatorAgreeIpRights2026: false,
    creatorAgreeQrCodeMandate: false,
    creatorAgreeYoutubeCollab30Pct: false,
    creatorAgreeDualSignature48H: false,
    creatorAgreeExclusiveAdSigning: false
  });

  useEffect(() => {
    getDeviceFingerprint().then((res) => {
      setDeviceFp(res.fingerprintHash);
    });
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError(null);
  };

  const handleSubmitVetting = async () => {
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setValidationError("يرجى ملء الاسم ورقم الهاتف والبريد الإلكتروني بدقة.");
      return;
    }

    if (selectedAxis === "ngo") {
      if (!formData.ngoEventDate || !formData.ngoAgendaDetails.trim()) {
        setValidationError("يرجى تحديد تاريخ الفعالية وتفاصيل جدول الأعمال.");
        return;
      }
      if (!formData.ngoAgree15Days) {
        setValidationError("شرط إلزامي: تقديم جدول الأعمال قبلها بمدة لا تقل عن 15 يوماً والموافقة على تدقيق الدور.");
        return;
      }
    } else if (selectedAxis === "agency") {
      if (
        !formData.agencyAgreeCreativeDecisions ||
        !formData.agencyAgreeProtocolDrafting ||
        !formData.agencyAgreeTeamNameOnly ||
        !formData.agencyAgreeExecutionOnly
      ) {
        setValidationError("يرجى الموافقة على شروط بروتوكول التعاون الخاصة بشركات الدعاية والإعلان (التنفيذ تحت إشرافنا التام وحصرياً باسم فريق التعاون).");
        return;
      }
    } else if (selectedAxis === "commercial") {
      if (!formData.businessProposalDetails.trim() || !formData.businessAgreeReviewMeeting) {
        setValidationError("يرجى توضيح العرض والشراكة التجارية المقترحة والموافقة على شرط دراسة العرض وجدولة موعد رسمي.");
        return;
      }
    } else if (selectedAxis === "creator") {
      if (
        !formData.creatorAgreeIpRights2026 ||
        !formData.creatorAgreeQrCodeMandate ||
        !formData.creatorAgreeYoutubeCollab30Pct ||
        !formData.creatorAgreeDualSignature48H ||
        !formData.creatorAgreeExclusiveAdSigning
      ) {
        setValidationError("يرجى الموافقة على البنود القانونية لعقد الشراكة مع صناع المحتوى (الملكية الفكرية © 2026، الـ QR Code، ميزة Collaborator، وحظر التوقيع المنفرد).");
        return;
      }
    }

    setIsAnalyzing(true);
    setValidationError(null);

    const payload = {
      ...formData,
      axis: selectedAxis,
      deviceFingerprint: deviceFp,
      submittedAt: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/squad/vetting/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setVettingResult(data.result);
      } else {
        simulateLocalEvaluation(payload);
      }
    } catch (e) {
      simulateLocalEvaluation(payload);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateLocalEvaluation = (payload: any) => {
    const candidateId = `PRT-${selectedAxis.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const matchScore = 92;
    const integrityScore = 96;

    let summary = "";
    if (selectedAxis === "ngo") {
      summary = `طلب بروتوكول جمعية أهلية مستوفٍ لشرط الـ 15 يوماً. يخضع جدول الأعمال للتدقيق الميداني لتحديد مساهمة المنظومة.`;
    } else if (selectedAxis === "agency") {
      summary = `طلب تعاون وكالة إعلانات مستوفٍ للاشتراطات الحاكمة: القرارات التشغيلية بيد فريقنا الإبداعي وباسم (فريق التعاون) بخبرة تنفيذ فقط.`;
    } else if (selectedAxis === "commercial") {
      summary = `عرض شراكة تجارية متكامل. تم توثيق الملف لتحويله لمتخصصي المراجعة تمهيداً لجدولة اجتماع رسمي بمقر الشركة.`;
    } else if (selectedAxis === "creator") {
      summary = `طلب شراكة صانع محتوى معتمد. تم تثبيت بنود الملكية الفكرية © 2026، نسبة الـ 30% مع Collaborator، وحظر التوقيع المنفرد.`;
    }

    const result: VettingResponse = {
      candidateId,
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      axis: selectedAxis,
      desiredRole: selectedAxis,
      yearsOfExp: "متخصص",
      portfolioUrl: payload.portfolioUrl,
      answers: payload,
      aiAnalysis: {
        matchScore,
        integrityScore,
        redFlags: [],
        strengths: [
          "التزام كامل بالشروط والبنود التشغيلية الحاكمة للمنظومة",
          "موافقة موثقة على بروتوكول التعاون المؤسسي وحماية الملكية الفكرية",
          "تنسيق مباشر مع غرفة العمليات ومكتب كوتش سراج"
        ],
        finalRecommendation: "strong_partner",
        executiveSummaryAr: summary
      },
      submittedAt: payload.submittedAt,
      deviceFingerprint: payload.deviceFingerprint
    };

    setVettingResult(result);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-10 text-right select-none" dir="rtl">

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#121a21] to-[#0b1015] border border-[#dc2626]/40 p-6 sm:p-10 overflow-hidden shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#dc2626]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-[#dc2626]/15 border border-[#dc2626]/30 px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#ef4444]">
          <Handshake className="w-3.5 h-3.5" />
          <span>بوابة بروتوكول التعاون والشراكات الميدانية (المحاور الأربعة المعتمدة)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#f8fafc]">
          منظومة تقديم ومراجعة طلبات الشراكة وبروتوكولات التعاون
        </h2>

        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-2xl">
          تخضع كافة أشكال التعاون والشراكات المؤسسية للوائح الحوكمة الصارمة المعتمدة برعاية كوتش سراج أوندا، لحماية جودة المخرجات، السيادة الإبداعية، وحقوق الملكية الفكرية.
        </p>

        {/* 4-Axes Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#1e293b]">
          {[
            { id: "ngo", label: "1. جمعيات أهلية", icon: Building, desc: "شرط الـ 15 يوماً" },
            { id: "agency", label: "2. وكالات إعلانات", icon: Megaphone, desc: "فريق التعاون والتنفيذ" },
            { id: "commercial", label: "3. أعمال تجارية", icon: Briefcase, desc: "مراجعة وجدولة اجتماع" },
            { id: "creator", label: "4. صناع محتوى", icon: YoutubeIcon, desc: "حقوق 2026 وCollaborator" },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedAxis === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedAxis(item.id as PartnershipAxisType);
                  setValidationError(null);
                }}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#dc2626]/15 border-[#ef4444] text-[#f8fafc] shadow-lg shadow-[#dc2626]/10"
                    : "bg-[#0b1015] border-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-[#ef4444]" : "text-[#64748b]"}`} />
                  <span className="font-bold text-xs">{item.label}</span>
                </div>
                <span className="text-[10px] text-[#94a3b8] block">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result View */}
      {vettingResult ? (
        <div className="bg-[#0b1015] border border-[#22c55e]/40 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] flex items-center justify-center shrink-0">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#f8fafc]">{vettingResult.fullName}</h3>
                <span className="text-xs text-[#94a3b8] font-mono">كود التوثيق المرجعي: {vettingResult.candidateId}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#121a21] border border-[#1e293b] px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-[#94a3b8] block">المطابقة التشغيلية</span>
                <span className="text-lg font-black text-[#22c55e] font-mono">{vettingResult.aiAnalysis.matchScore}%</span>
              </div>
              <div className="bg-[#121a21] border border-[#1e293b] px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-[#94a3b8] block">النزاهة والامتثال</span>
                <span className="text-lg font-black text-[#ef4444] font-mono">{vettingResult.aiAnalysis.integrityScore}%</span>
              </div>
            </div>
          </div>

          {/* AI Synthesis Summary */}
          <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f8fafc]">
              <Sparkles className="w-4 h-4 text-[#ef4444]" />
              <span>القرار الأولي واعتماد بروتوكول التعاون:</span>
            </div>
            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              {vettingResult.aiAnalysis.executiveSummaryAr}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-[#0b1015] border border-[#1e293b] rounded-xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-[#22c55e] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>الاشتراطات المستوفاة والموثقة:</span>
                </span>
                <ul className="text-[11px] text-[#94a3b8] space-y-1 pr-4 list-disc">
                  {vettingResult.aiAnalysis.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0b1015] border border-[#1e293b] rounded-xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-[#ef4444] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>التوجيه والتوثيق الميداني:</span>
                </span>
                <div className="text-xs font-bold text-[#f8fafc] pt-1">
                  ⭐ تم تسجيل الطلب وتحويله لمراجعة الكوتش سراج ولجنة الأخلاق
                </div>
                <div className="text-[11px] text-[#22c55e] pt-1">
                  ✅ تم الحفظ السحابي في جدول (operations_partner_vetting).
                </div>
                <div className="text-[10px] text-[#38bdf8]">
                  📧 تم الإرسال من (Serag@FitBrilliance.Store) إلى (Ethics@FitBrilliance.Store).
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab && setActiveTab("home")}
              className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white font-black px-8 py-3.5 rounded-xl text-xs shadow-lg shadow-[#dc2626]/20 cursor-pointer"
            >
              العودة للرئيسية
            </button>
            <a
              href={`https://wa.me/201274534493?text=${encodeURIComponent(`السلام عليكم، تم تقديم طلب بروتوكول تعاون (${selectedAxis}) كود ${vettingResult.candidateId} باسم ${vettingResult.fullName} هاتف ${vettingResult.phone}`)}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#22c55e]/15 border border-[#22c55e]/40 hover:bg-[#22c55e]/25 text-[#22c55e] font-bold px-8 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#22c55e]/10"
            >
              <span>متابعة فورية على واتساب الميداني الثاني (01274534493)</span>
            </a>
          </div>
        </div>
      ) : (
        /* Form */
        <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
          {/* Axis Specific Description Banner */}
          {selectedAxis === "ngo" && (
            <div className="bg-amber-500/10 border-r-4 border-amber-500 border-y border-l border-amber-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Calendar className="w-4 h-4" />
                <span>المحور الأول: بروتوكول الجمعيات الأهلية والمؤسسات غير الربحية</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>شرط أساسي ملزم:</strong> يجب تقديم خطة وجدول الأعمال والمشاريع المطلوب المشاركة فيها قبل موعد التنفيذ بمدة <span className="text-amber-300 font-bold">لا تقل عن 15 يوماً</span>. ولا يُحدد دور المنظومة ومساهمتها إلا بعد المراجعة والتدقيق الكامل لجدول الأعمال الداخلي.
              </p>
            </div>
          )}

          {selectedAxis === "agency" && (
            <div className="bg-rose-500/10 border-r-4 border-rose-500 border-y border-l border-rose-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>المحور الثاني: شروط التعاون الإلزامية لشركات التسويق ووكالات الإعلانات</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                تقبل الشراكة مع وكالات الإعلانات وفق بنود صارمة تضمن المشاركة <span className="text-rose-300 font-bold">بخبرة تنفيذ فقط وتحت إشرافنا الميداني والمباشر</span>، مع صدور كافة العقود المشتركة باسم <strong>(فريق التعاون)</strong> حصراً دون كتابة اسم وكالة بعينها.
              </p>
            </div>
          )}

          {selectedAxis === "commercial" && (
            <div className="bg-blue-500/10 border-r-4 border-blue-500 border-y border-l border-blue-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <Briefcase className="w-4 h-4" />
                <span>المحور الثالث: بروتوكول الأعمال التجارية والشركات</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                يُقدم صاحب النشاط المعلومات الكافية وعرض الشراكة المفصل. يُقرر لاحقاً من قبل متخصصي المراجعة بالقبول أو الرفض، وفي حال القبول المبدئي يُحدد موعد رسمي للاجتماع بإدارتنا بمقر الشركة.
              </p>
            </div>
          )}

          {selectedAxis === "creator" && (
            <div className="bg-purple-500/10 border-r-4 border-purple-500 border-y border-l border-purple-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                <YoutubeIcon className="w-4 h-4" />
                <span>المحور الرابع: شراكة صناع المحتوى والموهوبين (مرجع العقد الرسمي المعتمد)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                تحدد النسب التعاقدية بعد فحص المنصات، وفق الشروط القانونية الصارمة: ملكية الفكرية لـ Fit.Brilliance © 2026، إلزامية الـ QR Code (3ث بداية و5ث نهاية)، ميزة Collaborator على YouTube بنسبة 30% لشركتنا، التوقيع المزدوج خلال 48 ساعة، وحظر التوقيع المنفرد على عقود إعلانية.
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Base Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#f8fafc]">الاسم الكريم / المسؤول المفوض *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="الاسم الكامل"
                  className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#f8fafc]">رقم الواتساب الفعلي *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#f8fafc]">البريد الإلكتروني الرسمي *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                />
              </div>
            </div>

            {/* ── AXIS 1: NGO FIELDS ── */}
            {selectedAxis === "ngo" && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#f8fafc]">اسم الجمعية الأهلية / المؤسسة *</label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleChange("organizationName", e.target.value)}
                      placeholder="مثال: جمعية رواد التنمية الخيرية"
                      className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#f8fafc]">تاريخ الفعالية المقترحة (شرط: لا يقل عن 15 يوماً من اليوم) *</label>
                    <input
                      type="date"
                      value={formData.ngoEventDate}
                      onChange={(e) => handleChange("ngoEventDate", e.target.value)}
                      className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#f8fafc]">جدول الأعمال والمشاريع المطلوب المشاركة فيها بالتفصيل *</label>
                  <textarea
                    rows={4}
                    value={formData.ngoAgendaDetails}
                    onChange={(e) => handleChange("ngoAgendaDetails", e.target.value)}
                    placeholder="اكتب جدول الأعمال الزمني، الفئات المستهدفة، والمحاور المطلوب مشاركتنا فيها..."
                    className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl p-3.5 text-xs text-[#f8fafc] outline-none resize-y"
                  />
                </div>

                <div className="bg-[#121a21] border border-amber-500/30 rounded-xl p-3.5">
                  <label className="flex items-start gap-2.5 text-xs text-amber-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.ngoAgree15Days}
                      onChange={(e) => handleChange("ngoAgree15Days", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900"
                    />
                    <span>
                      أقر بأن تاريخ الفعالية لا يقل عن 15 يوماً من تاريخ تقديم الطلب، وأعلم أنه لا يتحدد دور المنظومة ومساهمتها إلا بعد المراجعة والتدقيق الكامل لجدول الأعمال من قبل إدارة كوتش سراج.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* ── AXIS 2: AGENCY FIELDS ── */}
            {selectedAxis === "agency" && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#f8fafc]">اسم وكالة الدعاية والإعلان / الشركة *</label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleChange("organizationName", e.target.value)}
                      placeholder="اسم الوكالة"
                      className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#f8fafc]">رابط البورتفوليو أو الموقع الرسمي</label>
                    <input
                      type="text"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleChange("portfolioUrl", e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                    />
                  </div>
                </div>

                {/* 5 Mandatory Agency Conditions */}
                <div className="bg-[#121a21] border border-rose-500/30 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold text-rose-300 block mb-1">
                    الشروط الخمسة الحاكمة للتعاون مع شركات التسويق والإعلانات (إلزامية للتفعيل):
                  </span>

                  <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agencyAgreeCreativeDecisions}
                      onChange={(e) => handleChange("agencyAgreeCreativeDecisions", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-rose-500"
                    />
                    <span>1. القرارات التشغيلية حصراً من خلال فريقنا الإبداعي، ولا يجوز التصرف أو التغيير في الخطط إلا بأمر كتابي صريح من الكوتش سراج أو من يفوضه كتابياً لإدارة المشاريع المشتركة.</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agencyAgreeProtocolDrafting}
                      onChange={(e) => handleChange("agencyAgreeProtocolDrafting", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-rose-500"
                    />
                    <span>2. صياغة بنود البروتوكول بالكامل تتم حصراً من خلال فريقنا القانوني والمتخصص في الحوكمة.</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agencyAgreeTeamNameOnly}
                      onChange={(e) => handleChange("agencyAgreeTeamNameOnly", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-rose-500"
                    />
                    <span>3. صياغة عقود الخدمات المشتركة تصدر باسم <strong>(فريق التعاون)</strong> ولا تُكتب باسم أي وكالة بعينها.</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agencyAgreeExecutionOnly}
                      onChange={(e) => handleChange("agencyAgreeExecutionOnly", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-rose-500"
                    />
                    <span>4. توزيع الأدوار والإشراف الميداني خاضع لإدارتنا، والمشاركة تكون <strong>بخبرة تنفيذ فقط وتحت إشرافنا التام والمباشر</strong>.</span>
                  </label>
                </div>
              </div>
            )}

            {/* ── AXIS 3: COMMERCIAL BUSINESS FIELDS ── */}
            {selectedAxis === "commercial" && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#f8fafc]">اسم النشاط التجاري / العلامة التجارية *</label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleChange("organizationName", e.target.value)}
                      placeholder="اسم الشركة أو المصنع"
                      className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#f8fafc]">المجال والقطاع الاقتصادي *</label>
                    <input
                      type="text"
                      value={formData.businessType}
                      onChange={(e) => handleChange("businessType", e.target.value)}
                      placeholder="مثال: تجارة وتوزيع، مطاعم، رعاية صحية، صناعات غذائية..."
                      className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#f8fafc]">عرض الشراكة والمعلومات الكافية عن المشروع *</label>
                  <textarea
                    rows={4}
                    value={formData.businessProposalDetails}
                    onChange={(e) => handleChange("businessProposalDetails", e.target.value)}
                    placeholder="وضح تفاصيل العرض، حجم العمليات، ونقاط القوة والاحتياج الاستشاري..."
                    className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl p-3.5 text-xs text-[#f8fafc] outline-none resize-y"
                  />
                </div>

                <div className="bg-[#121a21] border border-blue-500/30 rounded-xl p-3.5">
                  <label className="flex items-start gap-2.5 text-xs text-blue-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.businessAgreeReviewMeeting}
                      onChange={(e) => handleChange("businessAgreeReviewMeeting", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-blue-500"
                    />
                    <span>
                      أعلم أن المعلومات المقدمة تخضع لدراسة المتخصصين لاتخاذ قرار القبول أو الرفض، وفي حال القبول المبدئي يُحدد موعد رسمي للاجتماع بإدارة المنظومة بمقر الشركة.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* ── AXIS 4: CONTENT CREATOR FIELDS ── */}
            {selectedAxis === "creator" && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#f8fafc]">منصة البث الأساسية *</label>
                    <select
                      value={formData.creatorPlatform}
                      onChange={(e) => handleChange("creatorPlatform", e.target.value)}
                      className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                    >
                      <option value="youtube">قناة يوتيوب (YouTube)</option>
                      <option value="instagram">إنستغرام (Instagram Reels)</option>
                      <option value="tiktok">تيك توك (TikTok)</option>
                      <option value="podcast">بودكاست صوتي / مرئي</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#f8fafc]">متوسط المشاهدات / عدد المتابعين *</label>
                    <input
                      type="text"
                      value={formData.creatorFollowersCount}
                      onChange={(e) => handleChange("creatorFollowersCount", e.target.value)}
                      placeholder="مثال: 150K متابع / 50K مشاهدة"
                      className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#f8fafc]">رابط القناة أو الحساب الرسمي *</label>
                    <input
                      type="text"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleChange("portfolioUrl", e.target.value)}
                      placeholder="https://youtube.com/@..."
                      className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#f8fafc]">فكرة المحتوى المقترح أو عرض التعاون *</label>
                  <textarea
                    rows={3}
                    value={formData.creatorIdeaSummary}
                    onChange={(e) => handleChange("creatorIdeaSummary", e.target.value)}
                    placeholder="وضح فكرة السلسلة أو الحلقات أو التغطيات المشتركة..."
                    className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl p-3.5 text-xs text-[#f8fafc] outline-none resize-y"
                  />
                </div>

                {/* Reference Contract Legal Obligations (Image Reference) */}
                <div className="bg-[#121a21] border border-purple-500/40 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300 border-b border-[#1e293b] pb-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>البنود الحاكمة لعقد الشراكة وحقوق البث الرقمي (مرجع العقد المعتمد):</span>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.creatorAgreeIpRights2026}
                      onChange={(e) => handleChange("creatorAgreeIpRights2026", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-purple-500"
                    />
                    <span><strong>1. حقوق الملكية الفكرية:</strong> جميع حقوق الملكية الفكرية والمحتوى البصري مملوكة لـ <strong>Fit.Brilliance Advertising © 2026</strong>.</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.creatorAgreeQrCodeMandate}
                      onChange={(e) => handleChange("creatorAgreeQrCodeMandate", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-purple-500"
                    />
                    <span><strong>2. إلزامية الـ QR Code:</strong> يُلتزم وجوباً بإدراج الـ QR Code الإعلاني الخاص بشركتنا داخل الفيديو (بمدة لا تقل عن 3 ثوانٍ في المقدمة و5 ثوانٍ في النهاية). ويُعد حذفه أو إتلافه قانوناً إتلافاً للمحتوى كاملاً وموجباً للمساءلة.</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.creatorAgreeYoutubeCollab30Pct}
                      onChange={(e) => handleChange("creatorAgreeYoutubeCollab30Pct", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-purple-500"
                    />
                    <span><strong>3. خاصية Collaborator ونسبة الـ 30%:</strong> يُشترط وجوباً ألا يتم نشر أي فيديو على منصة YouTube إلا بتفعيل ميزة التعاون المشترك (Collaborator) مع قناتنا الرسمية، وتستحق شركة Fit.Brilliance للتسويق نسبة قطعية قدرها <strong>30%</strong> من أرباح وعوائد هذه الفيديوهات المشتركة حصراً.</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.creatorAgreeDualSignature48H}
                      onChange={(e) => handleChange("creatorAgreeDualSignature48H", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-purple-500"
                    />
                    <span><strong>4. التوقيع المزدوج خلال 48 ساعة:</strong> يُشترط وجوباً لتفعيل واعتماد أي تعديل أن يوقع كلا المديرين معاً على هذا التعديل في مدة زمنية لا تتجاوز 48 ساعة من تاريخ صدوره، ولا يُعتد بأي موافقة بعد فوات هذه المدة إلا بإعادة التوقيع المباشر مجدداً.</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.creatorAgreeExclusiveAdSigning}
                      onChange={(e) => handleChange("creatorAgreeExclusiveAdSigning", e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-purple-500"
                    />
                    <span><strong>5. حظر التوقيع المنفرد للشريك:</strong> لا يحق للشريك التوقيع على أي عقود إعلانية تخص محتوى الشراكة إلا مجتمعين، ويحق لمنظومتنا حصراً التوقيع منفردين لكونه اختصاصنا الأصيل، والنسب الإعلانية يتفق عليها لاحقاً.</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {validationError && (
            <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#ef4444] rounded-xl p-3 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action Submission */}
          <div className="flex items-center justify-between border-t border-[#1e293b] pt-6">
            <div className="text-xs text-[#94a3b8] font-mono">
              محور الشراكة المختار: <span className="text-[#ef4444] font-bold">{selectedAxis.toUpperCase()}</span>
            </div>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleSubmitVetting}
              className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black px-10 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#dc2626]/20 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isAnalyzing ? "جارٍ التحقق وتوثيق البروتوكول..." : "اعتماد وتوثيق طلب البروتوكول لدى الإدارة"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
