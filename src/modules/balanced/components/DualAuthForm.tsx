import React, { useState } from 'react';
import { createAnonymousSession, registerUser } from '../lib/api-balanced';
import { SafeSpaceUser } from '../types';
import { Shield, Lock, User, Mail } from 'lucide-react';

interface DualAuthFormProps {
  lang: 'ar' | 'en';
  onAuthSuccess: (user: SafeSpaceUser) => void;
}

export const DualAuthForm: React.FC<DualAuthFormProps> = ({ lang, onAuthSuccess }) => {
  const isRtl = lang === 'ar';
  const [authMode, setAuthMode] = useState<'anonymous' | 'registered'>('anonymous');
  const [formData, setFormData] = useState({ email: '', displayName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnonymous = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await createAnonymousSession();
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Failed to create anonymous session');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName || !formData.email) {
      setError(isRtl ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const user = await registerUser(formData.email, formData.displayName, formData.password);
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {error && (
        <div className="bg-[#ff6b6b]/10 border border-[#ff6b6b] rounded-lg p-3 text-[#ff6b6b] text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setAuthMode('anonymous')}
          className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
            authMode === 'anonymous'
              ? 'bg-[#a855f7] text-[#f5f7f8]'
              : 'bg-[#121a21] border border-[#202d38] text-[#94a3b8] hover:border-[#a855f7]'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          {isRtl ? 'دخول مجهول' : 'Anonymous'}
        </button>
        <button
          onClick={() => setAuthMode('registered')}
          className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
            authMode === 'registered'
              ? 'bg-[#06b6d4] text-[#f5f7f8]'
              : 'bg-[#121a21] border border-[#202d38] text-[#94a3b8] hover:border-[#06b6d4]'
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          {isRtl ? 'حساب مسجل' : 'Register'}
        </button>
      </div>

      {authMode === 'anonymous' && (
        <div className="space-y-4 bg-[#121a21] border-2 border-[#a855f7]/30 rounded-2xl p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-black text-[#f5f7f8]">
              {isRtl ? '🔒 مساحة آمنة وسرية تماماً' : '🔒 Completely Private Space'}
            </h3>
            <p className="text-xs text-[#94a3b8]">
              {isRtl
                ? 'لا نطلب اسمك الحقيقي أو بريدك. تُمحى جميع البيانات عند إغلاق الجلسة.'
                : 'No personal data collected. Session data is instantly deleted when you close the browser.'}
            </p>
          </div>
          <ul className="space-y-2 text-xs text-[#94a3b8]">
            <li>✅ {isRtl ? 'دخول فوري بدون بيانات' : 'Instant access — no data required'}</li>
            <li>✅ {isRtl ? 'هوية افتراضية عشوائية' : 'Random anonymous identity'}</li>
            <li>✅ {isRtl ? 'صفر سجلات تاريخية' : 'Zero session logging'}</li>
            <li>✅ {isRtl ? 'تشفير P2P كامل' : 'Full P2P encryption'}</li>
          </ul>
          <button
            onClick={handleAnonymous}
            disabled={loading}
            className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-[#f5f7f8] font-black py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? (isRtl ? 'جاري الدخول...' : 'Entering...') : isRtl ? 'ادخل الآن كزائر مجهول' : 'Enter as Anonymous Guest'}
          </button>
        </div>
      )}

      {authMode === 'registered' && (
        <form onSubmit={handleRegister} className="space-y-4 bg-[#121a21] border-2 border-[#06b6d4]/30 rounded-2xl p-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94a3b8]">{isRtl ? 'الاسم المعروض' : 'Display Name'}</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm focus:border-[#06b6d4] outline-none"
              placeholder={isRtl ? 'أحمد محمد' : 'John Doe'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94a3b8]">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
            <div className="flex items-center bg-[#090d0e] border border-[#202d38] rounded-lg px-3">
              <Mail className="w-4 h-4 text-[#06b6d4]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="flex-1 bg-transparent px-2 py-2 text-[#f5f7f8] text-sm outline-none"
                placeholder="you@fitbrilliance.store"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#06b6d4] hover:bg-[#0891b2] text-[#f5f7f8] font-black py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? (isRtl ? 'جاري التسجيل...' : 'Registering...') : isRtl ? 'إنشاء حساب' : 'Create Account'}
          </button>
        </form>
      )}
    </div>
  );
};
