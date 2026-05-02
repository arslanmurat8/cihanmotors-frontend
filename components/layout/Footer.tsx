'use client';
import Link from 'next/link';
import { FiMapPin, FiPhone, FiMail, FiClock, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo & Açıklama */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">C</span>
              </div>
              <div>
                <div className="font-display font-bold text-lg leading-none text-white">Cihan Motors</div>
                <div className="text-xs text-blue-400 font-medium tracking-widest uppercase">Oto Kiralama</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Kartal, İstanbul'un güvenilir araç kiralama firması. Geniş filomuz ve uygun fiyatlarımızla hizmetinizdeyiz.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-colors">
                <FiInstagram size={17} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <FiFacebook size={17} />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Hızlı Linkler
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Ana Sayfa' },
                { href: '/#araclar', label: 'Araçlarımız' },
                { href: '/#iletisim', label: 'İletişim' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-slate-400 hover:text-blue-400 text-sm flex items-center gap-2 transition-colors group">
                    <span className="w-1 h-1 rounded-full bg-blue-600 group-hover:bg-blue-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              İletişim
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-slate-400 text-sm">
                  Orta, Marifet Sk. NO: 4 B<br />34880 Kartal/İstanbul
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-400 flex-shrink-0" size={16} />
                <a href="tel:05324772447" className="text-slate-400 hover:text-white text-sm transition-colors">
                  0532 477 24 47
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-400 flex-shrink-0" size={16} />
                <a href="mailto:info@cihanmotorsotokiralama.com" className="text-slate-400 hover:text-white text-sm transition-colors break-all">
                  info@cihanmotorsotokiralama.com
                </a>
              </li>
            </ul>
          </div>

          {/* Çalışma Saatleri */}
          <div>
            <h3 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Çalışma Saatleri
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <FiClock className="text-blue-400 flex-shrink-0" size={16} />
                <div>
                  <div className="text-white text-sm font-medium">Hafta İçi</div>
                  <div className="text-slate-400 text-sm">08:00 – 20:00</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FiClock className="text-blue-400 flex-shrink-0" size={16} />
                <div>
                  <div className="text-white text-sm font-medium">Hafta Sonu</div>
                  <div className="text-slate-400 text-sm">09:00 – 18:00</div>
                </div>
              </li>
            </ul>

            <a
              href={`https://wa.me/905324772447`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full justify-center"
            >
              <FaWhatsapp size={18} />
              WhatsApp ile 7/24 ulaşabilirsiniz
            </a>
          </div>
        </div>

        {/* Harita */}
        <div className="mt-12 rounded-2xl overflow-hidden h-52 border border-slate-800">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3014.3!2d29.1894!3d40.9089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDU0JzMyLjAiTiAyOcKwMTEnMjEuOCJF!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Cihan Motors Konum"
          />
        </div>

        {/* Alt çizgi */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Cihan Motors Oto Kiralama. Tüm hakları saklıdır.
          </p>
          <p className="text-slate-600 text-xs">
            cihanmotorsotokiralama.com
          </p>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/905324772447?text=Merhaba,%20araç%20kiralama%20hakkında%20bilgi%20almak%20istiyorum.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-2xl whatsapp-pulse transition-transform hover:scale-110"
        aria-label="WhatsApp ile iletişim"
      >
        <FaWhatsapp className="text-white" size={28} />
      </a>
    </footer>
  );
}
