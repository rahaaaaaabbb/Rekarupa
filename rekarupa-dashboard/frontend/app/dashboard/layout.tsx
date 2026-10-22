// src/app/dashboard/layout.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role, setRole } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!role) router.push('/');
  }, [role, router]);

  if (!role) return null; 

  return (
    // 1. KUNCI VISUAL: Implementasi animate-gradient-fluid dengan palet warna yang kaya
    <div className="min-h-screen animate-gradient-fluid bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 font-sans text-slate-800 relative pb-24">
      
      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        
        {/* 2. GLASSMORPHISM: Menggunakan bg-white/70 dan backdrop-blur-md agar transparan */}
        <header className="flex justify-between items-center bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 mb-8 transition-all">
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
            Workspace Operasional
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold bg-white/80 text-indigo-700 px-4 py-1.5 rounded-full border border-indigo-100/50 shadow-sm uppercase tracking-wider">
              Role: {role}
            </span>
            <button onClick={() => { setRole(null); router.push('/'); }} className="text-sm text-rose-600 font-bold hover:text-rose-700 transition-colors bg-white/50 px-3 py-1.5 rounded-lg hover:bg-white/80">
              Logout
            </button>
          </div>
        </header>

        {/* Area Konten Anak */}
        {children}
      </div>

      {/* Floating Action Menu */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 origin-bottom ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
          <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-xl border border-white/50 px-6 py-3 rounded-full font-bold hover:bg-white hover:scale-105 transition-all">📊 Dashboard</Link>
          <Link href="/dashboard/transaksi" onClick={() => setIsMenuOpen(false)} className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-xl border border-white/50 px-6 py-3 rounded-full font-bold hover:bg-white hover:scale-105 transition-all">🛒 Transaksi</Link>
          <Link href="/dashboard/stok" onClick={() => setIsMenuOpen(false)} className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-xl border border-white/50 px-6 py-3 rounded-full font-bold hover:bg-white hover:scale-105 transition-all">📦 Stok Barang</Link>
          <Link href="/dashboard/laporan" onClick={() => setIsMenuOpen(false)} className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-xl border border-white/50 px-6 py-3 rounded-full font-bold hover:bg-white hover:scale-105 transition-all">📄 Detail Laporan</Link>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${isMenuOpen ? 'bg-rose-500 rotate-45' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:scale-110 hover:shadow-indigo-500/50'}`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {/* Ornamen Dekoratif Blur (Opsional untuk estetika ekstra) */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse pointer-events-none z-0"></div>
      <div className="fixed bottom-20 right-20 w-72 h-72 bg-rose-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse pointer-events-none z-0"></div>
    </div>
  );
}