'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiPhone, FiMapPin, FiMail } from 'react-icons/fi';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Ad, telefon ve mesaj alanları zorunludur');
      return;
    }
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Mesajınız alındı! En kısa sürede dönüş yapacağız.');
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Mesaj gönderilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="iletisim" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">
            Bize Ulaşın
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 mt-2 mb-4">
            İletişime Geçin
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Sorularınız, özel teklifleriniz veya rezervasyon için bizimle iletişime geçin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="font-display font-semibold text-lg text-slate-800 mb-5">
                İletişim Bilgileri
              </h3>
              <div className="space-y-5">
                {[
                  { icon: FiPhone, label: 'Telefon', value: '0532 477 24 47', href: 'tel:05324772447' },
                  { icon: FiMail, label: 'E-posta', value: 'info@cihanmotorsotokiralama.com', href: 'mailto:info@cihanmotorsotokiralama.com' },
                  { icon: FiMapPin, label: 'Adres', value: 'Orta, Marifet Sk. NO: 4 B\n34880 Kartal/İstanbul', href: null },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-medium mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-slate-800 font-medium text-sm hover:text-blue-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-slate-800 font-medium text-sm whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Working hours */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-3">Çalışma Saatleri</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Hafta İçi (Pzt-Cum)</span>
                  <span className="font-semibold text-blue-900">08:00 – 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Hafta Sonu</span>
                  <span className="font-semibold text-blue-900">09:00 – 18:00</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Ad Soyad *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Adınız ve soyadınız"
                    className="w-full border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Telefon *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="05XX XXX XX XX"
                    className="w-full border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">E-posta</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="ornek@email.com"
                    className="w-full border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Konu</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    placeholder="Mesajınızın konusu"
                    className="w-full border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Mesajınız *</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Mesajınızı buraya yazın..."
                  className="w-full border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/30"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSend size={18} />
                    Mesaj Gönder
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
