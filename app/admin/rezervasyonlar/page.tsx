'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNav from '@/components/admin/AdminNav';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiFileText, FiFilter, FiAlertTriangle, FiX } from 'react-icons/fi';

const statusMap: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Beklemede',  cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  confirmed: { label: 'Onaylandı', cls: 'bg-green-100 text-green-800 border-green-200' },
  rejected:  { label: 'Reddedildi',cls: 'bg-red-100 text-red-800 border-red-200' },
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [detailModal, setDetailModal] = useState<any>(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await api.get('/reservations', { params });
      setReservations(res.data.reservations);
    } catch { toast.error('Rezervasyonlar yüklenemedi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReservations(); }, [filter]);

  const handleApprove = async (id: string) => {
    setActionId(id);
    setProcessing(true);
    try {
      await api.post('/reservations/approve', { reservationId: id });
      toast.success('Rezervasyon onaylandı ✓');
      fetchReservations();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Onaylama başarısız';
      const conflict = err.response?.data?.conflictWith;
      if (conflict) {
        toast.error(
          `⚠️ ${msg}\n\nÇakışan Rezervasyon:\n${conflict.customerName}\n${new Date(conflict.startDate).toLocaleDateString('tr-TR')} - ${new Date(conflict.endDate).toLocaleDateString('tr-TR')}`,
          { duration: 6000 }
        );
      } else {
        toast.error(msg);
      }
    } finally { setProcessing(false); setActionId(null); }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setProcessing(true);
    try {
      await api.post('/reservations/reject', { reservationId: rejectModal.id, reason: rejectReason });
      toast.success('Rezervasyon reddedildi');
      setRejectModal(null);
      setRejectReason('');
      fetchReservations();
    } catch { toast.error('İşlem başarısız'); }
    finally { setProcessing(false); }
  };

  const handlePDF = async (id: string) => {
    try {
      const response = await api.get(`/reservations/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rezervasyon-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF indirildi');
    } catch { toast.error('PDF oluşturulamadı'); }
  };

  const filters = [
    { key: 'all', label: 'Tümü' },
    { key: 'pending', label: 'Bekleyen' },
    { key: 'confirmed', label: 'Onaylı' },
    { key: 'rejected', label: 'Reddedilen' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="md:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-800">Rezervasyonlar</h1>
              <p className="text-slate-500 text-sm mt-1">{reservations.length} kayıt görüntüleniyor</p>
            </div>
            {/* Filters */}
            <div className="flex gap-2 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Müşteri','Araç','Tarihler','Tutar','Durum','İşlemler'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-24 rounded" /></td>
                        ))}
                      </tr>
                    ))
                  ) : reservations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="text-5xl mb-3">📋</div>
                        <p className="text-slate-500">Rezervasyon bulunamadı</p>
                      </td>
                    </tr>
                  ) : reservations.map((r) => {
                    const st = statusMap[r.status] || statusMap.pending;
                    return (
                      <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800 text-sm">{r.customerName}</div>
                          <div className="text-slate-500 text-xs">{r.phone}</div>
                          <div className="text-slate-400 text-xs font-mono">{r.tcNo}</div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700">
                          {r.vehicleId ? `${r.vehicleId.brand} ${r.vehicleId.model}` : <span className="text-red-400">Araç silinmiş</span>}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          <div className="text-slate-800 font-medium">
                            {new Date(r.startDate).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="text-slate-500 text-xs">
                            → {new Date(r.endDate).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="text-slate-400 text-xs">{r.totalDays} gün</div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-800 text-sm">
                          {r.totalPrice?.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${st.cls}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            {/* Detay butonu */}
                            <button
                              onClick={() => setDetailModal(r)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium"
                              title="Detay"
                            >
                              👁
                            </button>

                            {/* PDF */}
                            <button
                              onClick={() => handlePDF(r._id)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="PDF İndir"
                            >
                              <FiFileText size={15} />
                            </button>

                            {/* Onayla - sadece pending */}
                            {r.status === 'pending' && (
                              <button
                                onClick={() => handleApprove(r._id)}
                                disabled={processing && actionId === r._id}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition-colors"
                                title="Onayla"
                              >
                                {processing && actionId === r._id ? (
                                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <><FiCheckCircle size={13} /> Onayla</>
                                )}
                              </button>
                            )}

                            {/* Reddet - sadece pending */}
                            {r.status === 'pending' && (
                              <button
                                onClick={() => setRejectModal({ id: r._id, name: r.customerName })}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors"
                                title="Reddet"
                              >
                                <FiXCircle size={13} /> Reddet
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetailModal(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-lg text-slate-800">Rezervasyon Detayı</h3>
                <button onClick={() => setDetailModal(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <FiX size={18} />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Müşteri Adı', value: detailModal.customerName },
                  { label: 'Telefon', value: detailModal.phone },
                  { label: 'TC Kimlik No', value: detailModal.tcNo },
                  { label: 'E-posta', value: detailModal.email || '-' },
                  { label: 'Araç', value: detailModal.vehicleId ? `${detailModal.vehicleId.brand} ${detailModal.vehicleId.model}` : '-' },
                  { label: 'Teslim Alma', value: `${new Date(detailModal.startDate).toLocaleDateString('tr-TR')} ${detailModal.pickupTime}` },
                  { label: 'İade', value: `${new Date(detailModal.endDate).toLocaleDateString('tr-TR')} ${detailModal.dropoffTime}` },
                  { label: 'Toplam Gün', value: `${detailModal.totalDays} gün` },
                  { label: 'Toplam Tutar', value: `${detailModal.totalPrice?.toLocaleString('tr-TR')} ₺` },
                  { label: 'Not', value: detailModal.notes || '-' },
                  { label: 'Talep Tarihi', value: new Date(detailModal.createdAt).toLocaleString('tr-TR') },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-slate-500 text-sm">{label}</span>
                    <span className="text-slate-800 text-sm font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
              {detailModal.rejectionReason && (
                <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-red-700 text-sm"><strong>Red Nedeni:</strong> {detailModal.rejectionReason}</p>
                </div>
              )}
              <button
                onClick={() => handlePDF(detailModal._id)}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                <FiFileText size={16} />
                PDF Olarak İndir
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={() => setRejectModal(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiAlertTriangle className="text-red-500" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Rezervasyonu Reddet</h3>
                  <p className="text-slate-500 text-xs">{rejectModal.name}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Red Nedeni (isteğe bağlı)</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Müşteriye iletilecek red nedeni..."
                  className="w-full border-2 border-slate-200 focus:border-red-400 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRejectModal(null)} className="flex-1 border-2 border-slate-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                  Vazgeç
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Reddet'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
