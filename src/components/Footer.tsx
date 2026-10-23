import React, { useState } from "react";
import { Mail, Phone, ExternalLink, ShieldCheck, Sparkles, Video, GraduationCap, ArrowUpRight, ChevronDown, ChevronUp, Bot } from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface FooterProps {
  setActiveTab: (tab: string, option?: string) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, lang }) => {
  const t = getTranslation(lang);
  const isRtl = lang === "ar";
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [channelsAccordionOpen, setChannelsAccordionOpen] = useState(false);

  return (
    <footer className="mt-20 border-t border-[#1e293b] bg-[#070a0e] text-[#94a3b8] text-xs pt-12 pb-24 sm:pb-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* 1. TOP HEADER: Brand Statement & Social Verified Channels (Balanced & Symmetrical) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#1e293b]/80">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo/fitbrilliance_todo4u_logo_thumb.webp"
                alt="Fit Brilliance Ecosystem"
                width="160"
                height="40"
                className="h-9 w-auto object-contain"
              />
              <span className="px-2.5 py-0.5 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-[10px] font-mono font-bold tracking-wider">
                {isRtl ? "منظومة معتمدة 2026" : "Verified Ecosystem 2026"}
              </span>
            </div>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              {isRtl
                ? "المنظومة المتكاملة للتحول والاستشارات المؤسسية، إنتاج وتصوير الفعاليات والمحتوى التدريسي، وخدمات أبحاث الدراسات العليا برعاية كوتش سراج أوندا."
                : "Comprehensive ecosystem for institutional transformation, event & masterclass production, and postgraduate academic research supervised by Coach Serag Onda."}
            </p>
          </div>

          {/* Social Channels Pills */}
          <div className="space-y-2 w-full lg:w-auto">
            <div className="flex items-center justify-between lg:justify-end gap-2">
              <span className="text-[10px] font-mono text-[#cbd5e1] font-bold uppercase tracking-wider">
                {isRtl ? "القنوات والمنصات الرسمية:" : "Official Channels:"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://www.youtube.com/@eg-Old.School"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#ef4444]/10 hover:bg-[#ef4444]/25 text-[#ef4444] border border-[#ef4444]/30 transition-all flex items-center gap-1.5 text-xs font-bold shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                title={isRtl ? "قناة اليوتيوب الرسمية" : "Official YouTube"}
              >
                <YouTubeIcon className="w-3.5 h-3.5 text-[#ef4444]" />
                <span>YouTube</span>
              </a>
              <a
                href="https://facebook.com/serag.onda"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#0e141a] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#1e293b] transition-all text-xs font-bold"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/serag_onda"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#0e141a] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#1e293b] transition-all text-xs font-bold"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com/@coach.serag"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#0e141a] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#1e293b] transition-all text-xs font-bold"
              >
                TikTok
              </a>
              <a
                href="https://x.com/Mostafa_Serag_O"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#0e141a] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#1e293b] transition-all text-xs font-bold font-mono"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>

        {/* 2. MIDDLE SECTION: 3 Balanced Equal Cards (Pioneers | Balanced | Executive Quick Access) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          
          {/* Card 1: Pioneers Brilliance (Field & 4K Production) */}
          <div className="bg-[#0b1015] border border-[#1e293b] hover:border-[#dc2626]/50 p-4 rounded-2xl transition-all flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/assets/logo/pioneers_brilliance_logo_thumb.webp" alt="Pioneers" width="32" height="32" className="w-8 h-8 rounded-full object-cover border border-[#dc2626]/50" />
                  <div>
                    <h4 className="font-bold text-xs text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">{isRtl ? "فريق Pioneers Brilliance" : "Pioneers Brilliance"}</h4>
                    <span className="text-[10px] font-mono text-[#ef4444] block">{isRtl ? "إنتاج 4K والتحول الميداني" : "4K Production & Field"}</span>
                  </div>
                </div>
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                {isRtl ? "تصوير الفعاليات السينمائي 4K، إنتاج المحتوى التدريسي، وتنفيذ خطط التحول الميداني لـ 90 يوماً." : "4K event filming, masterclass production, and 90-day field transformation execution."}
              </p>
              <div className="flex flex-wrap gap-1">
                {[isRtl?"4K سينمائي":"4K Cinematic", isRtl?"90 يوماً":"90-Day", isRtl?"مؤتمرات":"Conferences"].map(chip=>(
                  <span key={chip} className="px-2 py-0.5 rounded bg-[#121a21] border border-[#1e293b] text-[10px] text-[#cbd5e1] font-mono">{chip}</span>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1e293b] pt-3 mt-4 space-y-2 font-mono text-xs">
              <a href="https://wa.me/201274534493" target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#ef4444]/10 hover:bg-[#ef4444]/25 border border-[#ef4444]/30 text-[#ef4444] font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)]">
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /><span>01274534493</span></div>
                <span className="text-[11px] flex items-center gap-0.5">{isRtl?"واتساب (2)":"WhatsApp (2)"}<ArrowUpRight className="w-3 h-3" /></span>
              </a>
              <a href="mailto:pioneers@fitbrilliance.store" className="flex items-center gap-1.5 px-2 py-1.5 text-[#cbd5e1] hover:text-[#f8fafc] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#ef4444]" /><span className="truncate">pioneers@fitbrilliance.store</span>
              </a>
            </div>
          </div>

          {/* Card 2: Balanced Brilliance (Turnaround & Academic Research) */}
          <div className="bg-[#0b1015] border border-[#1e293b] hover:border-[#dc2626]/50 p-4 rounded-2xl transition-all flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/assets/logo/balanced_brilliance_logo_thumb.webp" alt="Balanced" width="32" height="32" className="w-8 h-8 rounded-full object-cover border border-[#dc2626]/50" />
                  <div>
                    <h4 className="font-bold text-xs text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">{isRtl ? "فريق Balanced Brilliance" : "Balanced Brilliance"}</h4>
                    <span className="text-[10px] font-mono text-[#ef4444] block">{isRtl ? "الإنقاذ المؤسسي والدراسات العليا" : "Turnaround & Academic"}</span>
                  </div>
                </div>
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                {isRtl ? "استشارات التوازن وإنقاذ الأنشطة المتعثرة، أبحاث الدراسات العليا، والتحليل الإحصائي المتقدم (SPSS/AMOS)." : "Turnaround consulting, postgraduate research, statistical analysis (SPSS/AMOS) and executive rescue."}
              </p>
              <div className="flex flex-wrap gap-1">
                {[isRtl?"إنقاذ مؤسسي":"Rescue", isRtl?"دراسات عليا":"Postgrad", isRtl?"تحليل إحصائي":"SPSS"].map(chip=>(
                  <span key={chip} className="px-2 py-0.5 rounded bg-[#121a21] border border-[#1e293b] text-[10px] text-[#cbd5e1] font-mono">{chip}</span>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1e293b] pt-3 mt-4 space-y-2 font-mono text-xs">
              <a href="https://wa.me/201274879442" target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#ef4444]/10 hover:bg-[#ef4444]/25 border border-[#ef4444]/30 text-[#ef4444] font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)]">
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /><span>01274879442</span></div>
                <span className="text-[11px] flex items-center gap-0.5">{isRtl?"واتساب (1)":"WhatsApp (1)"}<ArrowUpRight className="w-3 h-3" /></span>
              </a>
              <a href="mailto:balanced@fitbrilliance.store" className="flex items-center gap-1.5 px-2 py-1.5 text-[#cbd5e1] hover:text-[#f8fafc] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#ef4444]" /><span className="truncate">balanced@fitbrilliance.store</span>
              </a>
            </div>
          </div>

          {/* Card 3: Executive Office & Quick Navigator */}
          <div className="bg-[#0b1015] border border-[#1e293b] hover:border-[#dc2626]/50 p-4 rounded-2xl transition-all flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setQuickLinksOpen((prev) => !prev)}
                className="w-full flex items-center justify-between text-right pb-2.5 border-b border-[#1e293b] cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">
                      {isRtl ? "المكتب التنفيذي والروابط السريعة" : "Executive Office & Navigation"}
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 font-bold">
                      {isRtl ? "8 بوابات" : "8 Portals"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5">
                    {isRtl ? "تصفح سريع لكافة بوابات ومصفوفات المنظومة" : "Instant access to all system matrixes"}
                  </p>
                </div>
                <div className={`w-7 h-7 rounded-lg bg-[#121a21] border border-[#1e293b] flex items-center justify-center text-[#ef4444] transition-transform duration-300 ${quickLinksOpen ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Accordion Body: Compact 2-Column Grid */}
              {quickLinksOpen ? (
                <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1 text-xs animate-in fade-in duration-200">
                  {[
                    { label: t.navHome, tab: "home" },
                    { label: isRtl ? "مسيرة كوتش سراج" : "Coach Serag Bio", tab: "whos-serag" },
                    { label: isRtl ? "قيّم مشروعك (مجاناً)" : "Free Assessment", tab: "diagnostic-99" },
                    { label: isRtl ? "شريك عمل (الخلية)" : "Squad Partner", tab: "squad-vetting" },
                    { label: t.navPlans, tab: "plans" },
                    { label: isRtl ? "السياسات والحقوق" : "Policies", tab: "policies" },
                    { label: isRtl ? "تجارب العملاء" : "Reviews", tab: "reviews" },
                    { label: t.navContact, tab: "contact" },
                  ].map(({ label, tab }) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="text-right flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#121a21]/80 hover:bg-[#121a21] hover:text-[#ef4444] border border-[#1e293b]/60 transition-all text-[#cbd5e1] cursor-pointer text-[11px]"
                    >
                      <span className="truncate">{label}</span>
                      <span className="text-[#ef4444] text-[10px] shrink-0 mr-1">←</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                  {isRtl ? "إشراف مباشر ومتابعة ميدانية لكافة طلبات التحول المؤسسي وشراكات العمل الاستراتيجية." : "Direct executive supervision over all institutional transformation & partner vetting."}
                </p>
              )}
            </div>

            {/* Coach Serag Direct Contacts */}
            <div className="mt-4 pt-3 border-t border-[#1e293b] font-mono grid grid-cols-2 gap-2">
              <a
                href="https://wa.me/201274879442"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#ef4444]/10 hover:bg-[#ef4444]/25 border border-[#ef4444]/30 text-[#ef4444] font-bold text-xs transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>01274879442</span>
              </a>
              <a
                href="mailto:serag@fitbrilliance.store"
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#121a21] hover:bg-[#1c2631] text-[#cbd5e1] hover:text-[#f8fafc] text-xs transition-colors border border-[#1e293b]"
              >
                <Mail className="w-3.5 h-3.5 text-[#ef4444]" />
                <span className="truncate">serag@</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2.5 CENTERED SMART BOT & AI CONCIERGE PROMPT BANNER */}
        <div className="max-w-3xl mx-auto my-6 text-center">
          <div className="bg-gradient-to-r from-blue-950/40 via-[#0a101b]/95 to-blue-950/40 border-2 border-blue-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_10px_40px_rgba(37,99,235,0.22)] backdrop-blur-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400 mx-auto shadow-lg shadow-blue-950">
              <Bot className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isRtl ? "المساعد الذكي والموجّه الآلي المباشر" : "Interactive Smart AI Concierge"}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isRtl
                  ? "تحتاج إرشاداً فورياً حول باقات الـ 90 يوماً أو تصوير 4K أو الدراسات العليا؟"
                  : "Need instant guidance on 90-day transformation, 4K production, or research?"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                {isRtl
                  ? "المساعد الذكي متاح على مدار الساعة للإجابة المباشرة، شرح الخطوات التشغيلية، ومساعدتك في اختيار الباقة والمسار الأنسب لمشروعك."
                  : "Our intelligent guide is available 24/7 to provide immediate answers and help you navigate the optimal roadmap."}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (window.botpress && typeof window.botpress.toggle === "function") {
                    window.botpress.toggle();
                  } else if (window.botpress && typeof window.botpress.open === "function") {
                    window.botpress.open();
                  } else {
                    const bpLauncher = document.querySelector<HTMLElement>(
                      '#bp-web-widget-container button, .bpw-launcher, [aria-label*="chat"], [aria-label*="Chat"]'
                    );
                    if (bpLauncher) bpLauncher.click();
                  }
                }}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(37,99,235,0.45)] hover:scale-105 active:scale-95"
              >
                <Bot className="w-4 h-4" />
                <span>{isRtl ? "بدء المحادثة الفورية مع المساعد الذكي" : "Start Live Chat with AI Guide"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. LOWER SECTION: ACCORDION FOR 12 OFFICIAL CORPORATE INBOXES */}
        <div className="bg-[#0b1015] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl transition-all">
          {/* Accordion Trigger Header */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setChannelsAccordionOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setChannelsAccordionOpen((prev) => !prev);
              }
            }}
            className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 hover:bg-[#101720]/60 transition-colors text-right cursor-pointer group focus:outline-none focus:ring-1 focus:ring-red-500/50"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-[#f8fafc] group-hover:text-red-400 transition-colors">
                    {isRtl ? "دليل قنوات الاتصال والبريد المؤسسي المعتمد (12 قناة رسمية)" : "Verified Corporate Inboxes Directory (12 Official Channels)"}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-mono font-bold">
                    {channelsAccordionOpen ? (isRtl ? "انقر للإغلاق" : "Click to Collapse") : (isRtl ? "عرض القنوات" : "Expand")}
                  </span>
                </div>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  {isRtl ? "المسارات الرسمية المعتمدة لفرق التحول، الإنتاج، الدراسات، الحوكمة والنزاهة" : "Official verified routing for executive, production, research, governance and ethics"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 mr-auto sm:mr-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("contact");
                }}
                className="text-xs text-red-400 hover:text-red-300 hover:underline font-bold font-mono cursor-pointer min-h-[36px] flex items-center"
              >
                {isRtl ? "توجيه رسالة عبر مركز التواصل ←" : "Direct Message via Contact Center →"}
              </button>
              <div className={`w-8 h-8 rounded-xl bg-[#121a21] border border-[#1e293b] flex items-center justify-center text-[#ef4444] transition-transform duration-300 ${channelsAccordionOpen ? "rotate-180" : ""}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Accordion Expandable Content */}
          {channelsAccordionOpen && (
            <div className="p-5 pt-2 border-t border-[#1e293b]/70 space-y-6 animate-in slide-in-from-top-3 fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Executive Division */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-red-400 font-bold border-b border-[#1e293b]/70 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {isRtl ? "القيادة التنفيذية والعمليات الميدانية" : "Executive & Operations"}
                    </span>
                    <span className="text-[#94a3b8]">serag@fitbrilliance.store</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                    <a href="mailto:serag@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-red-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-red-400">serag@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "المكتب التنفيذي" : "Executive"}</span>
                    </a>
                    <a href="mailto:core@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-red-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-red-400">core@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "التحول 90 يوماً" : "Core"}</span>
                    </a>
                    <a href="mailto:pioneers@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-red-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-red-400">pioneers@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "الإنتاج 4K" : "4K Media"}</span>
                    </a>
                    <a href="mailto:balanced@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-red-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-red-400">balanced@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "الدراسات العليا" : "Research"}</span>
                    </a>
                    <a href="mailto:creative@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-red-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-red-400">creative@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "الإدارة الإبداعية" : "Creative"}</span>
                    </a>
                    <a href="mailto:new@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-red-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-red-400">new@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "العملاء الجدد" : "New Deals"}</span>
                    </a>
                  </div>
                </div>

                {/* Governance Division */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-blue-400 font-bold border-b border-[#1e293b]/70 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {isRtl ? "الحوكمة، الدعم والامتثال المؤسسي" : "Governance & Support"}
                    </span>
                    <span className="text-[#94a3b8]">support@fitbrilliance.store</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                    <a href="mailto:support@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-blue-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-blue-400">support@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "الدعم المركزي" : "Support"}</span>
                    </a>
                    <a href="mailto:support.legal@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-blue-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-blue-400">support.legal@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "الملكية الفكرية" : "Legal IP"}</span>
                    </a>
                    <a href="mailto:governance@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-blue-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-blue-400">governance@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "الحوكمة" : "Governance"}</span>
                    </a>
                    <a href="mailto:ethics-integrity@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-blue-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-blue-400">ethics-integrity@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "النزاهة" : "Ethics"}</span>
                    </a>
                    <a href="mailto:assistance@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-blue-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-blue-400">assistance@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "المسار السريع" : "Concierge"}</span>
                    </a>
                    <a href="mailto:join-team@fitbrilliance.store" className="p-2.5 min-h-[44px] rounded-xl bg-[#0e141a] hover:bg-[#141b24] hover:text-blue-400 border border-[#1e293b] flex items-center justify-between transition-colors group">
                      <span className="truncate text-[#f1f5f9] group-hover:text-blue-400">join-team@</span>
                      <span className="text-[10px] text-[#94a3b8]">{isRtl ? "التوظيف" : "Careers"}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. BOTTOM BAR: Copyright & Protected System */}
        <div className="pt-6 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <p className="text-xs text-[#94a3b8]">
            {isRtl
              ? "جميع الحقوق محفوظة © 2026 منظومة سراج أوندا — Fit Brilliance Ecosystem"
              : "All Rights Reserved © 2026 Serag Onda Ecosystem — Fit Brilliance"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <span className="text-[#94a3b8] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ef4444]" />
              <span>{isRtl ? "منظومة موثقة ومحمية ببصمة سيادية" : "Verified & Protected Sovereign System"}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
