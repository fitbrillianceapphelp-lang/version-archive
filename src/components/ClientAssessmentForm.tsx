import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  DollarSign,
  Target,
  FileText,
  Lock,
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle2,
  Check,
  ShieldAlert,
  Copy,
  ExternalLink,
  RotateCcw,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";
import {
  getDeviceFingerprint,
  checkDeviceSubmissionQuota,
  recordDeviceSubmission,
} from "../lib/deviceFingerprint";

interface ClientAssessmentFormProps {
  setActiveTab: (tab: string, option?: string) => void;
  lang?: Language;
}

interface StepDefinition {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepDefinition[] = [
  {
    id: 1,
    titleAr: "هوية المنشأة",
    titleEn: "Business Identity",
    descAr: "البيانات الأساسية وتصنيف النشاط",
    descEn: "Core entity info & trade sector",
    icon: Building2,
  },
  {
    id: 2,
    titleAr: "التدقيق المالي",
    titleEn: "Fiscal Audit",
    descAr: "أرقام إغلاق السنة المالية السابقة",
    descEn: "Past fiscal year closing figures",
    icon: DollarSign,
  },
  {
    id: 3,
    titleAr: "أهداف الـ 90 يوم",
    titleEn: "90-Day Goals",
    descAr: "عزل الاختناق وتحديد المستهدف",
    descEn: "Bottlenecks & transformation target",
    icon: Target,
  },
  {
    id: 4,
    titleAr: "المفوض والـ NDA",
    titleEn: "Sign-Off & NDA",
    descAr: "بيانات التواصل وقفل السرية",
    descEn: "Authorized officer & NDA pledge",
    icon: FileText,
  },
];

export const ClientAssessmentForm: React.FC<ClientAssessmentFormProps> = ({
  setActiveTab,
  lang = "ar",
}) => {
  const t = getTranslation(lang);
  const isRtl = lang === "ar";

  const [viewMode, setViewMode] = useState<"accordion" | "stepper">("accordion");
  const [openSteps, setOpenSteps] = useState<number[]>([1, 2, 3, 4]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState(false);
  const [assessmentCode, setAssessmentCode] = useState("");
  const [deviceFp, setDeviceFp] = useState<string>("");
  const [quotaLockedMsg, setQuotaLockedMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleStepAccordion = (stepId: number) => {
    setOpenSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const isStepComplete = (stepId: number): boolean => {
    if (stepId === 1) {
      return Boolean(formData.businessName.trim() && formData.businessSector.trim() && formData.cityLocation.trim());
    }
    if (stepId === 2) {
      return Boolean(
        formData.workingCapital.trim() &&
        formData.annualRevenue.trim() &&
        formData.operatingExpensesPercent.trim() &&
        formData.marketingExpensesPercent.trim() &&
        formData.netProfitAfterTax.trim() &&
        formData.taxAmountPaid.trim()
      );
    }
    if (stepId === 3) {
      return Boolean(formData.primaryBottleneck.trim() && formData.ninetyDayGoal.trim());
    }
    if (stepId === 4) {
      return Boolean(
        formData.ownerName.trim() &&
        formData.ownerRole.trim() &&
        formData.phoneWhatsApp.trim() &&
        formData.officialEmail.trim()
      );
    }
    return false;
  };

  const completedStepsCount = [1, 2, 3, 4].filter((s) => isStepComplete(s)).length;

  const yearsOptions = [
    { val: "less-than-1", labelAr: "أقل من سنة (انطلاق جديد)", labelEn: "Under 1 yr (Startup)" },
    { val: "1-3", labelAr: "1 إلى 3 سنوات (مرحلة نمو)", labelEn: "1 - 3 yrs (Growth)" },
    { val: "3-7", labelAr: "3 إلى 7 سنوات (توسع)", labelEn: "3 - 7 yrs (Scaling)" },
    { val: "more-than-7", labelAr: "أكثر من 7 سنوات (كيان راسخ)", labelEn: "7+ yrs (Established)" },
  ];

  const bottleneckPresets = isRtl
    ? [
        "الإعلانات لا تجلب مبيعات كافية (ROAS منخفض)",
        "تكاليف تشغيل وهدر مرتفع في الرواتب والمصروفات",
        "ضعف المتابعة وإغلاق الصفقات مع العملاء",
        "تذبذب في السيولة النقدية ومعدل حرق رأس المال",
        "صعوبة في تسعير الباقات وتآكل الهوامش الربحية",
      ]
    : [
        "Ads do not yield enough sales (Low ROAS)",
        "High OPEX burn rate & overhead leakages",
        "Weak lead follow-up & slow deal closing",
        "Cashflow instability and liquidity friction",
        "Sub-optimal package pricing & eroding margins",
      ];

  const ninetyDayGoalPresets = isRtl
    ? [
        "مضاعفة المبيعات بنسبة 50% وتحقيق ROAS 3.5x فما فوق",
        "إعادة هيكلة التسعير وخفض مصاريف التشغيل بنسبة 20%",
        "بناء ماكينة تسويق رقمية مستقرة مع استرداد التكاليف دفترياً",
        "تأسيس نظام متابعة مبيعات وإغلاق فوري للصفقات",
      ]
    : [
        "Grow revenue by 50% and achieve 3.5x+ ROAS",
        "Restructure pricing, value offers & cut OPEX by 20%",
        "Build repeatable marketing engine with deductible spend",
        "Implement dedicated sales closing & retention systems",
      ];

  useEffect(() => {
    const quotaCheck = checkDeviceSubmissionQuota("client_assessment");
    if (!quotaCheck.allowed && quotaCheck.message) {
      setQuotaLockedMsg(quotaCheck.message);
    }

    getDeviceFingerprint().then((res) => {
      setDeviceFp(res.fingerprintHash);
    });
  }, []);

  const [formData, setFormData] = useState({
    // Step 1: Business Identity
    businessName: "",
    businessSector: "",
    cityLocation: "",
    websiteOrSocial: "",
    yearsInBusiness: "1-3",

    // Step 2: Financial Audit
    workingCapital: "",
    annualRevenue: "",
    operatingExpensesPercent: "",
    marketingExpensesPercent: "",
    netProfitAfterTax: "",
    taxAmountPaid: "",

    // Step 3: Strategic & 90-Day Targets
    primaryBottleneck: "",
    ninetyDayGoal: "",
    allocatedBudget: "",

    // Step 4: Contact & Sign-off
    ownerName: "",
    ownerRole: "",
    phoneWhatsApp: "",
    officialEmail: "",
    ndaAgreement: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError(null);
  };

  const validateStep = (stepNumber: number): boolean => {
    if (stepNumber === 1) {
      if (!formData.businessName.trim() || !formData.businessSector.trim() || !formData.cityLocation.trim()) {
        setValidationError(
          isRtl
            ? "يرجى تعبئة كافة الحقول المطلوبة (*) في هذه المرحلة (اسم المنشأة، المجال، والمقر الجغرافي)."
            : "Please fill in all required fields (*) in this step (Business Name, Industry, and Location)."
        );
        return false;
      }
    } else if (stepNumber === 2) {
      if (
        !formData.workingCapital.trim() ||
        !formData.annualRevenue.trim() ||
        !formData.operatingExpensesPercent.trim() ||
        !formData.marketingExpensesPercent.trim() ||
        !formData.netProfitAfterTax.trim() ||
        !formData.taxAmountPaid.trim()
      ) {
        setValidationError(
          isRtl
            ? "يرجى تعبئة جميع الأرقام المالية المطلوبة (*) لضمان دقة التشخيص وعزل الهدر المالي."
            : "Please fill in all required fiscal audit fields (*) to ensure diagnostic precision."
        );
        return false;
      }
    } else if (stepNumber === 3) {
      if (!formData.primaryBottleneck.trim() || !formData.ninetyDayGoal.trim()) {
        setValidationError(
          isRtl
            ? "يرجى كتابة الاختناق التشغيلي الرئيسي والهدف المطلوب تحقيقه خلال 90 يوماً."
            : "Please define both the primary operational bottleneck and the 90-day core goal."
        );
        return false;
      }
    } else if (stepNumber === 4) {
      if (
        !formData.ownerName.trim() ||
        !formData.ownerRole.trim() ||
        !formData.phoneWhatsApp.trim() ||
        !formData.officialEmail.trim()
      ) {
        setValidationError(
          isRtl
            ? "يرجى كتابة بيانات المفوض للتنسيق (الاسم، الصفة، الهاتف/الواتساب، والبريد)."
            : "Please provide all authorized officer contact details."
        );
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep < currentStep) {
      setValidationError(null);
      setCurrentStep(targetStep);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } else if (targetStep === currentStep + 1) {
      handleNext();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        if (!openSteps.includes(s)) {
          setOpenSteps((prev) => [...prev, s]);
        }
        setCurrentStep(s);
        window.scrollTo({ top: 120, behavior: "smooth" });
        return;
      }
    }

    const quotaCheck = checkDeviceSubmissionQuota("client_assessment");
    if (!quotaCheck.allowed && quotaCheck.message) {
      setQuotaLockedMsg(quotaCheck.message);
      return;
    }

    const generatedCode = `FB-DIAG-${Math.floor(100000 + Math.random() * 900000)}`;
    setAssessmentCode(generatedCode);
    setSubmitted(true);

    recordDeviceSubmission("client_assessment", deviceFp);

    // Prepare WhatsApp Message
    const summary =
      `*📋 استمارة تقييم وتشخيص النشاط التجاري (Fit Brilliance)*%0a` +
      `*كود الملف:* ${generatedCode}%0a` +
      `*كود الأمان الرقمي:* FB-SEC-${deviceFp.substring(0, 16)}%0a%0a` +
      `*🏢 بيانات النشاط:*%0a` +
      `• المنشأة: ${formData.businessName}%0a` +
      `• المجال: ${formData.businessSector}%0a` +
      `• المقر: ${formData.cityLocation}%0a%0a` +
      `*💰 المؤشرات المالية للعام المنصرم:*%0a` +
      `• رأس المال العامل: ${formData.workingCapital}%0a` +
      `• إجمالي الإيراد السنوي: ${formData.annualRevenue}%0a` +
      `• نسبة مصاريف التشغيل: ${formData.operatingExpensesPercent}%%0a` +
      `• نسبة الدعاية والتسويق: ${formData.marketingExpensesPercent}%%0a` +
      `• صافي الأرباح بعد الضرائب: ${formData.netProfitAfterTax}%0a` +
      `• المبلغ الضريبي المسدد: ${formData.taxAmountPaid}%0a%0a` +
      `*🎯 مستهدف خطة الـ 90 يوماً:*%0a` +
      `• الاختناق الرئيسي: ${formData.primaryBottleneck}%0a` +
      `• هدف الـ 90 يوماً: ${formData.ninetyDayGoal}%0a%0a` +
      `*👤 المفوض المسؤول:*%0a` +
      `• الاسم والصفة: ${formData.ownerName} (${formData.ownerRole})%0a` +
      `• هاتف / واتساب: ${formData.phoneWhatsApp}%0a` +
      `• البريد: ${formData.officialEmail}`;

    try {
      const records = JSON.parse(localStorage.getItem("fitbrilliance_assessments") || "[]");
      records.unshift({
        code: generatedCode,
        date: new Date().toISOString(),
        deviceFingerprint: deviceFp,
        ...formData,
      });
      localStorage.setItem("fitbrilliance_assessments", JSON.stringify(records));
    } catch (_) {}

    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handleCopyCode = () => {
    if (!assessmentCode) return;
    navigator.clipboard.writeText(assessmentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const summary =
      `*📋 استمارة تقييم وتشخيص النشاط التجاري (Fit Brilliance)*%0a` +
      `*كود الملف:* ${assessmentCode}%0a` +
      `*المنشأة:* ${formData.businessName}%0a` +
      `*المفوض:* ${formData.ownerName} (${formData.phoneWhatsApp})%0a` +
      `*الهدف 90 يوم:* ${formData.ninetyDayGoal}`;
    const waUrl = `https://wa.me/201274534493?text=${summary}`;
    window.open(waUrl, "_blank");
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setAssessmentCode("");
    setValidationError(null);
  };

  return (
    <div className={`py-12 max-w-4xl mx-auto space-y-8 select-none ${isRtl ? "text-right" : "text-left"}`}>
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e5a93c]/15 text-[#e5a93c] text-xs font-mono font-bold border border-[#e5a93c]/30">
          <ShieldCheck className="w-4 h-4" />
          <span>{isRtl ? "استمارة تشخيص وتأهيل المنشآت الحصرية" : "Exclusive Enterprise Diagnostic Intake"}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#f5f7f8] tracking-tight">
          {isRtl ? "تشخيص النشاط وعزل الهدر المالي" : "Business Diagnostic & Waste Elimination"}
        </h1>

        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          {isRtl
            ? "المدخل الرسمي والوحيد للانضمام لمنظومة Fit Brilliance. تفاصيل خطط الـ 90 يوماً تُصمم خصيصاً بعد مراجعة الأرقام التشغيلية والمالية المغلقة للعام المنصرم."
            : "The official gateway to Fit Brilliance. 90-Day transformation architectures are formulated exclusively upon audited operational & fiscal diagnostics."}
        </p>

        {/* Confidentiality Seal */}
        <div className="inline-flex items-center gap-2 bg-[#090d0e] border border-[#202d38] px-3.5 py-1.5 rounded-xl text-[11px] font-mono text-red-400">
          <Lock className="w-3.5 h-3.5 text-red-500" />
          <span>{isRtl ? "مشفر وسري بالكامل بموجب اتفاقية NDA غير قابلة للإفشاء" : "Strictly Confidential & Protected under NDA"}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          /* ==================================================================
             SUCCESS OVERLAY (MOTION EXIT ANIMATION & RICH ACTIONS)
             ================================================================== */
          <motion.div
            key="success-overlay"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-br from-[#0e1620] via-[#0b1016] to-[#070b0f] border-2 border-red-500/50 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden"
          >
            {/* Subtle radial glow backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Animated Vector Success Checkmark */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600/25 to-red-950/40 border-2 border-red-500/80 shadow-[0_0_35px_rgba(220,38,38,0.55)] flex items-center justify-center"
              >
                <motion.svg
                  className="w-12 h-12 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: "easeInOut" }}
                  />
                </motion.svg>
              </motion.div>
            </div>

            <div className="space-y-3 relative z-10">
              <span className="inline-block px-3.5 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-mono font-bold border border-red-500/30">
                {isRtl ? "تم التشفير والاعتماد بنجاح" : "Encrypted & Certified Intake"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#f8fafc]">
                {isRtl ? "تم استلام ملف التشخيص الاستراتيجي بنجاح!" : "Assessment Dossier Received Successfully!"}
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
                {isRtl
                  ? `شكراً لثقتكم أستاذ / ${formData.ownerName || "العميل الكريم"}. تم توليد كود التشخيص الخاص بمنشأة (${formData.businessName || "المنشأة"}) وإدراجه في قائمة الفحص والتحليل لدى كوتش سراج.`
                  : `Thank you for your trust, ${formData.ownerName || "Partner"}. Your strategic diagnostic code for ${formData.businessName || "your enterprise"} is generated and queued for executive review.`}
              </p>
            </div>

            {/* Code Box with Copy Button */}
            <div className="bg-[#06090e] border-2 border-[#e5a93c]/50 rounded-2xl p-5 max-w-md mx-auto space-y-2 relative shadow-lg">
              <span className="text-[11px] font-mono text-[#94a3b8] block">
                {isRtl ? "كود التتبع والملف السري الخاص بك:" : "Your Confidential Dossier Code:"}
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-black text-[#e5a93c] font-mono tracking-widest">
                  {assessmentCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2 rounded-xl bg-[#121a21] hover:bg-[#1c2833] text-[#f8fafc] border border-[#202d38] transition-colors cursor-pointer"
                  title={isRtl ? "نسخ الكود" : "Copy Code"}
                >
                  {copiedCode ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#94a3b8]" />
                  )}
                </button>
              </div>
              {copiedCode && (
                <span className="text-[10px] text-emerald-400 font-bold block animate-fade-in">
                  {isRtl ? "تم نسخ الكود للحافظة ✓" : "Code copied to clipboard ✓"}
                </span>
              )}
            </div>

            {/* Summary Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs text-left rtl:text-right font-mono">
              <div className="bg-[#080d12] border border-[#1e293b] p-3.5 rounded-xl">
                <span className="text-[#64748b] block text-[10px]">{isRtl ? "المنشأة:" : "Entity:"}</span>
                <span className="text-[#f8fafc] font-bold truncate block">{formData.businessName || "غير محدد"}</span>
              </div>
              <div className="bg-[#080d12] border border-[#1e293b] p-3.5 rounded-xl">
                <span className="text-[#64748b] block text-[10px]">{isRtl ? "المجال:" : "Sector:"}</span>
                <span className="text-[#f8fafc] font-bold truncate block">{formData.businessSector || "عام"}</span>
              </div>
              <div className="bg-[#080d12] border border-[#1e293b] p-3.5 rounded-xl">
                <span className="text-[#64748b] block text-[10px]">{isRtl ? "المفوض المسؤول:" : "Officer:"}</span>
                <span className="text-[#f8fafc] font-bold truncate block">{formData.ownerName || "المسؤول"}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{isRtl ? "متابعة الملف فوراً عبر واتساب كوتش سراج ←" : "Follow Up via Official WhatsApp →"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("home")}
                className="w-full sm:w-auto bg-[#16202a] hover:bg-[#1f2d3a] text-[#f8fafc] font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm border border-[#263747] transition-all cursor-pointer"
              >
                {isRtl ? "العودة للصفحة الرئيسية" : "Return to Home"}
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto bg-[#0a0f15] hover:bg-[#121a22] text-[#94a3b8] hover:text-[#f8fafc] font-bold px-4 py-3.5 rounded-xl text-xs border border-[#1e293b] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRtl ? "إرسال ملف آخر" : "Submit Another"}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* ==================================================================
             MULTI-STEP PROGRESS STEPPER & FORM WIZARD
             ================================================================== */
          <motion.div
            key="assessment-form-container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            {/* View Mode Switcher & Accordion Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0b1016]/95 border border-[#1e293b] p-3 sm:p-4 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setViewMode("accordion")}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    viewMode === "accordion"
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/50"
                      : "bg-[#121a22] text-[#94a3b8] hover:text-[#f8fafc] border border-[#202d38]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isRtl ? "أكورديون تفاعلي (Accordion)" : "Accordion Mode"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("stepper")}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    viewMode === "stepper"
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/50"
                      : "bg-[#121a22] text-[#94a3b8] hover:text-[#f8fafc] border border-[#202d38]"
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{isRtl ? "خطوات متتالية (Stepper)" : "Stepper Mode"}</span>
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs font-mono">
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {completedStepsCount} / {STEPS.length} {isRtl ? "مراحل مكتملة" : "Completed"}
                  </span>
                </span>

                {viewMode === "accordion" && (
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSteps(openSteps.length === STEPS.length ? [] : [1, 2, 3, 4])
                    }
                    className="text-[#94a3b8] hover:text-red-400 text-[11px] underline transition-colors cursor-pointer"
                  >
                    {openSteps.length === STEPS.length
                      ? (isRtl ? "طي جميع الأقسام" : "Collapse All")
                      : (isRtl ? "فتح جميع الأقسام" : "Expand All")}
                  </button>
                )}
              </div>
            </div>

            {/* Visual Progress Stepper (Shown in Stepper mode) */}
            {viewMode === "stepper" && (
              <div className="bg-[#0b1016]/95 border border-[#1e293b] rounded-3xl p-4 sm:p-6 shadow-xl animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                  {STEPS.map((step) => {
                    const isCompleted = isStepComplete(step.id);
                    const isActive = step.id === currentStep;
                    const StepIcon = step.icon;

                    return (
                      <button
                        type="button"
                        key={step.id}
                        onClick={() => handleStepClick(step.id)}
                        className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all text-left rtl:text-right cursor-pointer select-none ${
                          isActive
                            ? "bg-gradient-to-br from-[#1a1114] to-[#0f1722] border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.35)] ring-1 ring-red-500/50"
                            : isCompleted
                            ? "bg-[#0c141c] border-emerald-500/40 hover:border-emerald-400 text-emerald-300"
                            : "bg-[#070b0f] border-[#1a2330] text-[#64748b]"
                        }`}
                      >
                        {/* Numbered Pill Badge */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-black shrink-0 transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.7)] ring-2 ring-red-400/60"
                              : isCompleted
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                              : "bg-[#121a22] text-[#64748b] border border-[#1e293b]"
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                        </div>

                        {/* Text details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <StepIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-red-400" : isCompleted ? "text-emerald-400" : "text-[#64748b]"}`} />
                            <span
                              className={`text-xs font-black truncate block ${
                                isActive ? "text-[#f8fafc]" : isCompleted ? "text-[#e2e8f0]" : "text-[#64748b]"
                              }`}
                            >
                              {isRtl ? step.titleAr : step.titleEn}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#64748b] truncate block mt-0.5">
                            {isRtl ? step.descAr : step.descEn}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Progress Bar Line */}
                <div className="mt-4 pt-3 border-t border-[#1a2330] flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
                  <span>
                    {isRtl ? `المرحلة ${currentStep} من ${STEPS.length}` : `Step ${currentStep} of ${STEPS.length}`}
                  </span>
                  <span className="text-red-400 font-bold">
                    {Math.round((completedStepsCount / STEPS.length) * 100)}% {isRtl ? "مكتمل" : "Complete"}
                  </span>
                </div>
                <div className="w-full bg-[#121a22] h-1.5 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-red-600 via-rose-500 to-red-400 h-full rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    initial={{ width: "25%" }}
                    animate={{ width: `${(completedStepsCount / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Validation Error Banner */}
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-950/30 border border-rose-500/50 p-4 rounded-2xl flex items-start gap-3 text-rose-300 text-xs shadow-lg"
              >
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <p className="leading-relaxed font-bold">{validationError}</p>
              </motion.div>
            )}

            {/* Quota Lock Alert */}
            {quotaLockedMsg && (
              <div className="bg-rose-500/10 border-2 border-rose-500/40 p-4 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <p className="leading-relaxed font-bold">{quotaLockedMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* =========================================================
                  ACCORDION VIEW (Default Interactive Presentation)
                  ========================================================= */}
              {viewMode === "accordion" ? (
                <div className="space-y-4">
                  {STEPS.map((step) => {
                    const isOpen = openSteps.includes(step.id);
                    const isComplete = isStepComplete(step.id);
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.id}
                        className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                          isOpen
                            ? "bg-[#0d141d]/95 border-red-500/60 shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
                            : isComplete
                            ? "bg-[#090e14]/90 border-emerald-500/40 hover:border-emerald-400"
                            : "bg-[#090d0e]/90 border-[#1e293b] hover:border-[#334155]"
                        }`}
                      >
                        {/* Step Accordion Header */}
                        <button
                          type="button"
                          onClick={() => toggleStepAccordion(step.id)}
                          className={`w-full p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer text-left rtl:text-right transition-colors ${
                            isOpen ? "bg-red-950/15" : "hover:bg-[#121a22]/70"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Number / Status Badge */}
                            <div
                              className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-mono font-black shrink-0 transition-all ${
                                isComplete
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                  : isOpen
                                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                  : "bg-[#141d27] text-[#64748b] border border-[#223041]"
                              }`}
                            >
                              {isComplete ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-black text-[#f8fafc] flex items-center gap-1.5">
                                  <StepIcon className={`w-4 h-4 ${isOpen ? "text-red-400" : isComplete ? "text-emerald-400" : "text-[#64748b]"}`} />
                                  <span>{isRtl ? step.titleAr : step.titleEn}</span>
                                </span>

                                <span
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                    isComplete
                                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold"
                                      : "bg-[#141d27] text-[#94a3b8] border-[#223041]"
                                  }`}
                                >
                                  {isComplete ? (isRtl ? "مكتمل ✓" : "Complete ✓") : (isRtl ? "قيد الإدخال" : "In Progress")}
                                </span>
                              </div>

                              <span className="text-[11px] text-[#94a3b8] truncate block mt-0.5">
                                {isRtl ? step.descAr : step.descEn}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                                isOpen ? "rotate-180 bg-red-600/15 text-red-400" : "bg-[#141d27] text-[#64748b]"
                              }`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </button>

                        {/* Accordion Content Body */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 sm:p-7 pt-2 border-t border-[#1e293b]/70 space-y-6">
                                {step.id === 1 && (
                                  <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block">
                                          {isRtl ? "اسم المنشأة / العلامة التجارية *" : "Business / Brand Name *"}
                                        </label>
                                        <input
                                          type="text"
                                          name="businessName"
                                          required
                                          value={formData.businessName}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: شركة النور للحلول الطبية" : "e.g. Al-Nour Medical"}
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                                        />
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block">
                                          {isRtl ? "مجال وتصنيف النشاط *" : "Industry / Sector *"}
                                        </label>
                                        <input
                                          type="text"
                                          name="businessSector"
                                          required
                                          value={formData.businessSector}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: تجارة جملة، خدمات تدريبية، عيادات..." : "e.g. Retail, Training, Healthcare"}
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                                        />
                                      </div>

                                      <div className="space-y-1.5 sm:col-span-2">
                                        <label className="font-bold text-[#cbd5e1] block">
                                          {isRtl ? "المقر الجغرافي / المدينة *" : "Location / City *"}
                                        </label>
                                        <input
                                          type="text"
                                          name="cityLocation"
                                          required
                                          value={formData.cityLocation}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: الإسكندرية / القاهرة / دبي" : "e.g. Alexandria / Cairo / Dubai"}
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                                        />
                                      </div>
                                    </div>

                                    {/* Years in Business (Interactive Choice Cards) */}
                                    <div className="space-y-2">
                                      <label className="font-bold text-[#cbd5e1] text-xs block">
                                        {isRtl ? "عمر النشاط بالسوق (خيارات تفاعلية):" : "Years in Business (Interactive Choices):"}
                                      </label>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {yearsOptions.map((opt) => {
                                          const isChosen = formData.yearsInBusiness === opt.val;
                                          return (
                                            <button
                                              type="button"
                                              key={opt.val}
                                              onClick={() => setFormData((prev) => ({ ...prev, yearsInBusiness: opt.val }))}
                                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                                isChosen
                                                  ? "bg-red-600/15 border-red-500 text-red-300 ring-1 ring-red-500/50 shadow-sm"
                                                  : "bg-[#090d0e] border-[#202d38] text-[#94a3b8] hover:border-[#38495c]"
                                              }`}
                                            >
                                              <span className="text-xs font-bold block">{isRtl ? opt.labelAr : opt.labelEn}</span>
                                              {isChosen && <span className="text-[10px] text-red-400 font-mono mt-1 block">محدد ✓</span>}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="font-bold text-[#cbd5e1] text-xs block">
                                        {isRtl ? "الموقع الإلكتروني أو صفحة العمل الرئيسية (اختياري)" : "Website or Primary Social Page (Optional)"}
                                      </label>
                                      <input
                                        type="text"
                                        name="websiteOrSocial"
                                        value={formData.websiteOrSocial}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono text-xs"
                                      />
                                    </div>
                                  </div>
                                )}

                                {step.id === 2 && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block">
                                          {isRtl ? "رأس المال العامل الإجمالي (Working Capital) *" : "Total Working Capital *"}
                                        </label>
                                        <input
                                          type="text"
                                          name="workingCapital"
                                          required
                                          value={formData.workingCapital}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: 500,000 ج.م" : "e.g. 500,000 EGP / USD"}
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                                        />
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block">
                                          {isRtl ? "إجمالي الإيراد السنوي للعام المنصرم *" : "Gross Annual Revenue (Past Year) *"}
                                        </label>
                                        <input
                                          type="text"
                                          name="annualRevenue"
                                          required
                                          value={formData.annualRevenue}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: 2,500,000 ج.م" : "e.g. 2,500,000 EGP / USD"}
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                                        />
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block flex items-center justify-between">
                                          <span>{isRtl ? "نسبة مصاريف التشغيل (OPEX) *" : "Operating Expenses (OPEX) Ratio *"}</span>
                                          <span className="text-[#94a3b8] font-mono text-[10px]">% من الإيراد</span>
                                        </label>
                                        <input
                                          type="text"
                                          name="operatingExpensesPercent"
                                          required
                                          value={formData.operatingExpensesPercent}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: 45%" : "e.g. 45%"}
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                                        />
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block flex items-center justify-between">
                                          <span>{isRtl ? "نسبة وميزانية التسويق والدعاية *" : "Marketing & Ads Spend Ratio *"}</span>
                                          <span className="text-[#94a3b8] font-mono text-[10px]">% من الإيراد</span>
                                        </label>
                                        <input
                                          type="text"
                                          name="marketingExpensesPercent"
                                          required
                                          value={formData.marketingExpensesPercent}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: 15% (أو 150 ألف)" : "e.g. 15%"}
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                                        />
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="font-bold text-red-400 block">
                                          {isRtl ? "صافي العائد / الأرباح بعد الضرائب *" : "Net Profit After Taxes *"}
                                        </label>
                                        <input
                                          type="text"
                                          name="netProfitAfterTax"
                                          required
                                          value={formData.netProfitAfterTax}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: 400,000 ج.م صافي" : "e.g. 400,000 Net"}
                                          className="w-full bg-[#090d0e] border border-red-500/40 rounded-xl px-3.5 py-2.5 text-red-400 font-bold outline-none focus:border-red-500 transition-all font-mono"
                                        />
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block">
                                          {isRtl ? "المبلغ الضريبي المسدد للعام المنصرم *" : "Tax Amount Paid (Past Fiscal Year) *"}
                                        </label>
                                        <input
                                          type="text"
                                          name="taxAmountPaid"
                                          required
                                          value={formData.taxAmountPaid}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: 95,000 ج.م" : "e.g. 95,000 EGP"}
                                          className="w-full bg-[#090d0e] border border-red-500/40 rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-red-500 transition-all font-mono"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {step.id === 3 && (
                                  <div className="space-y-5 text-xs">
                                    <div className="space-y-2">
                                      <label className="font-bold text-[#cbd5e1] block">
                                        {isRtl ? "أكبر اختناق أو عائق تشغيلي تواجهه حالياً *" : "Primary Operational Bottleneck *"}
                                      </label>

                                      {/* Quick Preset Choice Pills */}
                                      <div className="space-y-1">
                                        <span className="text-[10px] text-[#94a3b8] block">
                                          {isRtl ? "خيارات سريعة للاختناقات الشائعة (اضغط للإدراج الفوري):" : "Quick Bottleneck Presets (Click to insert):"}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                          {bottleneckPresets.map((preset, idx) => (
                                            <button
                                              type="button"
                                              key={idx}
                                              onClick={() => setFormData((prev) => ({ ...prev, primaryBottleneck: preset }))}
                                              className="text-[11px] bg-[#090d0e] hover:bg-red-950/30 text-[#cbd5e1] hover:text-red-300 border border-[#202d38] hover:border-red-500/40 px-2.5 py-1 rounded-lg transition-all cursor-pointer text-left rtl:text-right"
                                            >
                                              + {preset}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <textarea
                                        name="primaryBottleneck"
                                        required
                                        rows={3}
                                        value={formData.primaryBottleneck}
                                        onChange={handleChange}
                                        placeholder={isRtl ? "اكتب تفاصيل الاختناق التشغيلي أو اختر من القائمة أعلاه..." : "Describe the main operational/sales bottleneck..."}
                                        className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl p-3.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all resize-none mt-2"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="font-bold text-[#cbd5e1] block">
                                        {isRtl ? "الهدف العام المطلوب تحقيقه خلال 90 يوماً *" : "Core 90-Day Goal *"}
                                      </label>

                                      {/* Quick Goal Presets */}
                                      <div className="space-y-1">
                                        <span className="text-[10px] text-[#94a3b8] block">
                                          {isRtl ? "خيارات سريعة للمستهدفات (اضغط للإدراج الفوري):" : "Quick Goal Presets (Click to insert):"}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                          {ninetyDayGoalPresets.map((goal, idx) => (
                                            <button
                                              type="button"
                                              key={idx}
                                              onClick={() => setFormData((prev) => ({ ...prev, ninetyDayGoal: goal }))}
                                              className="text-[11px] bg-[#090d0e] hover:bg-emerald-950/30 text-[#cbd5e1] hover:text-emerald-300 border border-[#202d38] hover:border-emerald-500/40 px-2.5 py-1 rounded-lg transition-all cursor-pointer text-left rtl:text-right"
                                            >
                                              + {goal}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <textarea
                                        name="ninetyDayGoal"
                                        required
                                        rows={3}
                                        value={formData.ninetyDayGoal}
                                        onChange={handleChange}
                                        placeholder={isRtl ? "المستهدف الاستراتيجي أو اختر من الخيارات أعلاه..." : "Specific operational/financial goals for the next 90 days..."}
                                        className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl p-3.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all resize-none mt-2"
                                      />
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="font-bold text-[#cbd5e1] block">
                                        {isRtl ? "الميزانية الاستثمارية المرصودة لمنظومة التحول (90 يوماً)" : "Allocated Investment Budget for Transformation"}
                                      </label>
                                      <input
                                        type="text"
                                        name="allocatedBudget"
                                        value={formData.allocatedBudget}
                                        onChange={handleChange}
                                        placeholder={isRtl ? "مثال: 30,000 - 60,000 ج.م" : "e.g. $1,000 - $3,000"}
                                        className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                                      />
                                    </div>
                                  </div>
                                )}

                                {step.id === 4 && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block">
                                          {isRtl ? "اسم صاحب النشاط / المفوض *" : "Owner / Executive Name *"}
                                        </label>
                                        <input
                                          type="text"
                                          name="ownerName"
                                          required
                                          value={formData.ownerName}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "الاسم الثلاثي" : "Full Name"}
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                                        />
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block">
                                          {isRtl ? "الصفة والمسمى الوظيفي *" : "Role / Title *"}
                                        </label>
                                        <input
                                          type="text"
                                          name="ownerRole"
                                          required
                                          value={formData.ownerRole}
                                          onChange={handleChange}
                                          placeholder={isRtl ? "مثال: المالك، الشريك المدير، CEO" : "e.g. Owner, Managing Director, CEO"}
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                                        />
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="font-bold text-red-400 block">
                                          {isRtl ? "رقم الهاتف / الواتساب المباشر *" : "Direct Phone / WhatsApp *"}
                                        </label>
                                        <input
                                          type="tel"
                                          name="phoneWhatsApp"
                                          required
                                          value={formData.phoneWhatsApp}
                                          onChange={handleChange}
                                          placeholder="01xxxxxxxxx"
                                          className="w-full bg-[#090d0e] border border-red-500/40 rounded-xl px-3.5 py-2.5 text-red-400 font-bold outline-none focus:border-red-500 transition-all font-mono"
                                        />
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="font-bold text-[#cbd5e1] block">
                                          {isRtl ? "البريد الإلكتروني الرسمي *" : "Official Email *"}
                                        </label>
                                        <input
                                          type="email"
                                          name="officialEmail"
                                          required
                                          value={formData.officialEmail}
                                          onChange={handleChange}
                                          placeholder="name@business.com"
                                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-red-500 transition-all font-mono"
                                        />
                                      </div>
                                    </div>

                                    <div className="pt-2 flex items-start gap-3 bg-[#090d0e] border border-[#202d38] p-3.5 rounded-2xl text-[11px] text-[#cbd5e1]">
                                      <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                      <p className="leading-relaxed">
                                        {isRtl
                                          ? "إقرار بالسرية والحماية: جميع البيانات المالية والتشغيلية المذكورة أعلاه سرية للغاية وتستخدم حصرياً من قبل كوتش سراج لتحليل النشاط وإعداد خطة الـ 90 يوماً المخصصة، ولا يتم مشاركتها مع أي طرف ثالث تحت أي ظرف."
                                          : "Confidentiality Undertaking: All fiscal and operational diagnostics are strictly confidential, handled exclusively by Coach Serag, and protected under Non-Disclosure safeguards."}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  {/* Unified Accordion Submit Bar */}
                  <div className="bg-[#0b1016]/95 border border-[#1e293b] rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-right rtl:sm:text-right">
                      <span className="text-xs font-black text-[#f8fafc] block">
                        {isRtl ? "جاهزية ملف التشخيص الاستراتيجي:" : "Assessment Dossier Readiness:"}
                      </span>
                      <span className="text-[11px] font-mono text-[#94a3b8] block">
                        {completedStepsCount === 4
                          ? (isRtl ? "كافة المراحل الـ 4 مكتملة وجاهزة للتشفير والإرسال ✓" : "All 4 steps complete & ready for encrypted submission ✓")
                          : (isRtl ? `تم إكمال ${completedStepsCount} من 4 مراحل. يرجى ملء الحقول الإلزامية (*)` : `${completedStepsCount} of 4 steps complete. Please fill required fields (*)`)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={Boolean(quotaLockedMsg)}
                      className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                        quotaLockedMsg
                          ? "bg-[#202d38] text-[#64748b] cursor-not-allowed border border-[#334155]"
                          : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-950/60 hover:scale-[1.01] active:scale-[0.99] border border-red-500/50"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>{isRtl ? "إرسال ملف التشخيص وحجز موعد خطة الـ 90 يوماً" : "Submit Diagnostic Intake"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* =========================================================
                    STEPPER WIZARD VIEW (Step-by-Step)
                    ========================================================= */
                <div className="space-y-8">
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#121a21]/90 border border-[#202d38] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
                    >
                      <div className="flex items-center gap-3 border-b border-[#202d38] pb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#e5a93c]/15 text-[#e5a93c] flex items-center justify-center font-bold">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-[#f5f7f8]">
                            {isRtl ? "1. ملف وهوية المنشأة" : "1. Enterprise Profile & Industry"}
                          </h3>
                          <p className="text-xs text-[#94a3b8]">
                            {isRtl ? "البيانات الأساسية للكيان التجاري والنشاط" : "Core entity information and trade sector"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "اسم المنشأة / العلامة التجارية *" : "Business / Brand Name *"}
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            required
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: شركة النور للحلول الطبية" : "e.g. Al-Nour Medical"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "مجال وتصنيف النشاط *" : "Industry / Sector *"}
                          </label>
                          <input
                            type="text"
                            name="businessSector"
                            required
                            value={formData.businessSector}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: تجارة جملة، خدمات تدريبية، عيادات..." : "e.g. Retail, Training, Healthcare"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "المقر الجغرافي / المدينة *" : "Location / City *"}
                          </label>
                          <input
                            type="text"
                            name="cityLocation"
                            required
                            value={formData.cityLocation}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: الإسكندرية / القاهرة / دبي" : "e.g. Alexandria / Cairo / Dubai"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                          />
                        </div>
                      </div>

                      {/* Years in business choice cards */}
                      <div className="space-y-2 text-xs">
                        <label className="font-bold text-[#cbd5e1] block">
                          {isRtl ? "عمر النشاط بالسوق:" : "Years in Business:"}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {yearsOptions.map((opt) => {
                            const isChosen = formData.yearsInBusiness === opt.val;
                            return (
                              <button
                                type="button"
                                key={opt.val}
                                onClick={() => setFormData((prev) => ({ ...prev, yearsInBusiness: opt.val }))}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                  isChosen
                                    ? "bg-red-600/15 border-red-500 text-red-300 ring-1 ring-red-500/50"
                                    : "bg-[#090d0e] border-[#202d38] text-[#94a3b8] hover:border-[#38495c]"
                                }`}
                              >
                                <span className="text-xs font-bold block">{isRtl ? opt.labelAr : opt.labelEn}</span>
                                {isChosen && <span className="text-[10px] text-red-400 font-mono mt-0.5 block">محدد ✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="font-bold text-[#cbd5e1] block">
                          {isRtl ? "الموقع الإلكتروني أو صفحة العمل الرئيسية" : "Website or Primary Social Page"}
                        </label>
                        <input
                          type="text"
                          name="websiteOrSocial"
                          value={formData.websiteOrSocial}
                          onChange={handleChange}
                          placeholder="https://..."
                          className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#121a21]/90 border border-[#e5a93c]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3 border-b border-[#202d38] pb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#e5a93c]/20 text-[#e5a93c] flex items-center justify-center font-bold">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-[#f5f7f8] flex items-center gap-2">
                            <span>{isRtl ? "2. الميزانية والختام المالي للعام المنصرم" : "2. Past Fiscal Year Financial Audit"}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#e5a93c]/20 text-[#e5a93c] text-[10px] font-mono">حرج للتحليل</span>
                          </h3>
                          <p className="text-xs text-[#94a3b8]">
                            {isRtl ? "أرقام إغلاق السنة المالية لتحديد معدل الحرق والهدر وهوامش الربح الحقيقية" : "Fiscal year-end closing figures to diagnose cash burn, margins & tax ratio"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "رأس المال العامل الإجمالي (Working Capital) *" : "Total Working Capital *"}
                          </label>
                          <input
                            type="text"
                            name="workingCapital"
                            required
                            value={formData.workingCapital}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: 500,000 ج.م" : "e.g. 500,000 EGP / USD"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "إجمالي الإيراد السنوي للعام المنصرم *" : "Gross Annual Revenue (Past Year) *"}
                          </label>
                          <input
                            type="text"
                            name="annualRevenue"
                            required
                            value={formData.annualRevenue}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: 2,500,000 ج.م" : "e.g. 2,500,000 EGP / USD"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block flex items-center justify-between">
                            <span>{isRtl ? "نسبة مصاريف التشغيل (OPEX) *" : "Operating Expenses (OPEX) Ratio *"}</span>
                            <span className="text-[#94a3b8] font-mono text-[10px]">% من الإيراد</span>
                          </label>
                          <input
                            type="text"
                            name="operatingExpensesPercent"
                            required
                            value={formData.operatingExpensesPercent}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: 45%" : "e.g. 45%"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block flex items-center justify-between">
                            <span>{isRtl ? "نسبة وميزانية التسويق والدعاية *" : "Marketing & Ads Spend Ratio *"}</span>
                            <span className="text-[#94a3b8] font-mono text-[10px]">% من الإيراد</span>
                          </label>
                          <input
                            type="text"
                            name="marketingExpensesPercent"
                            required
                            value={formData.marketingExpensesPercent}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: 15% (أو 150 ألف)" : "e.g. 15%"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-red-400 block">
                            {isRtl ? "صافي العائد / الأرباح بعد الضرائب *" : "Net Profit After Taxes *"}
                          </label>
                          <input
                            type="text"
                            name="netProfitAfterTax"
                            required
                            value={formData.netProfitAfterTax}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: 400,000 ج.م صافي" : "e.g. 400,000 Net"}
                            className="w-full bg-[#090d0e] border border-red-500/40 rounded-xl px-3.5 py-2.5 text-red-400 font-bold outline-none focus:border-red-500 transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "المبلغ الضريبي المسدد للعام المنصرم *" : "Tax Amount Paid (Past Fiscal Year) *"}
                          </label>
                          <input
                            type="text"
                            name="taxAmountPaid"
                            required
                            value={formData.taxAmountPaid}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: 95,000 ج.م" : "e.g. 95,000 EGP"}
                            className="w-full bg-[#090d0e] border border-red-500/40 rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-red-500 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#121a21]/90 border border-[#202d38] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
                    >
                      <div className="flex items-center gap-3 border-b border-[#202d38] pb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-600/15 text-red-400 flex items-center justify-center font-bold">
                          <Target className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-[#f5f7f8]">
                            {isRtl ? "3. الاختناق ومستهدف خطة الـ 90 يوماً" : "3. Primary Bottleneck & 90-Day Goals"}
                          </h3>
                          <p className="text-xs text-[#94a3b8]">
                            {isRtl ? "أين يتسرب المال وما الهدف المطلوب تحقيقه خلال 90 يوماً؟" : "Where is cash leaking and what is the target 90-day outcome?"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "أكبر اختناق أو عائق تشغيلي تواجهه حالياً *" : "Primary Operational Bottleneck *"}
                          </label>

                          {/* Quick Preset Choice Pills */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#94a3b8] block">
                              {isRtl ? "خيارات سريعة للاختناقات الشائعة (اضغط للإدراج):" : "Quick Bottleneck Presets (Click to insert):"}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {bottleneckPresets.map((preset, idx) => (
                                <button
                                  type="button"
                                  key={idx}
                                  onClick={() => setFormData((prev) => ({ ...prev, primaryBottleneck: preset }))}
                                  className="text-[11px] bg-[#090d0e] hover:bg-red-950/30 text-[#cbd5e1] hover:text-red-300 border border-[#202d38] hover:border-red-500/40 px-2.5 py-1 rounded-lg transition-all cursor-pointer text-left rtl:text-right"
                                >
                                  + {preset}
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            name="primaryBottleneck"
                            required
                            rows={3}
                            value={formData.primaryBottleneck}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: الإعلانات لا تجلب مبيعات كافية، ضعف المتابعة وإغلاق الصفقات..." : "Describe the main operational/sales bottleneck..."}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl p-3.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all resize-none mt-2"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "الهدف العام المطلوب تحقيقه خلال 90 يوماً *" : "Core 90-Day Goal *"}
                          </label>

                          {/* Quick Goal Presets */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#94a3b8] block">
                              {isRtl ? "خيارات سريعة للمستهدفات (اضغط للإدراج):" : "Quick Goal Presets (Click to insert):"}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {ninetyDayGoalPresets.map((goal, idx) => (
                                <button
                                  type="button"
                                  key={idx}
                                  onClick={() => setFormData((prev) => ({ ...prev, ninetyDayGoal: goal }))}
                                  className="text-[11px] bg-[#090d0e] hover:bg-emerald-950/30 text-[#cbd5e1] hover:text-emerald-300 border border-[#202d38] hover:border-emerald-500/40 px-2.5 py-1 rounded-lg transition-all cursor-pointer text-left rtl:text-right"
                                >
                                  + {goal}
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            name="ninetyDayGoal"
                            required
                            rows={3}
                            value={formData.ninetyDayGoal}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: مضاعفة المبيعات، تخفيض مصاريف التشغيل بنسبة 25%..." : "Specific operational/financial goals for the next 90 days..."}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl p-3.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all resize-none mt-2"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "الميزانية الاستثمارية المرصودة لمنظومة التحول (90 يوماً)" : "Allocated Investment Budget for Transformation"}
                          </label>
                          <input
                            type="text"
                            name="allocatedBudget"
                            value={formData.allocatedBudget}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: 30,000 - 60,000 ج.م" : "e.g. $1,000 - $3,000"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all font-mono"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#121a21]/90 border border-[#202d38] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
                    >
                      <div className="flex items-center gap-3 border-b border-[#202d38] pb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center font-bold">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-[#f5f7f8]">
                            {isRtl ? "4. بيانات المفوض المسؤول" : "4. Authorized Point of Contact"}
                          </h3>
                          <p className="text-xs text-[#94a3b8]">
                            {isRtl ? "قنوات التواصل المباشرة للتنسيق السري مع كوتش سراج" : "Confidential direct communication channels with Coach Serag"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "اسم صاحب النشاط / المفوض *" : "Owner / Executive Name *"}
                          </label>
                          <input
                            type="text"
                            name="ownerName"
                            required
                            value={formData.ownerName}
                            onChange={handleChange}
                            placeholder={isRtl ? "الاسم الثلاثي" : "Full Name"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "الصفة والمسمى الوظيفي *" : "Role / Title *"}
                          </label>
                          <input
                            type="text"
                            name="ownerRole"
                            required
                            value={formData.ownerRole}
                            onChange={handleChange}
                            placeholder={isRtl ? "مثال: المالك، الشريك المدير، CEO" : "e.g. Owner, Managing Director, CEO"}
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-[#e5a93c] transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-red-400 block">
                            {isRtl ? "رقم الهاتف / الواتساب المباشر *" : "Direct Phone / WhatsApp *"}
                          </label>
                          <input
                            type="tel"
                            name="phoneWhatsApp"
                            required
                            value={formData.phoneWhatsApp}
                            onChange={handleChange}
                            placeholder="01xxxxxxxxx"
                            className="w-full bg-[#090d0e] border border-red-500/40 rounded-xl px-3.5 py-2.5 text-red-400 font-bold outline-none focus:border-red-500 transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-[#cbd5e1] block">
                            {isRtl ? "البريد الإلكتروني الرسمي *" : "Official Email *"}
                          </label>
                          <input
                            type="email"
                            name="officialEmail"
                            required
                            value={formData.officialEmail}
                            onChange={handleChange}
                            placeholder="name@business.com"
                            className="w-full bg-[#090d0e] border border-[#202d38] rounded-xl px-3.5 py-2.5 text-[#f5f7f8] outline-none focus:border-red-500 transition-all font-mono"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-start gap-3 bg-[#090d0e] border border-[#202d38] p-3.5 rounded-2xl text-[11px] text-[#cbd5e1]">
                        <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          {isRtl
                            ? "إقرار بالسرية والحماية: جميع البيانات المالية والتشغيلية المذكورة أعلاه سرية للغاية وتستخدم حصرياً من قبل كوتش سراج لتحليل النشاط وإعداد خطة الـ 90 يوماً المخصصة، ولا يتم مشاركتها مع أي طرف ثالث تحت أي ظرف."
                            : "Confidentiality Undertaking: All fiscal and operational diagnostics are strictly confidential, handled exclusively by Coach Serag, and protected under Non-Disclosure safeguards."}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Wizard Step Navigation Bar */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1e293b]">
                    {/* Previous Button */}
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-[#121a22] hover:bg-[#1a2530] text-[#cbd5e1] border border-[#202d38] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                        <span>{isRtl ? "السابق" : "Previous Step"}</span>
                      </button>
                    ) : (
                      <div className="hidden sm:block" />
                    )}

                    {/* Step indicator counter */}
                    <div className="text-xs font-mono text-[#64748b]">
                      {isRtl ? `خطوة ${currentStep} من ${STEPS.length}` : `Step ${currentStep} of ${STEPS.length}`}
                    </div>

                    {/* Next / Submit Button */}
                    {currentStep < STEPS.length ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{isRtl ? "التالي: المتابعة للمرحلة التالية" : "Next Step"}</span>
                        {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={Boolean(quotaLockedMsg)}
                        className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                          quotaLockedMsg
                            ? "bg-[#202d38] text-[#64748b] cursor-not-allowed border border-[#334155]"
                            : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-950/50 hover:scale-[1.01] active:scale-[0.99] border border-red-500/50"
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span>{isRtl ? "إرسال ملف التشخيص وحجز موعد خطة الـ 90 يوماً" : "Submit Diagnostic Intake"}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
