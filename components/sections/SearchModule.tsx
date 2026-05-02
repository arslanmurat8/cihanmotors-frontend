'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiClock, FiSearch } from 'react-icons/fi';
import { registerLocale } from 'react-datepicker';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const timeOptions = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00'
];

interface SearchModuleProps {
  onResults: (vehicles: any[], searchData: { startDate: Date; endDate: Date; startTime: string; endTime: string }) => void;
  onLoading: (loading: boolean) => void;
}

export default function SearchModule({ onResults, onLoading }: SearchModuleProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error('Lütfen teslim alma ve iade tarihlerini seçin');
      return;
    }
    if (startDate >= endDate) {
      toast.error('İade tarihi, teslim alma tarihinden sonra olmalıdır');
      return;
    }

    setLoading(true);
    onLoading(true);

    try {
      const response = await api.get('/vehicles', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      onResults(response.data.vehicles, { startDate, endDate, startTime, endTime });
    } catch (error) {
      toast.error('Araç arama sırasında hata oluştu');
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  return (
    <section id="arama" className="relative z-20 -mt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
          className="bg-white rounded-3xl shadow-2xl shadow-blue-900/15 border border-slate-100 p-6 md:p-8"
        >
          {/* Başlık */}
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">
              Müsait Araç Ara
            </h2>
            <p className="text-slate-500 text-sm">
              Tarih ve saatleri seçin, size özel müsait araçları gösterelim
            </p>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Teslim Alma */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                <FiCalendar size={14} className="text-blue-500" />
                Teslim Alma Tarihi
              </label>
              <div className="flex gap-2">
                <div className="flex-1 border-2 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 rounded-xl px-4 py-3 flex items-center gap-2 transition-colors">
                  <FiCalendar className="text-blue-400 flex-shrink-0" size={16} />
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    placeholderText="Tarih seçin"
                    dateFormat="dd.MM.yyyy"
                    className="w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <div className="border-2 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 rounded-xl px-3 flex items-center gap-1.5 transition-colors min-w-[110px]">
                  <FiClock className="text-blue-400 flex-shrink-0" size={14} />
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="text-sm font-medium text-slate-700 outline-none bg-transparent cursor-pointer"
                  >
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* İade */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                <FiCalendar size={14} className="text-blue-500" />
                İade Tarihi
              </label>
              <div className="flex gap-2">
                <div className="flex-1 border-2 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 rounded-xl px-4 py-3 flex items-center gap-2 transition-colors">
                  <FiCalendar className="text-blue-400 flex-shrink-0" size={16} />
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    placeholderText="Tarih seçin"
                    dateFormat="dd.MM.yyyy"
                    className="w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <div className="border-2 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 rounded-xl px-3 flex items-center gap-1.5 transition-colors min-w-[110px]">
                  <FiClock className="text-blue-400 flex-shrink-0" size={14} />
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="text-sm font-medium text-slate-700 outline-none bg-transparent cursor-pointer"
                  >
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Days summary */}
          {startDate && endDate && startDate < endDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiCalendar className="text-white" size={14} />
              </div>
              <span className="text-blue-800 text-sm font-medium">
                {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} günlük kiralama 
                &nbsp;·&nbsp; {startDate.toLocaleDateString('tr-TR')} {startTime} → {endDate.toLocaleDateString('tr-TR')} {endTime}
              </span>
            </motion.div>
          )}

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Aranıyor...
              </>
            ) : (
              <>
                <FiSearch size={20} />
                Müsait Araçları Göster
              </>
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
