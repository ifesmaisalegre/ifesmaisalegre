import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { AvisosList } from '@/components/AvisosList';
import { AVISOS, visibleAvisos } from '@/data/avisos';
import { todayISO } from '@/lib/format';

export const metadata: Metadata = { title: 'Avisos' };
export const dynamic = 'force-dynamic'; // esconde avisos vencidos a cada acesso

export default function AvisosPage() {
  const avisos = visibleAvisos(AVISOS, todayISO());
  return (
    <main>
      <Hero title="Avisos" subtitle="Comunicados dos docentes para os estudantes do campus." />
      <div className="container" style={{ maxWidth: 1000, padding: '36px 24px 56px' }}>
        <AvisosList avisos={avisos} />
      </div>
    </main>
  );
}
