import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerSession } from '@/lib/session';

export default async function DocenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') ?? '';

  if (pathname.endsWith('/docente/login')) {
    return <>{children}</>;
  }

  const session = await getServerSession();
  if (!session?.user) {
    redirect('/docente/login');
  }

  return <>{children}</>;
}