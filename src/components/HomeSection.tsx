import React, { useState } from "react";
import {
  ArrowRight, Sparkles, Lock, Video, GraduationCap,
  TrendingUp, Camera, BookOpen, Activity,
  Smartphone, Users, MessageSquare, ShieldCheck, Zap, BarChart3,
  Mail, Building2, Copy, Check, ChevronDown, ChevronUp
} from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";

interface HomeSectionProps {
  setActiveTab: (tab: string, option?: string) => void;
  onOpenProjectCode?: (code: string) => void;
  lang: Language;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ setActiveTab, onOpenProjectCode, lang }) => {
  const t = getTranslation(lang);
  const [projectCodeInput, setProjectCodeInput] = useState("");
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [openExecSector, setOpenExecSector] = useState(false);
  const [openGovSector, setOpenGovSector] = useState(false);
  const isRtl = lang === "ar";

  const handleCopyEmail = (emailStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(emailStr);
    setCopiedChannel(emailStr);
    setTimeout(() => setCopiedChannel(null), 2500);
  };

  const handleLookupProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectCodeInput.trim()) return;
    if (onOpenProjectCode) {
      onOpenProjectCode(projectCodeInput.trim());
    } else {
      setActiveTab("consultation", "improvement_plan");
    }
  };

  return (
    <div className="py-8 space-y-16 select-none">

      {/* 1. HERO SECTION */}
      <div id="hero-section" className="relative rounded-3xl glossy-obsidian-card p-6 sm:p-14 overflow-hidden shadow-2xl space-y-12">

        {/* Ambient Crimson Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#dc2626]/20 via-[#ef4444]/08 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#dc2626]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">

          {/* Full-Size Fit Brilliance Cutout Logo */}
          <div className="flex justify-center mb-6">
            <div className="float-anim drop-shadow-[0_0_40px_rgba(220,38,38,0.35)] hover:drop-shadow-[0_0_60px_rgba(239,68,68,0.55)] transition-all duration-500">
              <picture>
                {/* Mobile: 33KB WebP */}
                <source
                  media="(max-width: 640px)"
                  srcSet="/assets/logo/fit_brilliance_logo_with_website_qr-cutout-mobile.webp"
                  type="image/webp"
                />
                {/* Desktop: 60KB WebP (vs 383KB PNG — 6× faster LCP) */}
                <source
                  srcSet="/assets/logo/fit_brilliance_logo_with_website_qr-cutout-800.webp"
                  type="image/webp"
                />
                {/* Fallback PNG */}
                <img
                  src="/assets/logo/fit_brilliance_logo_with_website_qr-cutout.png"
                  alt="Fit Brilliance — Design by Serag Onda"
                  width="520"
                  height="200"
                  className="w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[520px] h-auto object-contain"
                  loading="eager"
                  decoding="sync"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.endsWith("/favicon.png")) {
                      img.src = "/favicon.png";
                    }
                  }}
                />
              </picture>
            </div>
          </div>

          {/* Top Banner: Ask Google or ChatGPT about Serag Onda / Coach Serag / Fitbrilliance */}
          <div className="flex justify-center max-w-xl mx-auto px-2 mb-2">
            <img
              src="/assets/ask_google_chatgpt_banner.jpg"
              alt={isRtl ? "متحترش كتير... عارف دول: Serag Onda Or Coach Serag Or Fitbrilliance - اسأل عنهم Google Or ChatGPT" : "Ask Google or ChatGPT about Serag Onda, Coach Serag or Fitbrilliance"}
              className="w-full max-w-[420px] sm:max-w-[480px] h-auto object-contain drop-shadow-[0_4px_25px_rgba(234,179,8,0.3)] rounded-2xl hover:scale-[1.02] transition-transform duration-300"
              loading="eager"
            />
          </div>

          {/* Main Vision Statement — Golden Calligraphy Image */}
          <div className="flex justify-center">
            <img
              src="/assets/vision-quote.webp"
              alt={isRtl ? "نرى ما لا يراه الآخرون... لنفعل ما لا يستطيع الآخرون فعله" : "We see what others cannot... to do what others cannot do"}
              className="float-anim w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[680px] h-auto object-contain drop-shadow-[0_0_45px_rgba(212,160,23,0.55)] hover:drop-shadow-[0_0_70px_rgba(212,160,23,0.75)] transition-all duration-700"
              loading="eager"
              decoding="sync"
              width="680"
              height="200"
            />
          </div>
          {/* Subtitle */}
          <h1 className="sr-only">
            {isRtl ? "نرى ما لا يراه الآخرون... لنفعل ما لا يستطيع الآخرون فعله" : "We see what others cannot — to do what others cannot do"}
          </h1>

          <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mx-auto max-w-2xl font-medium">
            {isRtl
              ? "المنظومة المتكاملة للتحول المؤسسي، تصوير وإنتاج الفعاليات التدريبية، ودعم الدراسات العليا برعاية كوتش سراج أوندا."
              : "The premier integrated ecosystem for enterprise transformation, 4K masterclass event filming, and academic research advisory."}
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab("diagnostic-99")}
              className="px-7 py-3.5 neon-red-btn text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-lg shadow-[#dc2626]/30 animate-pulse"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isRtl ? "قيّم مشروعك (مجاناً) — عرض التدشين الحصري" : "Assess Your Project (Free Launch Offer)"}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("whos-serag")}
              className="px-6 py-3.5 bg-gradient-to-r from-[#180a0a] to-[#121a21] hover:bg-[#1a2430] border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 rounded-2xl transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? "مسيرة كوتش سراج، المعرض والأغنية" : "Coach Serag Bio & Soundtrack"}</span>
            </button>

            <button
              onClick={() => setActiveTab("squad-vetting")}
              className="px-6 py-3.5 bg-[#121a21] hover:bg-[#1a2430] border border-[#dc2626]/40 hover:border-[#ef4444] text-[#f8fafc] text-xs sm:text-sm font-bold flex items-center gap-2 rounded-2xl transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#ef4444]" />
              <span>{isRtl ? "انضم كشريك عمل (الخلية الخماسية)" : "Join Squad Partner"}</span>
            </button>

            <button
              onClick={() => setActiveTab("plans")}
              className="px-6 py-3.5 neon-black-btn text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
              <span>{isRtl ? "استعراض خطط الـ 90 يوماً" : "Explore 90-Day Plans"}</span>
            </button>
          </div>
        </div>

        {/* 3 CORE GATEWAYS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-4">

          {/* Gateway 1: Fit Brilliance Core */}
          <div className="glossy-obsidian-card rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between group hover:border-[#dc2626] transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 glossy-red-pill text-[11px] font-mono font-black">
                  {isRtl ? "01 البوابة الأولى" : "01 Gateway"}
                </span>
                <TrendingUp className="w-5 h-5 text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">
                  Fit Brilliance Core
                </h2>
                <p className="text-xs text-[#94a3b8] leading-relaxed mt-2 font-medium">
                  {isRtl ? "بوابة التحول وإعادة الهيكلة، خطط الـ 90 يوماً، واستشارات الدراسات العليا." : "Strategic Transformation, 90-Day Modeling & Academic Research."}
                </p>
              </div>

              <ul className="space-y-2 text-xs text-[#cbd5e1] pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
                  <span>{isRtl ? "خطط الـ 90 يوماً وعزل الهدر" : "90-Day Plans & Cashflow Defense"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
                  <span>{isRtl ? "أبحاث الدراسات العليا (SPSS / AMOS)" : "Postgraduate Research (SPSS/AMOS)"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
                  <span>{isRtl ? "التشخيص الميداني والنمذجة المالية" : "Field Diagnosis & Financial Modeling"}</span>
                </li>
              </ul>
            </div>

            <button
              id="assessment-cta"
              onClick={() => setActiveTab("assessment")}
              className="w-full py-3 neon-red-btn text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isRtl ? "دخول بوابة الأعمال" : "Enter Core Gateway"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Gateway 2: Pioneers Media Hub */}
          <div className="glossy-obsidian-card rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between group hover:border-[#b91c1c] transition-all duration-300 border-[#dc2626]/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#dc2626]/15 text-[#f87171] text-[11px] font-mono font-black border border-[#dc2626]/30">
                  {isRtl ? "02 البوابة الثانية" : "02 Gateway"}
                </span>
                <Camera className="w-5 h-5 text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">
                  Pioneers Media Hub
                </h2>
                <p className="text-xs text-[#94a3b8] leading-relaxed mt-2 font-medium">
                  {isRtl ? "إنتاج وتصوير الفعاليات والمؤتمرات والكورسات التعليمية بأعلى دقة سينمائية 4K." : "Cinematic 4K Event Filming, Masterclasses, and Digital Content."}
                </p>
              </div>

              <ul className="space-y-2 text-xs text-[#cbd5e1] pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
                  <span>{isRtl ? "تغطية الفعاليات والمؤتمرات الكبرى" : "Major Events & Conferences Coverage"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
                  <span>{isRtl ? "تصوير الكورسات والمحتوى التدريسي" : "Masterclasses & Studio Production"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
                  <span>{isRtl ? "إنتاج الإعلانات والحملات المرئية" : "Ads Visual Production & Vertical Reels"}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab("pioneers")}
              className="w-full py-3 neon-red-btn text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isRtl ? "دخول بوابة الإنتاج" : "Enter Media Hub"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Gateway 3: Balanced Brilliance */}
          <div className="glossy-obsidian-card rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between group hover:border-[#991b1b] transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#dc2626]/10 text-[#f87171] text-[11px] font-mono font-black border border-[#dc2626]/25">
                  {isRtl ? "03 البوابة الثالثة" : "03 Gateway"}
                </span>
                <Lock className="w-5 h-5 text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">
                  Balanced Brilliance
                </h2>
                <p className="text-xs text-[#94a3b8] leading-relaxed mt-2 font-medium">
                  {isRtl ? "المساحة الآمنة المشفرة، دوائر الدعم، والاستشارات السرية دون الكشف عن الهوية." : "Confidential Safe Space, Support Circles, and Private Advisory."}
                </p>
              </div>

              <ul className="space-y-2 text-xs text-[#cbd5e1] pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
                  <span>{isRtl ? "دخول مجهول 100% بدون أي سجلات" : "100% Zero-Log Anonymous Entry"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
                  <span>{isRtl ? "غرف الدعم المباشر ومكالمات مشفرة" : "Encrypted Live Support Rooms"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shadow-[0_0_6px_#dc2626]" />
                  <span>{isRtl ? "مكتبة الإرشاد والتوازن النفسي والمهني" : "Guidance & Mental Balance Library"}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab("balanced")}
              className="w-full py-3 neon-black-btn hover:border-[#dc2626] hover:text-[#ef4444] text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isRtl ? "دخول المساحة الآمنة" : "Enter Safe Space"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE 90-DAY TRANSFORMATION TARGET MATRIX (Upgraded 3D Glowing Tracker) */}
      <div className="relative rounded-3xl overflow-hidden border border-[#dc2626]/40 bg-[#06080d] shadow-[0_0_50px_rgba(220,38,38,0.25)] transition-all">
        {/* Ambient Plasma Glow */}
        <div className="absolute -top-20 right-1/4 w-[500px] h-[300px] bg-gradient-to-b from-[#dc2626]/20 via-[#991b1b]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* High-Resolution 3D Glowing Visual Banner */}
        <div className="relative w-full overflow-hidden">
          <img
            src="/assets/kpi_tracker_90_glowing.jpg"
            alt={isRtl ? "مؤشرات النجاح ومعايير أداء الـ 90 يوماً" : "90-Day KPI Tracker & Growth Metrics"}
            className="w-full h-auto object-cover rounded-3xl select-none"
            loading="lazy"
          />
        </div>
      </div>

      {/* 3. OFFICIAL VERIFIED SOCIAL CHANNELS */}
      <div className="glossy-obsidian-card rounded-3xl p-6 sm:p-8 border border-[#dc2626]/25 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/3 w-96 h-28 bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] p-0.5 shadow-[0_0_15px_rgba(220,38,38,0.4)] shrink-0">
              <div className="w-full h-full bg-[#05080c] rounded-[14px] flex items-center justify-center">
                <img
                  src="/assets/logo/fit_brilliance_logo_sm.webp"
                  alt="Fit Brilliance"
                  width="28"
                  height="28"
                  className="w-7 h-7 object-contain"
                />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#ef4444] font-bold tracking-wider uppercase block">
                {isRtl ? "قنوات التواصل الرسمية" : "Official Channels"}
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-[#f8fafc]">
                {isRtl ? "تابعنا على المنصات الرسمية" : "Follow Us Across Official Platforms"}
              </h2>
            </div>
          </div>

          <div className="text-xs text-[#94a3b8] font-mono">
            {isRtl ? "جميع الحسابات موثقة ومعتمدة من المنظومة" : "All accounts verified & officially anchored"}
          </div>
        </div>

        {/* Channels Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Facebook - Verified Anchor */}
          <div className="p-4 rounded-2xl bg-[#0a0f16] border border-[#1e293b] hover:border-blue-500/50 hover:bg-[#0c1420] transition-all flex flex-col justify-between gap-3 group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm">
                  f
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#f8fafc] font-bold text-xs sm:text-sm">Facebook</span>
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] font-bold" title="Meta Verified">
                      ✓
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8] font-mono block">@serag.onda</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-mono border border-blue-500/30">
                {isRtl ? "موثق Meta" : "Meta Verified"}
              </span>
            </div>

            <a
              href="https://facebook.com/serag.onda"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#141b24] hover:bg-blue-600 hover:text-white border border-[#223145] text-xs font-bold text-[#cbd5e1] transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isRtl ? "متابعة الحساب الرسمي" : "Follow Page"}</span>
              <span className="text-[11px]">↗</span>
            </a>
          </div>

          {/* YouTube - Digital Archive */}
          <div className="p-4 rounded-2xl bg-[#0a0f16] border border-[#1e293b] hover:border-red-500/50 hover:bg-[#140c0e] transition-all flex flex-col justify-between gap-3 group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-black text-xs">
                  ▶
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#f8fafc] font-bold text-xs sm:text-sm">YouTube</span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8] font-mono block">@eg-Old.School</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-mono border border-red-500/30">
                {isRtl ? "أرشيف 2011" : "Archive 2011"}
              </span>
            </div>

            <a
              href="https://www.youtube.com/@eg-Old.School"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#141b24] hover:bg-red-600 hover:text-white border border-[#223145] text-xs font-bold text-[#cbd5e1] transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isRtl ? "زيارة القناة والأرشيف" : "Visit Channel"}</span>
              <span className="text-[11px]">↗</span>
            </a>
          </div>

          {/* Instagram */}
          <div className="p-4 rounded-2xl bg-[#0a0f16] border border-[#1e293b] hover:border-pink-500/50 hover:bg-[#140d13] transition-all flex flex-col justify-between gap-3 group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-xs">
                  📷
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#f8fafc] font-bold text-xs sm:text-sm">Instagram</span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8] font-mono block">@serag_onda</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[#1e293b] text-[#94a3b8] text-[10px] font-mono border border-[#334155]">
                {isRtl ? "المحتوى المرئي" : "Visual"}
              </span>
            </div>

            <a
              href="https://instagram.com/serag_onda"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#141b24] hover:bg-pink-600 hover:text-white border border-[#223145] text-xs font-bold text-[#cbd5e1] transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isRtl ? "متابعة" : "Follow"}</span>
              <span className="text-[11px]">↗</span>
            </a>
          </div>

          {/* TikTok */}
          <div className="p-4 rounded-2xl bg-[#0a0f16] border border-[#1e293b] hover:border-[#dc2626]/50 hover:bg-[#111620] transition-all flex flex-col justify-between gap-3 group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#1e293b] text-[#cbd5e1] border border-[#334155] flex items-center justify-center text-xs">
                  ♪
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#f8fafc] font-bold text-xs sm:text-sm">TikTok</span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8] font-mono block">@coach.serag</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[#1e293b] text-[#94a3b8] text-[10px] font-mono border border-[#334155]">
                {isRtl ? "فيديوهات قصيرة" : "Shorts"}
              </span>
            </div>

            <a
              href="https://tiktok.com/@coach.serag"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#141b24] hover:bg-red-600 hover:text-white border border-[#223145] text-xs font-bold text-[#cbd5e1] transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isRtl ? "متابعة" : "Follow"}</span>
              <span className="text-[11px]">↗</span>
            </a>
          </div>

          {/* X Platform */}
          <div className="p-4 rounded-2xl bg-[#0a0f16] border border-[#1e293b] hover:border-[#dc2626]/50 hover:bg-[#111620] transition-all flex flex-col justify-between gap-3 group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#1e293b] text-[#cbd5e1] border border-[#334155] flex items-center justify-center font-bold text-xs">
                  𝕏
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#f8fafc] font-bold text-xs sm:text-sm">X Platform</span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8] font-mono block">@Mostafa_Serag_O</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[#1e293b] text-[#94a3b8] text-[10px] font-mono border border-[#334155]">
                {isRtl ? "التحديثات" : "Updates"}
              </span>
            </div>

            <a
              href="https://x.com/Mostafa_Serag_O"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#141b24] hover:bg-red-600 hover:text-white border border-[#223145] text-xs font-bold text-[#cbd5e1] transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isRtl ? "متابعة" : "Follow"}</span>
              <span className="text-[11px]">↗</span>
            </a>
          </div>

          {/* WhatsApp Direct */}
          <div className="p-4 rounded-2xl bg-[#0a0f16] border border-[#1e293b] hover:border-green-500/50 hover:bg-[#0c1812] transition-all flex flex-col justify-between gap-3 group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-green-600/20 text-green-400 border border-green-500/30 flex items-center justify-center text-xs">
                  📱
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#f8fafc] font-bold text-xs sm:text-sm">WhatsApp</span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8] font-mono block">+20 127 487 9442</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[10px] font-mono border border-green-500/30">
                {isRtl ? "مباشر" : "Direct"}
              </span>
            </div>

            <a
              href="https://wa.me/201274879442"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#141b24] hover:bg-green-600 hover:text-white border border-[#223145] text-xs font-bold text-[#cbd5e1] transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isRtl ? "محادثة فورية" : "Chat on WhatsApp"}</span>
              <span className="text-[11px]">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3.5. OFFICIAL CORPORATE INBOXES & COMMUNICATION NETWORK (11 CHANNELS) */}
      <div className="glossy-obsidian-card rounded-3xl p-6 sm:p-10 border border-[#dc2626]/30 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-32 bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border-b border-[#1e293b] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] p-0.5 shadow-[0_0_20px_rgba(220,38,38,0.4)] shrink-0">
              <div className="w-full h-full bg-[#05080c] rounded-[14px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#ef4444]" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#ef4444] font-black tracking-widest uppercase block">
                {isRtl ? "شبكة قنوات التواصل المعتمدة • 12 قناة اتصال" : "Official Communication Network • 12 Verified Channels"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#f8fafc]">
                {isRtl ? "دليل قنوات الاتصال والبريد المؤسسي الرسمي" : "Corporate Directory & Departmental Inboxes"}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("contact")}
            className="px-5 py-2.5 rounded-full neon-red-btn text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>{isRtl ? "فتح مركز المراسلات المباشر ←" : "Open Direct Contact Center →"}</span>
          </button>
        </div>

        {/* Accordion Controls Bar */}
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-[#94a3b8]">
            {isRtl ? "اضغط على أي قطاع لفتح القنوات أو طيّها لتوفير المساحة:" : "Click on any sector to expand or collapse channels:"}
          </p>
          <div className="flex gap-2 text-xs font-mono">
            <button
              onClick={() => { setOpenExecSector(true); setOpenGovSector(true); }}
              className="px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1e293b] text-[#cbd5e1] hover:text-white transition-colors"
            >
              {isRtl ? "عرض الكل" : "Expand All"}
            </button>
            <button
              onClick={() => { setOpenExecSector(false); setOpenGovSector(false); }}
              className="px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1e293b] text-[#cbd5e1] hover:text-white transition-colors"
            >
              {isRtl ? "طي الكل" : "Collapse All"}
            </button>
          </div>
        </div>

        {/* The Two Executive Divisions as Accordion */}
        <div className="space-y-4">

          {/* Division 1: Executive Leadership & Field Operations (Accordion) */}
          <div className="rounded-2xl bg-[#0a0f16] border border-[#1e293b] overflow-hidden shadow-xl transition-all">
            {/* Accordion Header */}
            <button
              onClick={() => setOpenExecSector((prev) => !prev)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-right hover:bg-[#111822] transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base text-[#f8fafc]">
                      {isRtl ? "قطاع القيادة التنفيذية والعمليات الميدانية" : "Executive Leadership & Field Directorate"}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                      {isRtl ? "6 قنوات معتمدة" : "6 Channels"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    {isRtl
                      ? "إشراف كوتش سراج، خطط التحول 90 يوماً، وتصوير الفعاليات السينمائية"
                      : "Coach Serag oversight, 90-day transformation, and 4K media production"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-lg font-bold">
                  serag@fitbrilliance.store
                </span>
                <div className={`w-8 h-8 rounded-xl bg-[#1e293b]/60 flex items-center justify-center text-red-400 transition-transform duration-300 ${openExecSector ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* Accordion Content */}
            {openExecSector && (
              <div className="p-5 pt-1 border-t border-[#1e293b]/80 space-y-3 bg-[#080d13]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {[
                    {
                      email: "serag@fitbrilliance.store",
                      title: isRtl ? "المكتب التنفيذي لكوتش سراج أوندا" : "Office of Coach Serag Onda",
                      sub: isRtl ? "الرؤية والقيادة والشراكات الكبرى المباشرة" : "Executive principal oversight & strategic deals",
                      badge: isRtl ? "المكتب التنفيذي" : "Principal",
                      priority: true,
                    },
                    {
                      email: "core@fitbrilliance.store",
                      title: isRtl ? "النواة الاستراتيجية — Core" : "Strategic Operations — Core",
                      sub: isRtl ? "استشارات النمذجة التشغيلية وخطط الـ 90 يوماً" : "Operational modeling & 90-day plans",
                      badge: isRtl ? "التحول المؤسسي" : "Transformation",
                    },
                    {
                      email: "pioneers@fitbrilliance.store",
                      title: isRtl ? "الإنتاج والتصوير السينمائي — Pioneers" : "4K Cinema Filming — Pioneers",
                      sub: isRtl ? "تغطيات المؤتمرات، الكورسات والريلز السينمائي" : "Event filming & masterclass production",
                      badge: isRtl ? "الإنتاج 4K" : "4K Media",
                    },
                    {
                      email: "balanced@fitbrilliance.store",
                      title: isRtl ? "الأبحاث والمساحة الآمنة — Balanced" : "Research & Safe Space — Balanced",
                      sub: isRtl ? "استشارات رسائل الماجستير والدكتوراه والدعم الخاص" : "Postgraduate advisory & safe space",
                      badge: isRtl ? "الدراسات العليا" : "Academic",
                    },
                    {
                      email: "creative@fitbrilliance.store",
                      title: isRtl ? "الإدارة الإبداعية والمونتاج — Creative" : "Creative Directorate & Montage",
                      sub: isRtl ? "الإخراج الفني، السرد البصري والمونتاج عالي التأثير" : "Art direction & high-impact editing",
                      badge: isRtl ? "الإشراف الفني" : "Creative",
                    },
                    {
                      email: "new@fitbrilliance.store",
                      title: isRtl ? "المشاريع والفرص الجديدة — New" : "New Ventures & Onboarding — New",
                      sub: isRtl ? "استقبال العملاء الجدد وتأسيس الشركات وانطلاق الشراكات" : "First-time client onboarding & ventures",
                      badge: isRtl ? "العملاء الجدد" : "New Deals",
                    },
                  ].map((item) => (
                    <div
                      key={item.email}
                      className="p-3 rounded-xl bg-[#0e141a] border border-[#1e293b] hover:border-red-500/40 hover:bg-[#111822] transition-all flex flex-col justify-between gap-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#f8fafc] truncate">{item.title}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${item.priority ? "bg-red-500/15 text-red-400 border-red-500/40" : "bg-[#1e293b] text-[#94a3b8] border-[#334155]"}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94a3b8] truncate">{item.sub}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#1e293b]/50">
                        <a
                          href={`mailto:${item.email}`}
                          className="font-mono text-xs text-red-400 hover:text-red-300 hover:underline font-bold truncate"
                        >
                          {item.email}
                        </a>
                        <button
                          type="button"
                          onClick={(e) => handleCopyEmail(item.email, e)}
                          title={isRtl ? "نسخ البريد" : "Copy Email"}
                          className="p-1 rounded-lg hover:bg-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc] transition-colors cursor-pointer"
                        >
                          {copiedChannel === item.email ? (
                            <span className="text-[10px] font-mono font-bold text-green-400 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Division 2: Governance, Compliance & Central Support (Accordion) */}
          <div className="rounded-2xl bg-[#0a0f16] border border-[#1e293b] overflow-hidden shadow-xl transition-all">
            {/* Accordion Header */}
            <button
              onClick={() => setOpenGovSector((prev) => !prev)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-right hover:bg-[#111822] transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base text-[#f8fafc]">
                      {isRtl ? "قطاع الحوكمة، الامتثال والدعم المركزي" : "Governance, Compliance & Support Hub"}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold">
                      {isRtl ? "6 قنوات معتمدة" : "6 Channels"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    {isRtl
                      ? "الحماية القانونية للملكية الفكرية، ميثاق الأخلاقيات، والدعم الفوري على مدار 24/7"
                      : "Legal IP protection, ethics compliance, and 24/7 rapid concierge support"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline font-mono text-xs text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-lg font-bold">
                  support@fitbrilliance.store
                </span>
                <div className={`w-8 h-8 rounded-xl bg-[#1e293b]/60 flex items-center justify-center text-blue-400 transition-transform duration-300 ${openGovSector ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* Accordion Content */}
            {openGovSector && (
              <div className="p-5 pt-1 border-t border-[#1e293b]/80 space-y-3 bg-[#080d13]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {[
                    {
                      email: "support@fitbrilliance.store",
                      title: isRtl ? "مركز العمليات والدعم المركزي" : "Central Support Operations Hub",
                      sub: isRtl ? "خدمة العملاء المستمرة والمتابعة التشغيلية 24/7" : "24/7 ongoing ticketing and customer operations",
                      badge: isRtl ? "الدعم المركزي" : "Central Support",
                      priority: true,
                    },
                    {
                      email: "support.legal@fitbrilliance.store",
                      title: isRtl ? "الشؤون القانونية والملكية الفكرية" : "Legal Affairs & IP Protection",
                      sub: isRtl ? "حماية حقوق الابتكار (قانون 82/2002) والعقود الموثقة" : "IP enforcement & corporate agreements",
                      badge: isRtl ? "المستشار القانوني" : "Legal",
                    },
                    {
                      email: "governance@fitbrilliance.store",
                      title: isRtl ? "الحوكمة والامتثال المؤسسي" : "Corporate Governance & Compliance",
                      sub: isRtl ? "تدقيق السياسات والمعايير التشغيلية وضمان النزاهة" : "Policy auditing & operational governance",
                      badge: isRtl ? "لجنة الحوكمة" : "Governance",
                    },
                    {
                      email: "ethics-integrity@fitbrilliance.store",
                      title: isRtl ? "ميثاق الأخلاقيات والنزاهة" : "Ethics & Research Integrity",
                      sub: isRtl ? "ضمان الأمانة العلمية والتدقيق ومكافحة الانتحال" : "Academic honesty & anti-plagiarism verification",
                      badge: isRtl ? "ميثاق النزاهة" : "Ethics",
                    },
                    {
                      email: "assistance@fitbrilliance.store",
                      title: isRtl ? "المساعدة والدعم الفوري" : "Rapid Assistance Concierge",
                      sub: isRtl ? "المسار السريع لتلبية احتياجات العملاء والطلبات الطارئة" : "Fast-track urgent client support",
                      badge: isRtl ? "المسار السريع" : "Concierge",
                    },
                    {
                      email: "join-team@fitbrilliance.store",
                      title: isRtl ? "استقطاب الكفاءات والتوظيف" : "Talent Acquisition & Careers",
                      sub: isRtl ? "طلبات انضمام المصورين، المحللين، والاستشاريين المبدعين" : "Filmmakers & consultant recruitment",
                      badge: isRtl ? "التوظيف" : "Careers",
                    },
                  ].map((item) => (
                    <div
                      key={item.email}
                      className="p-3 rounded-xl bg-[#0e141a] border border-[#1e293b] hover:border-blue-500/40 hover:bg-[#111822] transition-all flex flex-col justify-between gap-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#f8fafc] truncate">{item.title}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${item.priority ? "bg-blue-500/15 text-blue-400 border-blue-500/40" : "bg-[#1e293b] text-[#94a3b8] border-[#334155]"}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94a3b8] truncate">{item.sub}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#1e293b]/50">
                        <a
                          href={`mailto:${item.email}`}
                          className="font-mono text-xs text-blue-400 hover:text-blue-300 hover:underline font-bold truncate"
                        >
                          {item.email}
                        </a>
                        <button
                          type="button"
                          onClick={(e) => handleCopyEmail(item.email, e)}
                          title={isRtl ? "نسخ البريد" : "Copy Email"}
                          className="p-1 rounded-lg hover:bg-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc] transition-colors cursor-pointer"
                        >
                          {copiedChannel === item.email ? (
                            <span className="text-[10px] font-mono font-bold text-green-400 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 4. QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="glossy-obsidian-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between items-center text-center space-y-4 hover:border-[#dc2626] transition-all">
          <div className="w-14 h-14 rounded-2xl bg-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center text-[#ef4444] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-[#f8fafc] font-bold text-sm">{isRtl ? "طلب الانضمام الموحد للمبدعين" : "Unified Creators Recruitment"}</h3>
            <p className="text-xs text-[#94a3b8] mt-1">{isRtl ? "نموذج واحد للتقديم (تصوير، إنتاج، استشارات)" : "One form for all talents (Media, Consulting)"}</p>
          </div>
          <button
            onClick={() => setActiveTab("team-app")}
            className="w-full py-2.5 neon-black-btn hover:border-[#dc2626] hover:text-[#ef4444] text-xs font-bold transition-all cursor-pointer"
          >
            {isRtl ? "قدّم طلب انضمام الآن" : "Apply to Join Us"}
          </button>
        </div>

        <div className="glossy-obsidian-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between items-center text-center space-y-4 hover:border-[#dc2626] transition-all">
          <div className="w-14 h-14 rounded-2xl bg-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center text-[#ef4444] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-[#f8fafc] font-bold text-sm">{isRtl ? "غرفة الاجتماعات والتنسيق المباشر" : "Private Meetings & Operations Room"}</h3>
            <p className="text-xs text-[#94a3b8] mt-1">{isRtl ? "غرفة خاصة بالتنسيق وإدارة المشاريع المغلقة" : "Closed operational coordination room"}</p>
          </div>
          <button
            onClick={() => setActiveTab("admin")}
            className="w-full py-2.5 neon-red-btn text-xs font-black transition-all cursor-pointer"
          >
            {isRtl ? "الدخول للغرفة المغلقة" : "Enter Private Room"}
          </button>
        </div>
      </div>

      {/* 5. PROJECT CODE LOOKUP */}
      <div className="glossy-obsidian-card border border-[#dc2626]/25 p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto space-y-3 text-center shadow-2xl">
        <h3 className="text-sm font-bold text-[#f8fafc] flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          {t.lookupTitle}
        </h3>
        <p className="text-[11px] text-[#94a3b8] leading-relaxed max-w-md mx-auto">
          {t.lookupSub}
        </p>
        <form onSubmit={handleLookupProject} className="flex gap-2 max-w-md mx-auto pt-2">
          <input
            type="text"
            required
            value={projectCodeInput}
            onChange={(e) => setProjectCodeInput(e.target.value)}
            placeholder={t.lookupPlaceholder}
            className="flex-1 bg-[#05080c] border border-[#1e293b] focus:border-[#dc2626] rounded-full px-5 py-2.5 text-xs text-[#f8fafc] outline-none font-mono transition-colors shadow-inner"
          />
          <button
            type="submit"
            className="neon-red-btn px-6 py-2.5 text-xs font-black cursor-pointer"
          >
            {t.lookupBtn}
          </button>
        </form>
      </div>

    </div>
  );
};
