// src/app/dashboard/laporan/page.tsx
"use client";
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function LaporanPage() {
  const { transactions, role } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Keluar' | 'Masuk'>('Keluar');

  // --- ALGORITMA FILTER WAKTU ---
  const hariIni = new Date();
  
  const isHariIni = (dateString: string) => {
    const d = new Date(dateString);
    return d.getDate() === hariIni.getDate() && d.getMonth() === hariIni.getMonth() && d.getFullYear() === hariIni.getFullYear();
  };

  const isBulanIni = (dateString: string) => {
    const d = new Date(dateString);
    return d.getMonth() === hariIni.getMonth() && d.getFullYear() === hariIni.getFullYear();
  };

  // --- DATA UNTUK DI CETAK (PRINT) ---
  // Admin: Hanya "Barang Keluar" & "Hari Ini"
  const dataCetakAdmin = transactions.filter(t => t.tipe === 'Keluar' && isHariIni(t.tanggal));
  
  // Owner: "Bulan Ini" (Dipisah menjadi dua array)
  const dataCetakOwnerKeluar = transactions.filter(t => t.tipe === 'Keluar' && isBulanIni(t.tanggal));
  const dataCetakOwnerMasuk = transactions.filter(t => t.tipe === 'Masuk' && isBulanIni(t.tanggal));

  // Kalkulasi total nominal cetak
  const totalAdmin = dataCetakAdmin.reduce((sum, t) => sum + Number(t.total), 0);
  const totalOwnerKeluar = dataCetakOwnerKeluar.reduce((sum, t) => sum + Number(t.total), 0);
  const totalOwnerMasuk = dataCetakOwnerMasuk.reduce((sum, t) => sum + Number(t.total), 0);
  const labaBulanIni = totalOwnerKeluar - totalOwnerMasuk;

  // --- DATA UNTUK DITAMPILKAN DI LAYAR WEB ---
  const dataTampilLayar = role === 'admin'
    ? dataCetakAdmin.filter(t => t.item.toLowerCase().includes(searchQuery.toLowerCase()))
    : transactions.filter(t => t.tipe === activeTab && t.item.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      {/* INJEKSI CSS KHUSUS PRINT */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #area-cetak-laporan, #area-cetak-laporan * { visibility: visible; }
          #area-cetak-laporan { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}} />

      {/* ========================================================= */}
      {/* --- TAMPILAN WEB (TIDAK IKUT TERPRINT) --- */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-fade-in flex flex-col min-h-[500px]">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {role === 'admin' ? 'Log Penjualan Hari Ini' : 'Log Detail Transaksi'}
            </h2>
            <p className="text-sm text-slate-500">
              {role === 'admin' ? 'Hanya menampilkan barang keluar pada hari ini.' : 'Menampilkan seluruh riwayat keluar masuk.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm font-bold border border-indigo-100 hidden sm:block">
              {dataTampilLayar.length} Data Ditemukan
            </span>
            
            <button 
              onClick={() => window.print()} 
              className="flex-1 sm:flex-none bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Cetak Dokumen
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari nama barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
            />
          </div>

          {role === 'owner' && (
            <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('Keluar')} 
                className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'Keluar' ? 'bg-white shadow-sm text-amber-600 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Barang Keluar
              </button>
              <button 
                onClick={() => setActiveTab('Masuk')} 
                className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'Masuk' ? 'bg-white shadow-sm text-emerald-600 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Barang Masuk
              </button>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[600px]">
          {dataTampilLayar.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">Tidak ada data transaksi yang sesuai.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {dataTampilLayar.map(t => (
                <li key={t.id} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100 hover:shadow-md transition-all group">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${t.tipe === 'Masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {t.tipe}
                    </span>
                    <span className="font-bold text-slate-800 ml-3 text-lg">{t.item}</span>
                    <p className="text-xs text-slate-500 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        Waktu: {new Date(t.tanggal).toLocaleString('id-ID')} | Penanggung Jawab: <span className="font-bold text-indigo-500">{t.kasir || 'Sistem'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mb-1 shadow-sm">
                        {t.qty} Unit
                    </p>
                    <p className="font-extrabold text-slate-800 text-lg">
                      {t.tipe === 'Keluar' ? '+' : '-'} Rp {Number(t.total).toLocaleString('id-ID')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* --- TEMPLATE KHUSUS CETAK (HANYA MUNCUL DI KERTAS) --- */}
      {/* ========================================================= */}
      <div id="area-cetak-laporan" className="hidden print:block w-full text-black bg-white p-8 font-sans">
        
        {/* KOP Surat Dokumen */}
        <div className="text-center border-b-2 border-black pb-6 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-widest">Reka Rupa</h1>
          <h2 className="text-xl mt-1 font-bold">
            {role === 'admin' ? 'Laporan Penjualan (Barang Keluar) Harian' : 'Rekapitulasi Finansial Logistik Bulanan'}
          </h2>
          <p className="text-sm mt-2 text-slate-600">
            {role === 'admin' 
              ? `Tanggal Cetak: ${hariIni.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` 
              : `Periode: Bulan ${hariIni.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`
            }
          </p>
        </div>

        {/* --- LAYOUT UNTUK ADMIN (Satu Tabel: Barang Keluar Saja) --- */}
        {role === 'admin' && (
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-black p-2 w-10">No</th>
                <th className="border border-black p-2">Waktu</th>
                <th className="border border-black p-2">Nama Barang</th>
                <th className="border border-black p-2 w-16">Qty</th>
                <th className="border border-black p-2">Kasir / Admin</th>
                <th className="border border-black p-2 text-right">Subtotal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {dataCetakAdmin.length > 0 ? (
                dataCetakAdmin.map((t, idx) => (
                  <tr key={t.id} className="border-b border-slate-300">
                    <td className="border border-black p-2 text-center">{idx + 1}</td>
                    <td className="border border-black p-2">{new Date(t.tanggal).toLocaleString('id-ID')}</td>
                    <td className="border border-black p-2">{t.item}</td>
                    <td className="border border-black p-2 text-center">{t.qty}</td>
                    <td className="border border-black p-2">{t.kasir || 'Sistem'}</td>
                    <td className="border border-black p-2 text-right">{t.total.toLocaleString('id-ID')}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="border border-black p-4 text-center italic text-slate-500">Belum ada transaksi keluar hari ini.</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td colSpan={5} className="border border-black p-2 text-right uppercase">Total Penjualan Hari Ini</td>
                <td className="border border-black p-2 text-right">Rp {totalAdmin.toLocaleString('id-ID')}</td>
              </tr>
            </tfoot>
          </table>
        )}

        {/* --- LAYOUT UNTUK OWNER (Dua Tabel Terpisah & Laba Bersih) --- */}
        {role === 'owner' && (
          <>
            {/* TABEL A: PENDAPATAN */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2 uppercase border-b border-black inline-block">A. Pemasukan (Penjualan / Barang Keluar)</h3>
              <table className="w-full border-collapse border border-black text-sm mt-2">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="border border-black p-2 w-10">No</th>
                    <th className="border border-black p-2 w-48">Waktu</th>
                    <th className="border border-black p-2">Nama Barang</th>
                    <th className="border border-black p-2 w-16">Qty</th>
                    <th className="border border-black p-2 text-right">Subtotal (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCetakOwnerKeluar.length > 0 ? (
                    dataCetakOwnerKeluar.map((t, idx) => (
                      <tr key={t.id} className="border-b border-slate-300">
                        <td className="border border-black p-2 text-center">{idx + 1}</td>
                        <td className="border border-black p-2">{new Date(t.tanggal).toLocaleString('id-ID')}</td>
                        <td className="border border-black p-2">{t.item}</td>
                        <td className="border border-black p-2 text-center">{t.qty}</td>
                        <td className="border border-black p-2 text-right">{t.total.toLocaleString('id-ID')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="border border-black p-2 text-center italic text-slate-500">Tidak ada data pemasukan bulan ini.</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={4} className="border border-black p-2 text-right">TOTAL PEMASUKAN</td>
                    <td className="border border-black p-2 text-right">Rp {totalOwnerKeluar.toLocaleString('id-ID')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* TABEL B: PENGELUARAN */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2 uppercase border-b border-black inline-block">B. Pengeluaran Modal (Restock / Barang Masuk)</h3>
              <table className="w-full border-collapse border border-black text-sm mt-2">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="border border-black p-2 w-10">No</th>
                    <th className="border border-black p-2 w-48">Waktu</th>
                    <th className="border border-black p-2">Nama Barang</th>
                    <th className="border border-black p-2 w-16">Qty</th>
                    <th className="border border-black p-2 text-right">Subtotal (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCetakOwnerMasuk.length > 0 ? (
                    dataCetakOwnerMasuk.map((t, idx) => (
                      <tr key={t.id} className="border-b border-slate-300">
                        <td className="border border-black p-2 text-center">{idx + 1}</td>
                        <td className="border border-black p-2">{new Date(t.tanggal).toLocaleString('id-ID')}</td>
                        <td className="border border-black p-2">{t.item}</td>
                        <td className="border border-black p-2 text-center">{t.qty}</td>
                        <td className="border border-black p-2 text-right">{t.total.toLocaleString('id-ID')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="border border-black p-2 text-center italic text-slate-500">Tidak ada data pengeluaran bulan ini.</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={4} className="border border-black p-2 text-right">TOTAL PENGELUARAN</td>
                    <td className="border border-black p-2 text-right">Rp {totalOwnerMasuk.toLocaleString('id-ID')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* RINGKASAN LABA BERSIH */}
            <div className="border-4 border-black p-4 flex justify-between items-center mt-6">
              <span className="font-bold text-xl uppercase tracking-widest">Estimasi Laba Bersih Bulan Ini</span>
              <span className="font-black text-2xl">Rp {labaBulanIni.toLocaleString('id-ID')}</span>
            </div>
          </>
        )}

        {/* Tanda Tangan */}
        <div className="mt-16 flex justify-end">
          <div className="text-center w-56">
            <p className="mb-16 text-sm">{hariIni.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold border-b border-black pb-1 uppercase">{role === 'admin' ? 'Kasir Bertugas' : 'Owner'}</p>
          </div>
        </div>

      </div>
    </>
  );
}