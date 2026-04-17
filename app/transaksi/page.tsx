"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, ShoppingCart, LogOut, Printer, PackagePlus, PackageMinus, Loader2, AlertCircle, CheckCircle2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Barang {
  id_stok: number;
  nama_barang: string;
  satuan: string;
  stok_sekarang: number;
  kategori: string;
}

export default function TransaksiPage() {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State Pencarian (Live Search)
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [selectedBarangId, setSelectedBarangId] = useState<number | null>(null);
  const [jenis, setJenis] = useState("Keluar");
  const [jumlah, setJumlah] = useState(0);
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/barang");
      const data = await res.json();
      setBarangList(data);
      const userRole = document.cookie.split('; ').find(row => row.startsWith('userRole='))?.split('=')[1];
      setRole(userRole || "admin");
    };
    fetchData();
  }, []);

  // Logika Live Search: Menyaring barang berdasarkan input pencarian
  const filteredBarangList = barangList.filter((barang) =>
    barang.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
    barang.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validasi Stok
  const selectedBarang = barangList.find(b => b.id_stok === selectedBarangId);
  const isInvalid = jenis === "Keluar" && selectedBarang && jumlah > selectedBarang.stok_sekarang;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid || !selectedBarangId) return;

    setLoading(true);
    const res = await fetch("/api/transaksi", {
      method: "POST",
      body: JSON.stringify({ id_stok: selectedBarangId, jenis_pergerakan: jenis, jumlah, keterangan }),
    });
    if (res.ok) {
      alert("Transaksi Berhasil Dicatat!");
      window.location.reload();
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/logout');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white overflow-hidden text-gray-800">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white/40 backdrop-blur-xl border-r border-white/60 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200"><Printer size={24} /></div>
            <h2 className="text-xl font-bold">REKA RUPA</h2>
          </div>
          <nav className="space-y-2">
            <Link href="/" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-white/40 rounded-xl transition-all"><LayoutDashboard size={20} /> Overview</Link>
            <Link href="/laporan" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-white/60 rounded-xl transition-all"><FileText size={20} /> Laporan Detail</Link>
            <Link href="/transaksi" className="flex items-center gap-3 p-3 bg-white/80 rounded-xl text-blue-700 font-semibold shadow-sm border border-white/50"><ShoppingCart size={20} /> Transaksi</Link>
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
          <LogOut size={20} /> Keluar
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Input Transaksi Baru</h1>
          <p className="text-gray-500">Pilih barang dan catat pergerakan stoknya.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: PILIH BARANG (BENTO GRID + LIVE SEARCH) */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                Pilih Barang dari Stok
              </h3>
              
              {/* Kolom Pencarian Live Search */}
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama atau kategori barang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
                />
              </div>
            </div>

            {/* Jika barang tidak ditemukan */}
            {filteredBarangList.length === 0 ? (
              <div className="p-8 text-center bg-white/40 border border-white/50 rounded-3xl">
                <p className="text-gray-500">Barang dengan kata kunci "{searchQuery}" tidak ditemukan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredBarangList.map((barang) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      key={barang.id_stok}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBarangId(barang.id_stok)}
                      className={`cursor-pointer p-5 rounded-3xl border-2 transition-all backdrop-blur-md ${
                        selectedBarangId === barang.id_stok 
                        ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-100" 
                        : "border-white bg-white/60 hover:border-blue-200 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800">{barang.nama_barang}</h4>
                        {selectedBarangId === barang.id_stok && <CheckCircle2 className="text-blue-600" size={20} />}
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{barang.kategori}</p>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tersedia</p>
                          <p className={`text-xl font-black ${barang.stok_sekarang < 5 ? "text-red-500" : "text-gray-800"}`}>
                            {barang.stok_sekarang} <span className="text-sm font-normal">{barang.satuan}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* STEP 2: DETAIL TRANSAKSI */}
          <AnimatePresence>
            {selectedBarangId && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/60 backdrop-blur-lg border border-white/50 p-8 rounded-3xl shadow-lg space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
                    Transaksi
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setJenis("Keluar")} className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${jenis === "Keluar" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-white"}`}>
                      <PackageMinus size={20} /> Keluar
                    </button>
                    {role === "pemilik" ? (
                      <button type="button" onClick={() => setJenis("Masuk")} className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${jenis === "Masuk" ? "border-green-600 bg-green-50 text-green-700" : "border-gray-100 bg-white"}`}>
                        <PackagePlus size={20} /> Masuk
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 cursor-not-allowed">Masuk (Owner)</div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Jumlah Unit</label>
                      <input type="number" required min="1" value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} className={`w-full p-4 bg-white/80 border rounded-2xl outline-none focus:ring-2 ${isInvalid ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Keterangan</label>
                      <input type="text" placeholder="Misal: Order Jilid" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="w-full p-4 bg-white/80 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  {isInvalid && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100">
                      <AlertCircle size={20} />
                      <p className="text-sm font-bold">Peringatan: Stok {selectedBarang?.nama_barang} tidak mencukupi!</p>
                    </motion.div>
                  )}

                  <button type="submit" disabled={loading || isInvalid} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                    {loading ? <Loader2 className="animate-spin" /> : "Proses Transaksi Sekarang"}
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </form>
      </main>
    </div>
  );
}