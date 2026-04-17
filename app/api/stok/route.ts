import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Menggabungkan tabel riwayat_stok dan stok_barang
    const query = `
      SELECT 
        r.id_riwayat, 
        r.tanggal, 
        r.jenis_pergerakan,     
        r.jumlah, 
        r.keterangan, 
        s.nama_barang, 
        s.satuan, 
        s.kategori 
      FROM riwayat_stok r
      JOIN stok_barang s ON r.id_stok = s.id_stok
      ORDER BY r.tanggal DESC, r.id_riwayat DESC
    `;
    const [rows] = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data stok' }, { status: 500 });
  }
}