'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminNav from '@/components/admin/AdminNav';
import api from '@/lib/api';
import { FiTruck, FiCalendar, FiClock, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentReservations, setRecentReservations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, resRes] = await Promise.all([
          api.get('/reservations/stats'),
          api.get('/reservations?limit=5')
        ]);
        setStats(statsRes.data.stats);
        setRecentReservations(resRes.data.reservations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Toplam Araç', value: stats?.totalVehicles, icon: FiTruck, color: 'blue' },
    { label: 'Toplam Rezervasyon', value: stats?.total, icon: FiCalendar, color: 'indigo' },
    { label: 'Bekleyen Talepler', value: stats?.pending, icon: FiClock, color: 'amber' },
    { label: 'Onaylı Rezervasyon', value: stats?.confirmed, icon: FiCheckCircle, color: 'green' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Beklemede', color: 'bg-amber-100 text-amber-700' },
    confirmed: { label: 'Onaylandı', color: 'bg-green-100 text-green-700' },
    rejected: { label: 'Reddedildi', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="md:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl text-slate-800">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Cihan Motors yönetim paneline hoşgeldiniz</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                >
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${colorMap[card.color]}`}>
                    <Icon size={20} />
                  </div>
                  <div className="font-display font-bold text-3xl text-slate-800">
                    {loading ? (
                      <div className="skeleton h-8 w-16 rounded" />
                    ) : (
                      card.value ?? 0
                    )}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">{card.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Reservations */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-display font-semibold text-slate-800">Son Rezervasyonlar</h2>
              <a href="/admin/rezervasyonlar" className="text-blue-600 text-sm font-medium hover:underline">
                Tümünü Gör
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Müşteri</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Araç</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tarihler</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tutar</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(5)].map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="skeleton h-4 w-20 rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : recentReservations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-500">
                        Henüz rezervasyon yok
                      </td>
                    </tr>
                  ) : recentReservations.map((r) => {
                    const status = statusLabels[r.status] || statusLabels.pending;
                    return (
                      <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800 text-sm">{r.customerName}</div>
                          <div className="text-slate-500 text-xs">{r.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {r.vehicleId ? `${r.vehicleId.brand} ${r.vehicleId.model}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(r.startDate).toLocaleDateString('tr-TR')} → {new Date(r.endDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                          {r.totalPrice?.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
