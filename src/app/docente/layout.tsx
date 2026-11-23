import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DocenteLogoutButton } from '@/components/DocenteLogoutButton';

export default async function DocenteLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email?.trim().toLowerCase();
  if (!session || !email) {
    redirect('/docente/login');
  }

  const docente = await prisma.docente.findFirst({
    where: {
      email: { equals: email, mode: 'insensitive' },
      active: true,
    },
  });

  if (!docente) {
    redirect('/docente/login');
  }

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
          Logado como <strong>{docente.name ?? session.user.name ?? email}</strong>
        </span>
        <DocenteLogoutButton />
      </div>
      {children}
    </div>
  );
}