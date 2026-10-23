import React, { useState, useEffect } from 'react';
import { ResourceGuide } from '../types';
import { getResourceGuides } from '../lib/api-balanced';
import { Clock, Bookmark } from 'lucide-react';

interface ResourceLibraryProps {
  lang: 'ar' | 'en';
}

const categoryLabels: Record<string, string> = {
  'stress-management': 'إدارة الضغوط / Stress Management',
  'thesis-anxiety': 'قلق الأطروحة / Thesis Anxiety',
  'family-balance': 'التوازن الأسري / Family Balance',
  mindfulness: 'اليقظة الذهنية / Mindfulness',
  breathing: 'تمارين التنفس / Breathing Exercises',
};

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [resources, setResources] = useState<ResourceGuide[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceGuide | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getResourceGuides();
      setResources(data);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'stress-management', 'thesis-anxiety', 'family-balance', 'mindfulness', 'breathing'];
  const filtered = selectedCategory === 'all' ? resources : resources.filter((r) => r.category === selectedCategory);

  if (selectedResource) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedResource(null)}
          className="text-[#a855f7] hover:text-[#9333ea] font-bold text-sm"
        >
          ← {isRtl ? 'العودة للمكتبة' : 'Back to Library'}
        </button>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-[#f5f7f8]">{selectedResource.title}</h2>
          <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{selectedResource.readingTimeMinutes} {isRtl ? 'دقيقة' : 'min'}</span>
            <span className="text-[#a855f7] font-mono">by {selectedResource.author}</span>
          </div>
        </div>
        <div className="bg-[#121a21] border border-[#202d38] rounded-2xl p-6">
          <div className="text-[#f5f7f8] text-sm leading-relaxed whitespace-pre-wrap">{selectedResource.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-[#f5f7f8]">
        {isRtl ? '📚 مكتبة الموارد والأدلة الإرشادية' : '📚 Resource Library'}
      </h3>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#a855f7] text-[#f5f7f8] font-black'
                : 'bg-[#121a21] border border-[#202d38] text-[#94a3b8] hover:border-[#a855f7]'
            }`}
          >
            {cat === 'all' ? (isRtl ? 'جميع المقالات' : 'All') : categoryLabels[cat]?.split(' / ')[isRtl ? 0 : 1]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-[#94a3b8]">{isRtl ? 'جاري التحميل...' : 'Loading...'}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-[#94a3b8]">{isRtl ? 'لا توجد موارد في هذه الفئة' : 'No resources in this category'}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setSelectedResource(guide)}
              className="bg-[#121a21] border border-[#202d38] rounded-xl p-4 space-y-3 hover:border-[#a855f7]/50 hover:cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between">
                <h4 className="font-black text-[#f5f7f8] group-hover:text-[#a855f7] transition-all">{guide.title}</h4>
                {guide.featured && <Bookmark className="w-4 h-4 text-[#a855f7]" />}
              </div>
              <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{guide.readingTimeMinutes} min</span>
                <span className="text-[#a855f7]">{guide.author}</span>
              </div>
              <button className="w-full text-[#a855f7] hover:text-[#9333ea] font-bold text-xs">
                {isRtl ? 'اقرأ المزيد →' : 'Read More →'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
