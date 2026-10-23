import React, { useState, useEffect } from "react";
import { Briefcase, Camera, Video, Sparkles, CheckCircle2, UserCheck, Send, ShieldAlert, AlertTriangle } from "lucide-react";
import { TeamApplication, Language } from "../types";
import { getTranslation } from "../i18n/translations";
import { supabase } from "../lib/supabase";
import {
  getDeviceFingerprint,
  checkDeviceSubmissionQuota,
  recordDeviceSubmission,
} from "../lib/deviceFingerprint";
import { CelebrationSuccess } from "./CelebrationSuccess";

interface TeamApplicationFormProps {
  onSuccessSubmitted: (application: TeamApplication) => void;
  lang: Language;
}

export const TeamApplicationForm: React.FC<TeamApplicationFormProps> = ({
  onSuccessSubmitted,
  lang,
}) => {
  const t = getTranslation(lang);
  const isRtl = lang === "ar";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [workMode, setWorkMode] = useState<'remote' | 'onsite_filming_and_projects' | 'both'>('both');
  const [specialty, setSpecialty] = useState("");
  const [experienceYears, setExperienceYears] = useState(t.expOption1to3);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [createdApp, setCreatedApp] = useState<TeamApplication | null>(null);

  // Device Fingerprint & Legal Mindset Gate
  const [deviceFp, setDeviceFp] = useState<string>("");
  const [quotaLockedMsg, setQuotaLockedMsg] = useState<string | null>(null);
  const [agreedToEthicalClause, setAgreedToEthicalClause] = useState<boolean>(false);
  const [hasPastMistakeCorrection, setHasPastMistakeCorrection] = useState<boolean>(false);
  const [mistakeExplanation, setMistakeExplanation] = useState<string>("");

  useEffect(() => {
    // 1. Check if device has an active submission lock
    const quotaCheck = checkDeviceSubmissionQuota("team_app");
    if (!quotaCheck.allowed && quotaCheck.message) {
      setQuotaLockedMsg(quotaCheck.message);
    }

    // 2. Compute hardware fingerprint
    getDeviceFingerprint().then((res) => {
      setDeviceFp(res.fingerprintHash);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !specialty) return;
    if (!agreedToEthicalClause) {
      alert(t.appAlertMandatory);
      return;
    }

    const quotaCheck = checkDeviceSubmissionQuota("team_app");
    if (!quotaCheck.allowed && quotaCheck.message) {
      setQuotaLockedMsg(quotaCheck.message);
      return;
    }

    const newApp: TeamApplication = {
      id: `TEAM-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName,
      email,
      phone,
      workMode,
      specialty,
      experienceYears,
      portfolioUrl,
      notes: `${notes ? notes + " | " : ""}${hasPastMistakeCorrection ? `[إقرار تصحيح مسار - تحت المراقبة: ${mistakeExplanation || 'تعهد بالالتزام التام وعدم التكرار'}] | ` : ""}SecurityFingerprint: ${deviceFp.substring(0, 16)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Lock device for 48 hours to prevent spam or multi-account evasion
    recordDeviceSubmission("team_app", deviceFp);

    setCreatedApp(newApp);
    setSubmitted(true);
    onSuccessSubmitted(newApp);

    // Try saving directly to Supabase
    try {
      await supabase.from("team_applications").insert([
        {
          id: newApp.id,
          full_name: newApp.fullName,
          email: newApp.email,
          phone: newApp.phone,
          work_mode: newApp.workMode,
          specialty: newApp.specialty,
          experience_years: newApp.experienceYears,
          portfolio_url: newApp.portfolioUrl,
          notes: newApp.notes,
          status: "pending",
        },
      ]);
    } catch (_) {}

    // Try posting to API
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newApp, deviceFingerprint: deviceFp }),
      });
    } catch (_) {}
  };

  if (submitted && createdApp) {
    return (
      <div className="py-12 max-w-2xl mx-auto space-y-6 text-center">
        <CelebrationSuccess
          title={t.successAppTitle}
          subtitle={t.successAppDesc}
          referenceCode={createdApp.id}
          onReset={() => setSubmitted(false)}
          resetButtonText={isRtl ? "تقديم طلب آخر" : "Submit Another Application"}
        />

        <div className="bg-[#0b1015] border-2 border-[#dc2626]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">

          {/* Profile Card Preview */}
          <div className={`bg-[#121a21] border border-[#1e293b] rounded-2xl p-6 space-y-4 font-mono ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <span className="text-xs text-[#ef4444] font-bold">{t.regCodeLabel} {createdApp.id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dc2626]/15 text-[#ef4444] text-[10px] font-bold border border-[#dc2626]/30">
                {t.statusPending}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#94a3b8] block">{t.fullName}:</span>
                <span className="text-[#f8fafc] font-bold">{createdApp.fullName}</span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">{t.specialty}:</span>
                <span className="text-[#ef4444] font-bold">{createdApp.specialty}</span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">{t.workMode}:</span>
                <span className="text-[#f8fafc] font-bold">
                  {createdApp.workMode === 'remote' ? t.modeRemote : createdApp.workMode === 'onsite_filming_and_projects' ? t.modeOnsite : t.modeBoth}
                </span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">{t.experienceYears}:</span>
                <span className="text-[#f8fafc] font-bold">{createdApp.experienceYears}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/201274534493"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-black px-6 py-3.5 rounded-2xl text-xs shadow-lg shadow-[#dc2626]/20 transition-all"
            >
              {lang === 'ar' ? 'متابعة طلب الانضمام عبر واتساب فريق فيت بريليانس ←' : 'Follow up application via Fit Brilliance WhatsApp →'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] text-xs font-mono font-bold">
          <Briefcase className="w-4 h-4" />
          <span>{lang === 'ar' ? 'استمارة التوظيف وانضمام فريق العمل' : 'Work Team Application'}</span>
        </div>

        <h2 className="text-3xl font-black text-[#f5f7f8] tracking-tight">
          {t.teamAppTitle}
        </h2>

        <p className="text-sm text-[#94a3b8] leading-relaxed max-w-xl mx-auto">
          {t.teamAppSub}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#121a21]/90 border border-[#202d38] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Roles Quick Pills */}
        <div className="space-y-2">
          <span className="text-[11px] text-[#94a3b8] font-bold block">{t.rolesPillsTitle}</span>
          <div className="flex flex-wrap gap-2">
            {(isRtl
              ? [
                  "مدير إبداعي",
                  "مدير فني",
                  "كاتب محتوى وتسويق",
                  "مصمم هويات بصرية",
                  "مصمم جرافيك سوشيال ميديا",
                  "مصمم موشن جرافيكس",
                  "مصور ومونتير سينمائي",
                  "مسؤول ضبط جودة فنية",
                  "مسوق رقمي وميديا باير",
                ]
              : [
                  "Creative Director",
                  "Art Director",
                  "Copywriter (Marketing & Ads)",
                  "Brand Identity Designer",
                  "Social Media Graphic Designer",
                  "Motion Graphics Designer",
                  "Filmmaker & Video Editor",
                  "Finalizer / Quality Control",
                  "Digital Marketer & Media Buyer",
                ]
            ).map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => setSpecialty(role)}
                className={`text-[11px] font-mono px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                  specialty === role
                    ? "bg-[#38bdf8] text-[#090d0e] font-bold border-[#38bdf8]"
                    : "bg-[#090d0e] text-[#94a3b8] border-[#202d38] hover:border-[#38bdf8]/50"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#f5f7f8] block">{t.fullName} *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#38bdf8] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#f5f7f8] block">{t.email} *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#38bdf8] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#f5f7f8] block">{t.phone} *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#38bdf8] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#f5f7f8] block">{t.specialty} *</label>
            <input
              type="text"
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder={t.specialtyPlaceholder}
              className="w-full bg-[#090d0e] border border-[#202d38] focus:border-[#38bdf8] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Work Mode Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#f5f7f8] block">{t.workMode} *</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setWorkMode('remote')}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                workMode === 'remote'
                  ? 'bg-[#38bdf8]/15 border-[#38bdf8] text-[#38bdf8]'
                  : 'bg-[#090d0e] border-[#202d38] text-[#94a3b8] hover:border-[#38bdf8]/50'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>{t.modeRemote}</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkMode('onsite_filming_and_projects')}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                workMode === 'onsite_filming_and_projects'
                  ? 'bg-[#dc2626]/15 border-[#ef4444] text-[#ef4444]'
                  : 'bg-[#090d0e] border-[#1e293b] text-[#94a3b8] hover:border-[#dc2626]/50'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>{t.modeOnsite}</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkMode('both')}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                workMode === 'both'
                  ? 'bg-[#dc2626]/15 border-[#ef4444] text-[#ef4444]'
                  : 'bg-[#090d0e] border-[#1e293b] text-[#94a3b8] hover:border-[#dc2626]/50'
              }`}
            >
              <Video className="w-5 h-5" />
              <span>{t.modeBoth}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#f5f7f8] block">{t.experienceYears}</label>
            <select
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full bg-[#090d0e] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none transition-colors"
            >
              <option value={t.expOptionFresh}>{t.expOptionFresh}</option>
              <option value={t.expOption1to3}>{t.expOption1to3}</option>
              <option value={t.expOption3to5}>{t.expOption3to5}</option>
              <option value={t.expOption5Plus}>{t.expOption5Plus}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#f5f7f8] block">{t.portfolioUrl}</label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder={t.portfolioPlaceholder}
              className="w-full bg-[#090d0e] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#f5f7f8] block">{t.notes}</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            className="w-full bg-[#090d0e] border border-[#1e293b] focus:border-[#ef4444] rounded-xl px-4 py-3 text-xs text-[#f5f7f8] outline-none transition-colors resize-none"
          />
        </div>

        {/* Quota Lock Alert if device already applied within 48h */}
        {quotaLockedMsg && (
          <div className="bg-rose-500/10 border-2 border-rose-500/40 p-4 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <p className="leading-relaxed font-bold">{quotaLockedMsg}</p>
          </div>
        )}

        {/* MANDATORY WARNING & ETHICAL EXCLUSION CLAUSE (Shortened, Clean & Fully Localized) */}
        <div className="bg-gradient-to-br from-[#0b0e12] via-[#12171d] to-[#070a0d] border-2 border-[#dc2626]/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl shadow-[#dc2626]/5">
          <div className="flex items-center gap-2.5 text-[#ef4444] border-b border-[#dc2626]/30 pb-3">
            <ShieldAlert className="w-5 h-5 shrink-0 text-[#ef4444]" />
            <h4 className="text-xs sm:text-sm font-black tracking-wide">
              {t.exclusionWarningTitle}
            </h4>
          </div>

          <div className="space-y-2 text-xs text-[#cbd5e1] leading-relaxed">
            <p className="font-bold text-[#f5f7f8]">
              {t.exclusionHeadline}
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-[#94a3b8] pr-2">
              <li>{t.exclusionReason1}</li>
              <li>{t.exclusionReason2}</li>
            </ul>
            <p className="text-[11px] text-[#ef4444] font-mono pt-1">
              {t.exclusionCopyrightNotice}
            </p>
          </div>

          {/* Mandatory Undertaking Checkbox */}
          <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={agreedToEthicalClause}
              onChange={(e) => setAgreedToEthicalClause(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-[#dc2626] text-[#ef4444] focus:ring-[#ef4444] cursor-pointer accent-[#ef4444]"
            />
            <span className="text-xs font-bold text-[#f5f7f8] leading-snug">
              {t.exclusionWarningCheckbox}
            </span>
          </label>

          {/* Conditional Correction Box for Past Mistake (مرتكب خطأ لن يتكرر - تحت المراقبة) */}
          <div className="pt-3 border-t border-[#dc2626]/20 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasPastMistakeCorrection}
                onChange={(e) => setHasPastMistakeCorrection(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#38bdf8] text-[#38bdf8] focus:ring-[#38bdf8] cursor-pointer accent-[#38bdf8]"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#38bdf8] block">
                  {t.repentanceOptionTitle}
                </span>
                <span className="text-[11px] text-[#94a3b8] leading-relaxed block">
                  {t.repentanceOptionDesc}
                </span>
              </div>
            </label>

            {hasPastMistakeCorrection && (
              <div className="pt-2 pl-7 pr-7">
                <input
                  type="text"
                  value={mistakeExplanation}
                  onChange={(e) => setMistakeExplanation(e.target.value)}
                  placeholder={t.repentancePlaceholder}
                  className="w-full bg-[#070a0d] border border-[#38bdf8]/40 focus:border-[#38bdf8] rounded-xl px-3.5 py-2 text-xs text-[#f5f7f8] outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Metallic Royal Gold Submit Button */}
        <button
          type="submit"
          disabled={!agreedToEthicalClause || Boolean(quotaLockedMsg)}
          className={`w-full py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            !agreedToEthicalClause || Boolean(quotaLockedMsg)
              ? "bg-[#202d38] text-[#64748b] cursor-not-allowed border border-[#334155]"
              : "bg-gradient-to-r from-[#f3c063] via-[#d4af37] to-[#b3831b] hover:from-[#f8cf7d] hover:to-[#c69424] text-[#090d0e] shadow-xl shadow-[#d4af37]/25 hover:scale-[1.01] active:scale-[0.99] border border-[#f3c063]"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{t.submitTeamApp}</span>
        </button>
      </form>
    </div>
  );
};
