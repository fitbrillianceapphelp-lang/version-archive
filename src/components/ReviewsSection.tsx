import React, { useState, useEffect } from "react";
import { Star, Award, Upload, CheckCircle2, Quote, Sparkles } from "lucide-react";
import { ClientReview, Language } from "../types";
import { supabase } from "../lib/supabase";

interface ReviewsSectionProps {
  lang?: Language;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ lang = "ar" }) => {
  const isRtl = lang === "ar";
  
  const defaultReviews: ClientReview[] = [
    {
      id: "rev-foul-mohamed-ahmed",
      customerName: "الوكالة الإعلانية المنفذة لحملة مطاعم فول محمد أحمد",
      businessName: "حملة مطاعم فول محمد أحمد (تنفيذ وإنتاج إعلاني عبر الوكيل الإعلاني)",
      rating: 5,
      quote: "تنفيذ وتصوير الهوية الإعلانية والحملات الترويجية المرئية لمطاعم «فول محمد أحمد — تأسس عام 1957» بالتعاون مع الوكيل الإعلاني، وإخراج حملة «المسؤول عن عشق إسكندرية للفول» بأعلى معايير الإنتاج السينمائي والهوية البصرية.",
      isFoundingMember: true,
      membershipCode: "FB-FM-FOUL-AGENCY",
      approved: true,
      createdAt: "2026-08-05",
    },
    {
      id: "rev-abo-eldahab-gym",
      customerName: "كابتن أبو الدهب",
      businessName: "سلسلة Abo Eldahab Gym & Fitness Club (Titan Power Whey)",
      rating: 5,
      quote: "بناء الهوية البصرية ثلاثية الأبعاد، تصوير الحملات الإبداعية السينمائية للفنون القتالية، وإدارة مسابقات الجماهير التفاعلية لمباريات مصر وأستراليا والأرجنتين، رفعت التفاعل والمبيعات والاشتراكات لمستويات قياسية.",
      isFoundingMember: true,
      membershipCode: "FB-FM-ABOELDAHAB",
      approved: true,
      createdAt: "2026-07-22",
    },
    {
      id: "rev-etoilista-sports",
      customerName: "كابتن أسماء سمسم",
      businessName: "وكالة Etoilista Sports Agency (تخطيط الأحمال والفتنس التخصصي 2026/2027)",
      rating: 5,
      quote: "صناعة البطلات في كرة اليد والألعاب الفردية والجماعية يحتاج علم ودقة. تعاوننا مع كوتش سراج في صياغة المنظومة المتكاملة وتخطيط الأحمال البدنية ساعد في وصول اللاعبات للقمة البدنية في بطولات الموسم الحاسم.",
      isFoundingMember: true,
      membershipCode: "FB-FM-ETOILISTA",
      approved: true,
      createdAt: "2026-08-12",
    },
    {
      id: "rev-al-fanar-media",
      customerName: "إدارة شركة الفنار",
      businessName: "الفنار للدعاية والإعلان (Al-Fanar Advertising & Media)",
      rating: 5,
      quote: "شعارنا المشترك «نرى ما لا يراه الآخرون.. لنصنع ما لا يستطيع الآخرون صنعه» تجسد في بناء المنظومة وتوجيه الحملات الذكية وتصميم الهويات الباقية التي تصل للجمهور بدقة.",
      isFoundingMember: true,
      membershipCode: "FB-FM-ALFANAR",
      approved: true,
      createdAt: "2026-08-15",
    },
    {
      id: "rev-queen-service",
      customerName: "إدارة كوين سيرفيس",
      businessName: "Queen Service & Electrical Repair (الصيانة والتشغيل الهندسي)",
      rating: 5,
      quote: "تصميم الهوية الذهبية الملكية وتنظيم مسارات خدمة العملاء وأتمتة طلبات الصيانة عزز من ثقة العملاء وسرعة الاستجابة لخدماتنا في السوق.",
      isFoundingMember: true,
      membershipCode: "FB-FM-QUEEN",
      approved: true,
      createdAt: "2026-07-30",
    },
    {
      id: "rev-coach-amal",
      customerName: "كوتش أمل",
      businessName: "Coach Amal Fitness (التدريب الرياضي والتأهيل البدني)",
      rating: 5,
      quote: "الهوية الرقمية المضيئة وبناء باقات التدريب الخاصة بالسيدات والبرامج الشخصية ساعدتني في بناء قاعدة متدربات واسعة وتدفق حجوزات منتظم.",
      isFoundingMember: true,
      membershipCode: "FB-FM-AMAL",
      approved: true,
      createdAt: "2026-08-08",
    },
    {
      id: "rev-logistics-banna",
      customerName: "أ. حسام البنا",
      businessName: "قطاع التجارة والاستيراد والشحن الدولي (مصر ⇄ الصين واليونان)",
      rating: 5,
      quote: "كنت أسافر شخصياً بشنط شخصية مرتين أو ثلاث في الشهر لتلبية طلبات الزبائن مع مخاطر وضغط وتكاليف مهدرة. بعد إعادة الهيكلة التشغيلية مع كوتش سراج، تطور البيزنس لنظام شحن كلي وبقينا نشحن كونتينر واتنين شهرياً بين مصر والصين واليونان باستقرار وأرباح قياسية.",
      isFoundingMember: true,
      membershipCode: "FB-FM-LOGISTICS",
      approved: true,
      createdAt: "2026-08-01",
    },
    {
      id: "rev-ksa-eng",
      customerName: "م. عبد العزيز الشمري",
      businessName: "مكتب استشارات وإدارة مشاريع هندسية (الرياض، المملكة العربية السعودية)",
      rating: 5,
      quote: "إعادة هندسة العروض والاستشارات الهندسية في السوق السعودي مع كوتش سراج نقلتني من العمل الفردي المشتت إلى استقطاب عقود إشراف واستشارات مع كبرى الشركات وبناء علامة مهنية موثوقة.",
      isFoundingMember: true,
      membershipCode: "FB-FM-KSA-ENG",
      approved: true,
      createdAt: "2026-08-10",
    },
    {
      id: "rev-uae-tourism",
      customerName: "أ. لمياء الكعبي",
      businessName: "وكالة سياحة وسفر وتنظيم رحلات (دبي، الإمارات العربية المتحدة)",
      rating: 5,
      quote: "تصميم قمع المبيعات الرقمي وتصوير الباقات السياحية باحترافية رفع معدل إغلاق الحجوزات ووقف تسريب العملاء المهتمين بنسبة تجاوزت 60% مع عائد استثمار إعلاني ممتاز.",
      isFoundingMember: true,
      membershipCode: "FB-FM-UAE-TOUR",
      approved: true,
      createdAt: "2026-08-14",
    },
    {
      id: "rev-dr-amira-abasiri",
      customerName: "د. أميرة الأباصيري",
      businessName: "باحثة دكتوراه في القانون الدولي والمقارن",
      rating: 5,
      quote: "الدعم المنهجي والتحليلي لأطروحة الدكتوراه في القانون، وتوثيق المراجع والأبحاث المتخصصة، وضبط الاقتباسات والتدقيق اللغوي والقانوني الصارم، وصياغة الفرضيات مع كوتش سراج وفريق Balanced Brilliance، وفر علي شهوراً من الجهد وخرجت الرسالة بأعلى معايير الرصانة الأكاديمية.",
      isFoundingMember: true,
      membershipCode: "FB-FM-LAW-PHD",
      approved: true,
      createdAt: "2026-08-16",
    },
    {
      id: "rev-dr-ebtisam-bakr",
      customerName: "د. ابتسام بكر",
      businessName: "باحثة دكتوراه في علم النفس والقياس السلوكي",
      rating: 5,
      quote: "بناء وتصميم المقاييس السيكومترية والتحليل الإحصائي المتقدم لبيانات عينة البحث الميداني تم باحترافية أكاديمية فائقة بإشراف وتوجيه كوتش سراج، مما عزز من قوة النتائج والتوصيات المعتمدة للأطروحة.",
      isFoundingMember: true,
      membershipCode: "FB-FM-PSYCH-PHD",
      approved: true,
      createdAt: "2026-08-19",
    },
    {
      id: "rev-content-creators-network",
      customerName: "شبكة شراكات صناع المحتوى (محمي بموجب اتفاقيات السرية NDA)",
      businessName: "إنتاج الحلقات والبرامج (تاريخية · وثائقية · علمية · فنية · رياضية)",
      rating: 5,
      quote: "منظومة إنتاج متكاملة لصناع المحتوى مع الالتزام التام والكامل باتفاقيات السرية والخصوصية (NDA) واحترام رغبة الشركاء في عدم الإفصاح عن الأسماء: من البحث المعرفي والتدقيق الأكاديمي، كتابة السيناريو، التصوير والإخراج السينمائي، وإدارة المنصات بنمو عضوي وتفاعل حقيقي 100% بدون أي تلاعب أو مشاهدات مصطنعة.",
      isFoundingMember: true,
      membershipCode: "FB-FM-CONFIDENTIAL-CREATORS",
      approved: true,
      createdAt: "2026-08-20",
    },
  ];

  const [reviewsList, setReviewsList] = useState<ClientReview[]>(defaultReviews);
  const [loading, setLoading] = useState(false);

  // New Review Form State
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [quote, setQuote] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [isFounding, setIsFounding] = useState(true);

  const [submitting, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    // 1. Try fetching from Supabase
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedReviews: ClientReview[] = data.map((d: any) => ({
          id: d.id,
          customerName: d.customer_name,
          businessName: d.business_name,
          rating: d.rating,
          quote: d.quote,
          isFoundingMember: d.is_founding_member,
          membershipCode: d.membership_code,
          proofImageUrl: d.proof_image_url,
          approved: d.approved,
          createdAt: d.created_at,
        }));
        setReviewsList(mappedReviews);
        return;
      }
    } catch (_) {}

    // 2. Fallback to API
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.reviews && data.reviews.length > 0) {
        setReviewsList(data.reviews);
      }
    } catch (_) {
      // Keep default loaded reviews
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    setLoadingSubmit(true);
    setMessage(null);

    const newRev: ClientReview = {
      id: `rev-${Date.now()}`,
      customerName: name.trim(),
      businessName: business.trim() || (isRtl ? "شريك نجاح" : "Partner"),
      rating,
      quote: quote.trim(),
      isFoundingMember: isFounding,
      proofImageUrl: proofImage,
      approved: true,
      createdAt: new Date().toISOString(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setMessage(isRtl ? "شكراً لمشاركتك التقييم! تم نشر تجربتك بنجاح." : "Thank you for your feedback! Your review has been published.");
    setName("");
    setBusiness("");
    setQuote("");
    setProofImage("");

    // Try saving directly to Supabase
    try {
      await supabase.from("reviews").insert([
        {
          customer_name: newRev.customerName,
          business_name: newRev.businessName,
          rating: newRev.rating,
          quote: newRev.quote,
          is_founding_member: newRev.isFoundingMember,
          proof_image_url: newRev.proofImageUrl,
          approved: true,
        },
      ]);
    } catch (_) {}

    // Try posting to API
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRev),
      });
    } catch (_) {}

    setLoadingSubmit(false);
  };

  return (
    <div className={`flex flex-col gap-10 py-6 select-none ${isRtl ? "text-right" : "text-left"}`}>
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#dc2626]/15 text-[#ef4444] border border-[#dc2626]/40 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
          <Quote className="w-3.5 h-3.5" />
          {isRtl ? "تجارب أصحاب المشاريع والباحثين والأعضاء" : "Real Founder & Academic Stories"}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#f8fafc] leading-tight">
          {isRtl ? "قصص نجاح وتجارب حقيقية من أرض الميدان" : "Field Transformation & Case Stories"}
        </h1>

        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-2xl">
          {isRtl ? "آراء وتقييمات شركاء النجاح الذين خاضوا تجربة التحول، إنتاج وتصوير المحتوى التدريبي، واستشارات الدراسات العليا مع كوتش سراج ومنظومة Fit Brilliance." : "Verifiable reviews from business owners, trainers, and researchers who partnered with Coach Serag and the Fit Brilliance ecosystem."}
        </p>

        {/* Real Verified Track Record Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl pt-2 font-mono text-center">
          <div className="bg-[#0b1015] border border-[#dc2626]/30 p-3 sm:p-4 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-[#ef4444] block">+400</span>
            <span className="text-[10px] sm:text-xs text-[#94a3b8]">{isRtl ? "عميل وشريك نجاح" : "Clients & Partners"}</span>
          </div>
          <div className="bg-[#0b1015] border border-[#1e293b] p-3 sm:p-4 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-[#f8fafc] block">+120</span>
            <span className="text-[10px] sm:text-xs text-[#94a3b8]">{isRtl ? "استشارة ميدانية منفذة" : "Field Consultations"}</span>
          </div>
          <div className="bg-[#0b1015] border border-[#1e293b] p-3 sm:p-4 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-[#cbd5e1] block">5+</span>
            <span className="text-[10px] sm:text-xs text-[#94a3b8]">{isRtl ? "دول وأسواق إقليمية" : "Regional Markets"}</span>
          </div>
          <div className="bg-[#0b1015] border border-[#dc2626]/30 p-3 sm:p-4 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-[#ef4444] block">100%</span>
            <span className="text-[10px] sm:text-xs text-[#94a3b8]">{isRtl ? "إشراف ميداني مباشر" : "Direct Supervision"}</span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="bg-[#0b1015] border border-[#1e293b] hover:border-[#dc2626]/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all duration-300 shadow-2xl relative"
          >
            <div className="flex flex-col gap-4">
              {/* Rating Stars */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rev.rating
                          ? "fill-[#ef4444] text-[#ef4444]"
                          : "text-[#1e293b] fill-[#121a21]"
                      }`}
                    />
                  ))}
                </div>

                {rev.isFoundingMember && (
                  <span className="text-[10px] font-mono font-bold text-[#ef4444] bg-[#ef4444]/10 px-2.5 py-0.5 rounded-full border border-[#ef4444]/30 flex items-center gap-1">
                    <Award className="w-3 h-3" /> {isRtl ? "عضو معتمد" : "Verified Partner"}
                  </span>
                )}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-[#f8fafc] leading-relaxed italic">
                "{rev.quote}"
              </p>

              {/* Proof Image if provided */}
              {rev.proofImageUrl && (
                <div className="w-full h-32 bg-[#090d0e] rounded-2xl overflow-hidden border border-[#1e293b]">
                  <img
                    src={rev.proofImageUrl}
                    alt="Proof"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Author */}
            <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <strong className="text-[#f8fafc]">{rev.customerName}</strong>
                <span className="text-[11px] text-[#94a3b8]">{rev.businessName}</span>
              </div>
              {rev.membershipCode && (
                <span className="text-[10px] font-mono text-[#ef4444]">
                  {rev.membershipCode}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Your Review Form */}
      <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl max-w-2xl mx-auto w-full flex flex-col gap-6 mt-6">
        <div className="flex flex-col gap-2 border-b border-[#1e293b] pb-4">
          <h2 className="text-lg font-bold text-[#f8fafc] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ef4444]" />
            {isRtl ? "شاركنا تجربتك وتقييمك مع Fit Brilliance" : "Share Your Fit Brilliance Experience"}
          </h2>
          <p className="text-xs text-[#94a3b8]">
            {isRtl ? "رأيك يمثل دليلاً حقيقياً يساعد أصحاب المشاريع والباحثين على اتخاذ القرار الصحيح." : "Your feedback helps other ambitious founders and researchers make the right strategic decision."}
          </p>
        </div>

        {message && (
          <div className="p-4 bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] text-xs rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-xs font-bold text-[#f8fafc] flex flex-col gap-2">
              {isRtl ? "اسمك الكريم *" : "Your Name *"}
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRtl ? "الاسم" : "Your Name"}
                className="bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-2.5 text-xs text-[#f8fafc] outline-none"
              />
            </label>

            <label className="text-xs font-bold text-[#f8fafc] flex flex-col gap-2">
              {isRtl ? "اسم نشاطك أو تخصصك" : "Business or Specialty"}
              <input
                type="text"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder={isRtl ? "اسم الشركة / المركز / مجال البحث" : "Organization / Field"}
                className="bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-2.5 text-xs text-[#f8fafc] outline-none"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#f8fafc]">{isRtl ? "تقييم التجربة:" : "Experience Rating:"}</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-[#ef4444] text-[#ef4444]"
                        : "text-[#1e293b] fill-[#121a21]"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="text-xs font-bold text-[#f8fafc] flex flex-col gap-2">
            {isRtl ? "رأيك وانطباعك الميداني *" : "Your Review & Feedback *"}
            <textarea
              required
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder={isRtl ? "اكتب كيف أثرت الخدمة في مسار مشروعك أو دراستك..." : "Describe how our service impacted your venture..."}
              className="bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl p-4 text-xs text-[#f8fafc] outline-none resize-y"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#f8fafc]">
              {isRtl ? "إرفاق صورة من التقييم أو النتيجة (اختياري)" : "Attach Result or Screenshot (Optional)"}
            </span>
            <label className="border border-dashed border-[#1e293b] hover:border-[#ef4444] bg-[#121a21] p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs text-[#94a3b8]">
              <Upload className="w-4 h-4 text-[#ef4444]" />
              <span>{proofImage ? (isRtl ? "تم إرفاق صورة المعاينة" : "Image Attached") : (isRtl ? "اضغط لرفع صورة إثبات التقييم" : "Click to Upload Screenshot")}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black py-3.5 rounded-2xl transition-all shadow-xl shadow-[#dc2626]/20 text-xs cursor-pointer mt-2"
          >
            {submitting ? (isRtl ? "جاري النشر..." : "Submitting...") : (isRtl ? "نشر تجربتك مع Fit Brilliance" : "Publish Your Fit Brilliance Review")}
          </button>
        </form>
      </div>
    </div>
  );
};
