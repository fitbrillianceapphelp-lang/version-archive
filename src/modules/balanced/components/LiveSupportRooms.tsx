import React, { useState, useEffect } from 'react';
import { SupportCircle, SafeSpaceUser } from '../types';
import { getSupportCircles, joinSupportCircle, getJitsiIframeUrl } from '../lib/api-balanced';
import { Video, Users, Clock } from 'lucide-react';

interface LiveSupportRoomsProps {
  lang: 'ar' | 'en';
  currentUser: SafeSpaceUser;
}

const dayLabels: Record<string, string> = {
  sunday: 'الأحد / Sunday',
  monday: 'الإثنين / Monday',
  tuesday: 'الثلاثاء / Tuesday',
  wednesday: 'الأربعاء / Wednesday',
  thursday: 'الخميس / Thursday',
  friday: 'الجمعة / Friday',
  saturday: 'السبت / Saturday',
};

export const LiveSupportRooms: React.FC<LiveSupportRoomsProps> = ({ lang, currentUser }) => {
  const isRtl = lang === 'ar';
  const [circles, setCircles] = useState<SupportCircle[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    loadCircles();
  }, []);

  const loadCircles = async () => {
    setLoading(true);
    try {
      const data = await getSupportCircles();
      setCircles(data);
    } catch (error) {
      console.error('Failed to load circles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (circle: SupportCircle) => {
    try {
      const room = await joinSupportCircle(circle.id, currentUser);
      const url = getJitsiIframeUrl(room.roomHash, currentUser.displayName, currentUser.isAnonymous);
      setIframeUrl(url);
      setActiveRoom(circle.id);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  if (activeRoom && iframeUrl) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => {
            setActiveRoom(null);
            setIframeUrl(null);
          }}
          className="text-[#a855f7] hover:text-[#9333ea] font-bold text-sm"
        >
          ← {isRtl ? 'العودة للقوائم' : 'Back to Circles'}
        </button>
        <div className="w-full bg-[#090d0e] rounded-2xl overflow-hidden border border-[#202d38]">
          <iframe
            src={iframeUrl}
            style={{ width: '100%', height: '600px', border: 'none' }}
            allow="camera; microphone; display-capture"
          />
        </div>
        <div className="bg-[#121a21] border border-[#202d38] rounded-lg p-4 text-xs text-[#94a3b8]">
          {isRtl
            ? '🔒 هذه الغرفة مشفرة تماماً من نهاية إلى نهاية. لا ��تم حفظ أي تسجيلات. بيانات جلستك ستُحذف فور الإغلاق.'
            : '🔒 This room is fully encrypted end-to-end. No recordings. Your session data will be deleted upon exit.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-[#f5f7f8]">
        {isRtl ? '📅 غرف الدعم والاستشارة المباشرة' : '📅 Live Support Circles'}
      </h3>

      {loading ? (
        <div className="text-center text-[#94a3b8]">{isRtl ? 'جاري التحميل...' : 'Loading...'}</div>
      ) : circles.length === 0 ? (
        <div className="text-center text-[#94a3b8]">{isRtl ? 'لا توجد جلسات قريبة الآن' : 'No upcoming sessions'}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {circles.map((circle) => (
            <div
              key={circle.id}
              className="bg-[#121a21] border border-[#202d38] rounded-2xl p-4 space-y-3 hover:border-[#a855f7]/50 transition-all"
            >
              <h4 className="font-black text-[#f5f7f8]">{circle.title}</h4>
              <p className="text-xs text-[#94a3b8] line-clamp-2">{circle.description}</p>
              <div className="text-xs text-[#a855f7] font-mono">👤 {circle.facilitator}</div>
              <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                <Clock className="w-4 h-4" />
                <span>{dayLabels[circle.schedule.dayOfWeek]} @ {circle.schedule.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                <Users className="w-4 h-4" />
                <span>{circle.currentParticipants} / {circle.maxParticipants} {isRtl ? 'مشارك' : 'participants'}</span>
              </div>
              <button
                onClick={() => handleJoinRoom(circle)}
                className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-[#f5f7f8] font-black py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                {isRtl ? 'ادخل الغرفة' : 'Join Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
