import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { AvisosList } from '@/components/AvisosList';
import { getActiveAvisosFromDb } from '@/lib/queries';
import { todayISO } from '@/lib/format';

export const metadata: Metadata = { title: 'Avisos' };
export const dynamic = 'force-dynamic';

export default async function AvisosPage() {
  const avisos = await getActiveAvisosFromDb(todayISO());
  return (
    <main>
      <Hero title="Avisos" subtitle="Comunicados dos docentes para os estudantes do campus." />
      <div className="container" style={{ maxWidth: 1000, padding: '36px 24px 56px' }}>
        <AvisosList avisos={avisos} />
      </div>
    </main>
  );
}