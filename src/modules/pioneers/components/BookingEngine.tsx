import React, { useState } from 'react';
import { Calendar, MapPin, Phone, Mail, MessageSquare, Zap } from 'lucide-react';
import { BookingSession } from '../types';
import { createBooking } from '../lib/api-pioneers';

interface BookingEngineProps {
  lang: 'ar' | 'en';
}

const packages = [
  { id: 'conference', name: 'باقة المؤتمرات والفعاليات', icon: '🎬', color: '#00e676' },
  { id: 'studio', name: 'باقة الكورسات والاستوديو', icon: '📹', color: '#00b0ff' },
  { id: 'reels', name: 'باقة الريلز والإعلانات (9:16)', icon: '📱', color: '#00e676' },
  { id: 'portrait', name: 'باقة البورتريه وهوية القادة', icon: '👤', color: '#00b0ff' },
];

export const BookingEngine: React.FC<BookingEngineProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [selectedPackage, setSelectedPackage] = useState<string>('conference');
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    shootingDate: '',
    shootingLocation: '',
    duration: '4',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const booking = await createBooking({
        ...formData,
        packageType: selectedPackage as any,
        packageName: packages.find((p) => p.id === selectedPackage)?.name || '',
        duration: parseInt(formData.duration),
      });
      setSuccess(true);
      setBookingCode(booking.bookingCode);
      setFormData({ clientName: '', clientPhone: '', clientEmail: '', shootingDate: '', shootingLocation: '', duration: '4', notes: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="bg-[#00e676]/10 border border-[#00e676] rounded-2xl p-4 text-[#00e676] text-sm font-mono">
          ✅ تم استلام حجزك برمز: <span className="font-black">{bookingCode}</span> — سيتم التواصل معك عبر الواتساب خلال ساعة.
        </div>
      )}

      {/* Package Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#f5f7f8]">{isRtl ? 'اختر باقة التصوير' : 'Select Shooting Package'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedPackage === pkg.id
                  ? `border-[${pkg.color}] bg-[${pkg.color}]/10`
                  : 'border-[#202d38] hover:border-[#00e676]'
              }`}
            >
              <div className="text-3xl mb-2">{pkg.icon}</div>
              <div className="text-sm font-bold text-[#f5f7f8]">{pkg.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#121a21] border border-[#202d38] rounded-2xl p-6">
        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94a3b8]">{isRtl ? 'اسم العميل' : 'Client Name'}</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
              placeholder="محمد أحمد"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94a3b8]">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</label>
            <input
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
              placeholder="+966501234567"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#94a3b8]">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
          <input
            type="email"
            value={formData.clientEmail}
            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
            className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
            required
          />
        </div>

        {/* Date & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94a3b8]">{isRtl ? 'تاريخ التصوير' : 'Shooting Date'}</label>
            <input
              type="date"
              value={formData.shootingDate}
              onChange={(e) => setFormData({ ...formData, shootingDate: e.target.value })}
              className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94a3b8]">{isRtl ? 'المدة (ساعات)' : 'Duration (Hours)'}</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
            >
              <option value="2">2 ساعات</option>
              <option value="4">4 ساعات</option>
              <option value="8">8 ساعات (يوم كامل)</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#94a3b8]">{isRtl ? 'موقع التصوير' : 'Shooting Location'}</label>
          <input
            type="text"
            value={formData.shootingLocation}
            onChange={(e) => setFormData({ ...formData, shootingLocation: e.target.value })}
            className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm"
            placeholder="الإسكندرية، مصر"
            required
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#94a3b8]">{isRtl ? 'ملاحظات إضافية' : 'Additional Notes'}</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-[#090d0e] border border-[#202d38] rounded-lg px-3 py-2 text-[#f5f7f8] text-sm h-20 resize-none"
            placeholder="أي متطلبات خاصة..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#00e676] hover:bg-[#00c865] text-[#090d0e] font-black py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {submitting ? 'جاري الحجز...' : isRtl ? 'تأكيد الحجز' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};
