import React, { useState, useEffect } from 'react';
import { PhotographerProfile } from '../types';
import { submitPhotographerApplication, getPhotographers } from '../lib/api-pioneers';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface PhotographersRegistryProps {
  lang: 'ar' | 'en';
}

export const PhotographersRegistry: React.FC<PhotographersRegistryProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'apply' | 'list'>('apply');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: 'multi',
    city: '',
    equipment: [],
    portfolioUrl: '',
    yearsOfExperience: '0',
    hourlyRate: '',
  });
  const [photographers, setPhotographers] = useState<PhotographerProfile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (activeTab === 'list') {
      loadPhotographers();
    }
  }, [activeTab]);

  const loadPhotographers = async () => {
    setLoading(true);
    try {
      const data = await getPhotographers();
      setPhotographers(data);
    } catch (error) {
      console.error('Failed to load photographers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitPhotographerApplication({
        ...formData,
        equipment: formData.equipment,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        hourlyRate: parseInt(formData.hourlyRate) || 0,
      } as any);
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        specialization: 'multi',
        city: '',
        equipment: [],
        portfolioUrl: '',
        yearsOfExperience: '0',
        hourlyRate: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#202d38]">
        <button
          onClick={() => setActiveTab('apply')}
          className={`px-4 py-2 font-bold text-sm transition-all ${
            activeTab === 'apply'
              ? 'text-[#00e676] border-b-2 border-[#00e676]'
              : 'text-[#94a3b8] hover:text-[#f5f7f8]'
          }`}
        >
          {isRtl ? 'تقديم الطلب' : 'Apply'}
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-bold text-sm transition-all ${
            activeTab === 'list'
              ? 'text-[#00e676] border-b-2 border-[#00e676]'
              : 'text-[#94a3b8] hover:text-[#f5f7f8]'
          }`}
        >
          {isRtl ? 'قائمة المصورين' : 'Photographers List'}
        </button>
      </div>

      {/* Apply Tab */}
      {activeTab === 'apply' && (
        <div className="space-y-4">
          {success && (
            <div className="bg-[#00e676]/10 border border-[#00e676] rounded-2xl p-4 text-[#00e676] text-sm font-mono">
              ✅ {isRtl ? 'تم إرسال طلبك بنجاح! سيتم مراجعته خلال 48 ساعة.' : 'Application submitted successfully!'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 bg-[#121a21] border border-[#202d38] rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={isRtl ? 'الاسم الكامل' : 'Full Name'}
                className="bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
                required
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={isRtl ? 'رقم الهاتف' : 'Phone'}
                className="bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
                required
              />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={isRtl ? 'المدينة' : 'City'}
                className="bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
                required
              />
            </div>

            <select
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
            >
              <option value="multi">{isRtl ? 'تخصص متعدد' : 'Multi-Specialization'}</option>
              <option value="conference">{isRtl ? 'المؤتمرات' : 'Conference'}</option>
              <option value="studio">{isRtl ? 'الاستود��و' : 'Studio'}</option>
              <option value="reels">{isRtl ? 'الريلز' : 'Reels'}</option>
            </select>

            <input
              type="text"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              placeholder={isRtl ? 'رابط البورتفوليو (Behance/Instagram)' : 'Portfolio URL'}
              className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#00e676] hover:bg-[#00c865] text-[#090d0e] font-black py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {submitting ? isRtl ? 'جاري الإرسال...' : 'Submitting...' : isRtl ? 'إرسال الطلب' : 'Submit Application'}
            </button>
          </form>
        </div>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-[#94a3b8]">جاري التحميل...</div>
          ) : photographers.length === 0 ? (
            <div className="text-center text-[#94a3b8]">{isRtl ? 'لا توجد طلبات حتى الآن' : 'No photographers yet'}</div>
          ) : (
            photographers.map((photographer) => (
              <div key={photographer.id} className="bg-[#121a21] border border-[#202d38] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#f5f7f8]">{photographer.fullName}</h4>
                    <p className="text-xs text-[#94a3b8]">{photographer.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {photographer.status === 'approved' && (
                      <CheckCircle className="w-5 h-5 text-[#00e676]" />
                    )}
                    {photographer.status === 'pending' && (
                      <Clock className="w-5 h-5 text-[#e5a93c]" />
                    )}
                    {photographer.status === 'rejected' && (
                      <XCircle className="w-5 h-5 text-[#ff6b6b]" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#94a3b8]">{photographer.city} • {photographer.yearsOfExperience} سنوات خبرة</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
