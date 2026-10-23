import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  FileText,
  Scale,
  Award,
  Sparkles,
  ExternalLink,
  Building2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FolderLock,
  Handshake,
  Bot
} from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";

interface GovernancePoliciesViewProps {
  setActiveTab?: (tab: string, option?: string) => void;
  lang?: Language;
}

export const OFFICIAL_CONTRACTS_REGISTRY = [
  {
    id: "cnt_01_primary_marketing",
    number: "01",
    titleAr: "عقد اتفاق ابتدائي لتقديم الخدمات التسويقية وإدارة الحملات الرقمية",
    titleEn: "Primary Marketing & Digital Advertising Agreement",
    descAr: "العقد الأساسي المنظم لإنتاج وتصوير الفيديوهات القصيرة (Reels)، تصاميم السوشيال ميديا، وإدارة الحملات الممولة، والمقابل المالي وجدول الدفعات، مع الشروط الجزائية الصارمة بنسبة 25%.",
    status: "معتمد وموثق",
    category: "commercial"
  },
  {
    id: "cnt_02_transformation_90",
    number: "02",
    titleAr: "عقد الشراكة الاستراتيجية وخطة التحول المؤسسي لـ 90 يوماً",
    titleEn: "90-Day Institutional Transformation & Operational SLA",
    descAr: "عقد تحول شامل يحدد أهداف المراحل الثلاث (عزل الهدر، إعادة الهيكلة، والانتشار السوقي)، ومصفوفة قياس الأداء (KPIs) وضمان استدامة النتائج.",
    status: "معتمد وموثق",
    category: "transformation"
  },
  {
    id: "cnt_03_youtube_collaborator",
    number: "03",
    titleAr: "عقد حقوق الملكية الفكرية والبث الرقمي والشراكة الإعلانية (30% Collaborator)",
    titleEn: "IP Rights, Digital Broadcast & 30% Collaborator Joint Media Agreement",
    descAr: "جميع حقوق الملكية الفكرية والمحتوى البصري مملوكة لـ Fit.Brilliance Advertising © 2026. ويُلتزم وجوباً بإدراج الـ QR Code الإعلاني (3ث مقدمة و5ث نهاية) وأي حذف يعد إتلافاً قانونياً. ويُشترط تفعيل ميزة Collaborator على YouTube بنسبة 30% من أرباح وعوائد الفيديوهات المشتركة حصراً، مع شرط التوقيع المزدوج لكلا المديرين خلال 48 ساعة، وحظر توقيع الشريك منفرداً على عقود إعلانية مع احتفاظ المنظومة بحق التوقيع منفردين.",
    status: "معتمد وموثق",
    category: "ip_rights"
  },
  {
    id: "cnt_04_squad_charter",
    number: "04",
    titleAr: "ميثاق انضمام عضو الخلية الخماسية (اتفاقية شريك العمل والأمانة المهنية)",
    titleEn: "Quintet Squad Membership Charter & Fiduciary Ethics Agreement",
    descAr: "ميثاق صارم يحدد الالتزام بالأمانة قبل الكفاءة، سرية بيانات المنظومة، بروتوكولات المسؤولية الميدانية المشتركة، وعزل أي تعارض مصالح.",
    status: "معتمد وموثق",
    category: "governance"
  },
  {
    id: "cnt_05_diagnostic_mou",
    number: "05",
    titleAr: "مذكرة تفاهم مبدئية لتقييم وتشريح النشاط (MoU Discovery & Audit)",
    titleEn: "Preliminary Diagnostic MoU & Non-Disclosure Assessment Protocol",
    descAr: "مذكرة التفاهم الأولية الموقعة قبل بدء فحص الدفاتر وحسابات النشاط، تضمن السرية المطلقة وحماية خطط العمل أثناء مرحلة التشخيص الأولي.",
    status: "معتمد وموثق",
    category: "mou"
  },
  {
    id: "cnt_06_media_masterclass",
    number: "06",
    titleAr: "عقد إنتاج وتصوير الفعاليات وإدارة الميديا 4K لرواد الأعمال",
    titleEn: "4K Masterclass Cinema Production & Executive Event Coverage",
    descAr: "عقد تغطية وتوثيق الإيفنتات والمؤتمرات الكبرى ومحتوى البراند الشخصي سينمائياً بكاميرات 4K وإخراج متكامل وتسليم ماستر رقمي مشفر.",
    status: "معتمد وموثق",
    category: "media_production"
  }
];

export const GovernancePoliciesView: React.FC<GovernancePoliciesViewProps> = ({
  setActiveTab,
  lang = "ar"
}) => {
  const t = getTranslation(lang);
  const isRtl = lang === "ar";
  const [activeSubTab, setActiveSubTab] = useState<"privacy" | "nda" | "dimc" | "contracts">("privacy");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-10 text-right select-none" dir="rtl">

      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#121a21] to-[#0b1015] border border-[#dc2626]/40 p-6 sm:p-10 overflow-hidden shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#dc2626]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-[#dc2626]/15 border border-[#dc2626]/30 px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#ef4444]">
          <Scale className="w-3.5 h-3.5" />
          <span>ميثاق الحوكمة، السياسات التشغيلية، وحماية البيانات الميدانية</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#f8fafc]">
          السياسات الرسمية وحماية الملكية الفكرية لمنظومة FitBrilliance
        </h2>

        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-3xl">
          تعمل منظومة FitBrilliance تحت إشراف ورعاية كوتش سراج وفق أعلى المعايير القانونية الصارمة. تجد هنا بنود حماية البيانات الشخصية، اتفاقيات عدم الإفصاح (NDA)، سجل الملكية الفكرية المعتمدة (DIMC)، وقائمة العقود الرسمية للمنظومة.
        </p>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-[#1e293b]">
          {[
            { id: "privacy", label: "🔒 حماية البيانات الشخصية والخصوصية" },
            { id: "nda", label: "🤝 ميثاق السرية وعدم الإفصاح (NDA)" },
            { id: "dimc", label: "⚖️ حقوق الملكية الفكرية (DIMC)" },
            { id: "contracts", label: "📜 مصفوفة العقود الرسمية الستة (6 Contracts)" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === tab.id
                  ? "bg-[#dc2626] text-white font-black shadow-lg shadow-[#dc2626]/20"
                  : "bg-[#0b1015] border border-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TAB: PRIVACY & PERSONAL DATA PROTECTION */}
      {activeSubTab === "privacy" && (
        <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="border-b border-[#1e293b] pb-4 space-y-1">
            <span className="text-xs font-mono font-bold text-[#ef4444]">Data Protection & Privacy Code 2026</span>
            <h3 className="text-xl font-black text-[#f8fafc]">سياسة الخصوصية وحماية بيانات العملاء والشركاء</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
            <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#f8fafc] text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                <span>1. الجمع الآمن والتشفير الميداني للبيانات:</span>
              </h4>
              <p className="text-[#94a3b8] leading-relaxed">
                كافة البيانات التشغيلية، الإيرادات، الميزانيات، ومعلومات الاستشارات التي يتم إدخالها عبر المنصة تخضع للتشفير العالي ولا يتم تداولها مطلقاً مع أي طرف ثالث تجاري أو تسويقي. البيانات مخصصة حصراً للدراسة التشخيصية المباشرة لكوتش سراج وفريق الخلية الخماسية.
              </p>
            </div>

            <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#f8fafc] text-sm flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-[#ef4444]" />
                <span>2. عزل وحماية الحسابات المصرفية والأرقام المالية:</span>
              </h4>
              <p className="text-[#94a3b8] leading-relaxed">
                لا نطلب ولا نقوم بتخزين أي كلمات مرور أو مفاتيح سرية للحسابات البنكية أو المحافظ الإلكترونية. كافة التحويلات المعتمدة تتم مباشرة وموثقة عبر الحسابات الرسمية أو تطبيق InstaPay على الرقم المعتمد والموثق فقط (`01274879442`).
              </p>
            </div>

            <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#f8fafc] text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-[#38bdf8]" />
                <span>3. الأرشفة المزدوجة التلقائية لحماية حقوق العميل:</span>
              </h4>
              <p className="text-[#94a3b8] leading-relaxed">
                أي استبيان تشخيصي، تقرير معتمد، أو مسودة عقد يتم حفظها على خوادم مشفرة سحابية، مع إرسال نسخة رقمية كاملة فورية ومؤرخة بالختم الزمني للبريد الرسمي لكوتش سراج والأرشفة على Google Drive لضمان عدم تعرض أي وثيقة للتعديل أو الضياع.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: NDA & CONFIDENTIALITY */}
      {activeSubTab === "nda" && (
        <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="border-b border-[#1e293b] pb-4 space-y-1">
            <span className="text-xs font-mono font-bold text-[#ef4444]">Non-Disclosure & Fiduciary Covenant</span>
            <h3 className="text-xl font-black text-[#f8fafc]">ميثاق السرية وعدم الإفصاح الميداني (NDA)</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
            <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#f8fafc] text-sm">أولاً: تعريف المعلومات السرية المحمية:</h4>
              <p className="text-[#94a3b8] leading-relaxed">
                تشمل أرقام المبيعات، هوامش الربح، خوارزميات العمل، أسماء الموردين، خطط التسويق غير المعلنة، ومسودات خطة الـ 90 يوماً الخاصة بكل شريك أو عميل ينضم للمنظومة.
              </p>
            </div>

            <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#f8fafc] text-sm">ثانياً: التزام الخلية الخماسية بالأمانة المهنية:</h4>
              <p className="text-[#94a3b8] leading-relaxed">
                يخضع كل عضو أو شريك عمل ينضم للخلية الخماسية لميثاق أمانة ملزم قانونياً وأخلاقياً، يمنع منعاً باتاً استغلال أي معلومة أو إتاحتها لأي جهة منافسة، مع تطبيق المسؤولية القانونية الكاملة والشرط الجزائي المنصوص عليه عند الإخلال.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: DIMC IP INTELLECTUAL PROPERTY */}
      {activeSubTab === "dimc" && (
        <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="border-b border-[#1e293b] pb-4 space-y-1">
            <span className="text-xs font-mono font-bold text-[#ef4444]">Digital Intellectual & Media Copyrights (DIMC)</span>
            <h3 className="text-xl font-black text-[#f8fafc]">إعلان حقوق الملكية الفكرية والأسبقية التاريخية</h3>
          </div>

          <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-mono text-[#ef4444] font-bold">وثيقة إثبات الأسبقية الموثقة رقمياً — كوتش سراج (مصطفى سراج)</div>
            <p className="text-xs sm:text-sm text-[#f8fafc] leading-relaxed font-semibold">
              سراج أوندا (مصطفى سراج) هو الموثق رقمياً كأول من صمم وطبق منهجية "استراتيجية التطوير المؤسسي لـ 90 يوم عمل لخدمة الهدف"، بأثر رقمي متصل ومؤرخ رسمياً عبر الأرشيف الزمني المفتوح وقناة يوتيوب @eg-Old.School منذ 22 أبريل 2011.
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
            <p>
              يُحظر نسخ أو إعادة إنتاج محتوى خطط الـ 90 يوماً، أو النماذج التشخيصية الستة، أو الهوية البصرية لـ FitBrilliance دون إذن كتابي موثق ومسبق صادر عن إدارة المنظومة.
            </p>
          </div>
        </div>
      )}

      {/* 5. TAB: THE 6 OFFICIAL CONTRACTS REGISTRY */}
      {activeSubTab === "contracts" && (
        <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#ef4444]">Institutional Contracts Matrix</span>
              <h3 className="text-xl font-black text-[#f8fafc]">مصفوفة العقود الستة الرسمية المعتمدة للمنظومة</h3>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#121a21] border border-[#1e293b] px-3.5 py-1.5 rounded-xl text-xs text-[#38bdf8] font-mono">
              <Bot className="w-4 h-4 text-[#ef4444]" />
              <span>مدعومة بوكيل الذكاء الاصطناعي للمراجعة المباشرة</span>
            </div>
          </div>

          <p className="text-xs text-[#94a3b8] leading-relaxed">
            هذه هي العقود الرسمية الستة المنظمة لكافة أعمال وشراكات FitBrilliance. عند استدعاء أي عقد مبدئي للعميل، يقوم وكيل الذكاء الاصطناعي بتوليد المسودة المبدئية للعرض والتواصل الفوري معك لمراجعتها واعتماد الصياغة النهائية معاً:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {OFFICIAL_CONTRACTS_REGISTRY.map((c) => (
              <div
                key={c.id}
                className="bg-[#121a21] border border-[#1e293b] hover:border-[#dc2626]/50 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#dc2626]/15 text-[#ef4444] font-mono text-xs font-black flex items-center justify-center">
                      {c.number}
                    </span>
                    <span className="text-xs font-mono text-[#22c55e] font-bold bg-[#22c55e]/10 px-2.5 py-0.5 rounded-full border border-[#22c55e]/20">
                      {c.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748b] font-mono">{c.category}</span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#f8fafc] leading-snug">{c.titleAr}</h4>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{c.descAr}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#1e293b]/60">
                  <span className="text-[#cbd5e1] text-[11px] font-mono">رمز العقد: {c.id}</span>
                  <button
                    onClick={() => handleCopy(c.id, `${c.number}. ${c.titleAr}\n${c.descAr}`)}
                    className="text-[#94a3b8] hover:text-[#ef4444] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === c.id ? "تم النسخ" : "نسخ الاسم والبيان"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-2xl p-4 flex items-center justify-between text-xs text-[#cbd5e1]">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#ef4444] shrink-0" />
              <span>تريد مراجعة أو صياغة تفاصيل أي عقد من العقود الستة الآن؟</span>
            </div>
            <a
              href="https://wa.me/201274879442"
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0 cursor-pointer"
            >
              مراجعة مباشرة مع كوتش سراج
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
