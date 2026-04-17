import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM pengeluaran ORDER BY tanggal ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data pengeluaran' }, { status: 500 });
  }
}