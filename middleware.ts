import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil status login dari cookie
  const isLoggedIn = request.cookies.get('isLoggedIn');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // 1. Jika belum login dan mencoba buka halaman dashboard (/)
  // Arahkan paksa ke halaman login
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Jika sudah login dan mencoba buka halaman login
  // Arahkan balik ke dashboard agar tidak login dua kali
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Tentukan halaman mana saja yang perlu dijaga oleh middleware ini
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};