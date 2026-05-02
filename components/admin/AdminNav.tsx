'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiGrid, FiTruck, FiCalendar, FiMessageSquare, 
  FiLogOut, FiMenu, FiX, FiChevronRight
} from 'react-icons/fi';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/araclar', label: 'Araçlar', icon: FiTruck },
  { href: '/admin/rezervasyonlar', label: 'Rezervasyonlar', icon: FiCalendar },
  { href: '/admin/mesajlar', label: 'Mesajlar', icon: FiMessageSquare },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    const u = localStorage.getItem('adminUser');
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-base font-display">C</span>
          </div>
          <div>
            <div className="font-display font-bold text-sm text-slate-800">Cihan Motors</div>
            <div className="text-xs text-slate-500">Admin Paneli</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {item.label}
              {active && <FiChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User & logout */}
      <div className="px-4 py-4 border-t border-slate-200">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">{user.name?.[0]}</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-800 truncate">{user.name}</div>
              <div className="text-xs text-slate-500 truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <FiLogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-slate-200 fixed left-0 top-0 z-40">
        <Sidebar />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="font-display font-bold text-slate-800">Admin Panel</div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-slate-100">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white">
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
