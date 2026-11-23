import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { DocentePanel } from '@/components/DocentePanel';
import {
  getActivitiesFromDb,
  getAllAvisosForDocenteFromDb,
  getAllPhotosForDocenteFromDb,
  getInscricoesFromDb,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Área Docente' };

export default async function DocentePage() {
  const [avisos, activities, photos, inscricoes] = await Promise.all([
    getAllAvisosForDocenteFromDb(),
    getActivitiesFromDb(),
    getAllPhotosForDocenteFromDb(),
    getInscricoesFromDb(),
  ]);

  return (
    <main>
      <Hero
        eyebrow="Área Docente"
        title="Painel de controle"
        subtitle="Publique avisos, avalie as fotos enviadas para a galeria e acompanhe as inscrições nas atividades do campus."
      />
      <DocentePanel
        initialAvisos={avisos}
        initialActivities={activities}
        initialPhotos={photos}
        initialInscricoes={inscricoes}
      />
    </main>
  );
}