import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/prisma/db';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ormPublic = (db as unknown as { orm: { public: Record<string, any> } }).orm.public;

async function isAuthorizedDocente(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  const docentes = await ormPublic.Docente.all();
  const list = Array.isArray(docentes) ? docentes : [];
  if (list.length === 0) return false;

  return list.some(
    (d: Record<string, unknown>) =>
      String(d.email ?? '').trim().toLowerCase() === normalized && Boolean(d.active ?? true)
  );
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const email = session?.user?.email?.trim().toLowerCase() ?? '';
    if (!session || !session.user || !email) {
      return NextResponse.redirect(new URL('/docente/login', origin));
    }

    const authorized = await isAuthorizedDocente(email);
    if (!authorized) {
      return NextResponse.redirect(new URL('/docente/login?acesso=nao_autorizado', origin));
    }

    return NextResponse.redirect(new URL('/docente', origin));
  } catch {
    return NextResponse.redirect(new URL('/docente/login', origin));
  }
}