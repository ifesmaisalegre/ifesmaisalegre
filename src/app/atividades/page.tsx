import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { ActivitiesGrid } from '@/components/ActivitiesGrid';
import { getActivitiesFromDb } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Atividades' };

export default async function AtividadesPage() {
  const activities = await getActivitiesFromDb();

  return (
    <main>
      <Hero title="Todas as atividades" subtitle="Conheça as atividades ofertadas pelo campus!" />
      <div className="container" style={{ padding: '40px 24px 56px' }}>
        <ActivitiesGrid activities={activities} />
      </div>
    </main>
  );
}