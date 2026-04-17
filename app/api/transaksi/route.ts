import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  const connection = await pool.getConnection();
  try {
    const { id_stok, jenis_pergerakan, jumlah, keterangan } = await request.json();
    const tanggal = new Date().toISOString().slice(0, 10);

    await connection.beginTransaction();

    // 1. Masukkan ke Riwayat
    await connection.query(
      'INSERT INTO riwayat_stok (id_stok, tanggal, jenis_pergerakan, jumlah, keterangan) VALUES (?, ?, ?, ?, ?)',
      [id_stok, tanggal, jenis_pergerakan, jumlah, keterangan]
    );

    // 2. Update Stok Sekarang
    const operator = jenis_pergerakan === 'Masuk' ? '+' : '-';
    await connection.query(
      `UPDATE stok_barang SET stok_sekarang = stok_sekarang ${operator} ? WHERE id_stok = ?`,
      [jumlah, id_stok]
    );

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await connection.rollback();
    return NextResponse.json({ success: false, error: 'Transaksi Gagal' }, { status: 500 });
  } finally {
    connection.release();
  }
}