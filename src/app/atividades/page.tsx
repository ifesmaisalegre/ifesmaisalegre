import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { ActivityCard, type ActivityCardData } from '@/components/ActivityCard';
import { getActivitiesFromDb } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Todas as atividades',
  description: 'Conheça as atividades ofertadas pelo campus!',
};

export default async function AtividadesPage() {
  const activities = (await getActivitiesFromDb()) as ActivityCardData[];

  return (
    <main>
      <Hero
        title="Todas as atividades"
        subtitle="Conheça as atividades ofertadas pelo campus!"
      />

      <div
        className="container"
        style={{
          padding: '36px 16px 64px',
          maxWidth: 1120,
        }}
      >
        {activities.length === 0 ? (
          <p className="hint">Nenhuma atividade cadastrada no momento.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 18,
            }}
          >
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}