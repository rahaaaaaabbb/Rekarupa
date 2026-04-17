"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { LayoutDashboard, FileText, Settings, LogOut, Printer, ChevronDown, ShoppingCart } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Pendapatan {
  id_pendapatan: number;
  tanggal: string;
  kategori_layanan: string;
  total_pendapatan: number;
}

interface Pengeluaran {
  id_pengeluaran: number;
  tanggal: string;
  kategori_pengeluaran: string;
  total_pengeluaran: number;
}

export default function DashboardPage() {
  const [dataPendapatan, setDataPendapatan] = useState<Pendapatan[]>([]);
  const [dataPengeluaran, setDataPengeluaran] = useState<Pengeluaran[]>([]);
  const [totalPendapatan, setTotalPendapatan] = useState<number>(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState<number>(0);
  const [labaKotor, setLabaKotor] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [resPendapatan, resPengeluaran] = await Promise.all([
          fetch("/api/pendapatan"),
          fetch("/api/pengeluaran")
        ]);

        if (!resPendapatan.ok || !resPengeluaran.ok) throw new Error("Gagal mengambil data");

        const dataPend: Pendapatan[] = await resPendapatan.json();
        const dataPeng: Pengeluaran[] = await resPengeluaran.json();

        setDataPendapatan(dataPend);
        setDataPengeluaran(dataPeng);

        const akumulasiPendapatan = dataPend.reduce((sum, item) => sum + item.total_pendapatan, 0);
        const akumulasiPengeluaran = dataPeng.reduce((sum, item) => sum + item.total_pengeluaran, 0);

        setTotalPendapatan(akumulasiPendapatan);
        setTotalPengeluaran(akumulasiPengeluaran);
        setLabaKotor(akumulasiPendapatan - akumulasiPengeluaran);

      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const rekapKategori = dataPendapatan.reduce((acc: any, curr) => {
    if (!acc[curr.kategori_layanan]) {
      acc[curr.kategori_layanan] = 0;
    }
    acc[curr.kategori_layanan] += curr.total_pendapatan;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(rekapKategori),
    datasets: [
      {
        label: "Total Pendapatan (Rp)",
        data: Object.values(rekapKategori),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        hoverBackgroundColor: "rgba(37, 99, 235, 1)",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      }
    },
    scales: {
      y: { grid: { color: "rgba(0,0,0,0.03)" }, border: { dash: [4, 4] } },
      x: { grid: { display: false } }
    },
    animations: {
      y: { duration: 1500, easing: 'easeOutQuart' }
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };
  const handleLogout = async () => {
  await fetch('/api/logout');
  window.location.href = '/login'; // Refresh dan arahkan ke login
};

  // LOGIKA BARU: Menggabungkan data pendapatan dan pengeluaran untuk tabel
  const riwayatTransaksi = [
    ...dataPendapatan.map(item => ({
      id: `inc-${item.id_pendapatan}`,
      tanggal: item.tanggal,
      jenis: 'Pendapatan',
      kategori: item.kategori_layanan,
      nominal: item.total_pendapatan
    })),
    ...dataPengeluaran.map(item => ({
      id: `exp-${item.id_pengeluaran}`,
      tanggal: item.tanggal,
      jenis: 'Pengeluaran',
      kategori: item.kategori_pengeluaran,
      nominal: item.total_pengeluaran
    }))
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()); // Urutkan terbaru

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white overflow-hidden text-gray-800 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white/40 backdrop-blur-xl border-r border-white/60 p-6 flex flex-col justify-between hidden md:flex z-10">
        <div>
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <Printer size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                REKA RUPA
              </h2>
              <p className="text-xs text-gray-500 font-medium">Dashboard Operasional</p>
            </div>
          </motion.div>

          <nav className="space-y-2">
            <Link href="/" className="flex items-center gap-3 p-3 bg-white/80 rounded-xl text-blue-700 font-semibold shadow-sm border border-white/50 transition-all">
              <LayoutDashboard size={20} /> Overview
            </Link>
            <Link href="/laporan" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-white/60 rounded-xl transition-all hover:text-blue-600">
              <FileText size={20} /> Laporan Detail
            </Link>
            <Link href="/transaksi" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-white/60 rounded-xl transition-all hover:text-blue-600">
              <ShoppingCart size={20} />Transaksi
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl font-bold text-gray-800">Ringkasan Hari Ini</h1>
            <p className="text-gray-500 mt-1">Pantau performa usaha secara real-time.</p>
          </motion.div>
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/50 rounded-xl text-sm font-semibold shadow-sm hover:bg-white/80 transition-all">
               Januari 2026 <ChevronDown size={16} />
             </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-300 border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"></div>
          </div>
        </header>

        {/* BENTO GRID */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.01 }} className="bg-white/60 backdrop-blur-lg border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 font-medium">Total Pendapatan</p>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg font-semibold">+ Pemasukan</span>
            </div>
            {isLoading ? <div className="h-10 w-32 bg-gray-200/50 animate-pulse rounded-lg"></div> : <h2 className="text-3xl font-bold text-gray-800">{formatRupiah(totalPendapatan)}</h2>}
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.01 }} className="bg-white/60 backdrop-blur-lg border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 font-medium">Total Pengeluaran</p>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-lg font-semibold">- Beban Biaya</span>
            </div>
            {isLoading ? <div className="h-10 w-32 bg-gray-200/50 animate-pulse rounded-lg"></div> : <h2 className="text-3xl font-bold text-gray-800">{formatRupiah(totalPengeluaran)}</h2>}
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg shadow-blue-200 text-white relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <p className="text-blue-100 font-medium">Laba Kotor</p>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg font-semibold backdrop-blur-md">Net Profit</span>
            </div>
            {isLoading ? <div className="h-10 w-32 bg-white/20 animate-pulse rounded-lg relative z-10"></div> : <h2 className="text-3xl font-bold relative z-10">{formatRupiah(labaKotor)}</h2>}
          </motion.div>
        </motion.div>

        {/* AREA GRAFIK & TOMBOL INTERAKTIF */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/60 backdrop-blur-lg border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-80 flex flex-col">
             <h3 className="text-lg font-bold text-gray-800 mb-4 flex-none">Distribusi Pendapatan Layanan</h3>
            <div className="flex-1 w-full relative">
              {isLoading ? <div className="absolute inset-0 bg-gray-200/50 animate-pulse rounded-xl"></div> : <Bar data={chartData} options={chartOptions} />}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className={`backdrop-blur-lg border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center transition-colors duration-500 ${isTableOpen ? 'bg-indigo-600 text-white' : 'bg-white/60 text-gray-800'}`}>
             <motion.div animate={{ rotate: isTableOpen ? 180 : 0 }} className={`p-4 rounded-full mb-4 ${isTableOpen ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-500'}`}>
               <FileText size={32} />
             </motion.div>
             <h3 className="text-lg font-bold mb-2">Data Dinamis</h3>
             <p className={`text-sm mb-4 ${isTableOpen ? 'text-indigo-100' : 'text-gray-500'}`}>
               {isTableOpen ? 'Tabel rincian telah dimuat di bawah.' : 'Klik tombol di bawah untuk menampilkan rincian data.'}
             </p>
             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsTableOpen(!isTableOpen)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${isTableOpen ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
               {isTableOpen ? 'Tutup Rincian' : 'Buka Rincian'}
             </motion.button>
          </motion.div>
        </motion.div>

        {/* TABEL RINCIAN (ANIMATED) */}
        <AnimatePresence>
          {isTableOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100/50">
                <h3 className="text-xl font-bold text-gray-800">Rincian Transaksi Operasional</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-sm text-gray-500">
                      <th className="py-4 px-6 font-semibold">Tanggal</th>
                      <th className="py-4 px-6 font-semibold">Jenis</th>
                      <th className="py-4 px-6 font-semibold">Kategori Layanan / Pengeluaran</th>
                      <th className="py-4 px-6 font-semibold text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatTransaksi.length === 0 && !isLoading && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">Belum ada data transaksi.</td>
                      </tr>
                    )}
                    {riwayatTransaksi.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100/50 hover:bg-white/80 transition-colors">
                        <td className="py-4 px-6 text-gray-600">{new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.jenis === 'Pendapatan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.jenis}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700 font-medium">{item.kategori}</td>
                        <td className={`py-4 px-6 text-right font-bold ${item.jenis === 'Pendapatan' ? 'text-green-600' : 'text-red-500'}`}>
                          {item.jenis === 'Pendapatan' ? '+' : '-'}{formatRupiah(item.nominal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </main>
    </div>
  );
}