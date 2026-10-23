import React, { useState } from 'react';
import { BookingEngine } from './components/BookingEngine';
import { PhotographersRegistry } from './components/PhotographersRegistry';
import { Showcase4K } from './components/Showcase4K';
import { Film, Users, Image } from 'lucide-react';

interface PioneerMediaHubProps {
  lang: 'ar' | 'en';
  onBackToHub: () => void;
}

export const PioneerMediaHub: React.FC<PioneerMediaHubProps> = ({ lang, onBackToHub }) => {
  const isRtl = lang === 'ar';
  const [activeSection, setActiveSection] = useState<'booking' | 'photographers' | 'showcase'>('booking');

  const tabs = [
    { id: 'booking', label: isRtl ? 'حجز الجلسات' : 'Book Session', icon: Film },
    { id: 'photographers', label: isRtl ? 'فريق المصورين' : 'Photographers', icon: Users },
    { id: 'showcase', label: isRtl ? 'معرض الأعمال' : 'Showcase', icon: Image },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={onBackToHub}
          className="text-[#00e676] hover:text-[#00c865] font-bold text-sm flex items-center gap-2"
        >
          ← {isRtl ? 'العودة للبوابات' : 'Back to Gateways'}
        </button>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[#f5f7f8]">
            {isRtl ? '🎬 بوابة Pioneers — التصوير والإنتاج' : '🎬 Pioneers Media Hub'}
          </h1>
          <p className="text-[#94a3b8]">
            {isRtl
              ? 'حجز جلسات تصوير احترافية بدقة 4K، تسجيل المصورين الموهوبين، واستعراض أعمالنا'
              : 'Professional filming, photographer registration, and work showcase'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#202d38] overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                activeSection === tab.id
                  ? 'text-[#00e676] border-b-2 border-[#00e676]'
                  : 'text-[#94a3b8] hover:text-[#f5f7f8]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-[#090d0e] rounded-2xl p-6 md:p-8">
        {activeSection === 'booking' && <BookingEngine lang={lang} />}
        {activeSection === 'photographers' && <PhotographersRegistry lang={lang} />}
        {activeSection === 'showcase' && <Showcase4K lang={lang} />}
      </div>
    </div>
  );
};
