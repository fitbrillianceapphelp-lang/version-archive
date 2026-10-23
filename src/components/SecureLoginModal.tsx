import React, { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider, facebookAuthProvider } from "../lib/firebase";
import { UserAccount } from "../types";
import {
  ShieldCheck,
  Lock,
  X,
  Music,
  Play,
  Pause,
  Disc,
  FastForward,
  Sparkles,
  Radio,
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import { TRACKS, TrackId } from "./FloatingAudioJourney";

interface SecureLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const SecureLoginModal: React.FC<SecureLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [activeTab, setActiveTab] = useState<"auth" | "playlist">("auth");
  const [currentTrack, setCurrentTrack] = useState<TrackId>("rihla");
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync audio status from DOM
  useEffect(() => {
    if (!isOpen) return;

    const checkAudioStatus = () => {
      const audios = document.querySelectorAll("audio");
      let playing = false;
      audios.forEach((audio) => {
        if (!audio.paused && !audio.ended && audio.currentTime > 0) {
          playing = true;
          const src = audio.getAttribute("src") || "";
          const matched = TRACKS.find((t) => src.includes(t.src) || t.src.includes(src));
          if (matched) {
            setCurrentTrack(matched.id);
          }
        }
      });
      setIsPlaying(playing);
    };

    checkAudioStatus();
    const interval = setInterval(checkAudioStatus, 1000);
    window.addEventListener("play", checkAudioStatus, true);
    window.addEventListener("pause", checkAudioStatus, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener("play", checkAudioStatus, true);
      window.removeEventListener("pause", checkAudioStatus, true);
    };
  }, [isOpen]);

  // Prevent Search Engine Indexing of test or login sessions
  useEffect(() => {
    if (isOpen) {
      let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "robots";
        document.head.appendChild(meta);
      }
      meta.content = "noindex, nofollow, noarchive";

      return () => {
        if (meta) meta.content = "index, follow";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemoteSwitch = (trackId: TrackId) => {
    setCurrentTrack(trackId);
    window.dispatchEvent(
      new CustomEvent("fitbrilliance:switch-track", { detail: { trackId } })
    );
  };

  const handleRemoteToggle = () => {
    window.dispatchEvent(new CustomEvent("fitbrilliance:toggle-play"));
    setIsPlaying((prev) => !prev);
  };

  const handleRemoteJumpVerse = () => {
    window.dispatchEvent(new CustomEvent("fitbrilliance:jump-verse"));
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      const clientUser: UserAccount = {
        email: user.email || `${user.uid}@google.user`,
        name: user.displayName || user.email?.split("@")[0] || "شريك أعمال",
        role: "client",
        whatsapp: whatsapp || "",
        memberInfo: {
          id: user.uid,
          memberCode: `FB-G-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: user.displayName || "شريك أعمال",
          email: user.email || "",
          phone: whatsapp || "",
          businessName: businessName || "نشاط معتمد",
          promoCode: "FOUNDER15",
          discountPercent: 15,
          monthlyConsultationsAvailable: 1,
          status: "active",
          createdAt: new Date().toISOString(),
        },
      };

      onLoginSuccess(clientUser);
      onClose();
    } catch (err: any) {
      console.error("Google login error:", err);
      setAuthError(err.message || "تعذر إكمال تسجيل الدخول عبر Google.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const result = await signInWithPopup(auth, facebookAuthProvider);
      const user = result.user;

      const clientUser: UserAccount = {
        email: user.email || `${user.uid}@facebook.user`,
        name: user.displayName || "شريك فيسبوك",
        role: "client",
        whatsapp: whatsapp || "",
        memberInfo: {
          id: user.uid,
          memberCode: `FB-FB-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: user.displayName || "شريك أعمال",
          email: user.email || "",
          phone: whatsapp || "",
          businessName: businessName || "نشاط معتمد",
          promoCode: "FOUNDER15",
          discountPercent: 15,
          monthlyConsultationsAvailable: 1,
          status: "active",
          createdAt: new Date().toISOString(),
        },
      };

      onLoginSuccess(clientUser);
      onClose();
    } catch (err: any) {
      console.error("Facebook login error:", err);
      setAuthError("تعذر إكمال تسجيل الدخول عبر Facebook. يمكنك الدخول عبر Google أو البريد السريع.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const isTestAccount = email.includes("test") || email.includes("dummy") || email.includes("demo");

    const clientUser: UserAccount = {
      email,
      name: email.split("@")[0],
      role: "client",
      whatsapp,
      memberInfo: {
        id: `client-${Date.now()}`,
        memberCode: `FB-M-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: email.split("@")[0],
        email,
        phone: whatsapp || "01000000000",
        businessName: businessName || "نشاط ريادي",
        promoCode: "FOUNDER15",
        discountPercent: 15,
        monthlyConsultationsAvailable: 1,
        status: isTestAccount ? "pending" : "active",
        createdAt: new Date().toISOString(),
      },
    };

    onLoginSuccess(clientUser);
    onClose();
  };

  return (
    <div
      data-noindex="true"
      className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 text-right font-sans"
    >
      <div className="bg-[#0b1018] border border-slate-700/80 rounded-3xl w-full max-w-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Anti-scraping Header (Mobile Bar) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-[#070b10]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-white">تسجيل الدخول المشفر</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex border-b border-slate-800 bg-[#090d14]">
          <button
            type="button"
            onClick={() => setActiveTab("auth")}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === "auth"
                ? "border-red-500 text-white bg-red-950/20"
                : "border-transparent text-slate-400"
            }`}
          >
            🔐 خيارات تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("playlist")}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "playlist"
                ? "border-red-500 text-white bg-red-950/20"
                : "border-transparent text-slate-400"
            }`}
          >
            <Music className="w-3.5 h-3.5 text-red-400" />
            <span>قائمة التشغيل المختصرة</span>
            {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </button>
        </div>

        {/* Main Column: Authentication Options */}
        <div
          className={`flex-1 p-5 sm:p-7 overflow-y-auto ${
            activeTab === "playlist" ? "hidden md:block" : "block"
          }`}
        >
          {/* Header (Desktop) */}
          <div className="hidden md:flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#ef4444]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">تسجيل الدخول المشفر والآمن</h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Sovereign Privacy Shield • NoIndex Protected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs font-mono">
              {authError}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full bg-[#121a21] hover:bg-[#1a2430] border border-[#2b3a4a] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md hover:border-[#ef4444]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{authLoading ? "جاري التوثيق..." : "المتابعة السريعة بحساب Google"}</span>
            </button>

            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={authLoading}
              className="w-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-blue-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md hover:border-[#1877F2]"
            >
              <svg className="w-4 h-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{authLoading ? "جاري التوثيق..." : "المتابعة المباشرة بحساب Facebook"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] font-mono text-slate-500">أو بالبريد ورقم الهاتف</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email & Phone Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-bold">البريد الإلكتروني المعتمد *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@business.com"
                className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">رقم الواتساب للتواصل والتوثيق *</label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">اسم النشاط أو المؤسسة (اختياري)</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="مجموعة الريادة التجارية"
                className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-red-600/30 mt-2"
            >
              دخول الحساب وتأكيد العضوية
            </button>
          </form>
        </div>

        {/* Side Column: Embedded Playlist Quick Sidebar */}
        <div
          className={`w-full md:w-72 bg-[#070b10] border-t md:border-t-0 md:border-r border-slate-800 p-5 flex flex-col justify-between overflow-y-auto ${
            activeTab === "auth" ? "hidden md:flex" : "flex"
          }`}
        >
          <div>
            {/* Playlist Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Music className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">قائمة التشغيل المختصرة</h4>
                  <p className="text-[9px] text-slate-400 font-mono">Audio Journey Quick Drawer</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoteToggle}
                className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
            </div>

            <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
              استمع للمقطوعات الرسمية لكوتش سراج ومنظومة Fit Brilliance مباشرة دون مغادرة إطار تسجيل الدخول:
            </p>

            {/* Tracks List */}
            <div className="space-y-2.5">
              {TRACKS.map((t) => {
                const isSelected = currentTrack === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleRemoteSwitch(t.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-right flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-red-950/40 border-red-500/70 shadow-[0_0_15px_rgba(220,38,38,0.25)]"
                        : "bg-[#090e15] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Disc
                          className={`w-4 h-4 text-red-400 shrink-0 ${
                            isSelected && isPlaying ? "animate-spin" : ""
                          }`}
                        />
                        <span className="text-xs font-bold text-white line-clamp-1">{t.title_ar}</span>
                      </div>
                      {isSelected && isPlaying && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      )}
                    </div>
                    <span className="text-[9px] text-red-300 font-mono line-clamp-1">{t.artist}</span>

                    {isSelected && t.id === "rihla" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoteJumpVerse();
                        }}
                        className="mt-1 flex items-center justify-center gap-1 text-[9px] font-bold text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-800/50 py-1 rounded-xl transition-all cursor-pointer"
                      >
                        <FastForward className="w-3 h-3 text-red-400" />
                        <span>00:32 («حرف مني يهد جمل»)</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Footer info */}
          <div className="pt-3 border-t border-slate-800/80 mt-4 text-[9px] text-slate-500 font-mono flex items-center justify-between">
            <span>الصوت مشغل بالخلفية</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>0ms Latency</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
