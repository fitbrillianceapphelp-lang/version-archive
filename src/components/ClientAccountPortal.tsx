import React, { useState, useEffect } from "react";
import { UserAccount, ProtectedProject, Language } from "../types";
import { User, Lock, Search, ShieldCheck, Key, PhoneCall, Calendar, Sparkles, Presentation, ArrowRight, Eye, CheckCircle2, Activity, TrendingUp } from "lucide-react";
import { getTranslation } from "../i18n/translations";
import { ProjectViewerModal } from "./ProjectViewerModal";
import { getStoredProjects, findProjectByCode } from "../lib/projectEmbed";
import { ClientActivityDashboard } from "./ClientActivityDashboard";
import { auth, googleAuthProvider } from "../lib/firebase.ts";
import { signInWithPopup } from "firebase/auth";

interface ClientAccountPortalProps {
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  setActiveTab: (tab: string) => void;
  lang?: Language;
}

export const ClientAccountPortal: React.FC<ClientAccountPortalProps> = ({
  currentUser,
  onLoginSuccess,
  setActiveTab,
  lang = 'ar',
}) => {
  const t = getTranslation(lang as Language);
  const isRtl = lang === 'ar';

  const [emailInput, setEmailInput] = useState("");
  const [whatsappInput, setWhatsappInput] = useState("");
  const [preferredTime, setPreferredTime] = useState("مساءً (4 - 8 مساءً)");
  const [projectCodeInput, setProjectCodeInput] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProtectedProject | null>(null);
  const [searchError, setSearchError] = useState("");
  const [projectsList, setProjectsList] = useState<ProtectedProject[]>([]);
  const [portalTab, setPortalTab] = useState<'crm' | 'presentations' | 'account'>('crm');

  useEffect(() => {
    setProjectsList(getStoredProjects());
    const handleUpdate = () => setProjectsList(getStoredProjects());
    window.addEventListener('fitbrilliance_projects_updated', handleUpdate);
    return () => window.removeEventListener('fitbrilliance_projects_updated', handleUpdate);
  }, []);

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("/api/auth/firebase-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "فشل تسجيل الدخول عبر Google");
      }

      onLoginSuccess({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        memberInfo: data.user.memberInfo,
      });
    } catch (err: any) {
      console.error("Google sign in failed:", err);
      setAuthError(err.message || "حدث خطأ أثناء تسجيل الدخول بحساب Google");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    const user: UserAccount = {
      email: emailInput,
      name: emailInput.split("@")[0],
      role: "client",
      whatsapp: whatsappInput,
      preferredTimeSlot: preferredTime,
      memberInfo: {
        id: "mem-101",
        memberCode: `FB-FM-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: emailInput.split("@")[0],
        email: emailInput,
        phone: whatsappInput || "01000000000",
        businessName: "مشروع ريادي",
        promoCode: "FOUNDER15",
        discountPercent: 15,
        monthlyConsultationsAvailable: 1,
        status: "active",
        createdAt: new Date().toISOString(),
      },
    };

    onLoginSuccess(user);
  };

  const handleProjectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    const code = projectCodeInput.trim().toUpperCase();
    const found = findProjectByCode(code);

    if (found) {
      setSelectedProject(found);
    } else {
      setSearchError("لم يتم العثور على مشروع بهذا الرمز. يرجى التأكد من الرمز المرسل إليك أو تجربة: PRJ-CANVA-SHOWCASE أو PRJ-LOGISTICS");
    }
  };

  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8 text-right">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#ef4444] text-xs font-mono font-bold">
          <User className="w-4 h-4" />
          <span>بوابة الشركاء واستعراض المشاريع المباشرة</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#f8fafc] tracking-tight">
          حسابي ومتابعة المشاريع والعروض الحية
        </h2>

        <p className="text-xs sm:text-sm text-[#94a3b8] max-w-2xl mx-auto">
          رادار الأنشطة الإعلانية الحية، واستعراض المشروعات والعروض التفاعلية المباشرة بأعلى درجات الخصوصية والأمان.
        </p>

        {/* Portal Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
          <button
            type="button"
            onClick={() => setPortalTab("crm")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              portalTab === "crm"
                ? "bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-[#ef4444]/50"
                : "bg-[#0b1015] text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4 text-[#ef4444]" />
            <span>رادار النشاط الإعلاني والـ CRM الحي</span>
          </button>

          <button
            type="button"
            onClick={() => setPortalTab("presentations")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              portalTab === "presentations"
                ? "bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-[#ef4444]/50"
                : "bg-[#0b1015] text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <Presentation className="w-4 h-4 text-[#ef4444]" />
            <span>عروض كانفا وجوجل درايف للمشروع</span>
          </button>

          <button
            type="button"
            onClick={() => setPortalTab("account")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              portalTab === "account"
                ? "bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-[#ef4444]/50"
                : "bg-[#0b1015] text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <User className="w-4 h-4 text-[#ef4444]" />
            <span>حساب الشريك والعضوية</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Live Project CRM Dashboard */}
      {portalTab === "crm" && (
        <ClientActivityDashboard initialCode={projectCodeInput || "FB-90D-1040"} lang={lang} />
      )}

      {/* Mode 2: Presentations & Project Search */}
      {portalTab === "presentations" && (
        <div className="space-y-8">
          {/* Quick Access Search Box */}
          <div className="bg-[#0b1015] border border-[#1e293b] hover:border-[#dc2626]/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#f8fafc] flex items-center gap-2">
                <Key className="w-5 h-5 text-[#ef4444]" />
                <span>الاستعلام المباشر بكود المشروع الفريد (PRJ-xxx)</span>
              </h3>
              <span className="text-[10px] font-mono text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/25 px-2 py-0.5 rounded-full">
                عرض مباشر محمي
              </span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              يتم ربط عروض كانفا والملفات المعتمدة بكود المشروع الخاص بك. أدخل الرمز للاستعراض التفاعلي الفوري بدون ظهور المصدر.
            </p>

            <form onSubmit={handleProjectSearch} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                value={projectCodeInput}
                onChange={(e) => setProjectCodeInput(e.target.value)}
                placeholder="أدخل كود المشروع (مثال: PRJ-CANVA-SHOWCASE أو PRJ-LOGISTICS)"
                className="flex-1 bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none font-mono uppercase"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black px-6 py-3 rounded-xl text-xs transition-all shadow-lg shadow-[#dc2626]/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>استعراض المشروع مباشرة</span>
              </button>
            </form>

            {searchError && (
              <p className="text-xs text-rose-400 font-mono pt-1">{searchError}</p>
            )}
          </div>

          {/* Featured Client Projects Ready for Live Presentation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#f8fafc] flex items-center gap-2">
                <Presentation className="w-4 h-4 text-[#ef4444]" />
                <span>نماذج المشاريع والعروض التفاعلية المباشرة المتاحة:</span>
              </h3>
              <span className="text-[11px] text-[#94a3b8] font-mono">
                {projectsList.length} مشاريع معتمدة
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectsList.map((prj) => (
                <div
                  key={prj.projectCode}
                  onClick={() => setSelectedProject(prj)}
                  className="bg-[#0b1015] border border-[#1e293b] hover:border-[#dc2626]/50 p-5 rounded-2xl space-y-3 cursor-pointer transition-all hover:-translate-y-0.5 shadow-lg group relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-[10px] font-mono font-bold">
                      {prj.projectCode}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      prj.status === 'completed'
                        ? 'bg-[#1e293b] text-[#cbd5e1]'
                        : 'bg-[#dc2626]/20 text-[#ef4444] border border-[#dc2626]/40'
                    }`}>
                      {prj.status === 'completed' ? 'مكتمل ومعتمد' : 'نشط — قيد التنفيذ'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#f8fafc] group-hover:text-[#ef4444] transition-colors">
                      {prj.companyName}
                    </h4>
                    <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2">
                      {prj.planName}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-[11px]">
                    <span className="text-[#cbd5e1] font-mono">
                      {prj.teamAssigned}
                    </span>

                    <span className="text-[#ef4444] font-bold flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                      <span>فتح العرض المباشر</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Member Account & Auth */}
      {portalTab === "account" && (
        <div>

      {!currentUser ? (
        /* Login Card */
        <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-8 space-y-6 max-w-md mx-auto shadow-2xl">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-[#f8fafc]">تسجيل الدخول وبوابة الشركاء</h3>
            <p className="text-xs text-[#94a3b8]">وثّق حسابك مباشرة للوصول إلى عضويتك ومشاريعك الخاصة</p>
          </div>

          {/* Google Firebase Sign-In Button */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={authLoading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{authLoading ? "جاري التوثيق مع Google..." : "الدخول المباشر بحساب Google (Gmail)"}</span>
            </button>

            {authError && (
              <p className="text-xs text-rose-400 font-mono text-center bg-rose-950/40 p-2 rounded-lg border border-rose-800/50">
                {authError}
              </p>
            )}

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-500 font-mono">أو الدخول اليدوي بالبريد</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#f8fafc] block">البريد الإلكتروني *</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#f8fafc] block">رقم الواتساب للتواصل *</label>
              <input
                type="tel"
                required
                value={whatsappInput}
                onChange={(e) => setWhatsappInput(e.target.value)}
                placeholder="010xxxxxxxx"
                className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#f8fafc] block">الموعد المفضّل للتواصل</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-[#121a21] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f8fafc] outline-none"
              >
                <option value="صباحاً (9 صباحاً - 1 ظهراً)">صباحاً (9 صباحاً - 1 ظهراً)</option>
                <option value="عصراً (1 ظهراً - 4 عصراً)">عصراً (1 ظهراً - 4 عصراً)</option>
                <option value="مساءً (4 - 8 مساءً)">مساءً (4 - 8 مساءً)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#dc2626]/20 transition-all cursor-pointer"
            >
              الدخول والوصول للعضوية ←
            </button>
          </form>
        </div>
      ) : (
        /* Logged In Portal Dashboard */
        <div className="space-y-6">
          <div className="bg-[#0b1015] border border-[#1e293b] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#ef4444]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#f8fafc]">
                    أهلاً بك، {currentUser.name || currentUser.email.split("@")[0]}
                  </h3>
                  <span className="text-xs text-[#ef4444] font-mono font-bold">
                    عضوية مجتمع الأوائل المعتمدة
                  </span>
                </div>
              </div>

              {currentUser.memberInfo && (
                <div className="bg-[#121a21] border border-[#dc2626]/40 p-3 rounded-2xl text-right font-mono text-xs">
                  <span className="text-[#94a3b8] block">كود العضوية:</span>
                  <span className="text-[#ef4444] font-black text-sm">{currentUser.memberInfo.memberCode}</span>
                </div>
              )}
            </div>

            {/* Member Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-[#121a21] p-4 rounded-2xl border border-[#1e293b]">
                <span className="text-[#94a3b8] block">بروموكود الخصم الحصري:</span>
                <span className="text-[#ef4444] font-black text-base mt-1 block">FOUNDER15</span>
                <span className="text-[10px] text-[#94a3b8]">خصم 15% على كل الخطط</span>
              </div>

              <div className="bg-[#121a21] p-4 rounded-2xl border border-[#1e293b]">
                <span className="text-[#94a3b8] block">الاستشارات المتاحة:</span>
                <span className="text-[#ef4444] font-black text-base mt-1 block">1 / 1 مجانية شهرياً</span>
              </div>

              <div className="bg-[#121a21] p-4 rounded-2xl border border-[#1e293b]">
                <span className="text-[#94a3b8] block">الموعد المفضّل للتواصل:</span>
                <span className="text-[#f8fafc] font-bold mt-1 block">
                  {currentUser.preferredTimeSlot || preferredTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      )}

      {/* Project Viewer Modal Component */}
      {selectedProject && (
        <ProjectViewerModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          lang={lang}
        />
      )}
    </div>
  );
};
