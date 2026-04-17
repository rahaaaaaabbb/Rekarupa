import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Hanya mengambil data master barang
    const [rows] = await pool.query('SELECT * FROM stok_barang ORDER BY nama_barang ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data barang' }, { status: 500 });
  }
}