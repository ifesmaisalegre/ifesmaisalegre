import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAMES = [
  'better-auth.session_token',
  '__Secure-better-auth.session_token',
  'better-auth.session_data',
  '__Secure-better-auth.session_data',
];

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => {
    const val = request.cookies.get(name)?.value;
    return typeof val === 'string' && val.trim().length > 0;
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const isLoginRoute = pathname === '/docente/login' || pathname.startsWith('/docente/login/');

  if (isLoginRoute) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!hasSessionCookie(request)) {
    const loginUrl = new URL('/docente/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/docente/:path*'],
};