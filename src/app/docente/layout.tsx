import { redirect } from 'next/navigation';
import { db } from '@/prisma/db';
import { getServerSession } from '@/lib/session';
import { DocenteLogoutButton } from '@/components/DocenteLogoutButton';

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
  const session = await getServerSession();
  const email = session?.user?.email?.trim().toLowerCase() ?? '';

  if (!session || !email) {
    redirect('/docente/login');
  }

  const authorized = await isAuthorizedDocente(email);
  if (!authorized) {
    redirect('/docente/login');
  }

  const displayName =
    typeof session.user?.name === 'string' && session.user.name.trim().length > 0
      ? session.user.name.trim()
      : email;

  return (
    <div>
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 16,
          paddingBottom: 8,
          gap: 12,
        }}
      >
        <span className="hint" style={{ fontSize: 13 }}>
          Logado como <strong>{displayName}</strong>
        </span>
        <DocenteLogoutButton />
      </div>
      {children}
    </div>
  );
}