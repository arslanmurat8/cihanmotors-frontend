'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNav from '@/components/admin/AdminNav';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiMail, FiTrash2, FiPhone, FiCheck, FiX } from 'react-icons/fi';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setMessages(res.data.leads);
    } catch { toast.error('Mesajlar yüklenemedi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleRead = async (id: string) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Mesaj silindi');
      setDeleteId(null);
      if (selected?._id === id) setSelected(null);
      fetchMessages();
    } catch { toast.error('Silme başarısız'); }
  };

  const openMessage = (msg: any) => {
    setSelected(msg);
    if (!msg.isRead) handleRead(msg._id);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="md:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-800">İletişim Mesajları</h1>
              <p className="text-slate-500 text-sm mt-1">
                {messages.length} mesaj
                {unreadCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} okunmamış
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Message list */}
            <div className="lg:col-span-2 space-y-2">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 space-y-2">
                    <div className="skeleton h-4 w-32 rounded" />
                    <div className="skeleton h-3 w-48 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                ))
              ) : messages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-slate-500">Henüz mesaj yok</p>
                </div>
              ) : messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => openMessage(msg)}
                  className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${
                    selected?._id === msg._id
                      ? 'border-blue-400 shadow-md shadow-blue-100'
                      : 'border-slate-100 hover:border-slate-200'
                  } ${!msg.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!msg.isRead ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        <FiMail className={!msg.isRead ? 'text-blue-600' : 'text-slate-400'} size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm truncate ${!msg.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-700'}`}>
                          {msg.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{msg.phone}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 flex-shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  {msg.subject && (
                    <div className="mt-2 text-xs font-medium text-slate-600 truncate">{msg.subject}</div>
                  )}
                  <div className="mt-1 text-xs text-slate-500 line-clamp-2">{msg.message}</div>
                </motion.div>
              ))}
            </div>

            {/* Message detail */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
                      <div>
                        <h2 className="font-display font-bold text-lg text-slate-800">{selected.name}</h2>
                        {selected.subject && (
                          <p className="text-slate-500 text-sm mt-0.5">{selected.subject}</p>
                        )}
                        <p className="text-slate-400 text-xs mt-1">
                          {new Date(selected.createdAt).toLocaleString('tr-TR')}
                        </p>
                      </div>
                      <button
                        onClick={() => setDeleteId(selected._id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                        title="Sil"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    {/* Contact info */}
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-4">
                      <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium">
                        <FiPhone size={14} />
                        {selected.phone}
                      </a>
                      {selected.email && (
                        <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium">
                          <FiMail size={14} />
                          {selected.email}
                        </a>
                      )}
                    </div>

                    {/* Message body */}
                    <div className="px-6 py-6">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 flex gap-3">
                      <a
                        href={`tel:${selected.phone}`}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <FiPhone size={15} />
                        Geri Ara
                      </a>
                      {selected.email && (
                        <a
                          href={`mailto:${selected.email}?subject=Cihan Motors - ${selected.subject || 'Yanıt'}`}
                          className="flex items-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        >
                          <FiMail size={15} />
                          E-posta Gönder
                        </a>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl border border-slate-100 py-20 flex flex-col items-center justify-center h-full"
                  >
                    <div className="text-5xl mb-4">💌</div>
                    <p className="text-slate-500 text-center">Detayları görmek için bir mesaj seçin</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="text-4xl text-center mb-3">🗑️</div>
              <h3 className="font-bold text-lg text-center text-slate-800 mb-2">Mesajı Sil</h3>
              <p className="text-slate-500 text-sm text-center mb-5">Bu mesaj kalıcı olarak silinecek.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 border-2 border-slate-200 py-2.5 rounded-xl text-sm font-semibold">İptal</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">Sil</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
