import React, { useState, useEffect, useRef } from "react";
import { Lock, KeyRound, Eye, EyeOff, AlertCircle, X, Sparkles, Mail, ShieldCheck, Radio, ShieldAlert } from "lucide-react";
import { SovereignCommandCenter } from "./SovereignCommandCenter";
import { verifySovereignCredentials, revokeSovereignAuth, isSovereignAuthorized } from "../lib/cryptoAuth";
import { ALL_12_CHANNELS, CorporateAdmin } from "../lib/corporateAdmins";
import { Language } from "../types";

const TARGET_TRIGGER_PHRASE = "start smart";
const MAX_TRIGGER_DURATION_MS = 15000; // Generous 15 seconds window for typing phrase naturally

interface GhostSecurityTriggerProps {
  lang?: Language;
}

export const GhostSecurityTrigger: React.FC<GhostSecurityTriggerProps> = ({ lang = "ar" }) => {
  const isRtl = lang === "ar";
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(() => isSovereignAuthorized());
  const [selectedChannelId, setSelectedChannelId] = useState<string>("admin-master-serag");
  const [corporateEmail, setCorporateEmail] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [showPinText, setShowPinText] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedChannel: CorporateAdmin | undefined = ALL_12_CHANNELS.find(
    (c) => c.id === selectedChannelId
  );
  const isMasterChannel = selectedChannelId === "admin-master-serag";

  // Buffer to capture keypress sequence and timestamps
  const keyBufferRef = useRef<{ char: string; timestamp: number }[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in active form inputs/textareas
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key.length !== 1 && key !== " ") return;

      const now = Date.now();
      keyBufferRef.current.push({ char: key, timestamp: now });

      if (keyBufferRef.current.length > 30) {
        keyBufferRef.current.shift();
      }

      const currentString = keyBufferRef.current.map((item) => item.char).join("");
      const targetNormalized = TARGET_TRIGGER_PHRASE.toLowerCase();
      const targetWithoutSpace = targetNormalized.replace(/\s+/g, "");

      const matchedWithSpace = currentString.endsWith(targetNormalized);
      const matchedWithoutSpace = currentString.replace(/\s+/g, "").endsWith(targetWithoutSpace);

      if (matchedWithSpace || matchedWithoutSpace) {
        const targetLen = matchedWithSpace ? targetNormalized.length : targetWithoutSpace.length;
        const matchingSlice = keyBufferRef.current.slice(-targetLen);
        if (matchingSlice.length > 1) {
          const duration = matchingSlice[matchingSlice.length - 1].timestamp - matchingSlice[0].timestamp;
          if (duration <= MAX_TRIGGER_DURATION_MS) {
            // Secret 'Start Smart' confirmed
            setShowAuthModal(true);
            setPinError(false);
            setErrorMessage("");
            setSelectedChannelId("admin-master-serag");
            setCorporateEmail("");
            setPinInput("");
            keyBufferRef.current = [];
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChannelChange = (channelId: string) => {
    setSelectedChannelId(channelId);
    setPinError(false);
    setErrorMessage("");

    const targetChan = ALL_12_CHANNELS.find((c) => c.id === channelId);
    if (targetChan && targetChan.id !== "admin-master-serag") {
      setCorporateEmail(targetChan.corporateEmail);
    } else {
      setCorporateEmail("");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setPinError(false);
    setErrorMessage("");

    // Enforce: only the director/super admin is activated
    if (selectedChannelId !== "admin-master-serag") {
      setPinError(true);
      setErrorMessage(
        isRtl
          ? "هذه القناة معلقة حالياً ومدرجة كاسم تنظيمي فقط. الدخول مقصور حصرياً على المكتب التنفيذي العام حتى صدور قرار التفعيل والتعيين الرسمي."
          : "This channel is currently inactive and listed as an organizational placeholder only. Access is strictly restricted to the Executive Directorate."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await verifySovereignCredentials(corporateEmail, pinInput);
      if (result.success) {
        setIsAuthorized(true);
        setShowAuthModal(false);
        setPinInput("");
        setCorporateEmail("");
      } else {
        setPinError(true);
        setErrorMessage(
          result.error ||
            (isRtl ? "بيانات الدخول غير صحيحة أو الصلاحية غير مفعلة." : "Invalid credentials or inactive role.")
        );
      }
    } catch {
      setPinError(true);
      setErrorMessage(
        isRtl
          ? "حدث خطأ في التدقيق الأمني المشفر. يرجى إعادة المحاولة."
          : "Encrypted security verification error. Please retry."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseCommandCenter = () => {
    revokeSovereignAuth();
    setIsAuthorized(false);
    setShowAuthModal(false);
  };

  return (
    <>
      {/* 1. If currently authorized, render full Sovereign Command Center */}
      {isAuthorized && <SovereignCommandCenter onClose={handleCloseCommandCenter} />}

      {/* 2. Secret Ghost Auth Modal (Appears ONLY after typing 'Start Smart') */}
      {showAuthModal && !isAuthorized && (
        <div className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div
            className={`max-w-lg w-full bg-[#080d14] border border-[#dc2626]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(220,38,38,0.3)] space-y-5 relative overflow-hidden font-sans ${
              isRtl ? "text-right" : "text-left"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#dc2626] to-transparent shadow-[0_0_10px_#dc2626]" />

            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className={`absolute top-4 ${
                isRtl ? "left-4" : "right-4"
              } text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer transition-colors`}
              aria-label={isRtl ? "إغلاق" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2.5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#dc2626]/25 to-black border border-[#ef4444]/40 flex items-center justify-center mx-auto shadow-lg shadow-[#dc2626]/20">
                <Lock className="w-8 h-8 text-[#ef4444]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dc2626]/15 border border-[#dc2626]/30 text-[#ef4444] text-[11px] font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>START SMART VERIFIED</span>
              </div>

              <h2 className="text-lg font-black text-white tracking-wide">
                {isRtl
                  ? "بوابة دخول الإدارة والسيادة التنفيذية"
                  : "Executive Leadership & Command Portal"}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                {isRtl
                  ? "منطقة تسجيل دخول مؤمنة ومشفرة لقيادات وأقسام منظومة Fit Brilliance."
                  : "Secure encrypted authentication portal for Fit Brilliance leadership & channels."}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              {/* 1. The 12 Ecosystem Channels Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-red-500" />
                    <span>{isRtl ? "القناة أو الإدارة المستهدفة (Ecosystem Channel):" : "Ecosystem Channel:"}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">12 Channels</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedChannelId}
                    onChange={(e) => handleChannelChange(e.target.value)}
                    className="w-full bg-[#05080c] border border-slate-700 focus:border-[#ef4444] rounded-2xl px-3.5 py-3 text-xs text-white outline-none transition-all cursor-pointer font-sans"
                  >
                    {ALL_12_CHANNELS.map((ch, idx) => {
                      const isMaster = ch.id === "admin-master-serag";
                      return (
                        <option
                          key={ch.id}
                          value={ch.id}
                          className="bg-[#080d14] text-white py-2"
                        >
                          {idx + 1}. {ch.name} {isMaster ? (isRtl ? "— [مفعل ونشط حصرياً]" : "— [Active]") : (isRtl ? "— [معلقة - قيد التعيين]" : "— [Pending]")}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Dynamic Status Banner for Selected Channel */}
              {isMasterChannel ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-600/30 rounded-2xl text-[11px] text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {isRtl
                      ? "المكتب التنفيذي العام — القناة الرئيسية النشطة ذات الصلاحية الكاملة لإدارة المنظومة."
                      : "General Executive Office — Active channel with full administrative sovereignty."}
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-2xl text-[11px] text-amber-300 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">
                      {isRtl ? "قناة معلقة وغير مفعلة للدخول حالياً" : "Channel Currently Suspended"}
                    </p>
                    <p className="text-[10px] text-amber-200/80 leading-relaxed">
                      {isRtl
                        ? "هذه القناة مسجلة كاسم تنظيمي فقط ومدرجة في شبكة المنظومة، ومحظور الدخول منها حتى يتم تعيين مديرها واعتماده وتفعيله رسمياً من قِبل كوتش سراج."
                        : "This channel is registered as an organizational placeholder. Access is locked until a manager is officially appointed and activated by Coach Serag."}
                    </p>
                  </div>
                </div>
              )}

              {/* Corporate Email Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                  {isRtl
                    ? "البريد الإلكتروني المؤسسي (Corporate Email):"
                    : "Corporate Email:"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder={isRtl ? "أدخل البريد المؤسسي المعتمد" : "name@domain.com"}
                    value={corporateEmail}
                    onChange={(e) => {
                      setCorporateEmail(e.target.value);
                      if (pinError) setPinError(false);
                    }}
                    className={`w-full bg-[#05080c] border border-slate-700 focus:border-[#ef4444] rounded-2xl ${
                      isRtl ? "pr-4 pl-10" : "pl-4 pr-10"
                    } py-3 text-xs text-white font-mono placeholder-slate-600 outline-none transition-all`}
                  />
                  <Mail
                    className={`w-4 h-4 text-slate-500 absolute ${
                      isRtl ? "left-3.5" : "right-3.5"
                    } top-1/2 -translate-y-1/2`}
                  />
                </div>
              </div>

              {/* PIN / Password Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                  {isRtl
                    ? "الرمز السري المعتمد (Security PIN):"
                    : "Security PIN:"}
                </label>
                <div className="relative">
                  <input
                    type={showPinText ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (pinError) setPinError(false);
                    }}
                    className={`w-full bg-[#05080c] border rounded-2xl ${
                      isRtl ? "pr-4 pl-11" : "pl-4 pr-11"
                    } py-3 text-sm text-white font-mono placeholder-slate-600 outline-none transition-all tracking-widest text-center ${
                      pinError
                        ? "border-rose-500 ring-2 ring-rose-500/30"
                        : "border-slate-700 focus:border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinText(!showPinText)}
                    className={`absolute ${
                      isRtl ? "left-3" : "right-3"
                    } top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1`}
                  >
                    {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {pinError && (
                  <p className="text-[11px] text-rose-400 mt-2 flex items-start gap-1.5 font-bold leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !corporateEmail.trim() || !pinInput.trim()}
                className="w-full bg-gradient-to-r from-[#dc2626] to-[#991b1b] hover:from-[#ef4444] hover:to-[#b91c1c] disabled:opacity-50 text-white font-black text-xs py-3.5 rounded-2xl transition-all cursor-pointer shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? isRtl
                      ? "جاري فك التشفير والتوثيق..."
                      : "Verifying encrypted credentials..."
                    : isRtl
                    ? "دخول غرفة العمليات والتحكم السيادية"
                    : "Enter Sovereign Command Center"}
                </span>
              </button>
            </form>

            <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
              FIT BRILLIANCE SOVEREIGN SYSTEM • SHA-256 ENCRYPTED
            </div>
          </div>
        </div>
      )}
    </>
  );
};
