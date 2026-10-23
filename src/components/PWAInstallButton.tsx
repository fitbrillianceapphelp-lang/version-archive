import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 px-3 py-1 text-xs font-bold text-red-300 hover:text-white shadow-sm transition-all cursor-pointer"
        title="تثبيت التطبيق على جهازك (PWA)"
      >
        <Download className="w-3.5 h-3.5 text-red-400" />
        <span className="hidden sm:inline">تثبيت التطبيق</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 px-3 py-1 text-xs font-bold text-red-300 hover:text-white shadow-sm transition-all cursor-pointer"
          title="تثبيت التطبيق على آيفون / آيباد"
        >
          <Smartphone className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">تثبيت على آيفون</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100003] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-[#0b1018] border border-slate-700 p-6 shadow-2xl text-right font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-sm font-black text-white">تثبيت المنظومة على iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                1. اضغط على زر <strong>مشاركة (Share)</strong> في شريط سفاري.<br />
                2. مرر للأسفل واختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
              </p>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-500 cursor-pointer"
              >
                فهمت، حسناً
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
