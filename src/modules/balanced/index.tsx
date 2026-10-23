import React, { useState } from 'react';
import { DualAuthForm } from './components/DualAuthForm';
import { LiveSupportRooms } from './components/LiveSupportRooms';
import { ResourceLibrary } from './components/ResourceLibrary';
import { SafeSpaceUser } from './types';
import { Users, BookOpen } from 'lucide-react';

interface BalancedSafeSpaceProps {
  lang: 'ar' | 'en';
  onBackToHub: () => void;
}

export const BalancedSafeSpace: React.FC<BalancedSafeSpaceProps> = ({ lang, onBackToHub }) => {
  const isRtl = lang === 'ar';
  const [currentUser, setCurrentUser] = useState<SafeSpaceUser | null>(null);
  const [activeSection, setActiveSection] = useState<'auth' | 'rooms' | 'library'>('auth');

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSection('auth');
  };

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBackToHub}
          className="text-[#a855f7] hover:text-[#9333ea] font-bold text-sm flex items-center gap-2"
        >
          ← {isRtl ? 'العودة للبوابات' : 'Back to Gateways'}
        </button>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[#f5f7f8]">
            {isRtl ? '🛡️ بوابة Balanced — المساحة الآمنة والدعم' : '🛡️ Balanced Safe Space'}
          </h1>
          <p className="text-[#94a3b8]">
            {isRtl
              ? 'مساحة آمنة وسرية لدعم الصحة النفسية، إدارة الضغوط، التوازن الأسري، والاستشارات الموجهة.'
              : 'A safe, confidential space for psychological support, stress management, and family balance counseling.'}
          </p>
        </div>
        <DualAuthForm lang={lang} onAuthSuccess={setCurrentUser} />
      </div>
    );
  }

  const tabs = [
    { id: 'rooms', label: isRtl ? 'غرف الدعم المباشرة' : 'Support Rooms', icon: Users },
    { id: 'library', label: isRtl ? 'مكتبة الموارد' : 'Resources', icon: BookOpen },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHub}
            className="text-[#a855f7] hover:text-[#9333ea] font-bold text-sm"
          >
            ← {isRtl ? 'العودة للبوابات' : 'Back to Gateways'}
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-[#f5f7f8]">{currentUser.displayName}</p>
              <p className="text-xs text-[#94a3b8]">{currentUser.isAnonymous ? (isRtl ? 'مجهول' : 'Anonymous') : isRtl ? 'مسجل' : 'Registered'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#ff6b6b] hover:text-[#ff5252] font-bold text-xs px-3 py-1 rounded bg-[#121a21] border border-[#202d38]"
            >
              {isRtl ? 'خروج' : 'Exit'}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[#f5f7f8]">
            {isRtl ? '🛡️ المساحة الآمنة Balanced' : '🛡️ Balanced Safe Space'}
          </h1>
          <p className="text-[#94a3b8]">
            {isRtl
              ? 'أهلاً بك في مساحتك الآمنة والسرية. كل محادثة مشفرة، وكل جلسة محمية.'
              : 'Welcome to your safe space. Every conversation is encrypted, every session protected.'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[#202d38] pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 font-bold text-sm flex items-center gap-2 transition-all ${
                activeSection === tab.id
                  ? 'text-[#a855f7] border-b-2 border-[#a855f7]'
                  : 'text-[#94a3b8] hover:text-[#f5f7f8]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-[#090d0e] rounded-2xl p-6 md:p-8">
        {activeSection === 'rooms' && <LiveSupportRooms lang={lang} currentUser={currentUser} />}
        {activeSection === 'library' && <ResourceLibrary lang={lang} />}
      </div>

      <div className="bg-[#a855f7]/5 border border-[#a855f7]/20 rounded-xl p-4">
        <p className="text-xs text-[#94a3b8] leading-relaxed">
          🔒 <strong className="text-[#a855f7]">{isRtl ? 'سياسة الخصوصية المطلقة:' : 'Zero-Logs Privacy Policy:'}</strong>
          {isRtl
            ? ' نحن لا نحفظ أسماءك الحقيقية أو بريدك أو بيانات محادثاتك. جميع البيانات تُحذف فوراً عند إغلاق الجلسة. الاتصالات مشفرة كلياً P2P.'
            : ' We do not store your real identity, conversations, or personal data. All session data is instantly deleted upon exit. All communications are fully encrypted P2P.'}
        </p>
      </div>
    </div>
  );
};
