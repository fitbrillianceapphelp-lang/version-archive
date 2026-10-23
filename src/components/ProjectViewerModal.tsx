import React, { useState, useEffect, useRef } from "react";
import { ProtectedProject, Language } from "../types";
import {
  X,
  ShieldAlert,
  Lock,
  CheckCircle2,
  FileText,
  PhoneCall,
  Sparkles,
  MapPin,
  Building,
  User,
  Mail,
  Briefcase,
  Eye,
  Send,
  Maximize2,
  Minimize2,
  ExternalLink,
  Presentation,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { getTranslation } from "../i18n/translations";
import { normalizeEmbedUrl, findProjectByCode } from "../lib/projectEmbed";

interface ProjectViewerModalProps {
  project?: ProtectedProject | null;
  initialCode?: string;
  onClose: () => void;
  lang: Language;
}

export const ProjectViewerModal: React.FC<ProjectViewerModalProps> = ({
  project: initialProject,
  initialCode = "PRJ-CANVA-SHOWCASE",
  onClose,
  lang,
}) => {
  const t = getTranslation(lang);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);

  // Verification Gate Form State
  const [isVerified, setIsVerified] = useState(false);
  const [viewerName, setViewerName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [projectCode, setProjectCode] = useState(initialCode);
  const [gateError, setGateError] = useState<string | null>(null);

  // Active view tab inside verified modal: 'presentation' | 'steps' | 'charter'
  const [activeModalTab, setActiveModalTab] = useState<'presentation' | 'steps' | 'charter'>('presentation');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState("");

  // Resolve current project from code or passed prop
  const resolvedProject = initialProject || findProjectByCode(projectCode);

  const currentProject: ProtectedProject = resolvedProject || {
    projectCode: projectCode || "PRJ-SAMPLE",
    clientName: viewerName || "شريك النجاح",
    companyName: companyName || "المشروع المعتمد",
    teamAssigned: "FitBrilliance Team",
    status: "active",
    planName: "خطة التحول الاستراتيجي الميداني وعرض الأصول",
    duration: "90 يوماً",
    confidentialDetails: "تشخيص ميداني دقيق للاختناقات، إعادة هيكلة المسار التشغيلي والتسويقي، والعمل يداً بيد لتحقيق نمو مستدام ومضاعفة العائد.",
    executionSteps: [
      "الأسبوع 1-2: التدقيق المشترك وإعادة صياغة العرض القومي",
      "الأسبوع 3-4: ضبط الحسابات وتصوير أصول المحتوى الأساسية",
      "الأسبوع 5-6: إطلاق حملات المرحلة الأولى وقياس استجابة الجمهور",
      "الأسبوع 7-8: تحسين قمع المبيعات ومتابعة فريق الردود والتحويل",
      "الأسبوع 9-10: توسيع نطاق الاستهداف وجذب الشريحة المستهدفة",
      "الأسبوع 11-12: تقييم العائد وتثبيت مسار الاستدامة السنوي",
    ],
    watermarkText: `${companyName || "محمي"} • ${email || "توثيق البريد المهني"}`,
  };

  // Normalized embed link
  const normalizedEmbed = currentProject.embedUrl ? normalizeEmbedUrl(currentProject.embedUrl) : null;

  // Auto-fill form if project found
  useEffect(() => {
    if (resolvedProject) {
      if (resolvedProject.clientName && !viewerName) setViewerName(resolvedProject.clientName);
      if (resolvedProject.companyName && !companyName) setCompanyName(resolvedProject.companyName);
      if (resolvedProject.clientEmail && !email) setEmail(resolvedProject.clientEmail);
    }
  }, [resolvedProject]);

  // Dynamic Security Watermark Canvas
  useEffect(() => {
    if (!isVerified || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 600;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rotate((-20 * Math.PI) / 180);
    ctx.font = "bold 13px Cairo, sans-serif";
    ctx.fillStyle = "rgba(239, 68, 68, 0.07)";

    const stamp = `FIT BRILLIANCE ECOSYSTEM • ${currentProject.companyName || companyName || 'VERIFIED PARTNER'} • ${currentProject.projectCode} • ${new Date().toLocaleDateString('ar-EG')}`;

    for (let x = -300; x < canvas.width + 400; x += 260) {
      for (let y = -300; y < canvas.height + 400; y += 100) {
        ctx.fillText(stamp, x, y);
      }
    }
  }, [isVerified, companyName, email, currentProject]);

  // Request Geolocation & Submit Gate
  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);

    if (!viewerName || !companyName || !email) {
      setGateError("يرجى ملء جميع الحقول المطلوبة لتوثيق الهوية وصلاحية الاطلاع.");
      return;
    }

    setIsVerified(true);
  };

  // WhatsApp CTA dispatcher
  const handleWhatsAppAction = (actionType: string) => {
    const phone = "201274534493";
    let message = "";

    switch (actionType) {
      case "approve-roadmap":
        message = `مرحباً كوتش سراج وفريق العمل، أنا ${viewerName} من شركة (${companyName}). اطلعت على مشروعنا المشفر [${currentProject.projectCode}] وأرغب في اعتماد خارطة الطريق والبدء الفوري.`;
        break;
      case "discuss-custom":
        message = `مرحباً، أنا ${viewerName} من شركة (${companyName}). بخصوص مشروعنا [${currentProject.projectCode}]، أرغب في تحديد موعد جلسة لمناقشة تخصيص بعض البنود التنفيذية.`;
        break;
      case "feedback":
        message = `ملاحظة واستفسار من الشريك ${viewerName} (${companyName}) على مشروع [${currentProject.projectCode}]:\n"${feedbackInput}"`;
        break;
      default:
        message = `استفسار بخصوص المشروع المشفر [${currentProject.projectCode}] لصالح شركة (${companyName}).`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  const toggleFullscreen = () => {
    if (!iframeContainerRef.current) return;
    if (!document.fullscreenElement) {
      iframeContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full ${isFullscreen ? 'max-w-none h-screen p-2' : 'max-w-5xl'} bg-[#0a0f14] border-2 border-[#dc2626]/40 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl my-8 text-right transition-all`}>
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dc2626]/15 text-[#ef4444] flex items-center justify-center border border-[#dc2626]/30 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#f8fafc] flex items-center gap-2">
                <span>بوابة استعراض المشروع المعتمد</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-[10px] font-mono font-bold">
                  {currentProject.projectCode}
                </span>
              </h3>
              <span className="text-xs text-[#94a3b8] font-mono">
                منظومة سراج أوندا — Fit Brilliance Ecosystem
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#121a21] hover:bg-[#ef4444]/20 text-[#94a3b8] hover:text-[#ef4444] border border-[#1e293b] transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: VERIFICATION GATE */}
        {!isVerified ? (
          <form onSubmit={handleVerifyGate} className="space-y-6">
            <div className="text-center space-y-2 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#dc2626]/10 text-[#ef4444] border border-[#dc2626]/30 flex items-center justify-center mx-auto shadow-lg shadow-[#dc2626]/10">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-base sm:text-lg font-black text-[#f8fafc]">
                توثيق هوية المشاهد وصاحب العمل
              </h4>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                هذا المشروع محمي ومخصص لصاحب العمل. يرجى تأكيد بياناتك للاطلاع على العرض التقديمي المباشر وخطة العمل.
              </p>
            </div>

            <div className="space-y-4 max-w-xl mx-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#f8fafc] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#ef4444]" />
                  <span>كود المشروع المشفر *</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                  placeholder="مثال: PRJ-CANVA-SHOWCASE أو FB-1042"
                  className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-2.5 text-xs text-[#f8fafc] outline-none font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#f8fafc] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>اسمك الكريم *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={viewerName}
                    onChange={(e) => setViewerName(e.target.value)}
                    placeholder="الاسم الثلاثي"
                    className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-2.5 text-xs text-[#f8fafc] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#f8fafc] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>المسمى الوظيفي *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="المدير التنفيذي / المؤسس / شريك"
                    className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-2.5 text-xs text-[#f8fafc] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#f8fafc] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>اسم الشركة / النشاط *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="اسم الشركة أو المؤسسة"
                    className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-2.5 text-xs text-[#f8fafc] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#f8fafc] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>البريد الإلكتروني المهني *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ceo@company.com"
                    className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-2.5 text-xs text-[#f8fafc] outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {gateError && <p className="text-xs text-rose-400 font-mono text-center">{gateError}</p>}

            <div className="max-w-xl mx-auto pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#dc2626]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>توثيق البيانات واستعراض المشروع المباشر ←</span>
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: PROTECTED DOCUMENT & DIRECT INTERACTIVE EMBED VIEW */
          <div className="space-y-6 relative">
            {/* Watermark Canvas Layer */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-20"
            />

            {/* Navigation Tabs Bar inside Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1318] p-3 rounded-2xl border border-[#1e293b] relative z-30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModalTab('presentation')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeModalTab === 'presentation'
                      ? 'bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/30'
                      : 'bg-[#121a21] text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span>العرض التفاعلي المباشر (Direct Presentation)</span>
                </button>

                <button
                  onClick={() => setActiveModalTab('steps')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeModalTab === 'steps'
                      ? 'bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/30'
                      : 'bg-[#121a21] text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>خطة التنفيذ والمراحل (90 يوماً)</span>
                </button>

                <button
                  onClick={() => setActiveModalTab('charter')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeModalTab === 'charter'
                      ? 'bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/30'
                      : 'bg-[#121a21] text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>ميثاق الشراكة والسرية</span>
                </button>
              </div>

              {/* Status & Fullscreen Toggle */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#cbd5e1] font-mono text-[11px] hidden sm:inline">
                  {currentProject.companyName} • {currentProject.teamAssigned}
                </span>
                {activeModalTab === 'presentation' && normalizedEmbed && (
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-xl bg-[#121a21] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#1e293b] transition-all cursor-pointer flex items-center gap-1 text-xs"
                    title="تكبير الشاشة"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isFullscreen ? "تصغير" : "ملء الشاشة"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: DIRECT INTERACTIVE PRESENTATION (CANVA / GOOGLE DRIVE / DIRECT) */}
            {activeModalTab === 'presentation' && (
              <div className="space-y-4 relative z-10" ref={iframeContainerRef}>
                {normalizedEmbed?.embedUrl ? (
                  <div className="space-y-3">
                    {/* Presentation Frame - Seamless White-Labeled Frame without External Source Bars */}
                    <div className="relative rounded-2xl overflow-hidden border-2 border-[#1e293b] bg-[#000000] shadow-2xl">
                      {/* Top White-Label Brand Bar */}
                      <div className="bg-[#0b1015] px-4 py-2.5 border-b border-[#1e293b] flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse"></span>
                          <span className="text-[#f8fafc] font-bold">
                            عرض الأصول التنفيذية المعتمدة — {currentProject.companyName}
                          </span>
                        </div>
                        <span className="text-[#94a3b8] text-[11px]">
                          منصة العرض المحمية • Fit Brilliance Viewer
                        </span>
                      </div>

                      {/* Clean Iframe without Referrer Header */}
                      <div className="relative w-full aspect-[16/9] min-h-[460px] sm:min-h-[560px] bg-black">
                        <iframe
                          src={normalizedEmbed.embedUrl}
                          title={currentProject.planName || "عرض المشروع المباشر"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                          allowFullScreen
                          referrerPolicy="no-referrer"
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                          className="w-full h-full border-0 absolute inset-0"
                          loading="lazy"
                        />
                      </div>

                      {/* Bottom White-Label Security Bar */}
                      <div className="bg-[#0b1015] px-4 py-2 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-[#94a3b8]">
                        <span>كود المشروع: {currentProject.projectCode}</span>
                        <span className="text-[#ef4444] font-bold font-mono">
                          ★ مصرح للمشاهد: {viewerName} ({companyName})
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#94a3b8] text-center">
                      يمكنك التفاعل مع الشرائح مباشرة، تكبير الشاشة، وتصفح المحتوى والخطط بأعلى دقة.
                    </p>
                  </div>
                ) : (
                  /* Fallback if no embedUrl provided yet */
                  <div className="bg-[#0b1015] border border-[#1e293b] p-8 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/10 text-[#ef4444] border border-[#dc2626]/30 flex items-center justify-center mx-auto">
                      <Presentation className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#f8fafc]">العرض التقديمي المباشر</h4>
                      <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
                        يتم تجهيز ورفع العرض التفاعلي الخاص بمشروعكم من قبل الفريق المشرف. يمكنك مراجعة مراحل الخطة والميثاق في التبويب المجاور.
                      </p>
                    </div>
                    <button
                      onClick={() => handleWhatsAppAction("discuss-custom")}
                      className="px-4 py-2 rounded-xl bg-[#dc2626] hover:bg-[#ef4444] text-white font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>طلب رابط العرض المباشر عبر واتساب</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DETAILED STEPS & CONFIDENTIAL DETAILS */}
            {activeModalTab === 'steps' && (
              <div className="relative z-10 space-y-4">
                <div className="bg-[#0b1015] p-5 rounded-2xl border border-[#1e293b] space-y-2">
                  <h5 className="text-xs font-bold text-[#ef4444]">الرؤية والمسار التنفيذي المعتمد:</h5>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {currentProject.confidentialDetails}
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-[#f8fafc]">مراحل العمل المشترك (الجدول الزمني):</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentProject.executionSteps.map((step, idx) => (
                      <div key={idx} className="bg-[#0b1015] p-3 rounded-xl border border-[#1e293b] text-xs text-[#cbd5e1] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ETHICS & PARTNERSHIP CHARTER */}
            {activeModalTab === 'charter' && (
              <div className="relative z-10 bg-[#0b1015] border border-[#dc2626]/30 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-black text-[#ef4444] text-center border-b border-[#1e293b] pb-3">
                  ميثاق الشراكة والسرية المهنية — Fit Brilliance
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#121a21] p-4 rounded-xl space-y-2 border border-[#1e293b]">
                    <span className="font-mono text-[#ef4444] font-bold block">01 · التكامل وصناعة القيمة</span>
                    <p className="text-[#94a3b8] leading-relaxed">
                      نعمل معاً بروح الفريق الواحد؛ ندمج خبراتنا في التحول والإنتاج والبحث العلمي مع واقع مشروعك لنصنع قيمة حقيقية مستدامة.
                    </p>
                  </div>

                  <div className="bg-[#121a21] p-4 rounded-xl space-y-2 border border-[#1e293b]">
                    <span className="font-mono text-[#ef4444] font-bold block">02 · الحلول المخصصة والدقيقة</span>
                    <p className="text-[#94a3b8] leading-relaxed">
                      نصمم لكل شريك خطة عمل مخصصة تلائم تطلعاته وتحدياته، بما يضمن أعلى درجات الكفاءة وتوفير الموارد.
                    </p>
                  </div>

                  <div className="bg-[#121a21] p-4 rounded-xl space-y-2 border border-[#1e293b]">
                    <span className="font-mono text-[#ef4444] font-bold block">03 · الشفافية والسرية التامة</span>
                    <p className="text-[#94a3b8] leading-relaxed">
                      جميع البيانات والخطط والتسجيلات محمية باتفاقية سرية مهنية غير قابلة للمشاركة خارج نطاق المشروع.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* BOTTOM ACTIONS BAR */}
            <div className="relative z-30 pt-4 border-t border-[#1e293b] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <button
                  onClick={() => handleWhatsAppAction("approve-roadmap")}
                  className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#dc2626]/20 flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>تأكيد واعتماد الخطة عبر واتساب</span>
                </button>

                <button
                  onClick={() => handleWhatsAppAction("discuss-custom")}
                  className="bg-[#121a21] hover:bg-[#1e293b] text-[#f8fafc] border border-[#1e293b] font-black py-3 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  جلسة مناقشة وتخصيص البنود
                </button>

                <button
                  onClick={() => handleWhatsAppAction("feedback")}
                  className="bg-[#121a21] hover:bg-[#1e293b] text-[#ef4444] border border-[#dc2626]/30 font-black py-3 rounded-xl transition-all cursor-pointer"
                >
                  إرسال استفسار مباشر للفريق
                </button>
              </div>

              {/* Feedback Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="اكتب أي ملاحظة أو استفسار تود إرساله مباشرة لكوتش سراج..."
                  className="flex-1 bg-[#121a21] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-[#f8fafc] outline-none focus:border-[#ef4444]"
                />
                <button
                  onClick={() => handleWhatsAppAction("feedback")}
                  className="bg-[#dc2626] hover:bg-[#ef4444] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
