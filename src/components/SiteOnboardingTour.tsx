import React, { useState, useEffect } from "react";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCcw
} from "lucide-react";
import { Language } from "../types";

interface TourStep {
  targetId: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  position: "bottom" | "top" | "center";
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "hero-section",
    titleAr: "1. رؤية المنظومة وأصل الريادة منذ 2011",
    titleEn: "1. Ecosystem Vision & Pioneer Origins (2011)",
    descriptionAr: "انطلاقة منظومة Fit Brilliance برعاية كوتش سراج أوندا؛ رؤية تجمع بين التحول الاستراتيجي، الإنتاج السينمائي 4K، والاستشارات الرفيعة.",
    descriptionEn: "The foundation of Fit Brilliance ecosystem by Coach Serag Onda, bridging strategic transformation, 4K production, and executive consulting.",
    position: "bottom",
  },
  {
    targetId: "plans-section",
    titleAr: "2. خطط الـ 90 يوماً حسب السوق الإقليمي",
    titleEn: "2. 90-Day Execution Plans by Regional Market",
    descriptionAr: "لا نؤمن بالقوالب الموحدة! لكل سوق (مصر، دول الخليج، أوروبا وأمريكا) باقة مخصصة بأسعار وقوة شرائية وحلول ميدانية تناسب واقع نشاطك.",
    descriptionEn: "Zero cookie-cutter templates! Each market (Egypt, GCC, Europe & Global) features realistic purchasing power calibration and tailored deliverables.",
    position: "top",
  },
  {
    targetId: "audio-dock",
    titleAr: "3. رحلة الصوت والنشيد السينمائي",
    titleEn: "3. Official Audio Journey & Soundtrack",
    descriptionAr: "استمع للمقطوعات الرسمية («في رحلة» و «مش دايماً») كخلفية صوتية محفزة لرحلتك، مع إمكانية التبديل والتحكم الفوري دون تأخير.",
    descriptionEn: "Listen to the official audio compositions ('Rihla' and 'Mesh Dayman') accompanying your navigation with instant 0ms preloaded streaming.",
    position: "top",
  },
  {
    targetId: "bot-widget",
    titleAr: "4. المساعد الذكي للسكينة والتوجيه",
    titleEn: "4. Serene Smart AI Concierge",
    descriptionAr: "مساعدك الرقمي المباشر المتاح على مدار الساعة للإجابة الفورية، شرح تفاصيل الباقات، وتوجيهك للمسار الأنسب لمشروعك.",
    descriptionEn: "Your 24/7 direct digital concierge providing immediate answers, package details, and navigational routing.",
    position: "top",
  },
  {
    targetId: "assessment-cta",
    titleAr: "5. التشخيص التشريحي وحجز الاستشارة المبدئية",
    titleEn: "5. Diagnostic Blueprint & Consultation",
    descriptionAr: "اطلب فحص نشاطك وعزل الهدر المالي، أو قدم على الاستشارة المبدئية لتحصل على تقرير تحليلي دقيق وموثق.",
    descriptionEn: "Request a deep financial waste audit or book an initial consultation to receive a certified diagnostic roadmap.",
    position: "bottom",
  },
  {
    targetId: "login-gate-btn",
    titleAr: "6. البوابة السيادية وتسجيل الدخول المشفر",
    titleEn: "6. Sovereign Portal & Secure Auth Gate",
    descriptionAr: "حساب العضوية وشبكة الشركاء الموثقة؛ تسجيل دخول سريع وآمن مع شريط جانبي مدمج لقائمة التشغيل الموسيقية.",
    descriptionEn: "Member account and certified partner network; secure fast login with an embedded quick playlist sidebar.",
    position: "bottom",
  },
];

interface SiteOnboardingTourProps {
  lang?: Language;
  onNavigateTab?: (tab: string) => void;
}

export const SiteOnboardingTour: React.FC<SiteOnboardingTourProps> = ({
  lang = "ar",
  onNavigateTab,
}) => {
  const isRtl = lang === "ar";
  const [showPrompt, setShowPrompt] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  // Check on first visit
  useEffect(() => {
    const tourPrompted = localStorage.getItem("fitbrilliance_tour_prompted");
    if (!tourPrompted) {
      // Delay slightly for smooth page load
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for manual restart event
  useEffect(() => {
    const handleStartTour = () => {
      setShowPrompt(false);
      setCurrentStepIndex(0);
      setIsTourActive(true);
    };

    window.addEventListener("fitbrilliance:start-tour", handleStartTour);
    return () => {
      window.removeEventListener("fitbrilliance:start-tour", handleStartTour);
    };
  }, []);

  // Update spotlight rect when step changes
  useEffect(() => {
    if (!isTourActive) return;

    const currentStep = TOUR_STEPS[currentStepIndex];
    if (!currentStep) return;

    // Navigate to appropriate tab if needed
    if (currentStep.targetId === "plans-section" && onNavigateTab) {
      onNavigateTab("plans");
    } else if (currentStep.targetId === "hero-section" && onNavigateTab) {
      onNavigateTab("home");
    }

    const updateRect = () => {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        const rect = element.getBoundingClientRect();
        setSpotlightRect(rect);
      } else {
        // Fallback rect in center of viewport
        setSpotlightRect(null);
      }
    };

    // Give time for scroll/tab switch
    const timeout = setTimeout(updateRect, 350);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, [isTourActive, currentStepIndex, onNavigateTab]);

  const handleAcceptTour = () => {
    localStorage.setItem("fitbrilliance_tour_prompted", "true");
    setShowPrompt(false);
    setCurrentStepIndex(0);
    setIsTourActive(true);
  };

  const handleDismissPrompt = () => {
    localStorage.setItem("fitbrilliance_tour_prompted", "true");
    setShowPrompt(false);
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsTourActive(false);
    localStorage.setItem("fitbrilliance_tour_completed", "true");
  };

  const step = TOUR_STEPS[currentStepIndex];

  return (
    <>
      {/* 1. INITIAL INVITATION MODAL (First Visit) */}
      {showPrompt && (
        <div className="fixed inset-0 z-[100001] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300 font-sans text-right select-none">
          <div className="bg-gradient-to-b from-[#0f172a] via-[#090d14] to-black border-2 border-red-500/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_25px_60px_rgba(220,38,38,0.25)] relative overflow-hidden">
            {/* Glowing Accent Aura */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner">
                  <Compass className="w-5 h-5 text-red-500 animate-spin" style={{ animationDuration: "12s" }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isRtl ? "مرحباً بك في منظومة Fit Brilliance 👑" : "Welcome to Fit Brilliance 👑"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Official Onboarding & Motion Walkthrough
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismissPrompt}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {isRtl
                ? "هل ترغب في جولة سريعة وموجزة (Motion Walkthrough) مع تظليل تفاعلي لشرح أقسام الموقع، باقات الأسواق الإقليمية، وكيفية الاستفادة القصوى من خدماتنا الميدانية والاستشارية؟"
                : "Would you like a brief interactive spotlight walkthrough explaining the ecosystem sections, localized market pricing, and operational capabilities?"}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleAcceptTour}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isRtl ? "نعم، ابدأ الجولة الآن 🚀" : "Yes, Start Tour Now 🚀"}</span>
              </button>

              <button
                type="button"
                onClick={handleDismissPrompt}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border border-slate-800 transition-colors cursor-pointer text-center"
              >
                {isRtl ? "سأتصفح بنفسي" : "Browse on my own"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE MOTION GRAPHIC SPOTLIGHT TOUR */}
      {isTourActive && (
        <div className="fixed inset-0 z-[100000] pointer-events-none select-none font-sans">
          {/* Dimmed Backdrop with Spotlight cutout */}
          <div
            className="absolute inset-0 bg-black/80 transition-all duration-500 pointer-events-auto"
            onClick={handleNext}
          />

          {/* Animated Spotlight Glowing Frame */}
          {spotlightRect && (
            <div
              className="absolute pointer-events-none transition-all duration-500 ease-out border-2 border-red-500 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.7),inset_0_0_20px_rgba(220,38,38,0.2)]"
              style={{
                top: Math.max(10, spotlightRect.top - 8),
                left: Math.max(10, spotlightRect.left - 8),
                width: spotlightRect.width + 16,
                height: spotlightRect.height + 16,
              }}
            >
              {/* Corner Pulsing Brackets */}
              <span className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
              <span className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
              <span className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
              <span className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
            </div>
          )}

          {/* Floating Interactive Walkthrough Card */}
          <div className="fixed bottom-24 sm:bottom-28 left-4 right-4 sm:left-auto sm:right-1/2 sm:translate-x-1/2 z-[100002] max-w-lg w-full pointer-events-auto animate-in slide-in-from-bottom-6 duration-300">
            <div className="bg-[#0b1018]/98 border-2 border-red-500/70 rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-right">
              {/* Card Header with Step Tracker */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-[10px] font-mono text-red-300 font-bold">
                    {isRtl
                      ? `المحطة ${currentStepIndex + 1} من ${TOUR_STEPS.length}`
                      : `Step ${currentStepIndex + 1} of ${TOUR_STEPS.length}`}
                  </span>
                  <div className="flex items-center gap-1">
                    {TOUR_STEPS.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === currentStepIndex
                            ? "w-4 bg-red-500"
                            : idx < currentStepIndex
                            ? "bg-emerald-400"
                            : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleComplete}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isRtl ? "إنهاء" : "Exit"}</span>
                </button>
              </div>

              {/* Step Content */}
              <h4 className="text-sm sm:text-base font-black text-white mb-2">
                {isRtl ? step.titleAr : step.titleEn}
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {isRtl ? step.descriptionAr : step.descriptionEn}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    currentStepIndex === 0
                      ? "opacity-30 cursor-not-allowed text-slate-500"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                  <span>{isRtl ? "السابق" : "Prev"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-black shadow-md shadow-red-600/40 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                  >
                    <span>
                      {currentStepIndex === TOUR_STEPS.length - 1
                        ? isRtl
                          ? "تم، ابدأ التصفح 🌟"
                          : "Finish Tour 🌟"
                        : isRtl
                        ? "التالي"
                        : "Next"}
                    </span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
