import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { ActivitiesGrid } from '@/components/ActivitiesGrid';
import { ACTIVITIES } from '@/data/activities';

export const metadata: Metadata = { title: 'Atividades' };

export default function AtividadesPage() {
  return (
    <main>
      <Hero title="Todas as atividades" subtitle="Conheça as atividades ofertadas pelo campus!" />
      <div className="container" style={{ padding: '40px 24px 56px' }}>
        <ActivitiesGrid activities={ACTIVITIES.filter((a) => a.status !== 'Inativa')} />
      </div>
    </main>
  );
}
