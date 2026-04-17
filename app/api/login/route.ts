import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers'; // Tambahkan ini

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const [rows]: any = await pool.query(
      'SELECT id_user, username, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
  const user = rows[0];
  const cookieStore = await cookies();
  
  // Simpan status login
  cookieStore.set('isLoggedIn', 'true', { path: '/' });
  // Simpan role (admin/pemilik) untuk pengecekan di UI
  cookieStore.set('userRole', user.role, { path: '/' });

  return NextResponse.json({ success: true, user });
}
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}