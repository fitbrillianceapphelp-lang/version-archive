import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Target,
  DollarSign,
  Layers,
  Sparkles,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  MessageSquare,
  Lock,
  Activity,
  Award,
  Zap,
} from "lucide-react";
import {
  ALL_75_QUESTIONS,
  DIAGNOSTIC_TABS_75,
  evaluateDiagnosticResponses,
  DiagnosticEvaluationResult,
} from "../lib/diagnosticGateway75";

interface DiagnosticGateway75ViewProps {
  onBackToHub?: () => void;
  onOpenContract?: (name: string, budget: string) => void;
}

export const DiagnosticGateway75View: React.FC<DiagnosticGateway75ViewProps> = ({
  onBackToHub,
  onOpenContract,
}) => {
  const [currentTabId, setCurrentTabId] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState(1);

  // Filter questions for the active tab (15 questions per tab)
  const currentTabQuestions = useMemo(() => {
    return ALL_75_QUESTIONS.filter((q) => q.tabId === currentTabId);
  }, [currentTabId]);

  // Handle option select
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));

    // Auto-advance to next question if inside same tab
    const nextInTab = currentTabQuestions.find((q) => q.id === questionId + 1);
    if (nextInTab) {
      setActiveQuestionId(nextInTab.id);
    }
  };

  // Evaluate current responses live
  const evaluation: DiagnosticEvaluationResult = useMemo(() => {
    return evaluateDiagnosticResponses(answers);
  }, [answers]);

  // Total answers progress
  const totalAnsweredCount = Object.keys(answers).length;
  const progressPercent = Math.round((totalAnsweredCount / 75) * 100);

  // Tab completion check
  const isCurrentTabComplete = currentTabQuestions.every((q) => answers[q.id] !== undefined);

  const activeQuestion =
    ALL_75_QUESTIONS.find((q) => q.id === activeQuestionId) || currentTabQuestions[0];

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-6 text-right font-sans animate-in fade-in duration-300">
      {/* Top Sovereign Diagnostic Header */}
      <div className="bg-[#0b1018] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#dc2626]/20 to-black border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black text-white">
                  بوابة التشخيص الاستراتيجي السيادية (75 سؤالاً × 5 محاور)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#dc2626]/10 text-red-400 border border-red-500/25">
                  Counter-Intel Protected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                نظام فحص تشريحي متكامل يكشف نوايا الشريك، يفرز الحسابات الحقيقية من المنافسين، ويحدد مسار التحول.
              </p>
            </div>
          </div>

          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              العودة للرئيسية
            </button>
          )}
        </div>

        {/* Live Authenticity & Progress Radar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {/* Progress Bar */}
          <div className="bg-[#05080c] p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
              <span className="text-slate-400">إجمالي الأسئلة المكتملة:</span>
              <span className="text-white font-mono">{totalAnsweredCount} / 75 ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Authenticity Index (Real vs Fake Meter) */}
          <div className="bg-[#05080c] p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>مؤشر الجدية والأصالة:</span>
              </span>
              <span className="text-emerald-400 font-mono font-bold">
                {totalAnsweredCount >= 5 ? `${evaluation.authenticityPercent}% حقيقي` : "قيد المعايرة..."}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${totalAnsweredCount >= 5 ? evaluation.authenticityPercent : 0}%` }}
              />
            </div>
          </div>

          {/* Persona Classification Tag */}
          <div className="bg-[#05080c] p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">حالة التقييم الاستخباراتي:</span>
              <span className="text-xs font-bold text-white">
                {evaluation.isDeceptivePathActivated ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    مسار استطلاعي مخصص
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    شريك موثوق معتمد
                  </span>
                )}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Auto-Detect</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation (5 Tabs × 15 Questions) */}
      {!isCompleted && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {DIAGNOSTIC_TABS_75.map((tab) => {
            const isCurrent = currentTabId === tab.id;
            const tabQs = ALL_75_QUESTIONS.filter((q) => q.tabId === tab.id);
            const answeredInTab = tabQs.filter((q) => answers[q.id] !== undefined).length;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTabId(tab.id);
                  setActiveQuestionId(tabQs[0].id);
                }}
                className={`p-3 rounded-2xl border transition-all text-right cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? "bg-[#dc2626] border-[#ef4444] text-white shadow-lg shadow-red-600/30 font-black"
                    : "bg-[#0b1018] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <div className="text-[10px] font-mono opacity-80 mb-1">{tab.range}</div>
                <div className="text-xs font-bold truncate">{tab.titleAr.split(":")[1] || tab.titleAr}</div>
                <div className="mt-2 text-[10px] font-mono flex items-center justify-between">
                  <span>المكتمل:</span>
                  <span className={isCurrent ? "text-white" : "text-emerald-400"}>
                    {answeredInTab} / 15
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Question Engine or Final Results */}
      {!isCompleted ? (
        <div className="bg-[#0b1018] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Active Question Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="px-3 py-1 rounded-full bg-slate-800/80 text-white text-xs font-mono font-bold">
              السؤال رقم {activeQuestion.id} من 75
            </span>
            <span className="text-xs text-[#ef4444] font-bold font-mono">
              محور: {activeQuestion.categoryAr}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
              {activeQuestion.questionAr}
            </h3>
            <p className="text-xs text-slate-400">
              اختر الإجابة الأدق التي تصف الواقع الفعلي لمنشأتك دون مجاملة لضمان دقة التشخيص.
            </p>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {activeQuestion.options.map((opt, idx) => {
              const isSelected = answers[activeQuestion.id] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(activeQuestion.id, idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-red-950/40 border-[#ef4444] text-white shadow-md shadow-red-900/30"
                      : "bg-[#06090e] border-slate-800/80 hover:border-slate-700 text-slate-300 hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-[#ef4444] bg-[#ef4444] text-white"
                          : "border-slate-700 bg-slate-800"
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {opt.labelAr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={() => {
                if (activeQuestion.id > 1) {
                  const prevId = activeQuestion.id - 1;
                  setActiveQuestionId(prevId);
                  const prevQ = ALL_75_QUESTIONS.find((q) => q.id === prevId);
                  if (prevQ && prevQ.tabId !== currentTabId) {
                    setCurrentTabId(prevQ.tabId);
                  }
                }
              }}
              disabled={activeQuestion.id === 1}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السؤال السابق</span>
            </button>

            {/* Quick jump dots within current tab */}
            <div className="hidden sm:flex items-center gap-1.5">
              {currentTabQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeQuestion.id === q.id
                      ? "bg-[#dc2626] text-white"
                      : answers[q.id] !== undefined
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {q.id}
                </button>
              ))}
            </div>

            {activeQuestion.id < 75 ? (
              <button
                onClick={() => {
                  const nextId = activeQuestion.id + 1;
                  setActiveQuestionId(nextId);
                  const nextQ = ALL_75_QUESTIONS.find((q) => q.id === nextId);
                  if (nextQ && nextQ.tabId !== currentTabId) {
                    setCurrentTabId(nextQ.tabId);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                <span>السؤال التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsCompleted(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <span>استخراج التقرير التشريحي الشامل</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* DUAL-REALITY FINAL DIAGNOSTIC REPORT */
        <div className="bg-[#0b1018] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
          {/* Report Top Verdict Banner */}
          <div
            className={`p-6 rounded-2xl border ${
              evaluation.reportPayload.isDecoy
                ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                : "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold mb-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>مخرجات التدقيق التشريحي النهائي لـ 75 سؤالاً</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
              {evaluation.reportPayload.title}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              {evaluation.reportPayload.verdict}
            </p>
          </div>

          {/* Key Metrics Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#05080c] p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">مسار مضاعف الـ ROAS:</span>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {evaluation.reportPayload.roasTrajectory}
              </div>
            </div>

            <div className="bg-[#05080c] p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">الهدر المالي المسترد:</span>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {evaluation.reportPayload.estimatedWasteReclaimed}
              </div>
            </div>

            <div className="bg-[#05080c] p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">الخطة الميدانية المعتمدة:</span>
              <div className="text-sm font-bold text-white">
                {evaluation.reportPayload.recommendedPlan}
              </div>
            </div>
          </div>

          {/* 4 Strategic Pillars */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ef4444]" />
              <span>ركائز خطة التنفيذ الموصى بها:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evaluation.reportPayload.tacticalPillars.map((p, i) => (
                <div key={i} className="bg-[#06090e] p-4 rounded-2xl border border-slate-800/80 space-y-1">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>{p.title}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Confidentiality Notice */}
          <div className="bg-[#06090e] p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
            <Lock className="w-5 h-5 text-slate-500 shrink-0" />
            <span>{evaluation.reportPayload.executiveNotice}</span>
          </div>

          {/* Actions: Direct WhatsApp & Contract Integration */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setIsCompleted(false);
                setAnswers({});
                setActiveQuestionId(1);
                setCurrentTabId(1);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة التشخيص من البداية</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={`https://wa.me/201098765432?text=${encodeURIComponent(
                  `مرحباً كوتش مصطفى سراج، أتممت التشخيص الاستراتيجي الشامل بنسبة أصالة (${evaluation.authenticityPercent}%)، وأود مراجعة مخرجات الخطة التنفيذية معك.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>محادثة كوتش سراج المباشرة على واتساب</span>
              </a>

              {onOpenContract && (
                <button
                  onClick={() => onOpenContract("المنشأة المعتمدة", "$35,000")}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>توليد مسودة العقد</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticGateway75View;
