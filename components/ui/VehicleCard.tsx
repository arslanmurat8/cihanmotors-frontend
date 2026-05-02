'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiUsers, FiZap, FiSettings, FiArrowRight } from 'react-icons/fi';

interface VehicleCardProps {
  vehicle: any;
  searchData?: {
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
  };
  index?: number;
}

const fuelIcons: Record<string, string> = {
  'Benzin': '⛽',
  'Dizel': '🛢️',
  'Hibrit': '🔋',
  'Elektrik': '⚡',
  'LPG': '🔵',
};

export default function VehicleCard({ vehicle, searchData, index = 0 }: VehicleCardProps) {
  const totalDays = searchData
    ? Math.ceil((searchData.endDate.getTime() - searchData.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const totalPrice = totalDays ? totalDays * vehicle.pricePerDay : null;

  const searchParams = searchData 
    ? `?startDate=${searchData.startDate.toISOString()}&endDate=${searchData.endDate.toISOString()}&startTime=${searchData.startTime}&endTime=${searchData.endTime}`
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className="vehicle-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {vehicle.images?.[0] ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-7xl opacity-30">🚗</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
          {vehicle.category}
        </div>
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
          {vehicle.pricePerDay.toLocaleString('tr-TR')} ₺/gün
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-xl text-slate-800 mb-1">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="text-slate-500 text-sm mb-4">{vehicle.year} Model</p>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-slate-600 text-sm">
            <span>{fuelIcons[vehicle.fuel] || '⛽'}</span>
            <span>{vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 text-sm">
            <FiSettings size={14} className="text-blue-400" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 text-sm">
            <FiUsers size={14} className="text-blue-400" />
            <span>{vehicle.seats} Kişi</span>
          </div>
        </div>

        {/* Total price if dates selected */}
        {totalPrice && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-blue-600 text-xs font-medium">{totalDays} günlük toplam</span>
              <div className="text-blue-800 font-bold text-xl">
                {totalPrice.toLocaleString('tr-TR')} ₺
              </div>
            </div>
            <span className="text-blue-300 text-2xl">💳</span>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/araclar/${vehicle._id}${searchParams}`}
          className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg group"
        >
          Rezervasyon Yap
          <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
