// src/app/dashboard/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function DashboardHomePage() {
  const { username, role, inventory, transactions } = useAppContext();
  
  const [welcomeToast, setWelcomeToast] = useState(false);

  useEffect(() => {
    const isNewLogin = sessionStorage.getItem('isNewLogin');
    if (isNewLogin === 'true') {
      setWelcomeToast(true);
      sessionStorage.removeItem('isNewLogin');
      setTimeout(() => {
        setWelcomeToast(false);
      }, 5000);
    }
  }, []);

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // --- KALKULASI DATA ANALITIK ---
  const totalBarang = inventory.length;
  const barangMenipis = inventory.filter(item => item.stok <= 5).length;
  const totalLogTransaksi = transactions.length;

  // Memisahkan Pendapatan (Penjualan/Keluar) dan Pengeluaran (Restock/Masuk)
  const totalPendapatan = transactions
    .filter(t => t.tipe === 'Keluar')
    .reduce((sum, t) => sum + Number(t.total), 0);
    
  const totalPengeluaran = transactions
    .filter(t => t.tipe === 'Masuk')
    .reduce((sum, t) => sum + Number(t.total), 0);

  const labaBersih = totalPendapatan - totalPengeluaran;

  // Kalkulasi persentase untuk visualisasi Chart
  const maxBar = Math.max(totalPendapatan, totalPengeluaran) || 1; 
  const persentasePendapatan = (totalPendapatan / maxBar) * 100;
  const persentasePengeluaran = (totalPengeluaran / maxBar) * 100;

  return (
    <div className="relative animate-fade-in h-full flex flex-col pb-8">
      
      {/* POP-UP WELCOME TOAST */}
      <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-700 ease-out ${
        welcomeToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
      }`}>
        <div className="bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3 border border-slate-700 backdrop-blur-md bg-opacity-90">
          <span className="text-2xl animate-wave origin-bottom-right inline-block">👋</span>
          <div>
            <p className="text-sm font-medium text-slate-300">Login Berhasil</p>
            <p className="font-bold">{getGreetingTime()}, {username}! Selamat bekerja.</p>
          </div>
          <button onClick={() => setWelcomeToast(false)} className="ml-4 pl-4 border-l border-slate-700 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* HEADER BERANDA */}
      <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-3xl p-8 sm:p-10 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
            {getGreetingTime()}, <span className="text-indigo-100">{username}</span>!
          </h1>
          <p className="text-indigo-50 text-lg max-w-xl opacity-90">
            Berikut adalah ringkasan sistem informasi manajemen logistik Reka Rupa pada hari ini.
          </p>
          <div className="mt-6 inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide">
            Akses Level: <span className="uppercase">{role}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Data Operasional & Pintasan (Memakan 2/3 layar) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* GRID KARTU RINGKASAN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-0.5">Jenis Barang</p>
                <h3 className="text-2xl font-extrabold text-slate-800">{totalBarang}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-0.5">Total Log</p>
                <h3 className="text-2xl font-extrabold text-slate-800">{totalLogTransaksi}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mr-4 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-0.5">Stok Menipis</p>
                <h3 className="text-2xl font-extrabold text-rose-600">{barangMenipis}</h3>
              </div>
            </div>
          </div>

          {/* AREA AKSI CEPAT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Pintasan Ruang Kerja
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/transaksi" className="group block p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-700">Mesin Kasir</h3>
                    <p className="text-slate-500 text-sm mt-1">Eksekusi transaksi barang.</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white text-slate-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </Link>

              {role === 'owner' ? (
                <Link href="/dashboard/laporan" className={`group block p-6 border-2 border-slate-100 rounded-2xl transition-all ${role === 'owner' ? 'hover:border-emerald-500 hover:bg-emerald-50' : 'hover:border-amber-500 hover:bg-amber-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold text-lg text-slate-800 ${role === 'owner' ? 'group-hover:text-emerald-700' : 'group-hover:text-amber-700'}`}>
                  {role === 'owner' ? 'Laporan Detail' : 'Laporan Harian'}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  {role === 'owner' ? 'Buku besar & riwayat operasional 1 bulan.' : 'Cetak laporan penjualan hari ini.'}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 transition-colors ${role === 'owner' ? 'group-hover:bg-emerald-600 group-hover:text-white' : 'group-hover:bg-amber-600 group-hover:text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              </div>
            </div>
          </Link>
              ) : (
                <div className="p-6 border-2 border-slate-100 border-dashed rounded-2xl bg-slate-50 flex flex-col justify-center">
                   <p className="text-slate-400 font-medium text-sm flex items-center mb-1">
                     <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                     Laporan Dikunci
                   </p>
                   <p className="text-xs text-slate-400">Akses dibatasi untuk Admin.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Analitik Finansial (Memakan 1/3 layar) */}
        <div className="lg:col-span-1">
          {role === 'owner' ? (
            <div className="bg-slate-900 rounded-3xl p-6 shadow-xl h-full flex flex-col text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500 opacity-20 blur-2xl"></div>
              
              <h2 className="text-lg font-bold mb-6 flex items-center text-slate-100 z-10">
                <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Analitik Finansial
              </h2>

              <div className="space-y-4 z-10 mb-8">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Pendapatan Kotor</p>
                  <p className="text-xl font-extrabold text-emerald-400">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Pengeluaran Modal</p>
                  <p className="text-xl font-extrabold text-rose-400">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="mt-auto z-10 bg-indigo-600/20 p-5 rounded-2xl border border-indigo-500/30">
                <p className="text-indigo-200 text-sm font-semibold mb-1">Estimasi Laba Bersih</p>
                <h3 className={`text-3xl font-black ${labaBersih >= 0 ? 'text-white' : 'text-rose-400'}`}>
                  Rp {labaBersih.toLocaleString('id-ID')}
                </h3>
              </div>

              {/* Chart Proposi CSS */}
              <div className="mt-6 z-10">
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>In {persentasePendapatan.toFixed(0)}%</span>
                  <span>Out {persentasePengeluaran.toFixed(0)}%</span>
                </div>
                <div className="flex h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full transition-all duration-1000" style={{ width: `${persentasePendapatan}%` }}></div>
                  <div className="bg-rose-500 h-full transition-all duration-1000" style={{ width: `${persentasePengeluaran}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            /* TAMPILAN ADMIN: Hanya melihat Pendapatan */
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs mb-2">Total Penjualan Masuk</p>
              <h3 className="text-3xl font-black text-slate-800">
                Rp {totalPendapatan.toLocaleString('id-ID')}
              </h3>
              <p className="text-slate-400 text-xs mt-4 px-4">
                Analitik laba rugi dan pengeluaran modal dienkripsi khusus untuk akses Owner.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}