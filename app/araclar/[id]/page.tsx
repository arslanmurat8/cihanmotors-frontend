'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiUsers, FiSettings, FiCheckCircle, FiAlertTriangle, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const fuelIcons: Record<string, string> = {
  'Benzin': '⛽', 'Dizel': '🛢️', 'Hibrit': '🔋', 'Elektrik': '⚡', 'LPG': '🔵'
};

export default function VehicleDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availability, setAvailability] = useState<boolean | null>(null);

  // Search params'dan tarihleri al
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  const startTimeParam = searchParams.get('startTime') || '10:00';
  const endTimeParam = searchParams.get('endTime') || '10:00';

  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;
  const totalDays = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) 
    : null;

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    tcNo: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`);
        setVehicle(res.data.vehicle);
      } catch {
        toast.error('Araç bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVehicle();
  }, [id]);

  useEffect(() => {
    const checkAvail = async () => {
      if (!id || !startDate || !endDate) return;
      try {
        const res = await api.post('/vehicles/check-availability', {
          vehicleId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        setAvailability(res.data.available);
      } catch {
        setAvailability(null);
      }
    };
    checkAvail();
  }, [id, startDateParam, endDateParam]);

  const totalPrice = totalDays && vehicle ? totalDays * vehicle.pricePerDay : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error('Tarih bilgisi eksik. Lütfen ana sayfadan araç arayın.');
      return;
    }
    if (!form.customerName || !form.phone || !form.tcNo) {
      toast.error('Ad, telefon ve TC No zorunludur');
      return;
    }
    if (form.tcNo.length !== 11) {
      toast.error('TC Kimlik No 11 haneli olmalıdır');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reservations/request', {
        vehicleId: id,
        ...form,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pickupTime: startTimeParam,
        dropoffTime: endTimeParam,
        totalPrice,
      });
      setSuccess(true);
      toast.success('Rezervasyon talebiniz alındı!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Rezervasyon oluşturulamadı');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = vehicle && startDate && endDate
    ? `Merhaba, *${vehicle.brand} ${vehicle.model}* aracını *${startDate.toLocaleDateString('tr-TR')} - ${endDate.toLocaleDateString('tr-TR')}* tarihleri için kiralamak istiyorum. Toplam tutar: *${totalPrice?.toLocaleString('tr-TR')} ₺*`
    : `Merhaba, araç kiralama hakkında bilgi almak istiyorum.`;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Araç bilgileri yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!vehicle) return null;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-slate-500">
              <a href="/" className="hover:text-blue-600">Ana Sayfa</a>
              <span className="mx-2">/</span>
              <span className="text-slate-800">{vehicle.brand} {vehicle.model}</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Sol: Araç bilgileri */}
            <div className="lg:col-span-3">
              {/* Araç görseli */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-6"
              >
                <div className="relative h-72 sm:h-96 bg-gradient-to-br from-slate-100 to-slate-200">
                  {vehicle.images?.[0] ? (
                    <Image
                      src={vehicle.images[0]}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-9xl opacity-20">🚗</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="font-display font-bold text-3xl text-slate-800">
                        {vehicle.brand} {vehicle.model}
                      </h1>
                      <p className="text-slate-500">{vehicle.year} Model · {vehicle.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-bold text-2xl">
                        {vehicle.pricePerDay.toLocaleString('tr-TR')} ₺
                      </div>
                      <div className="text-slate-400 text-sm">günlük</div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Yakıt', value: vehicle.fuel, icon: fuelIcons[vehicle.fuel] },
                      { label: 'Vites', value: vehicle.transmission, icon: '⚙️' },
                      { label: 'Koltuk', value: `${vehicle.seats} Kişilik`, icon: '💺' },
                      { label: 'Yıl', value: vehicle.year, icon: '📅' },
                    ].map((spec, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                        <div className="text-xl mb-1">{spec.icon}</div>
                        <div className="text-xs text-slate-500">{spec.label}</div>
                        <div className="text-sm font-semibold text-slate-800">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Açıklama */}
              {vehicle.description && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
                  <h2 className="font-display font-semibold text-lg text-slate-800 mb-3">Araç Hakkında</h2>
                  <p className="text-slate-600 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Özellikler */}
              {vehicle.features?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="font-display font-semibold text-lg text-slate-800 mb-3">Özellikler</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicle.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <FiCheckCircle className="text-green-500 flex-shrink-0" size={14} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sağ: Rezervasyon formu */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24"
              >
                {success ? (
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <FiCheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="font-display font-bold text-xl text-slate-800 mb-2">
                      Talebiniz Alındı!
                    </h3>
                    <p className="text-slate-500 text-sm mb-6">
                      Rezervasyon talebiniz iletildi. Onay için sizi arayacağız.
                    </p>
                    <a
                      href={`https://wa.me/905324772447?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold text-sm transition-colors w-full"
                    >
                      <FaWhatsapp size={20} />
                      WhatsApp ile Takip Et
                    </a>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Fiyat özeti */}
                    {totalPrice && (
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <div className="text-sm opacity-80 mb-1">
                          {startDate?.toLocaleDateString('tr-TR')} → {endDate?.toLocaleDateString('tr-TR')}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-blue-200 text-sm">{totalDays} gün × {vehicle.pricePerDay.toLocaleString('tr-TR')} ₺</span>
                            <div className="font-bold text-3xl mt-0.5">
                              {totalPrice.toLocaleString('tr-TR')} ₺
                            </div>
                          </div>
                          <div className="text-5xl opacity-20">💳</div>
                        </div>
                      </div>
                    )}

                    {/* Availability warning */}
                    {availability === false && (
                      <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                        <FiAlertTriangle className="text-red-500 flex-shrink-0" size={16} />
                        <span className="text-red-700 text-sm font-medium">
                          Seçilen tarihlerde araç uygun değil
                        </span>
                      </div>
                    )}

                    {!startDate && (
                      <div className="mx-6 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                        <FiAlertTriangle className="text-amber-500 flex-shrink-0" size={16} />
                        <span className="text-amber-700 text-sm">
                          Tarih seçmediniz. <a href="/" className="underline font-medium">Ana sayfaya dönün</a>
                        </span>
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                      <h3 className="font-display font-bold text-lg text-slate-800 mb-2">
                        Rezervasyon Talebi
                      </h3>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Ad Soyad *</label>
                        <input
                          type="text"
                          value={form.customerName}
                          onChange={e => setForm({...form, customerName: e.target.value})}
                          placeholder="Adınız ve soyadınız"
                          className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Telefon *</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm({...form, phone: e.target.value})}
                          placeholder="05XX XXX XX XX"
                          className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">TC Kimlik No *</label>
                        <input
                          type="text"
                          value={form.tcNo}
                          onChange={e => setForm({...form, tcNo: e.target.value.replace(/\D/g, '').slice(0, 11)})}
                          placeholder="11 haneli TC kimlik numaranız"
                          maxLength={11}
                          className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">E-posta</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                          placeholder="ornek@email.com"
                          className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Not</label>
                        <textarea
                          rows={3}
                          value={form.notes}
                          onChange={e => setForm({...form, notes: e.target.value})}
                          placeholder="Eklemek istediğiniz notlar..."
                          className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || availability === false}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-4 rounded-xl font-bold text-base transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                          'Rezervasyon Talebi Gönder'
                        )}
                      </button>

                      <div className="text-center text-xs text-slate-400 mt-2">
                        Talebiniz admin onayından geçtikten sonra kesinleşir
                      </div>

                      {/* WhatsApp button */}
                      <a
                        href={`https://wa.me/905324772447?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full border-2 border-green-500 text-green-600 hover:bg-green-50 py-3 rounded-xl font-semibold text-sm transition-colors"
                      >
                        <FaWhatsapp size={18} />
                        WhatsApp ile İletişim
                      </a>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
