import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { DocentePanel } from '@/components/DocentePanel';

export const metadata: Metadata = { title: 'Área Docente' };

// TODO(back): exigir login aqui (e em /docente/atividades e /docente/monitorias).
// Sugestão: middleware.ts do Next.js + Better Auth, liberando apenas docentes autenticados.
export default function DocentePage() {
  return (
    <main>
      <Hero
        eyebrow="Área Docente"
        title="Painel de controle"
        subtitle="Publique avisos, avalie as fotos enviadas para a galeria e acompanhe as inscrições nas atividades do campus."
      />
      <DocentePanel />
    </main>
  );
}
