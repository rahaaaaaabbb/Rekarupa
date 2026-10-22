// src/app/dashboard/transaksi/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';

export default function TransaksiPage() {
  // TAMBAHAN: username dipanggil dari context
  const { role, inventory, refreshData, username } = useAppContext();
  
  const [toast, setToast] = useState<{show: boolean, title: string, message: string, type: 'success' | 'error' | null}>({
    show: false, title: '', message: '', type: null
  });

  const triggerToast = (title: string, message: string, type: 'success' | 'error') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [qtyKeluar, setQtyKeluar] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [pembayaran, setPembayaran] = useState<number | ''>('');

  const [modeRestock, setModeRestock] = useState<'lama' | 'baru'>('lama');
  const [restockId, setRestockId] = useState<number>(0);
  const [restockQty, setRestockQty] = useState(1);

  const [masukNama, setMasukNama] = useState('');
  const [masukJenis, setMasukJenis] = useState('Material');
  const [masukHarga, setMasukHarga] = useState('');
  const [masukQty, setMasukQty] = useState('');
  const [masukFoto, setMasukFoto] = useState<File | null>(null);

  useEffect(() => {
    if (inventory.length > 0) {
      if (selectedItem === 0) setSelectedItem(inventory[0].id);
      if (restockId === 0) setRestockId(inventory[0].id);
    }
  }, [inventory, selectedItem, restockId]);

  const filteredInventory = inventory.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedInventoryItem = inventory.find(item => item.id === selectedItem);
  const totalHarga = selectedInventoryItem ? selectedInventoryItem.harga * qtyKeluar : 0;
  const uangDibayar = typeof pembayaran === 'number' ? pembayaran : 0;
  const kembalian = uangDibayar - totalHarga;

  // 1. KASIR (BARANG KELUAR)
  const handleTransaksiKeluar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem === 0) return triggerToast("Peringatan", "Pilih item terlebih dahulu!", "error");
    if (uangDibayar < totalHarga) return triggerToast("Transaksi Ditolak", "Nominal pembayaran kurang dari Total Harga!", "error");

    try {
      const response = await axios.post('http://localhost:5000/api/operasional/transaksi-keluar', {
        id_barang: selectedItem, 
        qty: qtyKeluar,
        kasir: username // <-- Mengirim nama kasir ke backend
      });
      if (response.data.status === 'success') {
        triggerToast("Transaksi Berhasil!", `Total: Rp${totalHarga.toLocaleString('id-ID')} | Kembalian: Rp${kembalian.toLocaleString('id-ID')}`, "success");
        setQtyKeluar(1); setPembayaran(''); setSearchQuery(''); refreshData(); 
      }
    } catch (error: any) {
        triggerToast("Sistem Menolak", error.response?.data?.message || "Terjadi kesalahan server", "error");
    }
  };

  // 2. RESTOCK BARANG LAMA
  const handleRestockLama = async (e: React.FormEvent) => {
    e.preventDefault();
    if (restockId === 0) return triggerToast("Peringatan", "Pilih item terlebih dahulu!", "error");

    try {
      const response = await axios.post('http://localhost:5000/api/operasional/restock-lama', {
        id_barang: restockId, 
        qty: restockQty,
        kasir: username // <-- Mengirim nama kasir ke backend
      });
      if (response.data.status === 'success') {
        triggerToast("Restock Berhasil", "Stok barang lama berhasil ditambahkan ke memori!", "success");
        setRestockQty(1); refreshData(); 
      }
    } catch (error: any) {
        triggerToast("Restock Gagal", error.response?.data?.message || "Gagal memproses Restock.", "error");
    }
  };

  // 3. BUAT ITEM BARU
  const handleBarangMasukBaru = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masukNama || !masukHarga || !masukQty) return triggerToast("Validasi Gagal", "Harap isi semua parameter data!", "error");

    const formData = new FormData();
    formData.append('nama', masukNama); 
    formData.append('jenis', masukJenis);
    formData.append('qty', masukQty); 
    formData.append('harga', masukHarga);
    formData.append('kasir', username); // <-- Mengirim nama kasir ke backend
    if (masukFoto) formData.append('foto', masukFoto);

    try {
      const response = await axios.post('http://localhost:5000/api/operasional/transaksi-masuk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.status === 'success') {
        triggerToast("Item Terdaftar", "Data inventaris baru beserta foto berhasil disimpan!", "success");
        setMasukNama(''); setMasukHarga(''); setMasukQty(''); setMasukFoto(null); refreshData(); 
      }
    } catch (error: any) {
        triggerToast("Gagal Mendaftar Item", error.response?.data?.message || "Gagal membuat item baru.", "error");
    }
  };

  return (
    <div className="relative h-full">
      {/* Toast Notifikasi */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        {toast.type === 'success' ? (
          <div className="bg-white border-l-4 border-emerald-500 p-4 rounded-xl shadow-xl shadow-emerald-500/10 flex items-start space-x-3 min-w-[300px] border border-y-slate-100 border-r-slate-100">
            <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className="flex-grow">
              <h4 className="font-bold text-slate-800 text-sm">{toast.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{toast.message}</p>
            </div>
            <button onClick={() => setToast(prev => ({...prev, show: false}))} className="text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <div className="bg-white border-l-4 border-rose-500 p-4 rounded-xl shadow-xl shadow-rose-500/10 flex items-start space-x-3 min-w-[300px] border border-y-slate-100 border-r-slate-100">
            <svg className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className="flex-grow">
              <h4 className="font-bold text-slate-800 text-sm">{toast.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{toast.message}</p>
            </div>
            <button onClick={() => setToast(prev => ({...prev, show: false}))} className="text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 ${role === 'owner' ? 'xl:grid-cols-2' : ''} gap-8 animate-fade-in`}>
        {/* BLOK KASIR */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Proses Barang Keluar (Kasir)</h2>
          <form onSubmit={handleTransaksiKeluar} className="space-y-6 mt-2 flex-grow flex flex-col">
            <div className="flex-grow flex flex-col">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input type="text" placeholder="Cari nama barang..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all bg-slate-50 focus:bg-white" />
              </div>
              
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 max-h-[300px] overflow-y-auto p-1 pr-2 rounded-xl custom-scrollbar relative">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map(item => (
                    <div key={item.id} onClick={() => setSelectedItem(item.id)} className={`border-2 rounded-xl p-3 cursor-pointer transition-all duration-200 flex flex-col ${selectedItem === item.id ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-100 bg-white hover:border-indigo-300 hover:shadow-sm'}`}>
                      <div className="w-full aspect-square bg-slate-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center border border-slate-100">
                        {item.foto ? <img src={`http://localhost:5000/uploads/${item.foto}`} alt={item.nama} className="w-full h-full object-cover"/> : <span className="text-slate-400 text-xs font-medium">No Pic</span>}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.nama}</h3>
                      <p className="text-indigo-600 text-sm font-extrabold mb-1 mt-auto">Rp{Number(item.harga).toLocaleString('id-ID')}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Stok:</span>
                        <span className={`font-bold ${item.stok <= 5 ? 'text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md' : 'text-slate-700'}`}>{item.stok}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-slate-500"><p>Barang tidak ditemukan.</p></div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Kuantitas</label>
                  <input type="number" min="1" value={qtyKeluar} onChange={(e) => setQtyKeluar(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Pembayaran (Rp)</label>
                  <input type="number" min="0" placeholder="0" value={pembayaran} onChange={(e) => setPembayaran(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold text-indigo-700" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Total Harga</span>
                  <span className="font-extrabold text-xl text-slate-800">Rp {totalHarga.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-500">Kembalian</span>
                  <span className={`font-extrabold text-xl ${kembalian < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>Rp {kembalian.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button type="submit" disabled={uangDibayar < totalHarga} className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-sm ${uangDibayar < totalHarga ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-md'}`}>
                {uangDibayar < totalHarga ? 'Pembayaran Kurang' : 'Eksekusi Penjualan'}
              </button>
            </div>
          </form>
        </div>

        {/* BLOK RESTOCK */}
        {role === 'owner' && (
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 border-dashed h-fit">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-slate-800">Barang Masuk</h2>
              <div className="flex bg-slate-200/70 p-1 rounded-xl w-full sm:w-auto">
                <button type="button" onClick={() => setModeRestock('lama')} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all ${modeRestock === 'lama' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>+ Stok Lama</button>
                <button type="button" onClick={() => setModeRestock('baru')} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all ${modeRestock === 'baru' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>Buat Item Baru</button>
              </div>
            </div>

            {modeRestock === 'lama' ? (
              <form onSubmit={handleRestockLama} className="space-y-4 animate-fade-in">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-4">
                  <p className="text-indigo-800 text-sm font-medium">Gunakan menu ini untuk menambah kuantitas barang yang sudah terdaftar di sistem.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Pilih Barang dari Inventaris</label>
                  <select value={restockId} onChange={(e) => setRestockId(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-3 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>{item.nama} (Sisa saat ini: {item.stok})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Kuantitas Tambahan Masuk</label>
                  <input type="number" min="1" value={restockQty} onChange={(e) => setRestockQty(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 mt-6 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200">
                  Eksekusi Penambahan Stok
                </button>
              </form>
            ) : (
              <form onSubmit={handleBarangMasukBaru} className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Nama Item Baru</label>
                  <input type="text" value={masukNama} onChange={(e) => setMasukNama(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Kategori</label>
                    <select value={masukJenis} onChange={(e) => setMasukJenis(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="Material">Material</option>
                      <option value="Layanan">Layanan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Kuantitas Awal</label>
                    <input type="number" min="1" value={masukQty} onChange={(e) => setMasukQty(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Harga Satuan (Rp)</label>
                  <input type="number" min="1" value={masukHarga} onChange={(e) => setMasukHarga(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Upload Foto Barang</label>
                  <input type="file" accept="image/*" onChange={(e) => setMasukFoto(e.target.files ? e.target.files[0] : null)} className="w-full border border-slate-300 rounded-xl p-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 mt-4 rounded-xl hover:bg-emerald-700 shadow-sm shadow-emerald-200">
                  Buat Parameter Item Baru
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}