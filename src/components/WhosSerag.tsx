import React, { useEffect, useState } from "react";
import { Language } from "../types";
import { Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface WhosSeragProps {
  lang: Language;
  setActiveTab: (tab: string) => void;
}

// ── Media arrays — faces-only photos removed, certified-blurred photos kept ──

// CERTIFICATES: P102xxxx — displayed in a dedicated, readable section
const certificates: string[] = [
  "/assets/serag-story/P1020695.jpg",
  "/assets/serag-story/P1020696.jpg",
  "/assets/serag-story/P1020697.jpg",
  "/assets/serag-story/P1020698.jpg",
  "/assets/serag-story/P1020699.jpg",
  "/assets/serag-story/P1020700.jpg",
  "/assets/serag-story/P1020701.jpg",
  "/assets/serag-story/P1020702.jpg",
  "/assets/serag-story/P1020703.jpg",
  "/assets/serag-story/P1020706.jpg",
  "/assets/serag-story/P1020709.jpg",
  "/assets/serag-story/P1020710.jpg",
  "/assets/serag-story/P1020711.jpg",
  "/assets/serag-story/P1020712.jpg",
];

// MAIN ARCHIVE: All other media — faces removed, blurred versions kept
const allMedia: string[] = [
  // GIFs (Animations & motion designs)
  "/assets/serag-story/1.gif",
  "/assets/serag-story/2.gif",
  "/assets/serag-story/3.gif",
  "/assets/serag-story/4.gif",
  "/assets/serag-story/5.gif",
  "/assets/serag-story/6.gif",
  "/assets/serag-story/7.gif",
  "/assets/serag-story/8.gif",
  "/assets/serag-story/9.gif",
  // Logos, Designs & Portfolios
  "/assets/serag-story/fit_brilliance_logo_with_website_qr-cutout.png",
  "/assets/serag-story/leadership-academy-identity.png",
  "/assets/serag-story/Portfolio.png",
  "/assets/serag-story/Portfolio1.png",
  "/assets/serag-story/Portfolio2.png",
  "/assets/serag-story/Portfolio3.png",
  "/assets/serag-story/Portfolio4.png",
  "/assets/serag-story/portfolio-art-05.png",
  "/assets/serag-story/umbrella_alex_pro_v111.png",
  "/assets/serag-story/design-untitled.png",
  "/assets/serag-story/24b9c799-f4ea-4881-bd5a-be8db28bf2c0.png",
  // Professional branding grid (studio shoot)
  "/assets/serag-story/759281599_10162748367821128_4938887955135947836_n.png",
  // Projects & Commercial Campaigns (CW Series)
  "/assets/serag-story/CW4.jpg",
  "/assets/serag-story/CW5.jpg",
  "/assets/serag-story/CW6.jpg",
  "/assets/serag-story/CW7.jpg",
  "/assets/serag-story/CW8.jpg",
  // Digital Timeline & Field Archive (blurred / no clear faces)
  "/assets/serag-story/2004-20012 (1).jpg",
  "/assets/serag-story/2004-20012 (2).jpg",
  "/assets/serag-story/2004-20012 (3).jpg",
  "/assets/serag-story/2004-20012 (4).jpg", // blurred group ✓
  "/assets/serag-story/2004-20012 (6).jpg",
  "/assets/serag-story/2004-20012 (7).jpg", // blurred suits ✓
  "/assets/serag-story/2013 (1).jpg",        // Sawahel Academy logo ✓
  "/assets/serag-story/2013 (2).jpg",        // text post ✓
  "/assets/serag-story/2013 (4).jpg",        // Ramadan graphic ✓
  // Blurred personal moments (faces not distinguishable)
  "/assets/serag-story/92db3cd7-85a1-4dc6-8c5a-c4d01df7102d.jpg",  // blurred ✓
  "/assets/serag-story/a00955da-e00a-442f-b5e6-c647dd8a78d8.jpg",   // blurred ✓
  "/assets/serag-story/9c37b7c9-1652-44c7-a0ac-e2c21c1d3fc0.jpg",   // mom+brother ✓
  // Adobe Premiere project — field archive
];

// Combined media for lightbox modal navigation (allMedia + certificates)
const combinedMedia: string[] = [...allMedia, ...certificates];


// Hero slider — full archive including certificates
const heroSlides: string[] = [
  "/assets/serag-story/CW8.jpg",
  "/assets/serag-story/1.gif",
  "/assets/serag-story/2.gif",
  "/assets/serag-story/CW7.jpg",
  "/assets/serag-story/fit_brilliance_logo_with_website_qr-cutout.png",
  "/assets/serag-story/3.gif",
  "/assets/serag-story/Portfolio.png",
  "/assets/serag-story/4.gif",
  "/assets/serag-story/CW6.jpg",
  "/assets/serag-story/5.gif",
  "/assets/serag-story/6.gif",
  "/assets/serag-story/2004-20012 (4).jpg",
  "/assets/serag-story/7.gif",
  "/assets/serag-story/CW5.jpg",
  "/assets/serag-story/8.gif",
  "/assets/serag-story/759281599_10162748367821128_4938887955135947836_n.png",
  "/assets/serag-story/9.gif",
  "/assets/serag-story/2013 (1).jpg",
  "/assets/serag-story/CW4.jpg",
  "/assets/serag-story/2004-20012 (7).jpg",
  "/assets/serag-story/Portfolio2.png",
  "/assets/serag-story/9c37b7c9-1652-44c7-a0ac-e2c21c1d3fc0.jpg",
  "/assets/serag-story/leadership-academy-identity.png",
  "/assets/serag-story/P1020695.jpg",
  "/assets/serag-story/P1020697.jpg",
  "/assets/serag-story/P1020699.jpg",
  "/assets/serag-story/P1020701.jpg",
  "/assets/serag-story/P1020703.jpg",
  "/assets/serag-story/P1020709.jpg",
  "/assets/serag-story/P1020712.jpg",
];

const timelineItems = [
  {
    year: "2002",
    icon: "💻",
    title_ar: "البداية من الصفر",
    title_en: "Started From Zero",
    desc_ar: "سيبر كافيه — هاردوير، نتوورك، وأنظمة. مش مجرد مستخدم للتقنية، بل فهم عميق لآلياتها.",
    desc_en: "Cyber café — hardware, networks, systems. Deep hands-on foundational understanding.",
  },
  {
    year: "2005",
    icon: "🌊",
    title_ar: "إنقاذ بحري ورياضات مائية",
    title_en: "Marine Rescue & Aquatics",
    desc_ar: "شاطئ البريفاج — منقذ بحري محترف ومدرب سباحة تنافسية، انضباط ميداني وقوة تحمل.",
    desc_en: "El Borifage beach — professional marine lifeguard and competitive swimming coach, discipline & endurance.",
  },
  {
    year: "2008",
    icon: "📘",
    title_ar: "الوجود الرقمي الأول",
    title_en: "First Digital Footprint",
    desc_ar: "حساب فيسبوك موثق — بداية الحضور الرقمي المستمر كمرجع زمني.",
    desc_en: "Verified Facebook presence — beginning of a continuous digital timeline.",
  },
  {
    year: "2011",
    icon: "▶️",
    title_ar: "أرشيف يوتيوب",
    title_en: "YouTube Archive",
    desc_ar: "قناة @eg-Old.School — طابع زمني ثابت وعلني يوضح أسبقية الحضور الرقمي.",
    desc_en: "Channel @eg-Old.School — immutable public timestamp demonstrating early digital footprint.",
  },
  {
    year: "2017",
    icon: "🏆",
    title_ar: "بطولات ومؤتمرات دولية",
    title_en: "Championships & Conferences",
    desc_ar: "مشاركة في البطولات المدرسية الأوروبية والمؤتمرات الرياضية الدولية وتدريب الكوادر.",
    desc_en: "European school competitions and international athletic conferences.",
  },
  {
    year: "2020",
    icon: "🏗️",
    title_ar: "إدارة التسويق والعمليات",
    title_en: "Marketing & Operations Leadership",
    desc_ar: "إعادة هيكلة العمليات التجارية، تحسين تدفق الكاش، وربط التسويق بالطاقة التشغيلية الواقعية.",
    desc_en: "Restructured commercial workflows, optimized cashflow, linked marketing to real operations.",
  },
  {
    year: "2022",
    icon: "⚡",
    title_ar: "إطلاق منظومة فيت بريليانس",
    title_en: "Fit Brilliance Ecosystem Launch",
    desc_ar: "استراتيجية الـ 90 يوماً، الإنتاج السينمائي 4K، ودعم أبحاث الدراسات العليا في بيئة متكاملة.",
    desc_en: "90-Day transformation strategy, 4K masterclass production, and academic research advisory.",
  },
  {
    year: "2026",
    icon: "🔴",
    title_ar: "الآن — والفضل لله",
    title_en: "Now — All Credit to God",
    desc_ar: "منظومة متكاملة، 12 قناة اتصال موثقة، نتائج حقيقية وأرشيف رقمي يثبت مسيرة العمل.",
    desc_en: "Comprehensive ecosystem, 12 verified communication channels, real results and digital archive.",
  },
];

export const WhosSerag: React.FC<WhosSeragProps> = ({ lang, setActiveTab }) => {
  const isRtl = lang === "ar";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance slideshow every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + combinedMedia.length) % combinedMedia.length);
    }
  };

  const nextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % combinedMedia.length);
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* ─── HERO: Cinematic Full-bleed Slider ─── */}
      <section className="relative h-[65vh] min-h-[460px] overflow-hidden rounded-3xl mb-12 border border-[#dc2626]/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        {heroSlides.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={src}
              alt="Serag Archive"
              className="w-full h-full object-cover object-center"
              loading={i === 0 ? "eager" : "lazy"}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ))}

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-[#05080c]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080c]/80 via-transparent to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#ef4444] font-mono text-xs font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{isRtl ? "المسيرة الميدانية والأرشيف الموثق" : "The Documented Archive & Journey"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-2 leading-tight">
            {isRtl ? (
              <>من هو <span className="metallic-red-text drop-shadow-[0_4px_20px_rgba(220,38,38,0.5)]">سراج أوندا</span>؟</>
            ) : (
              <>Who is <span className="metallic-red-text drop-shadow-[0_4px_20px_rgba(220,38,38,0.5)]">Serag Onda</span>?</>
            )}
          </h1>

          <p className="text-[#94a3b8] text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
            {isRtl
              ? "مسيرة واقعية بدأت من الصفر في 2002 إلى بناء منظومة تحول متكاملة تجمع بين الاستراتيجية، الإنتاج السينمائي، وأبحاث الدراسات العليا — والفضل لله دائماً وأبداً."
              : "A real-world journey from the ground up in 2002 to engineering an integrated transformation ecosystem combining strategy, 4K production, and research advisory."}
          </p>

          {/* Slider Controls & Counter */}
          <div className="flex items-center gap-4 mt-6">
            <div className="px-3 py-1 rounded-full bg-[#05080c]/80 border border-[#dc2626]/40 text-[#ef4444] font-mono text-xs font-bold">
              {currentSlide + 1} / {heroSlides.length}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="w-7 h-7 rounded-full bg-[#05080c]/80 border border-[#1e293b] hover:border-[#dc2626] flex items-center justify-center text-white text-xs cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                className="w-7 h-7 rounded-full bg-[#05080c]/80 border border-[#1e293b] hover:border-[#dc2626] flex items-center justify-center text-white text-xs cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTRO QUOTE ─── */}
      <section className="max-w-4xl mx-auto px-4 mb-16 text-center">
        <blockquote className="relative p-6 sm:p-8 rounded-3xl bg-[#0b1015]/60 border border-[#1e293b]">
          <p className="text-lg sm:text-2xl font-bold text-[#e2e8f0] leading-relaxed">
            {isRtl
              ? "«إنسان بدأ من الصفر في 2002، لم يسعَ لمجرد مواكبة التطور، بل تتبع مساراته العملية حتى أسس منظومة متكاملة تضع النتائج الموثقة فوق أي ادعاء.»"
              : "“A practical builder who started from zero in 2002 — focusing on measurable outcomes, technical discipline, and real institutional impact.”"}
          </p>
          <p className="text-xs sm:text-sm text-[#ef4444] font-mono mt-3 font-bold">
            — {isRtl ? "سراج أوندا" : "Serag Onda"}
          </p>
        </blockquote>
      </section>

      {/* ─── COMPLETE UNIFIED MEDIA & DIGITAL ARCHIVE ─── */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-[#1e293b] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isRtl ? "المعرض البصري والأرشيف الرقمي الشامل" : "The Complete Visual & Digital Archive"}
              </h2>
            </div>
            <p className="text-xs text-[#94a3b8]">
              {isRtl
                ? `عرض شامل لجميع الملفات والإنتاجات ومتحركات الـ GIF والأرشيف التوثيقي (${allMedia.length} ملف)`
                : `Comprehensive display of all motion GIFs, commercial productions, and field archives (${allMedia.length} assets)`}
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/30 text-xs font-mono text-[#ef4444] font-bold">
            {isRtl ? "انقر على أي ملف لعرضه بالحجم الكامل" : "Click any item to view in full HD"}
          </div>
        </div>

        {/* Unified Media Grid — Without artificial separation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {allMedia.map((src, index) => {
            const isGif = src.endsWith(".gif");
            return (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-[#070a0e] border border-[#1e293b] hover:border-[#dc2626] shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Archive item ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement?.classList.add("hidden");
                  }}
                />

                {/* GIF Indicator Badge */}
                {isGif && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#dc2626] text-[10px] font-black text-white tracking-wider shadow">
                    GIF
                  </div>
                )}

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-[#05080c]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#dc2626]/80 flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── CERTIFICATES & RECORDS — Dedicated Readable Section ─── */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-[#dc2626]/30 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isRtl ? "الشهادات والسجلات الرسمية" : "Official Certificates & Records"}
              </h2>
            </div>
            <p className="text-xs text-[#94a3b8]">
              {isRtl
                ? `${certificates.length} وثيقة وشهادة موثقة — انقر على أي منها للعرض بالحجم الكامل`
                : `${certificates.length} verified certificates & records — click to view full size`}
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/30 text-xs font-mono text-[#ef4444] font-bold">
            📜 {isRtl ? "أرشيف الشهادات" : "Certificates Archive"}
          </div>
        </div>

        {/* 2-column grid — large enough to read the certificate content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {certificates.map((src, index) => (
            <div
              key={index}
              onClick={() => openLightbox(allMedia.length + index)}
              className="group relative rounded-2xl overflow-hidden bg-[#0b1015] border border-[#1e293b] hover:border-[#dc2626] shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
            >
              <img
                src={src}
                alt={`Certificate ${index + 1}`}
                className="w-full object-contain object-center bg-white/5 p-1 transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ minHeight: "280px", maxHeight: "420px" }}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement?.classList.add("hidden");
                }}
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#dc2626] text-[10px] font-black text-white tracking-wider shadow">
                {index + 1} / {certificates.length}
              </div>
              <div className="absolute inset-0 bg-[#05080c]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#dc2626]/80 flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LIGHTBOX MODAL (works for both allMedia + certificates) ─── */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-[#05080c]/95 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-fadeIn"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-[#1e293b]/80 hover:bg-[#dc2626] text-white flex items-center justify-center transition-all cursor-pointer z-50"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#1e293b]/80 hover:bg-[#dc2626] text-white flex items-center justify-center transition-all cursor-pointer z-50"
            aria-label="Previous item"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Main Displayed Media */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center relative"
          >
            <img
              src={combinedMedia[lightboxIndex]}
              alt={`Full view ${lightboxIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-[#dc2626]/40 shadow-[0_0_50px_rgba(220,38,38,0.3)]"
            />
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-mono text-[#94a3b8]">
                {lightboxIndex + 1} / {combinedMedia.length}
              </span>
              {combinedMedia[lightboxIndex]?.endsWith(".gif") && (
                <span className="px-2 py-0.5 rounded bg-[#dc2626] text-[10px] font-black text-white">
                  GIF ANIMATION
                </span>
              )}
            </div>
          </div>

          {/* Navigation Next */}
          <button
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#1e293b]/80 hover:bg-[#dc2626] text-white flex items-center justify-center transition-all cursor-pointer z-50"
            aria-label="Next item"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* ─── FACTUAL TIMELINE ─── */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            {isRtl ? "خط الزمن — المحطات التأسيسية" : "Timeline — Foundational Milestones"}
          </h2>
        </div>

        <div className="space-y-4">
          {timelineItems.map((item, i) => (
            <div
              key={i}
              className={`group flex gap-4 items-start p-4 rounded-2xl bg-[#0b1015] border border-[#1e293b] hover:border-[#dc2626]/50 transition-all ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              <div className="shrink-0 flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-[#05080c] border border-[#1e293b] group-hover:border-[#dc2626]/60 flex items-center justify-center text-xl transition-all shadow-inner">
                  {item.icon}
                </div>
                <span className="text-[11px] font-mono text-[#ef4444] font-black">{item.year}</span>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-sm sm:text-base text-white mb-1">
                  {isRtl ? item.title_ar : item.title_en}
                </h3>
                <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                  {isRtl ? item.desc_ar : item.desc_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── IDENTITY STATS GRID ─── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "20+", label_ar: "سنة مسيرة وتطوير", label_en: "Years Track Record", icon: "🗓️" },
            { num: "12", label_ar: "قناة اتصال موثقة", label_en: "Official Channels", icon: "📡" },
            { num: "2011", label_ar: "أرشيف رقمي مسجل", label_en: "Public Digital Archive", icon: "📁" },
            { num: "90", label_ar: "يوماً — استراتيجية التحول", label_en: "Days — Transformation", icon: "⚡" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glossy-obsidian-card border border-[#1e293b] hover:border-[#dc2626]/40 rounded-2xl p-5 text-center transition-all group hover:scale-[1.02]"
            >
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-[#ef4444] group-hover:scale-110 transition-transform">
                {stat.num}
              </div>
              <div className="text-xs text-[#94a3b8] mt-1 leading-tight font-medium">
                {isRtl ? stat.label_ar : stat.label_en}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── IDENTITY DECLARATION ─── */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-br from-[#0b1015] to-[#120707] border border-[#dc2626]/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
            <span className="text-[#ef4444] font-mono text-xs font-bold uppercase tracking-wider">
              {isRtl ? "مبدأ العمل والتوثيق" : "Guiding Principles"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-4">
            {isRtl ? "الريادة بالأرقام والنتائج — والفضل لله" : "Leadership by Real Results"}
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
            <p>
              {isRtl
                ? "المنظومة قائمة على الهندسة والتنظيم العملي والإنتاج السينمائي الدقيق. لا نعتمد على استعراضات شكلية، بل على منظومات تشغيلية متكاملة تقدم نتائج ملموسة لرواد الأعمال، الباحثين، وأصحاب المشاريع."
                : "The ecosystem is built on systematic design, disciplined execution, and top-tier cinematic production. We focus on measurable business and academic outcomes."}
            </p>
            <p>
              {isRtl
                ? "إذا سبقتنا جهة أو زميل في أي فكرة فلهم منا كامل التقدير والاحترام، وغاية جهدنا هي التطوير والريادة المستمرة بأعلى معايير الجودة والإتقان."
                : "We hold full respect for all pioneers in the field; our commitment is relentless improvement and delivering the highest benchmark of excellence."}
            </p>
            <p className="text-[#ef4444] font-mono text-xs font-bold border-t border-[#1e293b] pt-3 mt-3">
              {isRtl ? "والفضل لله دائماً وأبداً." : "All credit belongs to God, always."}
            </p>
          </div>

          {/* Social Anchors */}
          <div className="flex flex-wrap gap-2.5 mt-6">
            {[
              { label: "Facebook 2008", href: "https://facebook.com/serag.onda", color: "#3b82f6" },
              { label: "YouTube 2011", href: "https://youtube.com/@eg-Old.School", color: "#ef4444" },
              { label: "Instagram", href: "https://instagram.com/serag_onda", color: "#ec4899" },
              { label: "TikTok", href: "https://tiktok.com/@coach.serag", color: "#a3e635" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all hover:scale-105"
                style={{ borderColor: `${s.color}50`, color: s.color, background: `${s.color}15` }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ACTION BUTTONS ─── */}
      <section className="max-w-4xl mx-auto px-4 mb-16 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab("contact")}
            className="neon-red-btn px-8 py-3.5 text-xs sm:text-sm font-black cursor-pointer"
          >
            {isRtl ? "تواصل مع المنظومة الآن" : "Connect with the Ecosystem"}
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            className="neon-black-btn px-8 py-3.5 text-xs sm:text-sm font-bold cursor-pointer"
          >
            {isRtl ? "استعراض خطط الـ 90 يوماً" : "View 90-Day Plans"}
          </button>
        </div>
      </section>
    </div>
  );
};
