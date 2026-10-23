import React, { useState } from "react";
import { Menu, X, Search, Globe, ShieldCheck, PhoneCall, User, Settings, Bot, Compass } from "lucide-react";
import { UserAccount, Language } from "../types";
import { getTranslation } from "../i18n/translations";
import { PWAInstallButton } from "./PWAInstallButton";

declare global {
  interface Window {
    botpress?: {
      open: () => void;
      close: () => void;
      toggle: () => void;
      on: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string, option?: string) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  lang: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  lang,
  onToggleLanguage,
}) => {
  const t = getTranslation(lang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRtl = lang === "ar";

  const handleToggleBotpress = () => {
    if (window.botpress && typeof window.botpress.toggle === "function") {
      window.botpress.toggle();
    } else if (window.botpress && typeof window.botpress.open === "function") {
      window.botpress.open();
    } else {
      const bpLauncher = document.querySelector<HTMLElement>(
        '#bp-web-widget-container button, .bpw-launcher, [aria-label*="chat"], [aria-label*="Chat"]'
      );
      if (bpLauncher) {
        bpLauncher.click();
      }
    }
  };

  const clientNavItems = [
    { id: "home", label: t.navHome },
    { id: "whos-serag", label: isRtl ? "مسيرة كوتش سراج" : "Coach Serag Bio" },
    { id: "diagnostic-99", label: isRtl ? "قيّم مشروعك (مجاناً)" : "Free Assessment" },
    { id: "squad-vetting", label: isRtl ? "شريك عمل" : "Partner Vetting" },
    { id: "plans", label: t.navPlans },
    { id: "reviews", label: t.navReviews },
    { id: "policies", label: isRtl ? "السياسات والحقوق" : "Policies" },
    { id: "contact", label: t.navContact },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#070a0e]/95 backdrop-blur-xl border-b border-[#1e293b] px-3 sm:px-6 py-2.5 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          onClick={() => setActiveTab("home")}
        >
          <div className="h-10 sm:h-12 flex items-center">
            <img
              src="/assets/logo/fitbrilliance_todo4u_logo_thumb.webp"
              alt="FitBrilliance ToDo4U"
              width="150"
              height="53"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#0d1318] px-2 py-1.5 rounded-2xl border border-[#1e293b] text-xs font-bold text-[#94a3b8]">
          {clientNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white font-bold shadow-[0_0_15px_rgba(220,38,38,0.35)]"
                    : "hover:bg-[#1e293b] hover:text-[#f8fafc]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Left side: Action Buttons - Unified Luxury Palette */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 bg-[#0d1318] hover:bg-[#1e293b] border border-[#1e293b] text-[#cbd5e1] hover:text-white font-bold px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
            title={lang === "ar" ? "Switch to English" : "التحويل للغة العربية"}
            aria-label={lang === "ar" ? "Switch to English" : "التحويل للغة العربية"}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          {/* Search Code Button */}
          <button
            onClick={() => setActiveTab("home")}
            className="hidden sm:flex items-center gap-1.5 bg-[#0d1318] hover:bg-[#1e293b] border border-[#1e293b] text-[#94a3b8] hover:text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
            aria-label={t.searchCode}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.searchCode}</span>
          </button>


          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Quick Tour Trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("fitbrilliance:start-tour"))}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title={isRtl ? "شرح سريع وموجز للموقع (Motion Walkthrough)" : "Site Walkthrough"}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRtl ? "شرح الموقع" : "Tour"}</span>
          </button>

          {/* Account / Portal Button */}
          <button
            id="login-gate-btn"
            onClick={() => setActiveTab("account")}
            className="flex items-center gap-1.5 bg-[#0d1318] hover:bg-[#1e293b] border border-[#dc2626]/40 text-[#f8fafc] font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
            aria-label={isRtl ? "تسجيل الدخول / حماية" : "Login / Portal"}
          >
            <User className="w-3.5 h-3.5 text-[#ef4444]" />
            <span className="hidden sm:inline">{isRtl ? "تسجيل الدخول" : "Login / Portal"}</span>
            <span className="sm:hidden">{isRtl ? "حسابي" : "Account"}</span>
          </button>

          {/* Merged Communication & AI Concierge Hub */}
          <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#0b1017]/95 border border-blue-500/40 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.2)] shrink-0">
            {/* Integrated Smart Bot (Botpress Concierge) Embed */}
            <button
              type="button"
              onClick={handleToggleBotpress}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-950/80 to-[#0e1726] hover:from-blue-900/90 hover:to-[#16233b] border border-blue-400/50 hover:border-blue-300 text-white transition-all cursor-pointer group shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0 min-h-[36px]"
              title={isRtl ? "المساعد الذكي المباشر (24/7) — استجابة فورية وتوجيه المسار" : "Smart AI Guide (24/7)"}
            >
              {/* Solid Blue Robot Icon (Fixed, no spinning star) */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-[0_0_10px_rgba(37,99,235,0.6)] shrink-0 border border-blue-300/40 group-hover:scale-105 transition-transform">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-100" />
              </div>

              {/* Anchored Dedicated Text Block */}
              <div className="flex flex-col text-right leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-black text-white group-hover:text-blue-300 transition-colors">
                    {isRtl ? "المساعد الذكي المباشر" : "Smart AI Guide"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-blue-500/20 border border-blue-400/40 text-[9px] font-mono text-blue-300 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isRtl ? "24/7" : "LIVE"}</span>
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-blue-200/90 font-medium hidden md:inline">
                  {isRtl ? "شرح الخدمات وتوجيه المسار" : "Instant Navigator & Guide"}
                </span>
              </div>
            </button>

            {/* WhatsApp Direct Line - Metallic Red (Merged alongside in same hub) */}
            <a
              href="https://wa.me/201274534493"
              target="_blank"
              rel="noreferrer"
              aria-label={isRtl ? "واتساب مباشر" : "Direct WhatsApp"}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#dc2626] to-[#991b1b] hover:from-[#ef4444] hover:to-[#b91c1c] text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(220,38,38,0.35)] cursor-pointer min-h-[36px]"
              title={isRtl ? "واتساب مباشر للتواصل السريع" : "WhatsApp Direct Line"}
            >
              <PhoneCall className="w-3.5 h-3.5 text-white" />
              <span className="hidden lg:inline">{isRtl ? "واتساب مباشر" : "WhatsApp"}</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#cbd5e1] border border-[#1e293b] rounded-xl bg-[#0d1318] cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center"
            aria-label={isRtl ? "فتح القائمة" : "Open Menu"}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#1e293b] flex flex-col gap-2 pb-2 text-xs">

          {clientNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl ${isRtl ? "text-right" : "text-left"} transition-all cursor-pointer ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white font-bold"
                  : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>
      )}
    </nav>
  );
};
