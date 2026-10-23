import React, { useState, useEffect } from 'react';
import { MediaShowcase } from '../types';
import { getShowcase } from '../lib/api-pioneers';
import { Play } from 'lucide-react';

interface Showcase4KProps {
  lang: 'ar' | 'en';
}

const categories = [
  { id: 'conference', label: 'المؤتمرات', icon: '🎬' },
  { id: 'studio', label: 'الاستوديو', icon: '📹' },
  { id: 'reels', label: 'الريلز', icon: '📱' },
  { id: 'portrait', label: 'البورتريه', icon: '👤' },
];

export const Showcase4K: React.FC<Showcase4KProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState('conference');
  const [showcase, setShowcase] = useState<MediaShowcase[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    loadShowcase();
  }, []);

  const loadShowcase = async () => {
    setLoading(true);
    try {
      const data = await getShowcase();
      setShowcase(data);
    } catch (error) {
      console.error('Failed to load showcase:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = showcase.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#00e676] text-[#090d0e] font-black'
                : 'bg-[#121a21] border border-[#202d38] text-[#f5f7f8] hover:border-[#00e676]'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center text-[#94a3b8]">جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-[#94a3b8]">{isRtl ? 'لا توجد أعمال في هذه الفئة حتى الآن' : 'No items in this category yet'}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative rounded-lg overflow-hidden bg-[#121a21] border border-[#202d38] hover:border-[#00e676] transition-all">
              {/* Placeholder Image */}
              <div className="aspect-video bg-[#090d0e] flex items-center justify-center text-[#94a3b8]">
                {item.videoUrl ? (
                  <Play className="w-12 h-12 opacity-50" />
                ) : (
                  <div className="text-center space-y-2">
                    <div className="text-3xl">📹</div>
                    <p className="text-xs">{item.resolution}</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <h4 className="font-bold text-[#f5f7f8] text-sm line-clamp-1">{item.title}</h4>
                <p className="text-xs text-[#94a3b8] line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[#202d38]">
                  <span className="text-xs font-mono text-[#00e676]">{item.resolution}</span>
                  {item.duration && <span className="text-xs text-[#94a3b8]">{Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
