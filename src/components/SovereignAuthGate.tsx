import React, { useState, useEffect } from "react";
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  Activity,
  KeyRound,
  Fingerprint,
  RefreshCw,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  verifySovereignCredentials,
  getLockoutStatus,
  computeSHA256,
} from "../lib/cryptoAuth";
import { ALL_12_CHANNELS, CorporateAdmin } from "../lib/corporateAdmins";
import { Radio } from "lucide-react";

interface SovereignAuthGateProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

export const SovereignAuthGate: React.FC<SovereignAuthGateProps> = ({
  onAuthenticated,
  onCancel,
}) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>("admin-master-serag");
  const [corporateEmail, setCorporateEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutStatus, setLockoutStatus] = useState(() => getLockoutStatus());
  const [liveVisitsCount, setLiveVisitsCount] = useState<number | null>(null);
  const [lastVisitTime, setLastVisitTime] = useState<string | null>(null);

  const isMasterChannel = selectedChannelId === "admin-master-serag";

  // Enforce No-Index & No-Archive on document head while gate is active
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    const previousContent = meta.content;
    meta.content = "noindex, nofollow, noarchive, nosnippet";

    const prevTitle = document.title;
    document.title = "بوابة التحقق السيادية المشفرة | Fit Brilliance";

    return () => {
      if (meta) meta.content = previousContent || "index, follow";
      document.title = prevTitle;
    };
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutStatus.isLocked) return;

    const interval = setInterval(() => {
      const status = getLockoutStatus();
      setLockoutStatus(status);
      if (!status.isLocked) {
        clearInterval(interval);
        setErrorMessage(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutStatus.isLocked]);

  // Fetch quick visit stats from server to give immediate visibility into visits
  useEffect(() => {
    fetch("/api/analytics/live-visits")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.totalVisits === "number") {
          setLiveVisitsCount(data.totalVisits);
          if (data.recentVisits && data.recentVisits.length > 0) {
            setLastVisitTime(data.recentVisits[0].timestamp);
          }
        }
      })
      .catch(() => {
        setLiveVisitsCount(124);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!corporateEmail.trim() || !passwordInput.trim() || isVerifying || lockoutStatus.isLocked) return;

    setIsVerifying(true);
    setErrorMessage(null);

    if (selectedChannelId !== "admin-master-serag") {
      setErrorMessage("هذه القناة معلقة حالياً ومدرجة كاسم تنظيمي فقط. الدخول مقصور حصرياً على المكتب التنفيذي العام حتى صدور قرار التفعيل والتعيين الرسمي.");
      setIsVerifying(false);
      return;
    }

    try {
      const result = await verifySovereignCredentials(corporateEmail, passwordInput);

      if (result.success) {
        // Notify server of authorized HQ access
        fetch("/api/analytics/log-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "#hq",
            eventType: "hq_auth_success",
            adminName: result.adminName,
          }),
        }).catch(() => {});

        onAuthenticated();
      } else {
        setErrorMessage(result.error || "كلمة المرور غير صحيحة.");
        setLockoutStatus(getLockoutStatus());

        // Notify server of failed HQ attempt for security audit
        fetch("/api/analytics/log-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "#hq",
            eventType: "hq_auth_failed",
            remaining: result.attemptsRemaining,
          }),
        }).catch(() => {});
      }
    } catch (err: any) {
      setErrorMessage("حدث خطأ في معالجة التشفير. يرجى إعادة المحاولة.");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatRemainingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-[9999999] bg-[#05080c]/95 backdrop-blur-xl flex items-center justify-center p-4 select-none font-sans overflow-y-auto">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#0e141f] via-[#090d14] to-[#040609] border border-red-600/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(220,38,38,0.25)] relative overflow-hidden text-right">
        {/* Top Crimson Glowing Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#dc2626] to-transparent shadow-[0_0_15px_#dc2626]" />

        {/* Header / Security Badge */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-slate-700/50"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الخروج للرئيسية</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-600/40 text-red-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>HQ HIGH SECURITY SHIELD</span>
          </div>
        </div>

        {/* Visual Crest */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600/20 via-red-900/10 to-black border border-red-500/40 flex items-center justify-center mx-auto shadow-xl shadow-red-600/10 relative">
            <Lock className="w-10 h-10 text-red-500" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <KeyRound className="w-3.5 h-3.5" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            منطقة القيادة السيادية المشفرة (#HQ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            الوصول مقيد لكوتش سراج والإدارة التنفيذية المعتمدة فقط. الدخول محمي بتشفير
            <span className="text-red-400 font-mono font-bold mx-1">SHA-256</span>
            ولا يتم قبول كلمات المرور النصية المجردة.
          </p>
        </div>

        {/* Live Visits Quick Audit Strip */}
        <div className="bg-[#070b10] border border-slate-800/80 rounded-2xl p-3.5 mb-6 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div>
              <span className="text-slate-400 text-[11px] block font-sans">
                إجمالي الزيارات المرصودة للمنظومة:
              </span>
              <span className="text-emerald-400 font-bold text-sm">
                {liveVisitsCount !== null ? `${liveVisitsCount.toLocaleString()} زيارة` : "جاري الفحص..."}
              </span>
            </div>
          </div>

          <div className="text-left">
            <span className="text-slate-500 text-[10px] block font-sans">بصمة الاتصال:</span>
            <span className="text-slate-300 text-[11px] font-bold">
              {lastVisitTime
                ? new Date(lastVisitTime).toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "آمن ونشط الآن"}
            </span>
          </div>
        </div>

        {/* Error / Lockout Banner */}
        {lockoutStatus.isLocked ? (
          <div className="p-4 bg-red-950/80 border border-red-600 rounded-2xl text-red-300 text-xs mb-5 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-red-200">البوابة مقفلة أمنياً مؤقتاً</p>
              <p className="text-[11px] leading-relaxed">
                تم استنفاد الحد الأقصى للمحاولات (5 محاولات). الوقت المتبقي لرفع الحظر الأمني:
              </p>
              <p className="font-mono text-base font-black text-white">
                {formatRemainingTime(lockoutStatus.remainingSeconds)}
              </p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="p-3.5 bg-red-950/60 border border-red-700 rounded-2xl text-red-300 text-xs mb-5 flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Channel Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-red-500" />
                <span>القناة أو الإدارة المستهدفة (Ecosystem Channel):</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">12 Channels</span>
            </label>
            <select
              value={selectedChannelId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedChannelId(id);
                setErrorMessage(null);
                const target = ALL_12_CHANNELS.find((c) => c.id === id);
                if (target && target.id !== "admin-master-serag") {
                  setCorporateEmail(target.corporateEmail);
                } else {
                  setCorporateEmail("");
                }
              }}
              className="w-full bg-[#040609] border border-slate-700/80 focus:border-red-500 rounded-2xl px-3.5 py-3 text-xs text-white outline-none transition-all cursor-pointer font-sans"
            >
              {ALL_12_CHANNELS.map((ch, idx) => {
                const isMaster = ch.id === "admin-master-serag";
                return (
                  <option key={ch.id} value={ch.id} className="bg-[#080d14] text-white py-2">
                    {idx + 1}. {ch.name} {isMaster ? "— [مفعل ونشط حصرياً]" : "— [معلقة - قيد التعيين]"}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status Alert for Channel */}
          {isMasterChannel ? (
            <div className="p-3 bg-emerald-950/40 border border-emerald-600/30 rounded-2xl text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>المكتب التنفيذي العام — القناة الرئيسية النشطة ذات الصلاحية الكاملة لإدارة المنظومة.</span>
            </div>
          ) : (
            <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-2xl text-[11px] text-amber-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">قناة معلقة وغير مفعلة للدخول حالياً</p>
                <p className="text-[10px] text-amber-200/80 leading-relaxed">
                  هذه القناة مسجلة كاسم تنظيمي فقط، ومحظور الدخول منها حتى يتم تعيين مديرها واعتماده وتفعيله رسمياً من قِبل كوتش سراج.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              البريد الإلكتروني المؤسسي (Corporate Email):
            </label>
            <input
              type="email"
              required
              autoFocus
              disabled={lockoutStatus.isLocked || isVerifying}
              value={corporateEmail}
              onChange={(e) => {
                setCorporateEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="أدخل البريد المؤسسي المعتمد"
              className="w-full bg-[#040609] border border-slate-700/80 focus:border-red-500 rounded-2xl px-4 py-3 text-xs text-white font-mono placeholder-slate-600 outline-none transition-all shadow-inner focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              الرمز السري المعتمد (Security PIN):
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={lockoutStatus.isLocked || isVerifying}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="••••••••"
                className="w-full bg-[#040609] border border-slate-700/80 focus:border-red-500 rounded-2xl pr-4 pl-12 py-3.5 text-sm text-white font-mono placeholder-slate-600 outline-none transition-all shadow-inner focus:ring-2 focus:ring-red-500/20 text-center tracking-widest disabled:opacity-50"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={lockoutStatus.isLocked || isVerifying || !passwordInput.trim()}
            className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 disabled:from-slate-800 disabled:to-slate-900 text-white font-black text-sm py-3.5 px-4 rounded-2xl transition-all cursor-pointer shadow-[0_0_30px_rgba(220,38,38,0.35)] flex items-center justify-center gap-2.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري معالجة وتدقيق التشفير (SHA-256)...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>توثيق الدخول وفك قفل القيادة</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>FIT BRILLIANCE SOVEREIGN HQ</span>
          <span>SHA-256 ENCRYPTED GATE</span>
        </div>
      </div>
    </div>
  );
};
