import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { AdminActivities } from '@/components/AdminActivities';
import { getActivitiesFromDb } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Gerenciar atividades' };

export default async function AdminAtividadesPage() {
  const activities = await getActivitiesFromDb();

  return (
    <main>
      <Hero
        eyebrow="Área Docente"
        title="Gerenciar atividades"
        subtitle="Cadastre novas atividades e mantenha atualizadas as informações das que já existem."
      />

      <div
        className="container"
        style={{
          padding: '24px 16px 0',
          maxWidth: 1120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Link href="/docente/monitorias" className="btn">
          Gerenciar monitorias
        </Link>
      </div>

      <AdminActivities initialActivities={activities} />
    </main>
  );
}