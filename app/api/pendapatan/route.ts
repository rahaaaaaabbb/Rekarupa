import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Mengambil data dari database
    const [rows] = await pool.query('SELECT * FROM pendapatan ORDER BY tanggal ASC');
    
    // Mengembalikan data dalam format JSON
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data pendapatan' }, { status: 500 });
  }
}