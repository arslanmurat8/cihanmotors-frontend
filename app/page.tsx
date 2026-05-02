'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import SearchModule from '@/components/sections/SearchModule';
import Features from '@/components/sections/Features';
import ContactSection from '@/components/sections/ContactSection';
import VehicleCard from '@/components/ui/VehicleCard';
import VehicleSkeleton from '@/components/ui/VehicleSkeleton';

export default function HomePage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [searchData, setSearchData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleResults = (results: any[], data: any) => {
    setVehicles(results);
    setSearchData(data);
    setHasSearched(true);
    
    // Sonuçlara scroll et
    setTimeout(() => {
      const el = document.getElementById('araclar');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SearchModule onResults={handleResults} onLoading={setLoading} />

        {/* Araç Sonuçları */}
        <section id="araclar" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <VehicleSkeleton key={i} />)}
              </div>
            )}

            {/* Sonuçlar */}
            <AnimatePresence>
              {!loading && hasSearched && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Section header */}
                  <div className="mb-8">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 mb-1">
                      {vehicles.length > 0 
                        ? `${vehicles.length} Müsait Araç Bulundu`
                        : 'Uygun Araç Bulunamadı'
                      }
                    </h2>
                    {searchData && (
                      <p className="text-slate-500 text-sm">
                        {searchData.startDate.toLocaleDateString('tr-TR')} – {searchData.endDate.toLocaleDateString('tr-TR')} tarihleri için
                      </p>
                    )}
                  </div>

                  {vehicles.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl">
                      <div className="text-6xl mb-4">😔</div>
                      <h3 className="font-display font-bold text-xl text-slate-700 mb-2">
                        Seçilen tarihlerde müsait araç bulunamadı
                      </h3>
                      <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        Farklı tarih aralıkları deneyin veya bizimle doğrudan iletişime geçin.
                      </p>
                      <a
                        href="tel:05324772447"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-colors"
                      >
                        📞 Bizi Arayın
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {vehicles.map((v, i) => (
                        <VehicleCard 
                          key={v._id} 
                          vehicle={v} 
                          searchData={searchData} 
                          index={i} 
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* İlk yüklemede açıklama */}
            {!loading && !hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-7xl mb-6 animate-float inline-block">🚗</div>
                <h2 className="font-display font-bold text-2xl text-slate-700 mb-3">
                  Araç filomuz sizi bekliyor
                </h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  Yukarıdan teslim alma ve iade tarihlerinizi seçin, 
                  size özel müsait araçlarımızı hemen gösterelim.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        <Features />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
