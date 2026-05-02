'use client';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiStar } from 'react-icons/fi';

const features = [
  'Ücretsiz İptal (24 saat öncesine kadar)',
  '7/24 Müşteri Desteği',
  'Sigortalı Araçlar',
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-700 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full px-4 py-2 text-sm font-medium mb-6"
          >
            <FiStar size={14} className="text-yellow-400" />
            Kartal'ın En Güvenilir Araç Kiralama Firması
          </motion.div>

          {/* Başlık */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6"
          >
            Konforlu Sürüş,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Uygun Fiyat
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl"
          >
            İstanbul Kartal'da geniş araç filomuzla sizlere hizmet veriyoruz. 
            Ekonomikten lükse, SUV'dan ticari araçlara geniş seçenek yelpazesi.
          </motion.p>

          {/* Features */}
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                <FiCheckCircle className="text-green-400 flex-shrink-0" size={16} />
                {f}
              </li>
            ))}
          </motion.ul>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#arama"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1"
            >
              🔍 Araç Ara
            </a>
            <a
              href="tel:05324772447"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:-translate-y-1"
            >
              📞 Hemen Ara
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-8 mt-14 pt-10 border-t border-white/10"
          >
            {[
              { value: '500+', label: 'Mutlu Müşteri' },
              { value: '50+', label: 'Araç Çeşidi' },
              { value: '7/24', label: 'Destek' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-2xl sm:text-3xl text-white">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
