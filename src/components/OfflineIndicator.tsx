import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/90 border border-amber-400 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-2">
      <WifiOff className="w-4 h-4 text-white animate-pulse" />
      <span>وضع عدم الاتصال — يتم تصفح المحتوى المخزن مؤقتاً</span>
    </div>
  );
};
