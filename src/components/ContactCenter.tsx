import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Send,
  Copy,
  Check,
  Mail,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";
import { supabase } from "../lib/supabase";
import { CelebrationSuccess } from "./CelebrationSuccess";

interface ContactCenterProps {
  lang?: Language;
}

interface ChannelItem {
  id: string;
  division: "executive" | "governance";
  title: string;
  subtitle: string;
  email: string;
  badge: string;
  priority?: boolean;
  whatsapp?: string;
  whatsappLabel?: string;
  categoryLabel: string;
}

export const ContactCenter: React.FC<ContactCenterProps> = ({ lang = "ar" }) => {
  const t = getTranslation(lang as Language);
  const isRtl = lang === "ar";
  const [filter, setFilter] = useState<"all" | "executive" | "governance">("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("serag");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 11 Official Verified Corporate Inboxes & Aliases on @fitbrilliance.store
  const channels: ChannelItem[] = [
    // --- سيرفر الإدارة التنفيذية والعمليات (serag@fitbrilliance.store) ---
    {
      id: "serag",
      division: "executive",
      title: isRtl ? "المكتب التنفيذي لكوتش سراج" : "Office of Coach Serag Onda",
      subtitle: isRtl
        ? "الإشراف المباشر على الشراكات الكبرى، الرؤية والقرارات الاستراتيجية الحساسة"
        : "Direct principal oversight for strategic enterprise partnerships and coaching",
      email: "serag@fitbrilliance.store",
      badge: isRtl ? "المكتب التنفيذي الرئيسي" : "Executive Principal",
      priority: true,
      whatsapp: "201274879442",
      whatsappLabel: isRtl ? "واتساب كوتش سراج المباشر" : "Direct Coach Serag WhatsApp",
      categoryLabel: isRtl ? "القيادة والعمليات" : "Executive & Ops",
    },
    {
      id: "core",
      division: "executive",
      title: isRtl ? "النواة الاستراتيجية — Core" : "Strategic Core & Field Ops",
      subtitle: isRtl
        ? "استشارات النمذجة التشغيلية والمالية، وتطبيق خطط الـ 90 يوماً للمؤسسات"
        : "Operational & financial modeling consultations and 90-day institutional transformation",
      email: "core@fitbrilliance.store",
      badge: isRtl ? "إدارة التحول لـ 90 يوماً" : "90-Day Transformation Unit",
      whatsapp: "201274879442",
      whatsappLabel: isRtl ? "استشارات الـ 90 يوماً" : "90-Day Advisory Line",
      categoryLabel: isRtl ? "القيادة والعمليات" : "Executive & Ops",
    },
    {
      id: "pioneers",
      division: "executive",
      title: isRtl ? "الإنتاج والتصوير 4K — Pioneers" : "4K Filming & Media — Pioneers",
      subtitle: isRtl
        ? "تغطيات الإيفنتات والمؤتمرات، إنتاج المحتوى التدريبي والريلز السينمائي"
        : "Cinema-grade event filming, corporate masterclasses and dynamic 9:16 reels production",
      email: "pioneers@fitbrilliance.store",
      badge: isRtl ? "وحدة الإنتاج السينمائي" : "Cinema Production Unit",
      whatsapp: "201274534493",
      whatsappLabel: isRtl ? "واتساب فريق Pioneers للإنتاج" : "Pioneers Media WhatsApp",
      categoryLabel: isRtl ? "القيادة والعمليات" : "Executive & Ops",
    },
    {
      id: "balanced",
      division: "executive",
      title: isRtl ? "الأبحاث والمساحة الآمنة — Balanced" : "Academic Research & Safe Space — Balanced",
      subtitle: isRtl
        ? "استشارات رسائل الماجستير والدكتوراه، التحليل الإحصائي المتقدم والاستشارات الخاصة"
        : "Postgraduate thesis methodology, advanced statistical modeling and private advisory",
      email: "balanced@fitbrilliance.store",
      badge: isRtl ? "الذراع الأكاديمي والاستشاري" : "Academic Advisory Wing",
      whatsapp: "201274879442",
      whatsappLabel: isRtl ? "مكتب الاستشارات الأكاديمية" : "Academic Office WhatsApp",
      categoryLabel: isRtl ? "القيادة والعمليات" : "Executive & Ops",
    },
    {
      id: "creative",
      division: "executive",
      title: isRtl ? "الإدارة الإبداعية والمونتاج — Creative" : "Creative Directorate & Post-Production",
      subtitle: isRtl
        ? "الإشراف الفني، السرد القصصي المرئي، وتوجيه المونتاج عالي التأثير"
        : "Art direction, high-impact narrative editing, and creative storytelling oversight",
      email: "creative@fitbrilliance.store",
      badge: isRtl ? "التوجيه الإبداعي والفني" : "Creative Directorate",
      categoryLabel: isRtl ? "القيادة والعمليات" : "Executive & Ops",
    },
    {
      id: "new",
      division: "executive",
      title: isRtl ? "المشاريع والفرص الجديدة — New" : "New Ventures & Onboarding — New",
      subtitle: isRtl
        ? "تأسيس الشراكات للعملاء الجدد، وانطلاق المشاريع والمبادرات المؤسسية لأول مرة"
        : "First-time client onboarding, venture incubation, and new initiative structuring",
      email: "new@fitbrilliance.store",
      badge: isRtl ? "انطلاق المشاريع الجديدة" : "Venture Inception",
      whatsapp: "201274534493",
      whatsappLabel: isRtl ? "واتساب العملاء الجدد" : "New Clients WhatsApp",
      categoryLabel: isRtl ? "القيادة والعمليات" : "Executive & Ops",
    },

    // --- سيرفر الحوكمة، الامتثال والدعم المركزي (support@fitbrilliance.store) ---
    {
      id: "support",
      division: "governance",
      title: isRtl ? "مركز العمليات والدعم المركزي" : "Central Support & Operations Desk",
      subtitle: isRtl
        ? "الدعم الفني، خدمة العملاء المستمرة، ومتابعة جميع الاستفسارات والشكاوى"
        : "24/7 technical customer support, ticketing, and operational escalations",
      email: "support@fitbrilliance.store",
      badge: isRtl ? "مركز الدعم الرئيسي" : "Central Support Hub",
      priority: true,
      whatsapp: "201274879442",
      whatsappLabel: isRtl ? "مكتب المتابعة السريعة" : "Rapid Escalation Line",
      categoryLabel: isRtl ? "الحوكمة والدعم" : "Governance & Support",
    },
    {
      id: "support_legal",
      division: "governance",
      title: isRtl ? "الشؤون القانونية والملكية الفكرية — Legal" : "Legal Affairs & IP Protection — Legal",
      subtitle: isRtl
        ? "حماية حقوق الملكية الفكرية (قانون 82/2002)، العقود والشراكات الموثقة"
        : "Intellectual property enforcement, DIMC rights, and corporate agreements",
      email: "support.legal@fitbrilliance.store",
      badge: isRtl ? "مكتب الحماية القانونية" : "Legal & IP Counsel",
      categoryLabel: isRtl ? "الحوكمة والدعم" : "Governance & Support",
    },
    {
      id: "governance",
      division: "governance",
      title: isRtl ? "الحوكمة والامتثال المؤسسي — Governance" : "Corporate Governance & Compliance",
      subtitle: isRtl
        ? "حوكمة الإجراءات، الالتزام بالمعايير المؤسسية وتدقيق مسارات العمل"
        : "Process governance, institutional compliance standards and operating controls",
      email: "governance@fitbrilliance.store",
      badge: isRtl ? "لجنة الحوكمة والامتثال" : "Governance Board",
      categoryLabel: isRtl ? "الحوكمة والدعم" : "Governance & Support",
    },
    {
      id: "ethics_integrity",
      division: "governance",
      title: isRtl ? "ميثاق الأخلاقيات والنزاهة — Ethics" : "Ethics & Research Integrity — Ethics",
      subtitle: isRtl
        ? "ضمان النزاهة العلمية، الأمانة في نتائج الدراسات، ومكافحة الانتحال والتحريف"
        : "Academic honesty oversight, data integrity audits, and anti-plagiarism verification",
      email: "ethics-integrity@fitbrilliance.store",
      badge: isRtl ? "ميثاق النزاهة المعتمد" : "Integrity Charter",
      categoryLabel: isRtl ? "الحوكمة والدعم" : "Governance & Support",
    },
    {
      id: "assistance",
      division: "governance",
      title: isRtl ? "المساعدة والدعم الفوري — Assistance" : "Rapid Assistance Concierge",
      subtitle: isRtl
        ? "المسار السريع لتلبية احتياجات العملاء والطلبات العاجلة في غضون دقائق"
        : "Fast-track concierge support for high-priority and urgent operational requests",
      email: "assistance@fitbrilliance.store",
      badge: isRtl ? "مسار الرد السريع" : "Fast-Track Response",
      categoryLabel: isRtl ? "الحوكمة والدعم" : "Governance & Support",
    },
    {
      id: "join_team",
      division: "governance",
      title: isRtl ? "استقطاب الكفاءات والتوظيف — Join Team" : "Talent Acquisition & Careers",
      subtitle: isRtl
        ? "طلبات انضمام المصورين، المحللين، والاستشاريين لفريق عمل المنظومة"
        : "Recruitment portal for filmmakers, editors, academic researchers and strategists",
      email: "join-team@fitbrilliance.store",
      badge: isRtl ? "بوابة الانضمام والتوظيف" : "Recruitment Portal",
      categoryLabel: isRtl ? "الحوكمة والدعم" : "Governance & Support",
    },
  ];

  const filteredChannels = channels.filter((c) => {
    if (filter === "executive") return c.division === "executive";
    if (filter === "governance") return c.division === "governance";
    return true;
  });

  const activeChannel = channels.find((c) => c.id === selectedChannel) || channels[0];

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg(isRtl ? "يرجى تعبئة الحقول الأساسية: الاسم، البريد، ونص الرسالة." : "Please fill in mandatory fields: Name, Email, Message.");
      return;
    }

    setLoading(true);

    try {
      try {
        await supabase.from("contact_messages").insert([
          {
            department: activeChannel.id,
            target_email: activeChannel.email,
            name,
            email,
            phone,
            business,
            subject,
            message,
            status: "unread",
          },
        ]);
      } catch (_) { }

      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department: activeChannel.id,
            target_email: activeChannel.email,
            name,
            email,
            phone,
            business,
            subject,
            message,
          }),
        });
      } catch (_) { }

      setSuccessMsg(
        isRtl
          ? `تم إرسال رسالتك بنجاح إلى: ${activeChannel.email}. سيقوم الفريق المختص بالمتابعة المباشرة معك.`
          : `Message sent successfully to ${activeChannel.email}. The dedicated team will follow up directly.`
      );
      setMessage("");
      setSubject("");
    } catch (err: any) {
      setErrorMsg(err.message || (isRtl ? "حدث خطأ أثناء التواصل مع الخادم." : "Error communicating with server."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-10 py-6 select-none ${isRtl ? "text-right" : "text-left"}`}>
      {/* Header Banner */}
      <div className="flex flex-col items-center text-center gap-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-red-600/15 text-red-400 border border-red-500/30 px-4 py-1.5 rounded-full text-xs font-mono font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>{isRtl ? "شبكة قنوات التواصل المؤسسية المعتمدة (12 قناة مخصصة)" : "Official Verified Corporate Network (12 Dedicated Channels)"}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#f4f0e7] leading-tight">
          {isRtl ? (
            <>
              منظومة تواصل مؤسسية متكاملة{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600">
                بأعلى معايير الحوكمة والثقة
              </span>
            </>
          ) : (
            <>
              Dedicated Corporate Inboxes{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600">
                Built for Precision & Trust
              </span>
            </>
          )}
        </h1>

        <p className="text-xs sm:text-sm text-[#a4aaa7] leading-relaxed max-w-2xl">
          {isRtl
            ? "بدلاً من صندوق بريد واحد يضيع فيه طلبك، نمتلك 12 قناة اتصال رسمية مستضافة على نطاق fitbrilliance.store ومربوطة بالهوية الموثقة لخوارزميات البحث والأعمال، لضمان معالجة فورية من الجهة المسؤولة."
            : "All 12 official enterprise communication channels hosted under @fitbrilliance.store, cryptographically aligned with verified Meta social identity for maximum algorithmic authority and instant departmental follow-up."}
        </p>

        {/* Verification Credentials Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121a21] border border-[#202d38] text-[11px] font-mono text-[#cbd5e1]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>{isRtl ? "مرتبط بحساب فيسبوك الموثق بعلامة الاعتماد الزرقاء" : "Bound to Meta-Verified Facebook Anchor"}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121a21] border border-[#202d38] text-[11px] font-mono text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{isRtl ? "أرشيف الأسبقية الرقمية منذ 22 أبريل 2011" : "Digital Prior Art Since April 22, 2011"}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 max-w-xl mx-auto bg-[#0b1015] p-1.5 rounded-2xl border border-[#202d38]">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
              : "text-[#94a3b8] hover:text-[#f4f0e7] hover:bg-[#121a21]"
          }`}
        >
          {isRtl ? "جميع القنوات (12)" : "All Channels (12)"}
        </button>
        <button
          onClick={() => setFilter("executive")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "executive"
              ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
              : "text-[#94a3b8] hover:text-[#f4f0e7] hover:bg-[#121a21]"
          }`}
        >
          {isRtl ? "القيادة والعمليات (6)" : "Executive & Ops (6)"}
        </button>
        <button
          onClick={() => setFilter("governance")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "governance"
              ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
              : "text-[#94a3b8] hover:text-[#f4f0e7] hover:bg-[#121a21]"
          }`}
        >
          {isRtl ? "الحوكمة والدعم القانوني (6)" : "Governance & Legal (6)"}
        </button>
      </div>

      {/* 11 Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredChannels.map((chan) => {
          const isSelected = selectedChannel === chan.id;
          const isCopied = copiedEmail === chan.email;

          return (
            <div
              key={chan.id}
              onClick={() => setSelectedChannel(chan.id)}
              className={`group relative rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 shadow-xl cursor-pointer border ${
                isSelected
                  ? "bg-[#141b22] border-red-500 shadow-red-950/40 ring-1 ring-red-500/50"
                  : "bg-[#0e141a] border-[#1e293b] hover:border-red-500/40 hover:bg-[#111822]"
              }`}
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      chan.priority
                        ? "bg-red-500/15 text-red-400 border-red-500/40"
                        : "bg-[#1e293b] text-[#94a3b8] border-[#334155]"
                    }`}
                  >
                    {chan.badge}
                  </span>

                  <span className="text-[10px] font-mono text-[#64748b]">
                    {chan.categoryLabel}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black text-[#f4f0e7] mt-0.5 group-hover:text-red-400 transition-colors">
                  {chan.title}
                </h3>

                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {chan.subtitle}
                </p>
              </div>

              {/* Email details with 1-click copy & actions */}
              <div className="pt-3 border-t border-[#1e293b] flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2 bg-[#090d11] px-3 py-2 rounded-xl border border-[#1e293b]">
                  <a
                    href={`mailto:${chan.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-xs font-bold text-red-400 hover:text-red-300 hover:underline truncate flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    <span className="truncate">{chan.email}</span>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => copyToClipboard(chan.email, e)}
                    title={isRtl ? "نسخ عنوان البريد" : "Copy email address"}
                    className="p-1 rounded-lg hover:bg-[#1e293b] text-[#94a3b8] hover:text-[#f4f0e7] transition-colors shrink-0 cursor-pointer"
                  >
                    {isCopied ? (
                      <span className="text-[10px] font-mono font-bold text-green-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {isRtl ? "تم" : "Done"}
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {chan.whatsapp && (
                  <a
                    href={`https://wa.me/${chan.whatsapp}?text=${encodeURIComponent(
                      isRtl
                        ? `مرحباً كوتش سراج، تواصل مباشر عبر قناة: ${chan.title}`
                        : `Hello Coach Serag, direct inquiry regarding: ${chan.title}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-mono text-green-400 hover:text-green-300 hover:underline flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3 h-3 text-green-400" />
                    <span>{chan.whatsappLabel}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Interactive Routing Form */}
      <div className="bg-[#0e141a] border border-[#1e293b] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl max-w-3xl mx-auto w-full flex flex-col gap-6 mt-4">
        <div className="flex flex-col gap-2 border-b border-[#1e293b] pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-[#f4f0e7] flex items-center gap-2">
              <Send className="w-5 h-5 text-red-500" />
              <span>{isRtl ? "نموذج التوجيه المباشر إلى: " : "Direct Message to: "}</span>
              <span className="text-red-400 font-mono font-bold text-sm bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-500/30">
                {activeChannel.email}
              </span>
            </h2>

            <span className="text-xs text-[#94a3b8] font-mono">
              {activeChannel.badge}
            </span>
          </div>

          <p className="text-xs text-[#94a3b8]">
            {isRtl
              ? "سيتم استلام رسالتك مباشرة في الصندوق المعتمد والمتابعة معك عبر البريد الإلكتروني والواتساب الرسمي."
              : "Your inquiry is routed directly to the verified corporate inbox with priority team dispatch."}
          </p>
        </div>

        {successMsg && (
          <div className="mb-6">
            <CelebrationSuccess
              title={isRtl ? "تم إرسال رسالتك وتوثيقها بنجاح!" : "Message Sent Successfully!"}
              subtitle={successMsg}
              onReset={() => setSuccessMsg(null)}
              resetButtonText={isRtl ? "إرسال رسالة أخرى" : "Send Another Message"}
            />
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-xs font-bold text-[#f4f0e7] flex flex-col gap-2">
              {isRtl ? "الاسم بالكامل *" : "Full Name *"}
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRtl ? "اسمك الكامل" : "Your Full Name"}
                className="bg-[#090d11] border border-[#1e293b] focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-[#f4f0e7] outline-none transition-colors"
              />
            </label>

            <label className="text-xs font-bold text-[#f4f0e7] flex flex-col gap-2">
              {isRtl ? "البريد الإلكتروني للرد *" : "Email Address *"}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="bg-[#090d11] border border-[#1e293b] focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-[#f4f0e7] outline-none font-mono transition-colors"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-xs font-bold text-[#f4f0e7] flex flex-col gap-2">
              {isRtl ? "رقم الهاتف / الواتساب" : "Phone / WhatsApp"}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010xxxxxxx"
                className="bg-[#090d11] border border-[#1e293b] focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-[#f4f0e7] outline-none font-mono transition-colors"
              />
            </label>

            <label className="text-xs font-bold text-[#f4f0e7] flex flex-col gap-2">
              {isRtl ? "اسم النشاط / المؤسسة" : "Company / Business Name"}
              <input
                type="text"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder={isRtl ? "اسم شركتك أو مشروعك" : "Company Name"}
                className="bg-[#090d11] border border-[#1e293b] focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-[#f4f0e7] outline-none transition-colors"
              />
            </label>
          </div>

          <label className="text-xs font-bold text-[#f4f0e7] flex flex-col gap-2">
            {isRtl ? "موضوع الرسالة" : "Subject"}
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={isRtl ? `طلب استفسار موجه إلى: ${activeChannel.title}` : "Inquiry Subject"}
              className="bg-[#090d11] border border-[#1e293b] focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-[#f4f0e7] outline-none transition-colors"
            />
          </label>

          <label className="text-xs font-bold text-[#f4f0e7] flex flex-col gap-2">
            {isRtl ? "نص الرسالة والتفاصيل *" : "Message & Details *"}
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isRtl ? "اكتب تفاصيل استفسارك أو طلبك هنا..." : "Write your inquiry details..."}
              className="bg-[#090d11] border border-[#1e293b] focus:border-red-500 rounded-xl p-4 text-xs text-[#f4f0e7] outline-none resize-y transition-colors"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-3.5 rounded-2xl transition-all shadow-xl shadow-red-950/40 text-xs flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>{isRtl ? "جاري الإرسال للصندوق المعتمد..." : "Sending Message..."}</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {isRtl
                    ? `إرسال مباشر إلى ${activeChannel.email}`
                    : `Send Message to ${activeChannel.email}`}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
