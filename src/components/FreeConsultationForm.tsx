import React, { useState } from "react";
import {
  CheckCircle2,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  Camera,
  GraduationCap,
  TrendingUp,
  Search,
  MessageCircle,
  ChevronDown,
  Check,
  Sparkles,
  Clock,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ConsultationOption, ConsultationRequest, FoundingMember, Language } from "../types";
import { supabase } from "../lib/supabase";
import { CelebrationSuccess } from "./CelebrationSuccess";

interface FreeConsultationFormProps {
  initialOption?: ConsultationOption;
  onSuccessSubmitted?: (consultation: ConsultationRequest, member: FoundingMember) => void;
  setActiveTab: (tab: string) => void;
  lang?: Language;
}

export const FreeConsultationForm: React.FC<FreeConsultationFormProps> = ({
  initialOption = "improvement_plan",
  onSuccessSubmitted,
  setActiveTab,
  lang = "ar",
}) => {
  const isRtl = lang === "ar";

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState(isRtl ? "مطاعم وتغذية" : "F&B / Hospitality");
  const [location, setLocation] = useState(isRtl ? "القاهرة، مصر" : "Cairo, Egypt");
  const [websiteOrSocial, setWebsiteOrSocial] = useState("");
  const [dissatisfaction, setDissatisfaction] = useState("");
  const [improvementGoal, setImprovementGoal] = useState("");
  const [requestedOption, setRequestedOption] = useState<ConsultationOption>(initialOption);
  const [openOption, setOpenOption] = useState<ConsultationOption | null>(initialOption);
  const [showAllOptionDetails, setShowAllOptionDetails] = useState(false);

  // Status State
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    consultation: ConsultationRequest;
    member: FoundingMember;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generatedId = `FB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newConsultation: ConsultationRequest = {
      id: generatedId,
      customerName,
      email,
      phone,
      businessName,
      businessType,
      location,
      websiteOrSocial,
      dissatisfaction,
      improvementGoal,
      requestedOption,
      rating: 5,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const newMember: FoundingMember = {
      id: `mem-${Date.now()}`,
      memberCode: `FB-FM-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      email,
      phone,
      businessName,
      promoCode: "FOUNDER15",
      discountPercent: 15,
      monthlyConsultationsAvailable: 1,
      status: "active",
      createdAt: new Date().toISOString(),
      profileType: "client",
    };

    // Save locally
    try {
      const savedCons = JSON.parse(localStorage.getItem("fitbrilliance_consultations") || "[]");
      savedCons.unshift(newConsultation);
      localStorage.setItem("fitbrilliance_consultations", JSON.stringify(savedCons));
    } catch (_) {}

    // Save directly to Supabase if configured
    try {
      await supabase.from("consultations").insert([
        {
          customer_name: customerName,
          email,
          phone,
          business_name: businessName,
          business_type: businessType,
          location,
          website_or_social: websiteOrSocial,
          dissatisfaction,
          improvement_goal: improvementGoal,
          requested_option: requestedOption,
          status: "new",
        },
      ]);
    } catch (_) {}

    // Try posting to API
    try {
      await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConsultation),
      });
    } catch (_) {}

    setSubmittedData({
      consultation: newConsultation,
      member: newMember,
    });

    if (onSuccessSubmitted) {
      onSuccessSubmitted(newConsultation, newMember);
    }

    setLoading(false);
  };

  const getTargetWhatsAppNumber = () => {
    if (requestedOption === "academic_research") return "201274879442"; // Coach Serag
    return "201274534493"; // Ms. Maria / FitBrilliance
  };

  const getTargetContactName = () => {
    if (requestedOption === "academic_research") {
      return isRtl ? "كوتش سراج — بالانسيد بريليانس" : "Coach Serag — Balanced Brilliance";
    }
    return isRtl ? "فريق فيت بريليانس" : "Fit Brilliance Team";
  };

  const handleOpenWhatsAppConfirmation = () => {
    if (!submittedData) return;
    const optionLabels: Record<string, string> = isRtl
      ? {
          improvement_plan: "خطة تحسين وتحول (90 يوم)",
          event_filming: "إعداد وتصوير إيفنتات ومحتوى تدريبي",
          academic_research: "استشارات أبحاث ودراسات عليا",
          activity_analysis: "تحليل وتشخيص نشاط",
        }
      : {
          improvement_plan: "90-Day Transformation Plan",
          event_filming: "Event Filming & Masterclasses",
          academic_research: "Postgraduate Academic Research",
          activity_analysis: "Business Diagnosis",
        };

    const text = isRtl
      ? `السلام عليكم ورحمة الله،
أنا: ${submittedData.consultation.customerName}
المشروع/الجهة: ${submittedData.consultation.businessName}
نوع الطلب: ${optionLabels[submittedData.consultation.requestedOption] || submittedData.consultation.requestedOption}
كود الطلب الفريد: ${submittedData.consultation.id}
التحديات: ${submittedData.consultation.dissatisfaction}
الهدف المنشود: ${submittedData.consultation.improvementGoal}

أرغب في تأكيد الاستشارة والمتابعة معكم عبر المنظومة.`
      : `Hello,
Name: ${submittedData.consultation.customerName}
Business/Entity: ${submittedData.consultation.businessName}
Inquiry Type: ${optionLabels[submittedData.consultation.requestedOption] || submittedData.consultation.requestedOption}
Reference Code: ${submittedData.consultation.id}
Key Challenge: ${submittedData.consultation.dissatisfaction}
Target Goal: ${submittedData.consultation.improvementGoal}

I would like to confirm my consultation and proceed with the team.`;

    window.open(`https://wa.me/${getTargetWhatsAppNumber()}?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (submittedData) {
    return (
      <div className={`py-12 max-w-3xl mx-auto space-y-8 animate-fade-in ${isRtl ? "text-right" : "text-left"}`}>
        <CelebrationSuccess
          title={isRtl ? "تم استلام طلبك وتأكيد التحليل المبدئي بنجاح! 🌟" : "Your Consultation Request Has Been Received! 🌟"}
          subtitle={isRtl ? "تم حفظ بيانات نشاطك في السجل الاستشاري. يتأهل مشروعك تلقائياً للحصول على تحليل وتوجيه شهري مجاني مدى الحياة بإشراف كوتش سراج." : "Your inquiry has been logged. Your project qualifies for lifetime monthly advisory with Coach Serag."}
          referenceCode={submittedData.consultation.id}
          onReset={() => setSubmittedData(null)}
          resetButtonText={isRtl ? "إرسال طلب جديد" : "Submit Another Request"}
        />

        <div className="bg-[#0b1015] border-2 border-[#dc2626]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[#1e293b] pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/40 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">بيانات العضوية المعتمدة</h4>
              <span className="text-xs font-mono text-red-400">
                {isRtl ? `كود العضوية: ${submittedData.member.memberCode}` : `Member Code: ${submittedData.member.memberCode}`}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleOpenWhatsAppConfirmation}
              className="w-full sm:w-auto bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black px-6 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#dc2626]/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isRtl ? `متابعة فورية مع (${getTargetContactName()}) ←` : `Follow up with (${getTargetContactName()}) →`}</span>
            </button>

            <button
              onClick={() => setActiveTab("plans")}
              className="w-full sm:w-auto bg-[#121a21] hover:bg-[#1e293b] text-[#f8fafc] border border-[#1e293b] font-black px-6 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>{isRtl ? "استعراض باقات وخطط الأسواق" : "Explore Regional Plans"}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-10 max-w-3xl mx-auto space-y-8 ${isRtl ? "text-right" : "text-left"}`}>
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/15 text-red-400 text-xs font-mono font-bold border border-red-500/30">
          <Zap className="w-4 h-4 text-red-500" />
          <span>{isRtl ? "استشارة مبدئية مجانية 100% · تقييم فوري" : "100% Free Preliminary Assessment"}</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-[#f5f7f8] tracking-tight">
          {isRtl ? "أخبرنا عن مشروعك وتطلعاتك" : "Tell Us About Your Venture & Goals"}
        </h2>

        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          {isRtl
            ? "نحلل احتياجك ونعد لك خطة مبدئية واضحة. جميع الاستشارات تتضمن تحليلاً وتوجيهاً شهرياً مجانياً مدى الحياة بإشراف كوتش سراج."
            : "We analyze your scope and draft a clear initial roadmap. All assessments include free lifetime monthly guidance under Coach Serag."}
        </p>
      </div>

      <div className="bg-[#121a21]/90 border border-[#202d38] rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#f5f7f8] block">{isRtl ? "اسمك الكريم *" : "Full Name *"}</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={isRtl ? "أدخل اسمك بالكامل" : "Enter your full name"}
                className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#e5a93c] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#f5f7f8] block">{isRtl ? "البريد الإلكتروني *" : "Email Address *"}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#e5a93c] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#f5f7f8] block">{isRtl ? "رقم الواتساب أو الهاتف *" : "Phone / WhatsApp *"}</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isRtl ? "01012345678" : "+1xxxxxxxxxx"}
                className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#e5a93c] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#f5f7f8] block">{isRtl ? "اسم النشاط / المشروع / جهة البحث *" : "Company / Research Subject *"}</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={isRtl ? "اسم شركتك، الأكاديمية، أو موضوع دراستك" : "Company, institution, or thesis topic"}
                className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#e5a93c] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#f5f7f8] block">{isRtl ? "المجال أو التخصص *" : "Field / Industry *"}</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#e5a93c] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none"
              >
                {isRtl ? (
                  <>
                    <option value="مطاعم وتغذية">مطاعم وأغذية ومشروبات</option>
                    <option value="تجارة إلكترونية">تجارة إلكترونية ومتاجر</option>
                    <option value="مراكز تدريب ومؤتمرات">مراكز تدريب وإيفنتات وتعليم</option>
                    <option value="دراسات عليا وأبحاث">دراسات عليا وأبحاث أكاديمية</option>
                    <option value="خدمات وصالونات">خدمات وعناية وصحة</option>
                    <option value="مقاولات وعقارات">تطوير عقاري ومقاولات</option>
                    <option value="تقنية وشركات">تقنية وتطبيقات وبرمجيات</option>
                    <option value="أخرى">مجال آخر</option>
                  </>
                ) : (
                  <>
                    <option value="F&B / Hospitality">Restaurants & Food/Beverage</option>
                    <option value="E-Commerce">E-Commerce & Retail</option>
                    <option value="Training & Events">Training Centers, Events & Education</option>
                    <option value="Postgraduate Research">Postgraduate & Academic Research</option>
                    <option value="Healthcare & Services">Healthcare, Wellness & Services</option>
                    <option value="Real Estate">Real Estate & Contracting</option>
                    <option value="Technology & SaaS">Technology, Apps & Software</option>
                    <option value="Other">Other Sector</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#f5f7f8] block">{isRtl ? "رابط السوشيال أو الموقع (اختياري)" : "Social Media or Website (Optional)"}</label>
              <input
                type="text"
                value={websiteOrSocial}
                onChange={(e) => setWebsiteOrSocial(e.target.value)}
                placeholder="instagram.com / facebook.com / drive"
                className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#e5a93c] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none font-mono"
              />
            </div>
          </div>

          {/* Requested Option Choice (Converted to Interactive Accordion) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202d38] pb-2">
              <label className="text-xs font-bold text-[#f5f7f8] flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                <span>{isRtl ? "نوع الخدمة / الاستشارة المطلوبة (أكورديون تفاعلي) *" : "Requested Service / Consultation Type (Interactive Accordion) *"}</span>
              </label>

              <button
                type="button"
                onClick={() => setShowAllOptionDetails((prev) => !prev)}
                className="text-[11px] font-mono text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>{showAllOptionDetails ? (isRtl ? "طي تفاصيل الخيارات" : "Collapse details") : (isRtl ? "عرض تفاصيل كافة الخيارات" : "Expand all options")}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllOptionDetails ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "improvement_plan" as ConsultationOption,
                  title: isRtl ? "خطة تحول استراتيجي وتنمية أرباح (90 يوم)" : "90-Day Strategic Transformation Plan",
                  subtitle: isRtl ? "إعادة هيكلة العرض القيمي والتسعير وإيقاف الهدر المالي" : "Restructure pricing, stop cash bleed & scale margins",
                  icon: TrendingUp,
                  badge: isRtl ? "البرنامج الرئيسي الشامل" : "Flagship Transformation",
                  team: isRtl ? "فريق فيت بريليانس — إشراف كوتش سراج" : "Fit Brilliance Team — Dir. Coach Serag",
                  timeline: isRtl ? "تنفيذ ومتابعة ميدانية على مدار 90 يوماً" : "90-Day Field Execution & Advisory",
                  deliverables: isRtl
                    ? [
                        "تدقيق مالي وتشغيلي دقيق للأرقام وهوامش الربح الحقيقية",
                        "إعادة هندسة العرض البيعي وقمع التسويق لرفع معدل التحويل",
                        "تصميم حملات إعلانية بميزانيات مدروسة ومستردة دفترياً",
                        "نظام متابعة أسبوعي مباشر واجتماعات توجيه مستمرة لضبط الأداء",
                      ]
                    : [
                        "Comprehensive fiscal audit & authentic margin diagnostics",
                        "Value proposition and sales funnel re-engineering",
                        "Targeted ad campaign architectures with deductible spend",
                        "Weekly direct advisory checkpoints & performance alignment",
                      ],
                },
                {
                  id: "event_filming" as ConsultationOption,
                  title: isRtl ? "تصوير إيفنتات ومحتوى تدريبي وتدريسي بدقة 4K" : "4K Event Filming & Masterclasses",
                  subtitle: isRtl ? "إنتاج سينمائي احترافي للمؤتمرات، الكورسات وورش العمل" : "Cinema-grade 4K filming for workshops, courses & conferences",
                  icon: Camera,
                  badge: isRtl ? "إنتاج سينمائي 4K" : "Cinema-Grade 4K",
                  team: isRtl ? "فريق رواد بريليانس (Pioneers Brilliance)" : "Pioneers Brilliance Media",
                  timeline: isRtl ? "جاهزية واستجابة سريعة خلال 48 ساعة" : "Rapid Deployment (48h Notice)",
                  deliverables: isRtl
                    ? [
                        "طاقم تصوير متعدد الكاميرات بدقة سينمائية 4K فائقة الوضوح",
                        "هندسة إضاءة مسرحية وصوت احترافي بدون أي تشويش",
                        "مونتاج متكامل، جرافيكس حركي، وتقطيع ريلز لمنصات السوشيال",
                        "تسليم أرشيف رقمي وماستر 4K جاهز للبث والنشر الفوري",
                      ]
                    : [
                        "Multi-cam cinema 4K camera setup with theater-grade lighting",
                        "Zero-noise acoustic engineering & directional microphones",
                        "Full editing, motion graphic titles, and social reels cuts",
                        "Master digital 4K export archive ready for broadcasting",
                      ],
                },
                {
                  id: "academic_research" as ConsultationOption,
                  title: isRtl ? "مساعدات وأبحاث الدراسات العليا والأكاديمية" : "Postgraduate Academic Research Advisory",
                  subtitle: isRtl ? "استشارات منهجية متخصصة لرسائل الماجستير والدكتوراه" : "Scientific methodology & thesis defense consulting (Masters & PhD)",
                  icon: GraduationCap,
                  badge: isRtl ? "معايير علمية رصينة" : "Academic Rigor",
                  team: isRtl ? "كوتش سراج — بالانسيد بريليانس" : "Coach Serag — Balanced Brilliance",
                  timeline: isRtl ? "إشراف ومتابعة منهجية مرنة ومخصصة" : "Personalized Methodology Supervision",
                  deliverables: isRtl
                    ? [
                        "بناء وضبط الإطار النظري وصياغة الفرضيات والمشكلة العلمية",
                        "التحليل الإحصائي المتقدم (SPSS / AMOS / PLS-SEM) وتفسير النتائج",
                        "مراجعة وصياغة الأوراق العلمية وفق اشتراطات النشر (Scopus / APA)",
                        "محاكاة جلسة المناقشة والتحضير للدفاع عن الأطروحة بنجاح",
                      ]
                    : [
                        "Theoretical framework building & scientific problem structuring",
                        "Advanced statistical modeling (SPSS / AMOS / PLS-SEM) & table interpretation",
                        "Scientific paper formatting conforming to Scopus / APA standards",
                        "Thesis defense mock sessions & executive presentation coaching",
                      ],
                },
                {
                  id: "activity_analysis" as ConsultationOption,
                  title: isRtl ? "تحليل وتشخيص فوري للنشاط وعزل الهدر" : "Instant Business Diagnosis & Cashflow Defense",
                  subtitle: isRtl ? "كشف الثغرات التشغيلية ومواضع تسرب السيولة النقدية" : "Rapid operational audit, cash leak quarantine & margin defense",
                  icon: Search,
                  badge: isRtl ? "كشف ثغرات في 48 ساعة" : "48-Hour Report",
                  team: isRtl ? "كوتش سراج ومستشارو Fit Brilliance" : "Coach Serag & Advisory Board",
                  timeline: isRtl ? "تسليم التقرير التوجيهي خلال 48 ساعة" : "48-Hour Executive Briefing",
                  deliverables: isRtl
                    ? [
                        "فحص نسبة تكاليف التشغيل (OPEX) وهوامش الربح الحقيقية",
                        "تحديد الاختناقات الرئيسية في قنوات البيع وخدمة العملاء",
                        "تقرير تشخيصي مكتوب وموجز تنفيذي بأهم التدخلات السريعة",
                        "جلسة استشارية أولية مجانية لوضع خطة العمل العاجلة",
                      ]
                    : [
                        "OPEX burn-rate inspection and actual margin isolation",
                        "Identification of primary bottlenecks in sales & conversion",
                        "Written diagnostic audit report with high-impact quick wins",
                        "Free preliminary consultation session to outline defense action",
                      ],
                },
              ].map((opt) => {
                const isSelected = requestedOption === opt.id;
                const isOpen = showAllOptionDetails || openOption === opt.id;
                const IconComp = opt.icon;

                return (
                  <div
                    key={opt.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? "bg-[#0d141d] border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.2)] ring-1 ring-red-500/50"
                        : "bg-[#090d0e]/95 border-[#1e293b] hover:border-[#334155]"
                    }`}
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => {
                        setRequestedOption(opt.id);
                        setOpenOption((prev) => (prev === opt.id && !showAllOptionDetails ? null : opt.id));
                      }}
                      className={`w-full p-4 flex items-center justify-between gap-3 cursor-pointer text-left rtl:text-right transition-colors ${
                        isSelected ? "bg-red-950/20" : "hover:bg-[#0f1722]/60"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Radio selection indicator */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                            isSelected
                              ? "bg-red-600 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                              : "border-[#334155] bg-[#121a22]"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? "bg-red-600/20 text-red-400 border border-red-500/40"
                              : "bg-[#141d27] text-[#94a3b8] border border-[#202d38]"
                          }`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>

                        {/* Title and Badge */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs font-black truncate block ${
                                isSelected ? "text-[#f8fafc]" : "text-[#cbd5e1]"
                              }`}
                            >
                              {opt.title}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                isSelected
                                  ? "bg-red-500/20 text-red-300 border-red-500/40"
                                  : "bg-[#16202c] text-[#94a3b8] border-[#223041]"
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#94a3b8] truncate block mt-0.5">
                            {opt.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Header trailing status and chevron */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && (
                          <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-red-400 bg-red-600/10 px-2 py-0.5 rounded-md border border-red-500/30">
                            {isRtl ? "محدد للاستشارة ✓" : "Selected ✓"}
                          </span>
                        )}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                            isOpen ? "rotate-180 bg-red-600/15 text-red-400" : "bg-[#141d27] text-[#64748b]"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </button>

                    {/* Accordion Collapsible Body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 sm:p-5 pt-1 border-t border-[#1e293b]/70 space-y-4 text-xs">
                            <p className="text-[#cbd5e1] leading-relaxed text-xs">
                              {opt.subtitle}
                            </p>

                            {/* Deliverables Grid */}
                            <div className="bg-[#05080c] border border-[#1e293b] rounded-xl p-3.5 space-y-2.5">
                              <span className="text-[11px] font-mono text-[#94a3b8] block font-bold">
                                {isRtl ? "ما تشمله هذه الخدمة والمخرجات التنفيذية:" : "Scope & Core Deliverables:"}
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                {opt.deliverables.map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-[#94a3b8]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                    <span className="leading-tight">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Meta & Selection CTA */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 text-[11px] font-mono text-[#64748b]">
                              <div className="flex items-center gap-4 flex-wrap">
                                <span className="flex items-center gap-1.5 text-red-400/90">
                                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                                  <span>{opt.team}</span>
                                </span>
                                <span className="flex items-center gap-1.5 text-[#94a3b8]">
                                  <Clock className="w-3.5 h-3.5 text-[#64748b]" />
                                  <span>{opt.timeline}</span>
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setRequestedOption(opt.id);
                                  if (!showAllOptionDetails) setOpenOption(opt.id);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                                    : "bg-[#141d27] hover:bg-[#1e293b] text-[#cbd5e1] border border-[#263747]"
                                }`}
                              >
                                {isSelected
                                  ? (isRtl ? "تم اعتماد هذا الخيار ✓" : "Option Selected ✓")
                                  : (isRtl ? "اختيار هذه الخدمة للاستشارة" : "Select this Option")}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#f5f7f8] block">{isRtl ? "أكثر ما يزعجك حالياً أو التحدي الرئيسي *" : "Current Main Challenge / Bottleneck *"}</label>
            <textarea
              required
              rows={3}
              value={dissatisfaction}
              onChange={(e) => setDissatisfaction(e.target.value)}
              placeholder={isRtl ? "اكتب التحديات التي تواجهها (مثال: ضعف جودة التصوير، تشتت المبيعات، صعوبة التحليل الإحصائي في البحث...)" : "Describe your current challenges (e.g. low filming quality, scattered sales, statistical analysis difficulties...)"}
              className="w-full bg-[#090d0e] border border-[#202d38] focus:border-red-500 rounded-xl p-4 text-xs text-[#f5f7f8] outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#f5f7f8] block">{isRtl ? "ما الهدف الذي تتمنى تحقيقه؟ *" : "Primary Goal You Wish to Achieve *"}</label>
            <textarea
              required
              rows={2}
              value={improvementGoal}
              onChange={(e) => setImprovementGoal(e.target.value)}
              placeholder={isRtl ? "الهدف المنشود (مثال: إنتاج كورس احترافي، إنجاز خطة الـ 90 يوم، إنهاء الإحصاء البحثي...)" : "Target goal (e.g. produce masterclass, achieve 90-day roadmap, complete thesis statistics...)"}
              className="w-full bg-[#090d0e] border border-[#202d38] focus:border-red-500 rounded-xl p-4 text-xs text-[#f5f7f8] outline-none transition-colors"
            />
          </div>

          {/* Guarantee Badge */}
          <div className="bg-[#090d0e] border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-red-400">
            <ShieldCheck className="w-5 h-5 shrink-0 text-red-500" />
            <span>{isRtl ? "يتضمن هذا الطلب تحليلاً وتوجيهاً شهرياً مجانياً مدى الحياة دون أي تكاليف خفية." : "This assessment includes lifetime free monthly guidance with no hidden fees."}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-4 rounded-xl text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading
              ? (isRtl ? "جاري إرسال الطلب ومعالجته..." : "Submitting...")
              : (isRtl ? "أرسل طلب الاستشارة المجانية الآن ←" : "Send Free Consultation Request Now →")}
          </button>
        </form>
      </div>
    </div>
  );
};

