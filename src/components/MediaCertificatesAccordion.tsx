import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Award,
  Image as ImageIcon,
  Film,
  Building2,
  Palette,
  Clock,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Language } from "../types";

export interface MediaItem {
  id: string;
  src: string;
  title_ar: string;
  title_en: string;
  category: "certificate" | "commercial" | "branding" | "motion" | "history";
  category_ar: string;
  category_en: string;
  date?: string;
  isGif?: boolean;
}

// ── Official Certificates (14 documents) ──
export const CERTIFICATES_DATA: MediaItem[] = [
  { id: "cert-01", src: "/assets/serag-story/P1020695.jpg", title_ar: "شهادة اعتماد وتدريب رسمي #01", title_en: "Official Accreditation Certificate #01", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-02", src: "/assets/serag-story/P1020696.jpg", title_ar: "شهادة اعتماد وسجل توثيق #02", title_en: "Official Accreditation Certificate #02", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-03", src: "/assets/serag-story/P1020697.jpg", title_ar: "شهادة اجتياز واعتماد مهني #03", title_en: "Professional Competence Certificate #03", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-04", src: "/assets/serag-story/P1020698.jpg", title_ar: "وثيقة اعتماد رسمي وتصريح #04", title_en: "Official Permit & Accreditation #04", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-05", src: "/assets/serag-story/P1020699.jpg", title_ar: "شهادة تدريب تخصصي متقدم #05", title_en: "Advanced Specialized Certificate #05", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-06", src: "/assets/serag-story/P1020700.jpg", title_ar: "سجل اعتماد واجتياز رسمي #06", title_en: "Official Accreditation Record #06", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-07", src: "/assets/serag-story/P1020701.jpg", title_ar: "شهادة مشاركة واعتماد ميداني #07", title_en: "Field Participation Certificate #07", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-08", src: "/assets/serag-story/P1020702.jpg", title_ar: "شهادة تأهيل واختبار كفاءة #08", title_en: "Qualification & Competency Record #08", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-09", src: "/assets/serag-story/P1020703.jpg", title_ar: "وثيقة وسجل اعتماد معتمد #09", title_en: "Verified Accreditation Record #09", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-10", src: "/assets/serag-story/P1020706.jpg", title_ar: "شهادة تفوق وإنجاز تدريبي #10", title_en: "Training Excellence Certificate #10", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-11", src: "/assets/serag-story/P1020709.jpg", title_ar: "شهادة اعتماد رسمي وتكريم #11", title_en: "Official Recognition & Award #11", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-12", src: "/assets/serag-story/P1020710.jpg", title_ar: "شهادة معتمدة وسجل توثيقي #12", title_en: "Accredited Documentation Certificate #12", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-13", src: "/assets/serag-story/P1020711.jpg", title_ar: "شهادة خبرة واعتماد مهني #13", title_en: "Professional Experience Record #13", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
  { id: "cert-14", src: "/assets/serag-story/P1020712.jpg", title_ar: "وثيقة وسجل التخرج والاعتماد #14", title_en: "Graduation & Accreditation Record #14", category: "certificate", category_ar: "شهادة رسمية", category_en: "Official Certificate" },
];

// ── Categorized Photos & Assets (37 items) ──
export const COMMERCIAL_PHOTOS: MediaItem[] = [
  { id: "cw-04", src: "/assets/serag-story/CW4.jpg", title_ar: "حملة الإنتاج التجاري والتصوير — CW4", title_en: "Commercial Production & Shoot — CW4", category: "commercial", category_ar: "إنتاج تجاري", category_en: "Commercial Shoot" },
  { id: "cw-05", src: "/assets/serag-story/CW5.jpg", title_ar: "حملة الإنتاج التجاري والتصوير — CW5", title_en: "Commercial Production & Shoot — CW5", category: "commercial", category_ar: "إنتاج تجاري", category_en: "Commercial Shoot" },
  { id: "cw-06", src: "/assets/serag-story/CW6.jpg", title_ar: "حملة الإنتاج التجاري والتصوير — CW6", title_en: "Commercial Production & Shoot — CW6", category: "commercial", category_ar: "إنتاج تجاري", category_en: "Commercial Shoot" },
  { id: "cw-07", src: "/assets/serag-story/CW7.jpg", title_ar: "حملة الإنتاج التجاري والتصوير — CW7", title_en: "Commercial Production & Shoot — CW7", category: "commercial", category_ar: "إنتاج تجاري", category_en: "Commercial Shoot" },
  { id: "cw-08", src: "/assets/serag-story/CW8.jpg", title_ar: "حملة الإنتاج التجاري والتصوير — CW8", title_en: "Commercial Production & Shoot — CW8", category: "commercial", category_ar: "إنتاج تجاري", category_en: "Commercial Shoot" },
];

export const BRANDING_PHOTOS: MediaItem[] = [
  { id: "brand-logo", src: "/assets/serag-story/fit_brilliance_logo_with_website_qr-cutout.png", title_ar: "شعار وهوية منظومة Fit Brilliance", title_en: "Fit Brilliance Ecosystem Identity & QR", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-leadership", src: "/assets/serag-story/leadership-academy-identity.png", title_ar: "هوية أكاديمية القيادة الرياضية", title_en: "Sports Leadership Academy Identity", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-port-main", src: "/assets/serag-story/Portfolio.png", title_ar: "غلاف بورتفوليو الإنتاج المتكامل", title_en: "Master Portfolio Showcase Cover", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-port-1", src: "/assets/serag-story/Portfolio1.png", title_ar: "نماذج بورتفوليو الأعمال الإعلانية 01", title_en: "Commercial Portfolio Sample 01", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-port-2", src: "/assets/serag-story/Portfolio2.png", title_ar: "نماذج بورتفوليو الأعمال الإعلانية 02", title_en: "Commercial Portfolio Sample 02", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-port-3", src: "/assets/serag-story/Portfolio3.png", title_ar: "نماذج بورتفوليو الأعمال الإعلانية 03", title_en: "Commercial Portfolio Sample 03", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-port-4", src: "/assets/serag-story/Portfolio4.png", title_ar: "نماذج بورتفوليو الأعمال الإعلانية 04", title_en: "Commercial Portfolio Sample 04", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-port-art", src: "/assets/serag-story/portfolio-art-05.png", title_ar: "تصميم بورتفوليو فني مخصص 05", title_en: "Custom Artistic Portfolio 05", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-umbrella", src: "/assets/serag-story/umbrella_alex_pro_v111.png", title_ar: "مشروع وهوية مظلة أليكس برو", title_en: "Alex Pro Umbrella Project Identity", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-untitled", src: "/assets/serag-story/design-untitled.png", title_ar: "تكوين جرافيكي فني تجريدي", title_en: "Abstract Graphic Art Composition", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-assets", src: "/assets/serag-story/24b9c799-f4ea-4881-bd5a-be8db28bf2c0.png", title_ar: "أيقونات وهوية الأصول الرقمية", title_en: "Digital Brand Assets & Vector Suite", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
  { id: "brand-shoot", src: "/assets/serag-story/759281599_10162748367821128_4938887955135947836_n.png", title_ar: "جلسة تصوير براندينج رسمية", title_en: "Official Executive Branding Shoot", category: "branding", category_ar: "هوية بصرية", category_en: "Brand Identity" },
];

export const MOTION_GIFS: MediaItem[] = [
  { id: "gif-01", src: "/assets/serag-story/1.gif", title_ar: "متحرك إنتاجي ديناميكي 01", title_en: "Motion Production Asset 01", category: "motion", category_ar: "متحرك إنتاجي GIF", category_en: "Motion GIF", isGif: true },
  { id: "gif-02", src: "/assets/serag-story/2.gif", title_ar: "متحرك إنتاجي ديناميكي 02", title_en: "Motion Production Asset 02", category: "motion", category_ar: "متحرك إنتاجي GIF", category_en: "Motion GIF", isGif: true },
  { id: "gif-03", src: "/assets/serag-story/3.gif", title_ar: "متحرك إنتاجي ديناميكي 03", title_en: "Motion Production Asset 03", category: "motion", category_ar: "متحرك إنتاجي GIF", category_en: "Motion GIF", isGif: true },
  { id: "gif-04", src: "/assets/serag-story/4.gif", title_ar: "متحرك إنتاجي ديناميكي 04", title_en: "Motion Production Asset 04", category: "motion", category_ar: "متحرك إنتاجي GIF", category_en: "Motion GIF", isGif: true },
  { id: "gif-05", src: "/assets/serag-story/5.gif", title_ar: "متحرك إنتاجي ديناميكي 05", title_en: "Motion Production Asset 05", category: "motion", category_ar: "متحرك إنتاجي GIF", category_en: "Motion GIF", isGif: true },
  { id: "gif-06", src: "/assets/serag-story/6.gif", title_ar: "متحرك إنتاجي ديناميكي 06", title_en: "Motion Production Asset 06", category: "motion", category_ar: "متحرك إنتاجي GIF", category_en: "Motion GIF", isGif: true },
  { id: "gif-07", src: "/assets/serag-story/7.gif", title_ar: "متحرك إنتاجي ديناميكي 07", title_en: "Motion Production Asset 07", category: "motion", category_ar: "متحرك إنتاجي GIF", category_en: "Motion GIF", isGif: true },
  { id: "gif-08", src: "/assets/serag-story/8.gif", title_ar: "متحرك إنتاجي ديناميكي 08", title_en: "Motion Production Asset 08", category: "motion", category_ar: "متحرك إنتاجي GIF", category_en: "Motion GIF", isGif: true },
  { id: "gif-09", src: "/assets/serag-story/9.gif", title_ar: "متحرك إنتاجي ديناميكي 09", title_en: "Motion Production Asset 09", category: "motion", category_ar: "متحرك إنتاجي GIF", category_en: "Motion GIF", isGif: true },
];

export const HISTORICAL_PHOTOS: MediaItem[] = [
  { id: "hist-01", src: "/assets/serag-story/2004-20012 (1).jpg", title_ar: "أرشيف المسيرة التأسيسية (2004 - 2012) - 01", title_en: "Historical Archive (2004 - 2012) - 01", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive", date: "2004 - 2012" },
  { id: "hist-02", src: "/assets/serag-story/2004-20012 (2).jpg", title_ar: "أرشيف المسيرة التأسيسية (2004 - 2012) - 02", title_en: "Historical Archive (2004 - 2012) - 02", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive", date: "2004 - 2012" },
  { id: "hist-03", src: "/assets/serag-story/2004-20012 (3).jpg", title_ar: "أرشيف المسيرة التأسيسية (2004 - 2012) - 03", title_en: "Historical Archive (2004 - 2012) - 03", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive", date: "2004 - 2012" },
  { id: "hist-04", src: "/assets/serag-story/2004-20012 (4).jpg", title_ar: "أرشيف العمل الميداني والإنقاذ البحري (2004 - 2012)", title_en: "Field Work & Marine Rescue Archive (2004 - 2012)", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive", date: "2004 - 2012" },
  { id: "hist-05", src: "/assets/serag-story/2004-20012 (6).jpg", title_ar: "أرشيف الفعاليات والمشاركات (2004 - 2012)", title_en: "Events & Engagements (2004 - 2012)", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive", date: "2004 - 2012" },
  { id: "hist-06", src: "/assets/serag-story/2004-20012 (7).jpg", title_ar: "أرشيف المؤتمرات والاجتماعات الرسمية (2004 - 2012)", title_en: "Conferences & Formal Delegations (2004 - 2012)", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive", date: "2004 - 2012" },
  { id: "hist-07", src: "/assets/serag-story/2013 (1).jpg", title_ar: "أرشيف 2013 — أكاديمية السواحل والأنشطة", title_en: "2013 Archive — Sawahel Academy & Activities", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive", date: "2013" },
  { id: "hist-08", src: "/assets/serag-story/2013 (2).jpg", title_ar: "أرشيف 2013 — التوثيق الرقمي والمنشورات", title_en: "2013 Archive — Digital Footprint Post", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive", date: "2013" },
  { id: "hist-09", src: "/assets/serag-story/2013 (4).jpg", title_ar: "أرشيف 2013 — التصميمات والمناسبات", title_en: "2013 Archive — Seasonal Graphic Art", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive", date: "2013" },
  { id: "hist-10", src: "/assets/serag-story/92db3cd7-85a1-4dc6-8c5a-c4d01df7102d.jpg", title_ar: "لحظات توثيقية شخصية وميدانية", title_en: "Personal & Field Archive Moment", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive" },
  { id: "hist-11", src: "/assets/serag-story/a00955da-e00a-442f-b5e6-c647dd8a78d8.jpg", title_ar: "لحظات توثيقية ومحطات الإنجاز", title_en: "Documentary Milestone Moment", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive" },
  { id: "hist-12", src: "/assets/serag-story/9c37b7c9-1652-44c7-a0ac-e2c21c1d3fc0.jpg", title_ar: "أرشيف الأسرة والرحلة الإنسانية", title_en: "Family & Foundational Roots Archive", category: "history", category_ar: "أرشيف تاريخي", category_en: "Historical Archive" },
];

// Unified list of all items for continuous lightbox traversal
export const ALL_MEDIA_ITEMS: MediaItem[] = [
  ...CERTIFICATES_DATA,
  ...COMMERCIAL_PHOTOS,
  ...BRANDING_PHOTOS,
  ...MOTION_GIFS,
  ...HISTORICAL_PHOTOS,
];

interface MediaCertificatesAccordionProps {
  lang: Language;
}

export const MediaCertificatesAccordion: React.FC<MediaCertificatesAccordionProps> = ({ lang }) => {
  const isRtl = lang === "ar";

  // Master Accordion Open/Close State
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(true);
  const [isPhotosOpen, setIsPhotosOpen] = useState(true);

  // Sub-accordions inside Photos
  const [openPhotoSubsections, setOpenPhotoSubsections] = useState<Record<string, boolean>>({
    commercial: true,
    branding: true,
    motion: true,
    history: true,
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "certificates" | "photos">("all");

  // Lightbox Modal State
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxItem) return;
      if (e.key === "Escape") {
        setLightboxItem(null);
      } else if (e.key === "ArrowLeft") {
        navigateLightbox(-1);
      } else if (e.key === "ArrowRight") {
        navigateLightbox(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem]);

  const navigateLightbox = (direction: number) => {
    if (!lightboxItem) return;
    const currentIndex = ALL_MEDIA_ITEMS.findIndex((item) => item.id === lightboxItem.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + direction + ALL_MEDIA_ITEMS.length) % ALL_MEDIA_ITEMS.length;
    setLightboxItem(ALL_MEDIA_ITEMS[nextIndex]);
  };

  const togglePhotoSubsection = (key: string) => {
    setOpenPhotoSubsections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = () => {
    setIsCertificatesOpen(true);
    setIsPhotosOpen(true);
    setOpenPhotoSubsections({
      commercial: true,
      branding: true,
      motion: true,
      history: true,
    });
  };

  const collapseAll = () => {
    setIsCertificatesOpen(false);
    setIsPhotosOpen(false);
    setOpenPhotoSubsections({
      commercial: false,
      branding: false,
      motion: false,
      history: false,
    });
  };

  // Filtered Certificates
  const filteredCertificates = useMemo(() => {
    if (activeFilter === "photos") return [];
    if (!searchQuery.trim()) return CERTIFICATES_DATA;
    const q = searchQuery.toLowerCase();
    return CERTIFICATES_DATA.filter(
      (c) =>
        c.title_ar.toLowerCase().includes(q) ||
        c.title_en.toLowerCase().includes(q)
    );
  }, [searchQuery, activeFilter]);

  // Filtered Photo Categories
  const filterList = (list: MediaItem[]) => {
    if (activeFilter === "certificates") return [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.title_ar.toLowerCase().includes(q) ||
        item.title_en.toLowerCase().includes(q) ||
        item.category_ar.toLowerCase().includes(q)
    );
  };

  const filteredCommercial = useMemo(() => filterList(COMMERCIAL_PHOTOS), [searchQuery, activeFilter]);
  const filteredBranding = useMemo(() => filterList(BRANDING_PHOTOS), [searchQuery, activeFilter]);
  const filteredMotion = useMemo(() => filterList(MOTION_GIFS), [searchQuery, activeFilter]);
  const filteredHistory = useMemo(() => filterList(HISTORICAL_PHOTOS), [searchQuery, activeFilter]);

  const totalFilteredPhotos =
    filteredCommercial.length +
    filteredBranding.length +
    filteredMotion.length +
    filteredHistory.length;

  return (
    <div className="w-full space-y-8 select-none" dir={isRtl ? "rtl" : "ltr"}>
      {/* ─── MASTER CONTROLLER TOOLBAR ─── */}
      <div className="bg-[#0b1015]/90 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Title and stats */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#dc2626]/20 to-[#05080c] border border-[#dc2626]/40 flex items-center justify-center text-[#ef4444] shadow-lg shadow-red-950/40 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isRtl ? "أوكورديون الشهادات ومعرض الصور" : "Certificates & Photo Gallery Accordion"}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl
                ? "أقسام منظمة وقابلة للطي والتوسيع لكافة الوثائق والأصول والإنتاجات البصرية"
                : "Collapsible structured showcase for all verified documents and production assets"}
            </p>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Filter Segmented Buttons */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[#dc2626] text-white shadow-md shadow-red-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isRtl ? "الكل (51)" : "All (51)"}
            </button>
            <button
              onClick={() => setActiveFilter("certificates")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === "certificates"
                  ? "bg-[#dc2626] text-white shadow-md shadow-red-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isRtl ? "الشهادات (14)" : "Certificates (14)"}
            </button>
            <button
              onClick={() => setActiveFilter("photos")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === "photos"
                  ? "bg-[#dc2626] text-white shadow-md shadow-red-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isRtl ? "الصور (37)" : "Photos (37)"}
            </button>
          </div>

          {/* Expand/Collapse All */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              {isRtl ? "فتح الكل" : "Expand All"}
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              {isRtl ? "طي الكل" : "Collapse All"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 1. ACCORDION ITEM: CERTIFICATES & RECORDS ─── */}
      {activeFilter !== "photos" && (
        <div className="rounded-3xl border border-[#dc2626]/30 bg-[#070b10] overflow-hidden shadow-2xl transition-all">
          {/* Accordion Header */}
          <div
            onClick={() => setIsCertificatesOpen(!isCertificatesOpen)}
            className="w-full flex items-center justify-between p-5 sm:p-7 bg-gradient-to-r from-[#0c1219] via-[#0b1016] to-[#120808] hover:bg-[#0f1722] cursor-pointer border-b border-slate-800 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/15 border border-[#dc2626]/40 flex items-center justify-center text-[#ef4444] group-hover:scale-110 transition-transform shadow-lg shadow-red-950/30">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-red-400 transition-colors">
                    {isRtl ? "أرشيف الشهادات والسجلات والاعتمادات الرسمية" : "Official Certificates & Accredited Records"}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[11px] font-mono font-bold text-[#ef4444]">
                    {filteredCertificates.length} {isRtl ? "وثيقة" : "docs"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl
                    ? "شهادات تدريب، وثائق تخرج، واعتمادات رسمية تثبت المسيرة المهنية الميدانية"
                    : "Verified accreditation credentials and formal qualification records"}
                </p>
              </div>
            </div>

            {/* Indicator */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                {isCertificatesOpen ? (isRtl ? "انقر للطي" : "Click to collapse") : (isRtl ? "انقر للعرض" : "Click to view")}
              </span>
              <div className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:border-[#dc2626] transition-all">
                {isCertificatesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </div>

          {/* Accordion Content Drawer */}
          {isCertificatesOpen && (
            <div className="p-5 sm:p-8 animate-in fade-in duration-300">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                <span className="font-mono flex items-center gap-1.5 text-red-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isRtl ? "جميع الوثائق مفحوصة بدقة أصلية — اضغط على أي شهادة للتكبير الفائق" : "High-resolution verified records — click any certificate for HD view"}</span>
                </span>
                <span className="font-mono text-slate-500">{filteredCertificates.length} {isRtl ? "شهادة متاحة" : "available"}</span>
              </div>

              {filteredCertificates.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  {isRtl ? "لا توجد نتائج مطابقة لبحثك" : "No certificates match your query"}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCertificates.map((cert, index) => (
                    <div
                      key={cert.id}
                      onClick={() => setLightboxItem(cert)}
                      className="group relative rounded-2xl overflow-hidden bg-[#0c1218] border border-slate-800 hover:border-[#dc2626] shadow-xl transition-all duration-300 hover:scale-[1.015] cursor-pointer flex flex-col justify-between"
                    >
                      {/* Certificate preview */}
                      <div className="relative w-full aspect-[4/3] bg-black/40 overflow-hidden flex items-center justify-center p-2">
                        <img
                          src={cert.src}
                          alt={cert.title_ar}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#05080c]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <div className="px-3 py-1.5 rounded-xl bg-[#dc2626] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/40">
                            <Maximize2 className="w-4 h-4" />
                            <span>{isRtl ? "تكبير وقراءة الوثيقة" : "Enlarge Document"}</span>
                          </div>
                        </div>

                        {/* Top Badge */}
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300 font-bold">
                          #{String(index + 1).padStart(2, "0")}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-3.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="truncate pr-2">
                          <h4 className="text-xs font-bold text-white truncate">
                            {isRtl ? cert.title_ar : cert.title_en}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {cert.category_ar} · P1020
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-red-400 group-hover:bg-red-500/10 transition-colors shrink-0">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── 2. ACCORDION ITEM: VISUAL PHOTOS & PRODUCTION MEDIA ─── */}
      {activeFilter !== "certificates" && (
        <div className="rounded-3xl border border-slate-800 hover:border-slate-700 bg-[#070b10] overflow-hidden shadow-2xl transition-all">
          {/* Accordion Header */}
          <div
            onClick={() => setIsPhotosOpen(!isPhotosOpen)}
            className="w-full flex items-center justify-between p-5 sm:p-7 bg-gradient-to-r from-[#0c1219] via-[#0b1016] to-[#0c141d] hover:bg-[#0f1722] cursor-pointer border-b border-slate-800 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-lg shadow-blue-950/30">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                    {isRtl ? "معرض الصور والأرشيف البصري والإنتاجي الشامل" : "Visual Photos & Complete Production Media Archive"}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-mono font-bold text-blue-400">
                    {totalFilteredPhotos} {isRtl ? "ملفاً" : "assets"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl
                    ? "أرشيف الحملات التجارية، تصميمات البورتفوليو، متحركات الـ GIF، والأرشيف التاريخي (2004 - 2013)"
                    : "Commercial campaigns, design portfolio, animated GIFs, and historical field records (2004 - 2013)"}
                </p>
              </div>
            </div>

            {/* Indicator */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                {isPhotosOpen ? (isRtl ? "انقر للطي" : "Click to collapse") : (isRtl ? "انقر للعرض" : "Click to view")}
              </span>
              <div className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:border-blue-500 transition-all">
                {isPhotosOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </div>

          {/* Sub-Accordions Container */}
          {isPhotosOpen && (
            <div className="p-5 sm:p-8 space-y-6 animate-in fade-in duration-300">
              {/* SUB-ACCORDION 1: COMMERCIAL PROJECTS (CW SERIES) */}
              <div className="rounded-2xl border border-slate-800/80 bg-[#090e14] overflow-hidden">
                <button
                  type="button"
                  onClick={() => togglePhotoSubsection("commercial")}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 cursor-pointer border-b border-slate-800/60 text-right transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-[#ef4444]" />
                    <span className="text-sm font-bold text-white">
                      {isRtl ? "1. مشاريع وحملات الإنتاج التجاري (CW Series)" : "1. Commercial Campaigns & Shoots (CW Series)"}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {filteredCommercial.length} {isRtl ? "صور" : "photos"}
                    </span>
                  </div>
                  {openPhotoSubsections.commercial ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openPhotoSubsections.commercial && (
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {filteredCommercial.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setLightboxItem(item)}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-slate-800 hover:border-[#dc2626] transition-all cursor-pointer shadow-md"
                      >
                        <img
                          src={item.src}
                          alt={item.title_ar}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-[#05080c]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-slate-300 truncate">
                          {item.title_ar}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUB-ACCORDION 2: BRAND IDENTITIES & PORTFOLIOS */}
              <div className="rounded-2xl border border-slate-800/80 bg-[#090e14] overflow-hidden">
                <button
                  type="button"
                  onClick={() => togglePhotoSubsection("branding")}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 cursor-pointer border-b border-slate-800/60 text-right transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-white">
                      {isRtl ? "2. الهويات البصرية ونماذج البورتفوليو والبراندينج" : "2. Brand Identities & Portfolio Showcases"}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {filteredBranding.length} {isRtl ? "تصميم" : "designs"}
                    </span>
                  </div>
                  {openPhotoSubsections.branding ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openPhotoSubsections.branding && (
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {filteredBranding.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setLightboxItem(item)}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-slate-800 hover:border-amber-500/80 transition-all cursor-pointer shadow-md"
                      >
                        <img
                          src={item.src}
                          alt={item.title_ar}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-[#05080c]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-slate-300 truncate">
                          {item.title_ar}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUB-ACCORDION 3: MOTION GIFS */}
              <div className="rounded-2xl border border-slate-800/80 bg-[#090e14] overflow-hidden">
                <button
                  type="button"
                  onClick={() => togglePhotoSubsection("motion")}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 cursor-pointer border-b border-slate-800/60 text-right transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Film className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">
                      {isRtl ? "3. متحركات الإنتاج والـ GIF السينمائية" : "3. Cinematic Motion & Animated Production GIFs"}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold">
                      {filteredMotion.length} GIF
                    </span>
                  </div>
                  {openPhotoSubsections.motion ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openPhotoSubsections.motion && (
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {filteredMotion.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setLightboxItem(item)}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-slate-800 hover:border-emerald-500 transition-all cursor-pointer shadow-md"
                      >
                        <img
                          src={item.src}
                          alt={item.title_ar}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-600 text-[9px] font-black text-white">
                          GIF
                        </div>
                        <div className="absolute inset-0 bg-[#05080c]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-slate-300 truncate">
                          {item.title_ar}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUB-ACCORDION 4: HISTORICAL TIMELINE (2004 - 2013) */}
              <div className="rounded-2xl border border-slate-800/80 bg-[#090e14] overflow-hidden">
                <button
                  type="button"
                  onClick={() => togglePhotoSubsection("history")}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 cursor-pointer border-b border-slate-800/60 text-right transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-white">
                      {isRtl ? "4. الأرشيف الميداني والمحطات التاريخية التأسيسية (2004 - 2013)" : "4. Foundational Historical Field Archive (2004 - 2013)"}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 font-bold">
                      {filteredHistory.length} {isRtl ? "صور" : "photos"}
                    </span>
                  </div>
                  {openPhotoSubsections.history ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openPhotoSubsections.history && (
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setLightboxItem(item)}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-slate-800 hover:border-purple-500 transition-all cursor-pointer shadow-md"
                      >
                        <img
                          src={item.src}
                          alt={item.title_ar}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        {item.date && (
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 border border-purple-500/30 text-[9px] font-mono text-purple-300">
                            {item.date}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[#05080c]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-slate-300 truncate">
                          {item.title_ar}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── INTERACTIVE FULLSCREEN LIGHTBOX ─── */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-[10000] bg-[#05080c]/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 hover:bg-[#dc2626] text-white flex items-center justify-center transition-all cursor-pointer z-50 shadow-xl"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(-1);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-700 hover:bg-[#dc2626] text-white flex items-center justify-center transition-all cursor-pointer z-50 shadow-xl"
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Main Media Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[90vh] flex flex-col items-center justify-center relative p-2"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#dc2626]/40 shadow-[0_0_60px_rgba(220,38,38,0.25)] bg-[#070b10] max-h-[78vh] flex items-center justify-center">
              <img
                src={lightboxItem.src}
                alt={lightboxItem.title_ar}
                className="max-w-full max-h-[76vh] object-contain"
              />
            </div>

            {/* Metadata Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-center">
              <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-xs font-mono font-bold text-[#ef4444]">
                {lightboxItem.category_ar}
              </span>
              <h3 className="text-sm font-bold text-white">
                {isRtl ? lightboxItem.title_ar : lightboxItem.title_en}
              </h3>
              {lightboxItem.date && (
                <span className="text-xs font-mono text-slate-400">
                  ({lightboxItem.date})
                </span>
              )}
              {lightboxItem.isGif && (
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-[10px] font-black text-white">
                  GIF ANIMATION
                </span>
              )}
            </div>
            <div className="mt-1 text-[11px] font-mono text-slate-500">
              {ALL_MEDIA_ITEMS.findIndex((it) => it.id === lightboxItem.id) + 1} / {ALL_MEDIA_ITEMS.length} · {isRtl ? "استخدم الأسهم للملاحة أو Esc للإغلاق" : "Use arrow keys to navigate or Esc to exit"}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(1);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-700 hover:bg-[#dc2626] text-white flex items-center justify-center transition-all cursor-pointer z-50 shadow-xl"
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
};
