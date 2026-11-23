import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { AdminMonitorias } from '@/components/AdminMonitorias';
import { getMonitoriasFromDb } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Gerenciar monitorias' };

export default async function AdminMonitoriasPage() {
  const monitorias = await getMonitoriasFromDb();

  return (
    <main>
      <Hero
        eyebrow="Área Docente"
        title="Gerenciar monitorias"
        subtitle="Cadastre e atualize os horários de monitoria de cada disciplina."
      />
      <AdminMonitorias initialMonitorias={monitorias} />
    </main>
  );
}