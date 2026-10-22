"use client";
import { useAppContext } from '@/context/AppContext';

export default function StokPage() {
  const { inventory } = useAppContext();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Manajemen Inventaris</h2>
        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">Total: {inventory.length} Item</span>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {/* TAMBAHAN: Kolom Header Foto */}
            <th className="p-4 font-semibold text-slate-600">Foto</th>
            <th className="p-4 font-semibold text-slate-600">ID</th>
            <th className="p-4 font-semibold text-slate-600">Nama Barang</th>
            <th className="p-4 font-semibold text-slate-600">Kategori</th>
            <th className="p-4 font-semibold text-slate-600">Harga Dasar</th>
            <th className="p-4 font-semibold text-slate-600">Kuantitas Memori</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              
              {/*Sel Data untuk Render Foto */}
              <td className="p-4">
                {item.foto ? (
                    <img 
                      src={`http://localhost:5000/uploads/${item.foto}`} 
                      alt={item.nama} 
                      className="w-12 h-12 object-cover rounded-lg shadow-sm"
                    />
                ) : (
                    <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs">No Pic</div>
                )}
              </td>

              <td className="p-4 text-slate-500">#{item.id}</td>
              <td className="p-4 font-bold text-slate-800">{item.nama}</td>
              <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-600">{item.jenis}</span></td>
              <td className="p-4 text-slate-600">Rp {item.harga.toLocaleString('id-ID')}</td>
              <td className="p-4">
                {item.stok <= 5 ? (
                  <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-sm animate-pulse border border-red-200">
                    Sisa {item.stok} - Peringatan!
                  </span>
                ) : (
                  <span className="text-slate-800 font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">{item.stok} Unit</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
