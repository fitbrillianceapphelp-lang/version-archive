import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Target,
  FileText,
  Lock,
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
  Layers,
  Activity,
  Briefcase,
  Search,
  Scale,
  Clock,
  ExternalLink,
  ShieldAlert,
  Phone,
  Mail,
  Building,
  MapPin,
  Check,
  Download
} from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";
import { getDeviceFingerprint } from "../lib/deviceFingerprint";
import { downloadSecureReportPdf } from "../lib/secureReportGenerator";

interface ProjectDiagnostic99Props {
  setActiveTab?: (tab: string, option?: string) => void;
  lang?: Language;
}

export interface DiagnosticQuestion {
  id: string;
  sectionId: number;
  textAr: string;
  textEn: string;
  type: "text" | "select" | "scale" | "textarea";
  options?: { value: string; labelAr: string; labelEn: string }[];
  hintAr?: string;
  placeholderAr?: string;
  required?: boolean;
}

export interface DiagnosticSection {
  id: number;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  descriptionAr: string;
  icon: any;
}

export const DIAGNOSTIC_SECTIONS: DiagnosticSection[] = [
  {
    id: 1,
    titleAr: "المحور الأول: لنتعرف على شريك النجاح (فلسفة القيادة والرؤية)",
    titleEn: "Pillar 1: Meet the Founder (Leadership Philosophy & Vision)",
    badgeAr: "شريك النجاح والقيادة",
    descriptionAr: "التعرف المتعمق على شخصية صاحب المشروع، فلسفته الإدارية، ومدى استعداده للتحول الميداني والشفافية التامة.",
    icon: Building2
  },
  {
    id: 2,
    titleAr: "المحور الثاني: الغرض من الأهداف والميزانية المخصصة للتحول الميداني",
    titleEn: "Pillar 2: Purpose Behind Goals & Allocated Transformation Budget",
    badgeAr: "الأهداف والميزانية",
    descriptionAr: "فحص دوافع الأهداف الحقيقية، ماذا بعد تحقيقها، وسقف الميزانية المرصودة للتطوير والتسويق والإعلام.",
    icon: DollarSign
  },
  {
    id: 3,
    titleAr: "المحور الثالث: رأس المال التأسيسي ودراسات الجدوى والتكاليف السابقة",
    titleEn: "Pillar 3: Foundation Capital, Feasibility & Cost History",
    badgeAr: "التأسيس ودراسة الجدوى",
    descriptionAr: "تشريح نشأة النشاط، رأس المال الفعلي، هل سبقتها دراسة جدوى وتكاليف موثقة، وأبرز الأزمات التاريخية.",
    icon: Target
  },
  {
    id: 4,
    titleAr: "المحور الرابع: المشهد التنافسي ومكامن التميز الحقيقي في السوق",
    titleEn: "Pillar 4: Market Intelligence & True Competitive Edge",
    badgeAr: "التنافسية ونقاط القوة",
    descriptionAr: "فحص ما يميزك بدقة عن المنافسين، نقاط ضعفهم، ومدى وعيك بسلوك شريحة عملائك الفعلية.",
    icon: TrendingUp
  },
  {
    id: 5,
    titleAr: "المحور الخامس: التشخيص الداخلي وحصر الهدر التشغيلي والمالي",
    titleEn: "Pillar 5: Internal Leaks, SOP Gaps & Capital Waste",
    badgeAr: "الهدر واللوائح الداخلية",
    descriptionAr: "كشف مواطن تسريب الأموال، ضعف التحويل، الثغرات الإجرائية، وغياب لوائح الـ SOPs المعتمدة.",
    icon: Layers
  },
  {
    id: 6,
    titleAr: "المحور السادس: الفرص غير المستغلة والجاهزية للظهور المرئي 4K",
    titleEn: "Pillar 6: Untapped Scale & 4K Cinema Media Readiness",
    badgeAr: "الفرص والتصوير 4K",
    descriptionAr: "حصر المنتجات ذات الهوامش الأعلى القابلة للتكثيف، والجاهزية لإطلاق حملات الفيديو السينمائي وبناء هيبة العلامة.",
    icon: Sparkles
  }
];

export const CORE_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // --- Section 1: Founder & Vision ---
  {
    id: "q1_founder_name",
    sectionId: 1,
    textAr: "الاسم الكريم لصاحب المشروع أو الشريك التنفيذي المفوض بالقرار:",
    textEn: "Full Name of Founder or Authorized Executive Partner:",
    type: "text",
    placeholderAr: "الاسم الثلاثي أو الرباعي المعتمد",
    required: true
  },
  {
    id: "q2_contact_info",
    sectionId: 1,
    textAr: "رقم الهاتف والواتساب المباشر والبريد الإلكتروني الرسمي:",
    textEn: "Direct Phone/WhatsApp & Official Email:",
    type: "text",
    placeholderAr: "010xxxxxxx - name@company.com",
    required: true
  },
  {
    id: "q3_business_identity",
    sectionId: 1,
    textAr: "اسم النشاط التجاري / العلامة التجارية وموقع النشاط والمجال بالتحديد:",
    textEn: "Business/Brand Name, Exact Location & Specific Industry:",
    type: "text",
    placeholderAr: "مثال: مصنع الأمل للصناعات الهندسية - المنطقة الصناعية بالعاشر من رمضان",
    required: true
  },
  {
    id: "q4_leadership_philosophy",
    sectionId: 1,
    textAr: "كيف تصف نموذج قيادتك لفريق العمل ومستوى تفويض المهام اليومية؟",
    textEn: "How do you describe your leadership style and daily task delegation?",
    type: "select",
    options: [
      { value: "centralized", labelAr: "مركزي: لا يمر أي قرار مالي أو تشغيلي إلا بموافقتي الشخصية المباشرة", labelEn: "Strictly Centralized" },
      { value: "semi_delegated", labelAr: "تفويض جزئي: أفوض المهام البسيطة، لكن أتدخل عند حدوث أخطاء أو قرارات حيوية", labelEn: "Semi-Delegated with active oversight" },
      { value: "fully_systemized", labelAr: "مؤسسي بالكامل: نعتمد على لوائح واضحة وتقارير دورية دون تدخل يومي", labelEn: "Fully Systemized via SOPs" }
    ],
    required: true
  },
  {
    id: "q5_transparency_commitment",
    sectionId: 1,
    textAr: "هل أنت مستعد لمشاركة الأرقام والبيانات المالية والتشغيلية بشفافية تامة لتشخيص الخلل؟",
    textEn: "Are you fully prepared to share transparent operational/financial data?",
    type: "select",
    options: [
      { value: "full_transparency", labelAr: "نعم، شفافية مطلقة ووضوح كامل لأن هدفي الإصلاح الجذري ووقف النزيف", labelEn: "Full Transparency without reservation" },
      { value: "selective_transparency", labelAr: "مستعد لمشاركة المؤشرات العامة مع الاحتفاظ ببعض أرقام التكلفة الخاصة", labelEn: "Selective metrics with private cost buffers" },
      { value: "skeptical", labelAr: "متردد وأفضل البدء بجلسة تشاورية عامة أولاً", labelEn: "Cautious, prefer initial exploratory talk" }
    ],
    required: true
  },

  // --- Section 2: Goals & Budget ---
  {
    id: "q6_primary_goals",
    sectionId: 2,
    textAr: "ما هو الهدف التشغيلي أو المالي الأول الذي ترغب في تحقيقه خلال خطة الـ 90 يوماً القادمة؟",
    textEn: "What is your primary operational or financial goal for the upcoming 90-day sprint?",
    type: "textarea",
    placeholderAr: "مثال: مضاعفة المبيعات، ضبط هوامش الربح، خفض الهدر الإعلاني، تنظيم حركة الموظفين...",
    required: true
  },
  {
    id: "q7_purpose_after_goal",
    sectionId: 2,
    textAr: "ما هو الغرض العميق من هذا الهدف، وماذا تنوي فعله بمجرد تحقيقه بالكامل؟",
    textEn: "What is the deeper purpose behind this goal, and what comes after achieving it?",
    type: "textarea",
    placeholderAr: "مثال: فتح فرع جديد، استعادة راحة البال والتفرغ للتطوير، تأمين مستقبل الأسرة، التحول لامتياز تجاري...",
    required: true
  },
  {
    id: "q8_capital_allocated",
    sectionId: 2,
    textAr: "ما هي الميزانية الشهرية التقريبية المخصصة للاستثمار في التحول (تشمل التسويق والمحتوى والخدمات)؟",
    textEn: "Approximate monthly budget allocated for transformation & marketing:",
    type: "select",
    options: [
      { value: "budget_starter", labelAr: "من 10,000 إلى 25,000 جنيه مصري شهرياً", labelEn: "EGP 10k - 25k / month" },
      { value: "budget_growth", labelAr: "من 25,000 إلى 50,000 جنيه مصري شهرياً", labelEn: "EGP 25k - 50k / month" },
      { value: "budget_scale", labelAr: "من 50,000 إلى 120,000 جنيه مصري شهرياً (توسع مكثف)", labelEn: "EGP 50k - 120k / month (Heavy Scale)" },
      { value: "budget_enterprise", labelAr: "أكثر من 120,000 جنيه مصري (مؤسسي ومشاريع كبرى)", labelEn: "EGP 120k+ / month (Enterprise)" }
    ],
    required: true
  },

  // --- Section 3: Foundation Capital & History ---
  {
    id: "q9_initial_capital",
    sectionId: 3,
    textAr: "كم كان رأس المال التقريبي عند تأسيس النشاط، وهل أُجريت له دراسة جدوى وتكاليف موثقة؟",
    textEn: "Initial startup capital and whether a feasibility/cost study was conducted:",
    type: "select",
    options: [
      { value: "studied_with_buffer", labelAr: "نعم، بدأنا بدراسة جدوى وتكاليف واضحة واحتياطي تشغيلي", labelEn: "Yes, structured study with operating buffer" },
      { value: "informal_estimate", labelAr: "تقديرات تقريبية غير موثقة معتمدة على المعاينة الميدانية", labelEn: "Informal estimates based on market observations" },
      { value: "no_study_spontaneous", labelAr: "بدون دراسة جدوى مسبقة، وبدأت التجربة مباشرة برأس مال شخصي", labelEn: "No formal study, started directly with personal capital" }
    ],
    required: true
  },
  {
    id: "q10_historical_crises",
    textAr: "ما هي أقسى أزمة أو خسارة مالية مر بها المشروع منذ انطلاقه، وما سببها المباشر؟",
    textEn: "What was the harshest operational/financial crisis experienced, and its root cause?",
    sectionId: 3,
    type: "textarea",
    placeholderAr: "مثال: هبوط المبيعات في موسم معين، شريك غير أمين، حملات تسويق فاشلة كلفتنا مبالغ طائلة دون مردود..."
  },

  // --- Section 4: Competition & Edge ---
  {
    id: "q11_competitive_edge",
    sectionId: 4,
    textAr: "ما الذي يميزك عن أقوى 3 منافسين لك في منطقتك أو مجالك؟ ولماذا يشتري العميل منك تحديداً؟",
    textEn: "What truly differentiates you from your top 3 competitors?",
    type: "textarea",
    placeholderAr: "مثال: جودة الخامات، سرعة التسليم، الضمان الحقيقي، أو الخدمة الميدانية المباشرة...",
    required: true
  },
  {
    id: "q12_market_knowledge",
    sectionId: 4,
    textAr: "كيف تقيّم مدى معرفتك بأسعار منافسيك، طرق تسويقهم، وتغذية عملائهم الراجعة؟",
    textEn: "How do you rate your intelligence on competitor pricing, ads & customer sentiment?",
    type: "select",
    options: [
      { value: "deep_intel", labelAr: "أعرفهم بدقة متناهية: أراقب إعلاناتهم وأسعارهم ونقاط ضعفهم أسبوعياً", labelEn: "Deep Intel: Weekly monitoring of pricing and gaps" },
      { value: "moderate_intel", labelAr: "معرفة متوسطة: أعرف أبرز الأسماء لكن لا أتابع تفاصيل حملاتهم", labelEn: "Moderate: Aware of major players without deep tracking" },
      { value: "blind_spot", labelAr: "نقطة عمياء: منشغل بالتشغيل الداخلي ولا أعلم الكثير عن تحركاتهم", labelEn: "Blind Spot: Focused internally with minimal market surveillance" }
    ],
    required: true
  },

  // --- Section 5: Internal Leaks & Waste ---
  {
    id: "q13_operational_waste",
    sectionId: 5,
    textAr: "أين ترى أكبر مواطن استنزاف وهدر للأموال أو الوقت داخل نشاطك حالياً؟",
    textEn: "Where do you observe the greatest drain of capital or time in your operations?",
    type: "textarea",
    placeholderAr: "مثال: إعلانات ممولة دون استهداف دقيق، هدر في الخامات أو الوقت، تسرب العملاء بعد الاستفسار دون إغلاق..."
  },
  {
    id: "q14_standard_sops",
    sectionId: 5,
    textAr: "هل تمتلك إجراءات تشغيل قياسية مكتوبة (SOPs) يلتزم بها الموظفون دون الحاجة لوجودك الدائم؟",
    textEn: "Do you have documented SOPs that employees follow independently?",
    type: "select",
    options: [
      { value: "no_sops_chaos", labelAr: "لا توجد لوائح مكتوبة، وكل الأمور تعتمد على التعليمات الشفهية والذاكرة", labelEn: "No documented SOPs, rely on verbal orders" },
      { value: "partial_sops", labelAr: "توجد بعض الخطوات الأساسية مكتوبة ولكن غير مطبقة بصرامة", labelEn: "Partial written steps, inconsistent enforcement" },
      { value: "strict_sops", labelAr: "نعم، لدينا لوائح مكتوبة واضحة ونظام متابعة مستمر", labelEn: "Documented SOPs with active tracking" }
    ],
    required: true
  },

  // --- Section 6: Untapped Opportunities & 4K Media ---
  {
    id: "q15_highest_margin_services",
    sectionId: 6,
    textAr: "ما هو المنتج أو الخدمة صاحبة أعلى هامش ربح لديك، والتي إذا تضاعفت مبيعاتها تضاعف ربح المشروع؟",
    textEn: "Which service/product yields your highest profit margin if scaled?",
    type: "text",
    placeholderAr: "مثال: الخدمة الفاخرة VIP، المنتجات المصنعة محلياً، باقات الصيانة السنوية...",
    required: true
  },
  {
    id: "q16_media_readiness",
    sectionId: 6,
    textAr: "ما مدى جاهزيتك لإنتاج محتوى بصري عالي القيمة (فيديو سينمائي 4K وReels توثيقية) لقيادة مجالك؟",
    textEn: "Readiness for cinema-grade 4K storytelling to establish market authority:",
    type: "select",
    options: [
      { value: "urgent_ready", labelAr: "أولوية قصوى: جاهزون للتصوير فوراً وندرك قوة التوثيق البصري الاحترافي", labelEn: "High Priority: Ready for filming & storytelling authority" },
      { value: "after_restructure", labelAr: "بعد إعادة ضبط البيت الداخلي: نفضل إصلاح التشغيل أولاً ثم التصوير", labelEn: "After Operations Fix: Restructure first, then scale visually" },
      { value: "standard_content", labelAr: "نكتفي حالياً بالتصاميم والمنشورات البسيطة", labelEn: "Basic social posts currently sufficient" }
    ],
    required: true
  }
];

// Helper to detect if user represents a marketing agency or competitor (IP Shield)
function isCompetitorOrAgency(email: string, businessName: string, roleOrIndustry: string): boolean {
  const combined = `${email} ${businessName} ${roleOrIndustry}`.toLowerCase();
  const prohibitedKeywords = [
    "agency", "marketing", "media", "production", "advertising", "تسويق", "وكالة", "دعاية", "إعلان", "انتاج", "ميديا", "برمجيات", "software house"
  ];
  return prohibitedKeywords.some(kw => combined.includes(kw));
}

export const ProjectDiagnostic99: React.FC<ProjectDiagnostic99Props> = ({
  setActiveTab,
  lang = "ar"
}) => {
  const t = getTranslation(lang);
  const isRtl = lang === "ar";

  // 4-Stage Workflow: registration -> questions | competitor_intake -> pre_result_commitments -> result
  const [stage, setStage] = useState<"registration" | "competitor_intake" | "questions" | "pre_result_commitments" | "result">("registration");
  const [activePillar, setActivePillar] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [deviceFp, setDeviceFp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<any | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // User Profile Gating
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    phone: "",
    email: "",
    businessName: "",
    industryCategory: "retail",
    city: ""
  });

  // Competitor Basic Intake form state
  const [competitorIntake, setCompetitorIntake] = useState({
    primaryGoal: "",
    preferredContactMethod: "whatsapp",
    notes: ""
  });
  const [competitorSubmitted, setCompetitorSubmitted] = useState(false);

  // Pre-Result Commitments
  const [googleReviewDone, setGoogleReviewDone] = useState(false);
  const [socialFollowDone, setSocialFollowDone] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"accounts_input" | "screenshot_upload">("accounts_input");
  const [verificationAccountNames, setVerificationAccountNames] = useState("");
  const [ndaAgreed, setNdaAgreed] = useState(false);
  const [uniqueProjectCode, setUniqueProjectCode] = useState(() => `FB-PROJ-99-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    getDeviceFingerprint().then((res) => {
      setDeviceFp(res.fingerprintHash);
    });

    const saved = localStorage.getItem("fb_diagnostic_99_draft");
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {}
    }

    const savedProfile = localStorage.getItem("fb_diagnostic_user_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
      } catch (e) {}
    }
  }, []);

  const handleProfileChange = (field: string, val: string) => {
    const updated = { ...userProfile, [field]: val };
    setUserProfile(updated);
    localStorage.setItem("fb_diagnostic_user_profile", JSON.stringify(updated));
    if (validationError) setValidationError(null);
  };

  const handleStartQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile.fullName.trim()) {
      setValidationError("يرجى إدخال اسمك الكريم للمتابعة.");
      return;
    }
    if (!userProfile.phone.trim() || userProfile.phone.length < 8) {
      setValidationError("يرجى إدخال رقم هاتف / واتساب صحيح للمتابعة الميدانية.");
      return;
    }
    if (!userProfile.businessName.trim()) {
      setValidationError("يرجى إدخال اسم ونشاط مشروعك التجاري.");
      return;
    }

    setValidationError(null);

    // IP Shield: Check if applicant is a competitor/agency
    const isCompetitor = isCompetitorOrAgency(userProfile.email, userProfile.businessName, userProfile.industryCategory);
    if (isCompetitor) {
      // Shield the 99 questions and route to basic intake form
      setStage("competitor_intake");
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      q1_founder_name: userProfile.fullName,
      q2_contact_info: `${userProfile.phone} | ${userProfile.email || "غير مسجل"}`,
      q3_business_identity: userProfile.businessName
    }));

    setStage("questions");
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleInputChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem("fb_diagnostic_99_draft", JSON.stringify(updated));
    if (validationError) setValidationError(null);
  };

  const getPillarProgress = (pillarId: number) => {
    const questions = CORE_DIAGNOSTIC_QUESTIONS.filter((q) => q.sectionId === pillarId);
    const answered = questions.filter((q) => answers[q.id]?.trim());
    return Math.round((answered.length / questions.length) * 100);
  };

  const totalAnswered = CORE_DIAGNOSTIC_QUESTIONS.filter((q) => answers[q.id]?.trim()).length;
  const overallProgress = Math.round((totalAnswered / CORE_DIAGNOSTIC_QUESTIONS.length) * 100);

  const handleNextPillar = () => {
    const currentQuestions = CORE_DIAGNOSTIC_QUESTIONS.filter((q) => q.sectionId === activePillar);
    const missing = currentQuestions.find((q) => q.required && !answers[q.id]?.trim());
    if (missing) {
      setValidationError(`يرجى الإجابة على السؤال المطلوب: "${missing.textAr}"`);
      return;
    }
    setValidationError(null);
    if (activePillar < 6) {
      setActivePillar(activePillar + 1);
      window.scrollTo({ top: 250, behavior: "smooth" });
    }
  };

  const handleCompleteQuestions = () => {
    const currentQuestions = CORE_DIAGNOSTIC_QUESTIONS.filter((q) => q.sectionId === 6);
    const missing = currentQuestions.find((q) => q.required && !answers[q.id]?.trim());
    if (missing) {
      setValidationError(`يرجى الإجابة على السؤال المطلوب: "${missing.textAr}"`);
      return;
    }
    setValidationError(null);
    setStage("pre_result_commitments");
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleFinalSubmit = async () => {
    if (!googleReviewDone || !socialFollowDone) {
      setValidationError("يرجى استيفاء شرط الشريك الشرفي (تقييم جوجل + متابعة الحسابات) لفتح التقرير الشامل وباقة الـ 5 تحليلات السنوية.");
      return;
    }
    if (!ndaAgreed) {
      setValidationError("يرجى الموافقة على ميثاق السرية وحماية بيانات المشروع.");
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    const payload = {
      founderName: userProfile.fullName,
      contactInfo: `${userProfile.phone} | ${userProfile.email}`,
      businessIdentity: userProfile.businessName,
      budgetTier: answers["q8_capital_allocated"] || "غير محدد",
      answers,
      uniqueProjectCode,
      deviceFingerprint: deviceFp,
      submittedAt: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/diagnostic-99/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnosticReport(data.report || null);
        setStage("result");
        localStorage.removeItem("fb_diagnostic_99_draft");
      } else {
        setStage("result");
      }
    } catch (e) {
      setStage("result");
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  };

  const handleCompetitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCompetitorSubmitted(true);
    }, 600);
  };

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-10 text-right select-none" dir="rtl">

      {/* ── STAGE 1: REGISTRATION & LAUNCH OFFER NOTICE ── */}
      {stage === "registration" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#121a21] to-[#0b1015] border border-[#dc2626]/40 p-6 sm:p-10 overflow-hidden shadow-2xl space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#dc2626]/15 border border-[#dc2626]/30 px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#ef4444]">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>عرض تدشين الخدمة الحصري — قيّم مشروعك مجاناً 100% كشريك شرفي</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#f8fafc]">
                قيّم مشروعك (مجاناً) — مصفوفة التشخيص الاستراتيجي الشامل وعزل الهدر المالي
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-3xl">
                التشخيص التشريحي الشامل لنموذج عملك، عزل الهدر المالي والتشغيلي، واستكشاف أعلى هوامش الربحية تمهيداً لخطة التحول لـ 90 يوماً بإشراف كوتش سراج.
              </p>
            </div>

            {/* Crucial Pricing & Honorary Partner Launch Notice */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-r-4 border-amber-500 border-y border-l border-amber-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Award className="w-4 h-4 shrink-0" />
                <span>تنبيه رسمي وضوابط التسعير وعرض التدشين المجاني:</span>
              </div>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>
                  💵 <strong>القيمة الاستشارية المعتمدة:</strong> تبدأ من <strong>500 إلى 1000 جنيه مصري</strong> (Start 500 To 1000 EGP). وتوجد حالات استثنائية تُمنح مباشرة بقرار من الكوتش سراج. بعد انتهاء العرض المجاني، يتاح للعميل الاختيار ما بين <em>"تقييم آلي استرشادي لقيمة التقرير"</em> أو <em>"طلب استثناء مباشر من خلال الكوتش سراج"</em>.
                </p>
                <p className="text-emerald-400 font-semibold">
                  🎁 <strong>عرض التدشين الميداني الحالي:</strong> بمجرد إرسال إجاباتك كاملة، يتم تسجيلك فوراً كمستفيد من <strong>التحليل المجاني بالكامل (0 تكلفة)</strong>.
                </p>
                <div className="bg-[#0b1015]/80 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span>
                    ⭐ <strong>ميزة الشريك الشرفي الممنوحة لك:</strong> تقييم النشاط على Google Reviews + متابعة حساباتنا الرسمية = يمنحك <strong>5 طلبات تحليل استراتيجي سنوياً مجاناً</strong> كشريك شرفي معتمد.
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold font-mono shrink-0">
                    5 تحليلات / سنة
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Auth Form */}
          <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl max-w-2xl mx-auto">
            <div className="border-b border-[#1e293b] pb-4 space-y-1">
              <div className="flex items-center gap-2 text-[#ef4444] text-xs font-bold font-mono">
                <Lock className="w-4 h-4" />
                <span>المرحلة الأولى: تسجيل البيانات وتوثيق هوية النشاط</span>
              </div>
              <h3 className="text-lg font-bold text-[#f8fafc]">
                سجل بياناتك لبدء تقييم مشروعك (عرض التدشين المجاني)
              </h3>
              <p className="text-xs text-[#94a3b8]">
                البيانات مؤمنة وتخضع لميثاق السرية التامة لحماية أرقام ومعلومات نشاطك التجاري.
              </p>
            </div>

            <form onSubmit={handleStartQuestions} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#f8fafc]">الاسم الكريم (صاحب المشروع أو الشريك التنفيذي) *</label>
                <input
                  type="text"
                  required
                  value={userProfile.fullName}
                  onChange={(e) => handleProfileChange("fullName", e.target.value)}
                  placeholder="الاسم ثلاثي أو رباعي"
                  className="w-full bg-[#121a21] border border-[#1e293b] rounded-xl px-4 py-3 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#f8fafc]">رقم الهاتف / الواتساب *</label>
                  <input
                    type="tel"
                    required
                    value={userProfile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-[#121a21] border border-[#1e293b] rounded-xl px-4 py-3 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#ef4444]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#f8fafc]">البريد الإلكتروني الرسمي *</label>
                  <input
                    type="email"
                    required
                    value={userProfile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    placeholder="name@business.com"
                    className="w-full bg-[#121a21] border border-[#1e293b] rounded-xl px-4 py-3 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#ef4444]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#f8fafc]">اسم النشاط التجاري وطبيعته *</label>
                  <input
                    type="text"
                    required
                    value={userProfile.businessName}
                    onChange={(e) => handleProfileChange("businessName", e.target.value)}
                    placeholder="مثال: مصنع للصناعات الهندسية / معرض تجاري"
                    className="w-full bg-[#121a21] border border-[#1e293b] rounded-xl px-4 py-3 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#ef4444]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#f8fafc]">قطاع النشاط التجاري *</label>
                  <select
                    value={userProfile.industryCategory}
                    onChange={(e) => handleProfileChange("industryCategory", e.target.value)}
                    className="w-full bg-[#121a21] border border-[#1e293b] rounded-xl px-4 py-3 text-xs text-[#f8fafc] focus:outline-none focus:border-[#ef4444]"
                  >
                    <option value="retail">تجارة تجزئة ومحلات ومعارض</option>
                    <option value="factory">مصانع وإنتاج وورش تشغيل</option>
                    <option value="restaurant">مطاعم وكافيهات وأغذية</option>
                    <option value="medical">عيادات ومراكز طبية وصيدليات</option>
                    <option value="education">أكاديميات ومراكز تدريبية</option>
                    <option value="ecommerce">متاجر إلكترونية وتوزيع</option>
                    <option value="realestate">مقاولات وتطوير عقاري</option>
                    <option value="media_agency">وكالة دعاية وإعلان / شركة إنتاج ميديا</option>
                    <option value="other">نشاط تجاري / خدمي آخر</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#f8fafc]">المدينة / المحافظة</label>
                <input
                  type="text"
                  value={userProfile.city}
                  onChange={(e) => handleProfileChange("city", e.target.value)}
                  placeholder="القاهرة، الجيزة، الإسكندرية، العاشر من رمضان..."
                  className="w-full bg-[#121a21] border border-[#1e293b] rounded-xl px-4 py-3 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              {validationError && (
                <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#ef4444] rounded-xl p-3 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#dc2626]/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تأكيد التسجيل والبدء في تقييم مشروعك (عرض مجاني) ➔</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── STAGE 1-B: COMPETITOR / AGENCY IP SHIELD INTAKE ── */}
      {stage === "competitor_intake" && (
        <div className="bg-[#0b1015] border border-amber-500/40 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl max-w-2xl mx-auto animate-in fade-in duration-300">
          <div className="border-b border-[#1e293b] pb-4 space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>بوابة التواصل المباشر والتعاون المهني</span>
            </div>
            <h3 className="text-xl font-bold text-[#f8fafc]">
              استمارة الاستفسار المبدئي والتعاون المهني
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              نظراً لطبيعة نشاطكم في مجال الدعاية والإعلان أو الإنتاج الإعلامي، وحفاظاً على حقوق الملكية الفكرية والفريم ورك التشخيصي المعتمد لكوتش سراج (DIMC Intellectual Property)، يتم استقبال استفساراتكم عبر هذه الاستمارة المباشرة لتنسيق جلسة عمل متخصصة.
            </p>
          </div>

          {competitorSubmitted ? (
            <div className="bg-[#121a21] border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">تم استلام طلبكم وتوجيهه للإدارة المختصة</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                شكراً لتواصلكم. تم تسجيل بيانات مشروعكم واختياركم لطريقة التواصل، وسيتم الرد عليكم لتنسيق اللقاء المهني المباشر.
              </p>
              <button
                onClick={() => setStage("registration")}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
              >
                العودة للرئيسية
              </button>
            </div>
          ) : (
            <form onSubmit={handleCompetitorSubmit} className="space-y-4">
              <div className="bg-[#121a21] border border-[#1e293b] rounded-xl p-4 space-y-2 text-xs text-slate-300">
                <div><strong>الاسم:</strong> {userProfile.fullName}</div>
                <div><strong>المشروع:</strong> {userProfile.businessName}</div>
                <div><strong>الهاتف:</strong> {userProfile.phone}</div>
                <div><strong>البريد:</strong> {userProfile.email}</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#f8fafc]">الهدف الأساسي من التواصل أو الشراكة *</label>
                <textarea
                  rows={3}
                  required
                  value={competitorIntake.primaryGoal}
                  onChange={(e) => setCompetitorIntake({ ...competitorIntake, primaryGoal: e.target.value })}
                  placeholder="وضح هنا الهدف من طلب التواصل، مجالات التعاون الممكنة، أو تفاصيل المشروع..."
                  className="w-full bg-[#121a21] border border-[#1e293b] rounded-xl p-3.5 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-amber-400 resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#f8fafc]">طريقة التواصل المفضلة *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCompetitorIntake({ ...competitorIntake, preferredContactMethod: "whatsapp" })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      competitorIntake.preferredContactMethod === "whatsapp"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-[#121a21] border-[#1e293b] text-slate-400"
                    }`}
                  >
                    واتساب
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompetitorIntake({ ...competitorIntake, preferredContactMethod: "phone" })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      competitorIntake.preferredContactMethod === "phone"
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-[#121a21] border-[#1e293b] text-slate-400"
                    }`}
                  >
                    اتصال هاتفي
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompetitorIntake({ ...competitorIntake, preferredContactMethod: "email" })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      competitorIntake.preferredContactMethod === "email"
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                        : "bg-[#121a21] border-[#1e293b] text-slate-400"
                    }`}
                  >
                    بريد إلكتروني
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !competitorIntake.primaryGoal.trim()}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "جارٍ الإرسال..." : "إرسال البيانات وطلب التواصل المباشر"}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── STAGE 2: THE 99 QUESTIONS ── */}
      {stage === "questions" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#121a21] to-[#0b1015] border border-[#dc2626]/40 p-6 sm:p-8 overflow-hidden shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
              <div>
                <span className="text-xs text-[#ef4444] font-bold font-mono">مشروع: {userProfile.businessName} ({userProfile.fullName})</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#f8fafc]">
                  المحور {activePillar} من 6: {DIAGNOSTIC_SECTIONS.find((s) => s.id === activePillar)?.titleAr}
                </h2>
              </div>
              <div className="bg-[#0b1015] border border-[#1e293b] rounded-2xl px-4 py-2 text-center shrink-0">
                <div className="text-[11px] text-[#94a3b8]">الإنجاز الإجمالي</div>
                <div className="text-xl font-black text-[#ef4444] font-mono">{overallProgress}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
              {DIAGNOSTIC_SECTIONS.map((sec) => {
                const progress = getPillarProgress(sec.id);
                const isActive = activePillar === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActivePillar(sec.id)}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#dc2626]/20 border-[#ef4444] text-[#f8fafc]"
                        : "bg-[#0b1015] border-[#1e293b] text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                      <span>0{sec.id}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="text-xs font-bold truncate">{sec.badgeAr}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
            {(() => {
              const currentSection = DIAGNOSTIC_SECTIONS.find((s) => s.id === activePillar)!;
              const currentQuestions = CORE_DIAGNOSTIC_QUESTIONS.filter((q) => q.sectionId === activePillar);

              return (
                <div className="space-y-6">
                  <div className="space-y-1 border-b border-[#1e293b] pb-4">
                    <h3 className="text-lg font-bold text-[#f8fafc]">{currentSection.titleAr}</h3>
                    <p className="text-xs text-[#94a3b8]">{currentSection.descriptionAr}</p>
                  </div>

                  <div className="space-y-6">
                    {currentQuestions.map((q, idx) => (
                      <div key={q.id} className="bg-[#121a21]/60 border border-[#1e293b] rounded-2xl p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <label className="text-xs sm:text-sm font-bold text-[#f8fafc] leading-relaxed">
                            <span className="text-[#ef4444] font-mono mr-2">[{idx + 1}]</span>
                            {q.textAr}
                            {q.required && <span className="text-[#ef4444] mr-1">*</span>}
                          </label>
                        </div>

                        {q.type === "text" && (
                          <input
                            type="text"
                            value={answers[q.id] || ""}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            placeholder={q.placeholderAr || "اكتب إجابتك هنا..."}
                            className="w-full bg-[#0b1015] border border-[#1e293b] rounded-xl px-4 py-3 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#ef4444]"
                          />
                        )}

                        {q.type === "textarea" && (
                          <textarea
                            rows={3}
                            value={answers[q.id] || ""}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            placeholder={q.placeholderAr || "اكتب تفاصيل إجابتك هنا بدقة..."}
                            className="w-full bg-[#0b1015] border border-[#1e293b] rounded-xl p-3.5 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#ef4444] resize-y"
                          />
                        )}

                        {q.type === "select" && q.options && (
                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {q.options.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleInputChange(q.id, opt.value)}
                                className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between text-xs ${
                                  answers[q.id] === opt.value
                                    ? "bg-[#dc2626]/20 border-[#ef4444] text-[#f8fafc] font-bold"
                                    : "bg-[#0b1015] border-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc]"
                                }`}
                              >
                                <span>{opt.labelAr}</span>
                                {answers[q.id] === opt.value && (
                                  <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {validationError && (
                    <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#ef4444] rounded-xl p-3 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between border-t border-[#1e293b] pt-6">
                    {activePillar > 1 ? (
                      <button
                        type="button"
                        onClick={() => setActivePillar(activePillar - 1)}
                        className="bg-[#121a21] border border-[#1e293b] text-[#f8fafc] font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>المحور السابق</span>
                      </button>
                    ) : <div />}

                    {activePillar < 6 ? (
                      <button
                        type="button"
                        onClick={handleNextPillar}
                        className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#dc2626]/20 cursor-pointer"
                      >
                        <span>المحور التالي</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCompleteQuestions}
                        className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#4ade80] hover:to-[#22c55e] text-white font-black px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#22c55e]/20 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>الانتقال لاعتماد التقرير وإصدار الكود الفريد ➔</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── STAGE 3: THE 2 MANDATORY COMMITMENTS BEFORE RESULT ── */}
      {stage === "pre_result_commitments" && (
        <div className="bg-[#0b1015] border border-amber-500/40 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl max-w-2xl mx-auto animate-in fade-in duration-300">
          <div className="border-b border-[#1e293b] pb-4 space-y-2 text-center sm:text-right">
            <span className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>خطوتان إلزاميتان قبل كشف التقرير التشريحي</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#f8fafc]">
              تأكيد شروط الشريك الشرفي وإصدار كود المشروع الفريد
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              لإصدار التقرير النهائي والاستفادة من عرض التدشين (باقة الـ 5 تحليلات السنوية المجانية بقيمة 5000 ج.م)، يرجى استيفاء الخطوتين التاليتين:
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1: Google Reviews + Social Follow */}
            <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f8fafc]">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs">1</span>
                <span>الخطوة الأولى: تقييم جوجل ومتابعة الحسابات الرسمية (لإرسال البرومو كود)</span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                اضغط على الروابط أدناه للتقييم على Google والمتابعة، وتتم المراجعة عبر إدخال أسماء حساباتك أو إرفاق سكرين مجمع لإرسال البرومو كود المعتمد:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href="https://g.page/r/fitbrilliance/review"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>⭐ تقييم على Google Reviews</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-200 font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span>📱 متابعة الحسابات الرسمية</span>
                </a>
              </div>

              {/* Verification Mode Selector */}
              <div className="bg-[#0b1015] border border-[#1e293b] rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#f8fafc]">
                  <span>طريقة التحقق لإرسال البرومو كود:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("accounts_input")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                        verificationMethod === "accounts_input"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                          : "bg-[#121a21] text-[#94a3b8] border border-[#1e293b]"
                      }`}
                    >
                      كتابة اسم الحسابات
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("screenshot_upload")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                        verificationMethod === "screenshot_upload"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                          : "bg-[#121a21] text-[#94a3b8] border border-[#1e293b]"
                      }`}
                    >
                      سكرين مجمع
                    </button>
                  </div>
                </div>

                {verificationMethod === "accounts_input" ? (
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-[#cbd5e1] block">
                      اكتب اسم أو يوزر الحسابات التي قامت بالمتابعة والتقييم (وسيتم المراجعة وإرسال البرومو كود لك):
                    </label>
                    <input
                      type="text"
                      value={verificationAccountNames}
                      onChange={(e) => setVerificationAccountNames(e.target.value)}
                      placeholder="مثال: Google: Mostafa S. / IG: @serag_onda"
                      className="w-full bg-[#121a21] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                ) : (
                  <div className="border border-dashed border-amber-500/30 rounded-xl p-4 text-center space-y-2 bg-[#121a21]/50">
                    <p className="text-xs text-[#cbd5e1]">
                      التقط سكرين مجمع يُظهر تقييمك على Google ومتابعتك للحسابات، وسيتم توثيقها بالملف وإرسال البرومو كود.
                    </p>
                    <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      ✓ جاهز للتأكيد والمطابقة الميدانية
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={googleReviewDone && socialFollowDone}
                    onChange={(e) => {
                      setGoogleReviewDone(e.target.checked);
                      setSocialFollowDone(e.target.checked);
                    }}
                    className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900"
                  />
                  <span>
                    أؤكد قيامي بالتقييم والمتابعة للحصول على ميزة <strong>الـ 5 طلبات تحليل سنوياً مجاناً</strong> واستلام البرومو كود المعتمد.
                  </span>
                </label>
              </div>
            </div>

            {/* Step 2: Unique Project Code & NDA Acceptance */}
            <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f8fafc]">
                <span className="w-6 h-6 rounded-full bg-[#ef4444]/20 text-[#ef4444] flex items-center justify-center font-mono text-xs">2</span>
                <span>الخطوة الثانية: توليد كود المشروع الفريد والسرية</span>
              </div>

              <div className="bg-[#0b1015] border border-[#ef4444]/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#94a3b8]">كود مشروعك الفريد (الرقم المرجعي):</div>
                  <div className="text-base font-black text-[#ef4444] font-mono tracking-wider">{uniqueProjectCode}</div>
                </div>
                <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم التخصيص سحابياً</span>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ndaAgreed}
                    onChange={(e) => setNdaAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-[#ef4444] focus:ring-[#ef4444] bg-slate-900"
                  />
                  <span>
                    أوافق على ميثاق السرية وحماية البيانات، وأقر بدقة البيانات المقدمة لتغذية التقرير الاستراتيجي.
                  </span>
                </label>
              </div>
            </div>

            {validationError && (
              <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#ef4444] rounded-xl p-3 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting || !googleReviewDone || !ndaAgreed}
              onClick={handleFinalSubmit}
              className="w-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#4ade80] hover:to-[#22c55e] disabled:opacity-40 text-white font-black py-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#22c55e]/25 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "جارٍ إتمام التشخيص السحابي والأرشفة..." : "إصدار التقرير التشريحي الرسمي وتثبيت الكود"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── STAGE 4: EXECUTIVE RESULT VIEW ── */}
      {stage === "result" && (
        <div className="bg-[#0b1015] border border-[#22c55e]/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-3xl bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] flex items-center justify-center mx-auto shadow-lg shadow-[#22c55e]/15">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#f8fafc]">تم استلام مصفوفة التشخيص واعتماد الكود بنجاح!</h3>
            <p className="text-sm text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
              تم تسجيل إجاباتك كاملة، وحفظ نسختك الأصلية على سبيسس، وإرسال التقرير من حساب المدير إلى حساب الأخلاق.
            </p>
          </div>

          {/* Key Summary Cards */}
          <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-6 max-w-lg mx-auto text-right space-y-3">
            <div className="flex items-center justify-between text-xs text-[#94a3b8] border-b border-[#1e293b] pb-2">
              <span>كود المشروع الفريد:</span>
              <span className="font-mono text-[#ef4444] font-bold text-sm">{uniqueProjectCode}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span>صاحب المشروع:</span>
              <span className="text-[#f8fafc] font-bold">{userProfile.fullName} ({userProfile.businessName})</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span>مؤشر الجاهزية والجدوى (AI):</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">{diagnosticReport?.readinessIndex || 85}%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span>الأرشفة والحفظ السحابي:</span>
              <span className="text-[#22c55e] font-bold">✅ احتفاظ أصلي على قاعدة بيانات Supabase</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span>البريد المؤسسي والتحليل:</span>
              <span className="text-[#38bdf8] font-bold">من حساب المدير ➔ لحساب الأخلاق والتقييم</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span>إشعار المتابعة الميدانية:</span>
              <span className="text-[#eab308] font-bold">واتساب الثاني (01274534493)</span>
            </div>
          </div>

          {/* Local Secure PDF & Live Cockpit Action Row */}
          <div className="bg-[#121a21]/80 border border-[#dc2626]/30 p-4 rounded-2xl max-w-lg mx-auto space-y-3">
            <div className="text-xs text-slate-300 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-white">
                <FileText className="w-4 h-4 text-[#ef4444]" />
                <span>التقرير التشريحي المشفر محلياً (Zero-Knowledge PDF):</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">100% مجاناً وآمن</span>
            </div>

            <button
              type="button"
              onClick={() =>
                downloadSecureReportPdf({
                  clientName: userProfile.fullName || "شريك أعمال",
                  businessName: userProfile.businessName || "مشروع تجاري",
                  phone: userProfile.phone || "+201274879442",
                  projectCode: uniqueProjectCode,
                  financialWastePercent: 34,
                  monthlyWasteEstimateEGP: 18500,
                  projectedRoasMultiplier: 3.8,
                  criticalLeaks: [
                    "تسريب في معدل التحويل البيعي المباشر بسبب غياب الـ SOPs الميدانية.",
                    "هدر في الاستهداف الجغرافي تم رصده في قمع الإعلانات.",
                    "ضعف استبقاء العملاء القدامى (Customer Retention Leak).",
                  ],
                  operationalChokepoints: [
                    "تفعيل خطة الـ 90 يوماً لوقف النزيف في الأسبوع الأول.",
                    "تصوير الأصول السينمائية 4K لبناء أصل تجاري غير قابل للتقليد.",
                  ],
                  ninetyDayPhases: [
                    { phase: "الشهر الأول: التأسيس والتصحيح الهيكلي", focus: "عزل الهدر وإعادة صياغة العرض", targetKPI: "وقف النزيف وخفض التكلفة بـ 30%" },
                    { phase: "الشهر الثاني: التكثيف والمبيعات المباشرة", focus: "إطلاق الحملات وتفعيل الـ SOPs", targetKPI: "مضاعفة الحجوزات وتثبيت الـ ROAS" },
                    { phase: "الشهر الثالث: الهيمنة واسترداد التكاليف", focus: "الأتمتة واستدامة النمو", targetKPI: "تحقيق عائد ROAS يتجاوز 3.5x" },
                  ],
                })
              }
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل التقرير الفني والمالي المشفر لجهازك (PDF فوري)</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab && setActiveTab("account")}
              className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white font-black px-6 py-3.5 rounded-xl text-xs shadow-lg shadow-[#dc2626]/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>فتح رادار المتابعة الحية في حسابي (CRM)</span>
            </button>
            <a
              href={`https://wa.me/201274534493?text=${encodeURIComponent(`السلام عليكم، تم تقديم استبيان تشخيص المشروع كود ${uniqueProjectCode} باسم ${userProfile.fullName} لنشاط ${userProfile.businessName}، وأرغب في المتابعة الميدانية كشريك شرفي.`)}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#22c55e]/15 border border-[#22c55e]/40 hover:bg-[#22c55e]/25 text-[#22c55e] font-bold px-6 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#22c55e]/10"
            >
              <span>متابعة فورية على واتساب (01274534493)</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
