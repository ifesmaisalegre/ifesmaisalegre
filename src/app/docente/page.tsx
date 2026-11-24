import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { DocentePanel } from '@/components/DocentePanel';
import { DocenteLogoutButton } from '@/components/DocenteLogoutButton';
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
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '20px 16px 0',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link href="/docente/atividades" className="btn btn-ghost" style={{ fontSize: 13 }}>
            Atividades e monitorias
          </Link>
          <Link href="/docente/contato" className="btn btn-ghost" style={{ fontSize: 13 }}>
            Gerenciar contatos
          </Link>
          <Link href="/docente/acessos" className="btn btn-ghost" style={{ fontSize: 13 }}>
            Controle de acessos
          </Link>
        </div>

        <DocenteLogoutButton />
      </div>
      <DocentePanel
        initialAvisos={avisos}
        initialActivities={activities}
        initialPhotos={photos}
        initialInscricoes={inscricoes}
      />
    </main>
  );
}