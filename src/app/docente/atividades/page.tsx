import type { Metadata } from 'next';
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
      <AdminActivities initialActivities={activities} />
    </main>
  );
}