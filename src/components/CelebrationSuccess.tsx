import React, { useEffect } from "react";
import { CheckCircle2, Sparkles, MessageCircle, ArrowRight, Copy, Check } from "lucide-react";

interface CelebrationSuccessProps {
  title: string;
  subtitle: string;
  referenceCode?: string;
  whatsappMessage?: string;
  onReset?: () => void;
  resetButtonText?: string;
}

export const CelebrationSuccess: React.FC<CelebrationSuccessProps> = ({
  title,
  subtitle,
  referenceCode,
  whatsappMessage,
  onReset,
  resetButtonText = "إرسال طلب جديد",
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    if (referenceCode) {
      navigator.clipboard.writeText(referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      whatsappMessage ||
        `السلام عليكم كوتش سراج، قمت بإرسال طلبي بنجاح ورقم المرجع الخاص بي هو: ${referenceCode || ""}`
    );
    window.open(`https://wa.me/201274879442?text=${text}`, "_blank");
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0b141f] via-[#070b10] to-black border-2 border-emerald-500/60 p-6 sm:p-10 text-center shadow-[0_20px_50px_rgba(16,185,129,0.2)] animate-in zoom-in-95 fade-in duration-300 font-sans select-none">
      {/* CSS Confetti & Starburst Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-ping"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 95}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              backgroundColor: ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#ec4899"][i % 5],
              animationDuration: `${1.5 + (i % 3) * 0.8}s`,
              animationDelay: `${(i % 5) * 0.2}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Central Animated Checkmark Circle */}
      <div className="relative mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24">
        {/* Glowing Aura Rings */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/25 blur-xl animate-pulse" />
        <div className="absolute -inset-1 rounded-full border-2 border-emerald-400/40 animate-spin" style={{ animationDuration: "8s" }} />

        <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.7)]">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-[2.5] drop-shadow-md" />
        </div>
      </div>

      {/* Title & Celebratory Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 font-bold mb-3">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>تم توثيق واعتماد الإرسال بنجاح</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
        {subtitle}
      </p>

      {/* Reference Code Card (if available) */}
      {referenceCode && (
        <div className="max-w-xs mx-auto mb-6 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between shadow-inner">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">رقم المرجع المعتمد</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 tracking-wider">
              {referenceCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px]"
            title="نسخ رقم المرجع"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "تم النسخ" : "نسخ"}</span>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-[1.02]"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>المتابعة المباشرة عبر واتساب</span>
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs border border-slate-800 transition-colors cursor-pointer"
          >
            {resetButtonText}
          </button>
        )}
      </div>
    </div>
  );
};
