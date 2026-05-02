'use client';
import { motion } from 'framer-motion';
import { FiShield, FiClock, FiPhone, FiMapPin, FiStar, FiCheckCircle } from 'react-icons/fi';

const features = [
  {
    icon: FiClock,
    title: '7/24 Hizmet',
    description: 'Günün her saati, haftanın her günü sizin yanınızdayız. WhatsApp ile anında ulaşın.',
    color: 'blue',
  },
  {
    icon: FiShield,
    title: 'Tam Sigorta Güvencesi',
    description: 'Tüm araçlarımız kasko ve trafik sigortasıyla kapsamlı güvence altındadır.',
    color: 'green',
  },
  {
    icon: FiCheckCircle,
    title: 'Kolay Rezervasyon',
    description: 'Online form doldurun, biz onaylayalım. Saniyeler içinde rezervasyon tamamlayın.',
    color: 'purple',
  },
  {
    icon: FiMapPin,
    title: 'Kartal\'da Merkezi Konum',
    description: 'Kartal Metro istasyonuna 5 dakika mesafede. Ulaşım son derece kolay.',
    color: 'orange',
  },
  {
    icon: FiStar,
    title: 'Bakımlı Araç Filosu',
    description: 'Düzenli bakımdan geçirilmiş temiz ve konforlu araçlar ile güvenli yolculuk.',
    color: 'yellow',
  },
  {
    icon: FiPhone,
    title: 'Kişisel Destek',
    description: 'Size özel çözümler sunuyoruz. Her müşterimize bireysel ilgi ve önem veriyoruz.',
    color: 'cyan',
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
};

export default function Features() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">
            Neden Cihan Motors?
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 mt-2 mb-4">
            Fark Yaratan Hizmet Anlayışımız
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Müşteri memnuniyetini her şeyin üzerinde tutan anlayışımızla, 
            araç kiralama deneyiminizi en üst seviyeye taşıyoruz.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${colorMap[feature.color]}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
