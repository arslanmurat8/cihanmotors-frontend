'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AdminNav from '@/components/admin/AdminNav';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiCheck } from 'react-icons/fi';

const emptyForm = {
  brand: '', model: '', year: new Date().getFullYear(), fuel: 'Benzin',
  transmission: 'Manuel', seats: 5, pricePerDay: '', description: '',
  features: '', category: 'Ekonomik', isActive: true
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles/all');
      setVehicles(res.data.vehicles);
    } catch { toast.error('Araçlar yüklenemedi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const openAdd = () => {
    setEditVehicle(null);
    setForm(emptyForm);
    setImages([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const openEdit = (v: any) => {
    setEditVehicle(v);
    setForm({
      brand: v.brand, model: v.model, year: v.year, fuel: v.fuel,
      transmission: v.transmission, seats: v.seats, pricePerDay: v.pricePerDay,
      description: v.description || '', features: v.features?.join(', ') || '',
      category: v.category, isActive: v.isActive
    });
    setImages([]);
    setImagePreviews(v.images || []);
    setShowModal(true);
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.pricePerDay) {
      toast.error('Marka, model ve fiyat zorunludur'); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      // Features'ı JSON array olarak gönder
      const featuresArr = form.features.split(',').map((f: string) => f.trim()).filter(Boolean);
      fd.set('features', JSON.stringify(featuresArr));
      images.forEach(img => fd.append('images', img));

      if (editVehicle) {
        await api.put(`/vehicles/${editVehicle._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Araç güncellendi');
      } else {
        await api.post('/vehicles', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Araç eklendi');
      }
      setShowModal(false);
      fetchVehicles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'İşlem başarısız');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Araç silindi');
      setDeleteId(null);
      fetchVehicles();
    } catch { toast.error('Silme işlemi başarısız'); }
  };

  const inputCls = 'w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors';

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="md:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-800">Araç Yönetimi</h1>
              <p className="text-slate-500 text-sm mt-1">{vehicles.length} araç kayıtlı</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              <FiPlus size={18} />
              Araç Ekle
            </button>
          </div>

          {/* Vehicles table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Araç</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Özellikler</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Kategori</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Günlük Ücret</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Durum</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="skeleton h-4 w-20 rounded" /></td>
                        ))}
                      </tr>
                    ))
                  ) : vehicles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-slate-500">
                        <div className="text-5xl mb-3">🚗</div>
                        <p>Henüz araç eklenmemiş</p>
                      </td>
                    </tr>
                  ) : vehicles.map((v) => (
                    <motion.tr
                      key={v._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                            {v.images?.[0] ? (
                              <Image src={v.images[0]} alt={v.brand} width={56} height={40} className="object-cover w-full h-full" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-xl">🚗</div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">{v.brand} {v.model}</div>
                            <div className="text-slate-500 text-xs">{v.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {v.fuel} · {v.transmission} · {v.seats} kişi
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">{v.category}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600 text-sm">
                        {Number(v.pricePerDay).toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${v.isActive ? 'bg-green-500' : 'bg-slate-400'}`} />
                          {v.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(v)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(v._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between rounded-t-3xl z-10">
                <h2 className="font-display font-bold text-xl text-slate-800">
                  {editVehicle ? 'Araç Düzenle' : 'Yeni Araç Ekle'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Marka *</label>
                    <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="Örn: Toyota" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Model *</label>
                    <input value={form.model} onChange={e => setForm({...form, model: e.target.value})} placeholder="Örn: Corolla" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Yıl</label>
                    <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Koltuk Sayısı</label>
                    <input type="number" value={form.seats} onChange={e => setForm({...form, seats: e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Günlük Ücret (₺) *</label>
                    <input type="number" value={form.pricePerDay} onChange={e => setForm({...form, pricePerDay: e.target.value})} placeholder="500" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Yakıt Tipi</label>
                    <select value={form.fuel} onChange={e => setForm({...form, fuel: e.target.value})} className={inputCls}>
                      {['Benzin','Dizel','Hibrit','Elektrik','LPG'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Vites</label>
                    <select value={form.transmission} onChange={e => setForm({...form, transmission: e.target.value})} className={inputCls}>
                      <option>Manuel</option>
                      <option>Otomatik</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Kategori</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputCls}>
                      {['Ekonomik','Orta Sınıf','SUV','Lüks','Ticari'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Araç Açıklaması</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Araç hakkında kısa açıklama..." className={inputCls + ' resize-none'} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Özellikler (virgülle ayırın)</label>
                  <input value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="Klima, Bluetooth, Geri Kamera, Cruise Control" className={inputCls} />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Araç Görselleri</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition-colors"
                  >
                    <FiUpload className="mx-auto text-slate-400 mb-2" size={24} />
                    <p className="text-slate-500 text-sm">Tıklayın veya görsel sürükleyin</p>
                    <p className="text-slate-400 text-xs mt-1">JPG, PNG, WebP · Max 5MB</p>
                  </div>
                  <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative w-20 h-14 rounded-lg overflow-hidden border border-slate-200">
                          <Image src={src} alt={`Görsel ${i+1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({...form, isActive: !form.isActive})}
                    className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-green-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                  <span className="text-sm font-medium text-slate-700">
                    {form.isActive ? 'Aktif (Listede görünür)' : 'Pasif (Listede görünmez)'}
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><FiCheck size={16} /> {editVehicle ? 'Güncelle' : 'Araç Ekle'}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="text-4xl text-center mb-4">🗑️</div>
              <h3 className="font-bold text-lg text-center text-slate-800 mb-2">Aracı Sil</h3>
              <p className="text-slate-500 text-sm text-center mb-6">Bu araç kalıcı olarak silinecek. Emin misiniz?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 border-2 border-slate-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">İptal</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">Sil</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
