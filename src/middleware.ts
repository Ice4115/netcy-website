import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect every page under /netcy-secure-access/dashboard
  if (pathname.startsWith('/netcy-secure-access/dashboard')) {
    const adminCookie = req.cookies.get('netcy_admin_access');

    if (!adminCookie || adminCookie.value !== 'granted') {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/netcy-secure-access';
      loginUrl.searchParams.set('reason', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/netcy-secure-access/dashboard/:path*'],
};
