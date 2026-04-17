"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Settings, LogOut, Printer, ArrowDownCircle, ArrowUpCircle, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link"; // Menggunakan Link dari Next.js untuk navigasi cepat

interface RiwayatStok {
  id_riwayat: number;
  tanggal: string;
  jenis_pergerakan: string;
  jumlah: number;
  keterangan: string;
  nama_barang: string;
  satuan: string;
  kategori: string;
}

export default function LaporanPage() {
  const [dataStok, setDataStok] = useState<RiwayatStok[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStok() {
      try {
        const response = await fetch("/api/stok");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        setDataStok(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStok();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white overflow-hidden text-gray-800 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white/40 backdrop-blur-xl border-r border-white/60 p-6 flex flex-col justify-between hidden md:flex z-10">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <Printer size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">REKA RUPA</h2>
              <p className="text-xs text-gray-500 font-medium">Dashboard Operasional</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="/" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-white/60 rounded-xl transition-all hover:text-blue-600">
              <LayoutDashboard size={20} /> Overview
            </Link>
            {/* Menu Laporan Detail dibuat aktif (biru) */}
            <Link href="/laporan" className="flex items-center gap-3 p-3 bg-white/80 rounded-xl text-blue-700 font-semibold shadow-sm border border-white/50 transition-all">
              <FileText size={20} /> Laporan Detail
            </Link>
            <Link href="/transaksi" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-white/60 rounded-xl transition-all hover:text-blue-600">
              <ShoppingCart size={20} /> Transaksi
            </Link>
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
          <LogOut size={20} /> Keluar
        </button>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        <header className="mb-8 flex justify-between items-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-gray-800">Laporan Inventori</h1>
            <p className="text-gray-500 mt-1">Riwayat pergerakan barang masuk dan keluar.</p>
          </motion.div>
        </header>

        {/* TABEL GLASSMORPHISM */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-sm text-gray-500 border-b border-gray-100/50">
                  <th className="py-4 px-6 font-semibold">Tanggal</th>
                  <th className="py-4 px-6 font-semibold">Pergerakan</th>
                  <th className="py-4 px-6 font-semibold">Nama Barang</th>
                  <th className="py-4 px-6 font-semibold">Jumlah</th>
                  <th className="py-4 px-6 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">Memuat data...</td></tr>
                ) : dataStok.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">Belum ada riwayat stok.</td></tr>
                ) : (
                  dataStok.map((item) => (
                    <tr key={item.id_riwayat} className="border-b border-gray-100/50 hover:bg-white/80 transition-colors">
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 flex items-center gap-2">
                        {item.jenis_pergerakan === 'Masuk' ? (
                          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <ArrowDownCircle size={14} /> Masuk
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <ArrowUpCircle size={14} /> Keluar
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-700">{item.nama_barang}</p>
                        <p className="text-xs text-gray-400">{item.kategori}</p>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-700">
                        {item.jumlah} <span className="text-sm font-normal text-gray-500">{item.satuan}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{item.keterangan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>
    </div>
  );
}