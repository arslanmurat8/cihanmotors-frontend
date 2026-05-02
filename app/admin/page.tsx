'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) router.push('/admin/dashboard');
    else router.push('/admin/login');
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
