import React from "react";
import { Zap, Scale, ShieldCheck, Sparkles, CheckCircle2, Video, GraduationCap, Award } from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";

interface FamilyIdentitySectionProps {
  lang: Language;
  setActiveTab?: (tab: string) => void;
}

export const FamilyIdentitySection: React.FC<FamilyIdentitySectionProps> = ({ lang, setActiveTab }) => {
  const t = getTranslation(lang);
  const isRtl = lang === "ar";

  return (
    <section className={`py-12 space-y-12 select-none ${isRtl ? "text-right" : "text-left"}`}>
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#ef4444] text-xs font-mono font-bold">
          <Award className="w-4 h-4" />
          <span>{isRtl ? "الهوية الرسمية والفرق المتخصصة · Fit Brilliance" : "Official Ecosystem Identity & Specialized Teams"}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#f8fafc] tracking-tight">
          Fit Brilliance Ecosystem
        </h2>

        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-2xl mx-auto">
          {isRtl
            ? "المنظومة المظلية الرسمية للتحول الاستراتيجي، إنتاج الفعاليات والتدريب، والدعم الأكاديمي، وتنبثق منها فرقتان متخصصتان تحت قيادة وإشراف "
            : "The overarching official ecosystem for strategic transformation, media production, and academic consulting under "}
          <span className="text-[#ef4444] font-bold">{t.coachName}</span>.
        </p>
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Fit Brilliance (Parent) */}
        <div className="bg-[#0b1015] border-2 border-[#dc2626]/40 rounded-3xl p-6 relative overflow-hidden group hover:border-[#ef4444] transition-all shadow-xl shadow-[#dc2626]/5 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#dc2626]/10 rounded-full blur-2xl group-hover:bg-[#dc2626]/20 transition-all pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#dc2626]/40 shadow-lg shadow-[#dc2626]/20 group-hover:scale-105 transition-transform bg-[#121a21]">
                <img
                  src="/assets/logo/fit_brilliance_logo.webp"
                  alt="Fit Brilliance Official Logo"
                  width="64"
                  height="64"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#dc2626]/15 text-[#ef4444] text-[11px] font-bold border border-[#dc2626]/30">
                {isRtl ? "الهوية الرسمية والمنظومة الأم" : "Official Parent Ecosystem"}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">
                Fit Brilliance
              </h3>
              <p className="text-xs text-[#ef4444] font-mono font-bold mt-1">
                {isRtl ? "المنظومة المعتمدة للتحول والإنتاج والريادة" : "Certified Leadership & Production Ecosystem"}
              </p>
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed">
              {isRtl
                ? "الحاضنة الاستراتيجية التي تصيغ الفكر التنموي، المعايير الإنتاجية، والالتزام المعرفي والأكاديمي لكافة المشاريع بالمنظومة."
                : "The strategic umbrella formulating development methodology, production standards, and academic commitment across all ventures."}
            </p>

            <ul className="space-y-2 text-xs text-[#cbd5e1] font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{isRtl ? "إشراف وقيادة مباشرة من كوتش سراج" : "Direct leadership by Coach Serag"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{isRtl ? "تكامل فرق العمل الميدانية والإنتاجية" : "Integration of operational & production teams"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{isRtl ? "حلول شاملة للأعمال والتدريب والدراسات" : "Comprehensive business & academic solutions"}</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono font-bold text-[#ef4444]">
            <span>{isRtl ? "الهوية الثابتة المعتمدة" : "Official Fixed Identity"}</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Pioneers Brilliance Team */}
        <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 relative overflow-hidden group hover:border-[#dc2626]/50 transition-all shadow-xl shadow-[#dc2626]/5 flex flex-col justify-between">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#dc2626]/40 shadow-lg shadow-[#dc2626]/20 group-hover:scale-105 transition-transform bg-[#121a21]">
                <img
                  src="/assets/logo/pioneers_brilliance_logo.webp"
                  alt="Pioneers Brilliance Team Logo"
                  width="64"
                  height="64"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#121a21] text-[#cbd5e1] text-[11px] font-bold border border-[#1e293b]">
                {isRtl ? "التحول وتصوير الإيفنتات والمحتوى" : "Transformation & Event Filming"}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">
                {isRtl ? "فريق Pioneers Brilliance" : "Pioneers Brilliance Team"}
              </h3>
              <p className="text-xs text-[#ef4444] font-mono font-bold mt-1">
                {isRtl ? "قناة تواصل الفريق (01274534493)" : "Team Channel (+201274534493)"}
              </p>
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed">
              {isRtl
                ? "المسؤول عن تنفيذ خطط التحول الميداني للـ 90 يوماً، وإعداد وتصوير الفعاليات والمؤتمرات والمحتوى التدريبي والتدريسي بأعلى جودة بصرية 4K."
                : "Dedicated to 90-day field transformation execution, event production, and educational/training course filming in 4K quality."}
            </p>

            <ul className="space-y-2 text-xs text-[#cbd5e1] font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{isRtl ? "إعداد وتصوير الإيفنتات والبرامج التدريبية" : "Event staging & masterclass filming"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{isRtl ? "متابعة تنفيذ خطط الـ 90 يوماً أسبوعياً" : "Weekly 90-day roadmap execution"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                <a href="mailto:offers@fitbrilliance.store" className="font-mono hover:underline text-[#cbd5e1]">offers@fitbrilliance.store</a>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono font-bold text-[#ef4444]">
            <a href="https://wa.me/201274534493" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
              {isRtl ? "واتساب فريق Pioneers Brilliance ←" : "Pioneers Brilliance WhatsApp →"}
            </a>
            <Video className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Balanced Brilliance Team */}
        <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 relative overflow-hidden group hover:border-[#dc2626]/50 transition-all shadow-xl shadow-[#dc2626]/5 flex flex-col justify-between">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#dc2626]/40 shadow-lg shadow-[#dc2626]/20 group-hover:scale-105 transition-transform bg-[#121a21]">
                <img
                  src="/assets/logo/balanced_brilliance_logo.webp"
                  alt="Balanced Brilliance Logo"
                  width="64"
                  height="64"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#121a21] text-[#cbd5e1] text-[11px] font-bold border border-[#1e293b]">
                {isRtl ? "التوازن وأبحاث الدراسات العليا" : "Balance & Postgraduate Research"}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">
                {isRtl ? "فريق Balanced Brilliance" : "Balanced Brilliance Team"}
              </h3>
              <p className="text-xs text-[#ef4444] font-mono font-bold mt-1">
                {isRtl ? "إشراف كوتش سراج (01274879442)" : "Supervision: Coach Serag (+201274879442)"}
              </p>
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed">
              {isRtl
                ? "المسؤول عن استشارات التوازن المؤسسي، معالجة التعثر والإنقاذ، وتقديم الدعم المنهجي والإحصائي لرسائل الماجستير والدكتوراه والأبحاث العلمية."
                : "Dedicated to institutional turnaround, cashflow balance, and postgraduate academic thesis methodology and advanced statistical analysis."}
            </p>

            <ul className="space-y-2 text-xs text-[#cbd5e1] font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{isRtl ? "مساعدات واستشارات رسائل الماجستير والدكتوراه" : "Master & PhD academic research consulting"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{isRtl ? "التحليل الإحصائي المتقدم (SPSS / AMOS / PLS)" : "Advanced statistical analysis (SPSS / AMOS)"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ef4444] shrink-0" />
                <a href="mailto:projects@fitbrilliance.store" className="font-mono hover:underline text-[#cbd5e1]">projects@fitbrilliance.store</a>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono font-bold text-[#ef4444]">
            <a href="https://wa.me/201274879442" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
              {isRtl ? "واتساب كوتش سراج ←" : "Coach Serag WhatsApp →"}
            </a>
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Coach Serag Bio & Leadership Journey Section */}
      <div className="bg-[#0b1015] border-2 border-[#dc2626]/30 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
          {/* 3x3 Photo Collage Container */}
          <div className="w-full lg:w-1/2 aspect-square max-w-md rounded-2xl overflow-hidden border-2 border-[#dc2626]/40 shadow-2xl shadow-[#dc2626]/10 group hover:border-[#ef4444] transition-all duration-300">
            <img
              src="/assets/logo/coach_serag_bio_grid.webp"
              alt="Coach Serag Portfolio Grid"
              width="448"
              height="448"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Bio & Information Text */}
          <div className={`w-full lg:w-1/2 space-y-6 ${isRtl ? "text-right" : "text-left"}`}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dc2626]/15 text-[#ef4444] text-xs font-mono font-bold border border-[#dc2626]/30">
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? "مسيرتنا والبايو الإشرافي · Leadership Bio" : "Leadership Journey & Official Bio"}</span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-black text-[#f8fafc] tracking-tight">
                  {isRtl ? "كوتش سراج" : "Coach Serag"}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold font-mono">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                  <span>{isRtl ? "موثق رسمياً" : "Meta Verified"}</span>
                </span>
              </div>
              <p className="text-xs text-[#ef4444] font-mono font-bold mt-1">
                {isRtl ? "المؤسس والقائد الميداني لمنظومة Fit Brilliance Ecosystem" : "Founder & Field Commander of Fit Brilliance Ecosystem"}
              </p>
            </div>

            {/* Vision & Human Evolution Philosophy */}
            <div className="bg-[#121a21]/80 border-r-2 border-l-0 rtl:border-r-2 ltr:border-l-2 ltr:border-r-0 border-[#ef4444] p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-[#f8fafc] font-mono flex items-center gap-1.5">
                <span className="text-[#ef4444]">✦</span>
                <span>{isRtl ? "رؤيتي في التطور البشري والقدرات الكامنة:" : "Philosophy on Human Evolution & Latent Potential:"}</span>
              </h4>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {isRtl
                  ? "يمتلك الإنسان المعاصر طاقات عقلية وجسدية وقيادية غير مسبوقة، لكن المعضلة الكبرى تكمن في استسلامه لوهم 'منطقة الراحة'؛ أصبح يبحث عن الراحة والحلول السهلة متجاهلاً جوهر وقيمة 'الرحلة' ذاتها. التحول الحقيقي — سواء كان نهضة لمؤسسة متعثرة، أو صياغة فكرية وبدنية استثنائية — لا يمكن أن يولد من السكون أو الراحة الزائفة، بل يصنعه الانضباط، خوض غمار التجربة في الميدان، وتفكيك العوائق لتفجير أقصى قدرات الإنسان الكامنة."
                  : "Modern humans possess unprecedented intellectual, physical, and leadership capabilities, yet the defining struggle of our era is the passive surrender to the illusion of 'comfort'—seeking effortless shortcuts while discarding the transformative power of the 'journey' itself. Real transformation—whether turning around a struggling enterprise or sculpting exceptional mental and physical grit—is never cultivated in static comfort zones. It is forged through field discipline, confronting friction, and shattering perceived limits to awaken supreme human potential."}
              </p>
            </div>

            {/* Official Meta Verified Credentials Badge Card */}
            <div className="bg-[#121a21] border border-[#1e293b] rounded-2xl p-4 space-y-3 hover:border-[#dc2626]/50 transition-colors">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
                <div className="flex items-center gap-2">
                  <a
                    href="https://facebook.com/serag.onda"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <span className="font-bold text-sm text-[#f8fafc]">Serag Onda (Coach Serag)</span>
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black shrink-0" title="Meta Verified">
                      ✓
                    </span>
                  </a>
                </div>
                <span className="text-[10px] font-mono text-[#94a3b8]">
                  {isRtl ? "الأسبقية الرقمية منذ 2011" : "Digital Archive 2011"}
                </span>
              </div>

              {/* Accreditations & Specs */}
              <div className="space-y-1.5 text-xs text-[#cbd5e1]">
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-[#ef4444] font-bold">
                  <span className="px-2 py-0.5 rounded bg-[#ef4444]/10 border border-[#ef4444]/30">Certified Fitness Trainer (CFT)</span>
                  <span className="px-2 py-0.5 rounded bg-[#ef4444]/10 border border-[#ef4444]/30">Sports Nutrition Specialist (SNS)</span>
                </div>
                <p className="text-[11px] text-[#94a3b8] font-mono leading-relaxed pt-1">
                  Business Dev 🚀 · Entrepreneur · Marketing 🎯 · Creative 🎬 · Fitness 🏋️‍♂️ · IT 💻 · Alexandria 📍
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#1e293b]/70">
                <span className="text-[11px] font-mono text-[#94a3b8]">
                  {isRtl ? "نطاق المنظومة المعتمد:" : "Verified Domain:"}{" "}
                  <a href="https://fitbrilliance.store" className="text-[#ef4444] hover:underline font-bold">fitbrilliance.store</a>
                </span>
                <a
                  href="https://facebook.com/serag.onda"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-blue-600/15 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-[10px] font-mono font-bold transition-all flex items-center gap-1"
                >
                  <span>{isRtl ? "ملف الاعتماد الرسمي" : "Official Profile"}</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Handwritten Signature & Button to full archive */}
            <div className={`pt-2 flex flex-col space-y-4 ${isRtl ? "items-end" : "items-start"} w-full`}>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-[#94a3b8] font-mono">{isRtl ? "التوقيع الاعتمادي المباشر:" : "Direct Certified Signature:"}</span>
                <img
                  src="/assets/logo/coach_serag_signature.webp"
                  alt="Coach Serag Official Signature"
                  width="200"
                  height="56"
                  className="h-14 w-auto object-contain brightness-125 drop-shadow-[0_2px_8px_rgba(220,38,38,0.4)]"
                />
              </div>

              {setActiveTab && (
                <button
                  onClick={() => setActiveTab("whos-serag")}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#dc2626] to-[#991b1b] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black text-xs transition-all shadow-xl shadow-[#dc2626]/30 flex items-center justify-center gap-2 cursor-pointer border border-[#ef4444]/40 hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>{isRtl ? "استعراض مسيرة كوتش سراج، معرض الصور والأغنية الرسمية (رحلة) ←" : "Explore Coach Serag Journey, Photo Gallery & Official Soundtrack (Rihla) →"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
