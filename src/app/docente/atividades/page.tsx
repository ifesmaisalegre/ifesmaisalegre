import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { AdminActivities } from '@/components/AdminActivities';

export const metadata: Metadata = { title: 'Gerenciar atividades' };

// TODO(back): exigir login (somente docentes).
export default function AdminAtividadesPage() {
  return (
    <main>
      <Hero eyebrow="Área Docente" title="Gerenciar atividades" subtitle="Cadastre novas atividades e mantenha atualizadas as informações das que já existem." />
      <AdminActivities />
    </main>
  );
}
