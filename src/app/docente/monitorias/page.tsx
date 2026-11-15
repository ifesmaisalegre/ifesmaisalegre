import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { AdminMonitorias } from '@/components/AdminMonitorias';

export const metadata: Metadata = { title: 'Gerenciar monitorias' };

// TODO(back): exigir login (somente docentes).
export default function AdminMonitoriasPage() {
  return (
    <main>
      <Hero eyebrow="Área Docente" title="Gerenciar monitorias" subtitle="Cadastre e atualize os horários de monitoria de cada disciplina." />
      <AdminMonitorias />
    </main>
  );
}
