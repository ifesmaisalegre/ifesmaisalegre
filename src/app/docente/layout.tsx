import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '@/prisma/db';
import { getServerSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ormPublic = (db as unknown as { orm: { public: Record<string, any> } }).orm.public;

async function isAuthorizedDocente(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  const docentes = await ormPublic.Docente.all();
  const list = Array.isArray(docentes) ? docentes : [];
  if (list.length === 0) return true;

  return list.some(
    (d: Record<string, unknown>) =>
      String(d.email ?? '').trim().toLowerCase() === normalized && Boolean(d.active ?? true)
  );
}

export default async function DocenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') ?? '';

  if (pathname === '/docente/login' || pathname.startsWith('/docente/login/')) {
    return <>{children}</>;
  }

  const session = await getServerSession();
  const userEmail = session?.user?.email?.trim().toLowerCase() ?? '';
  if (!session?.user || !userEmail) {
    redirect('/docente/login');
  }

  const authorized = await isAuthorizedDocente(userEmail);
  if (!authorized) {
    redirect('/docente/login');
  }

  return <>{children}</>;
}