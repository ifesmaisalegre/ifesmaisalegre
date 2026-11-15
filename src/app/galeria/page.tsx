import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { GalleryUpload } from '@/components/GalleryUpload';
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder';
import { GALLERY_PHOTOS } from '@/data/docente-demo';

export const metadata: Metadata = { title: 'Galeria' };

export default function GaleriaPage() {
  // Só fotos aprovadas por um docente aparecem aqui. TODO(back): buscar do banco.
  const approved = GALLERY_PHOTOS.filter((p) => p.status === 'approved');
  return (
    <main>
      <Hero
        tone="green"
        title="Galeria de fotos"
        subtitle="Fique por dentro das novidades e descubra todas as atividades ofertadas pelo campus. Venha fazer parte da história do IFES · Campus de Alegre!"
      />
      <div className="container" style={{ padding: '36px 24px 56px' }}>
        <GalleryUpload />
        <div className="cards" style={{ gap: 16 }}>
          {approved.map((p) => (
            <figure key={p.id} style={{ flex: '1 1 240px', maxWidth: 380, margin: 0, background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 10 }}>
              <PhotoPlaceholder tone={p.tone} />
            </figure>
          ))}
        </div>
        {approved.length === 0 && <p className="hint">Ainda não há fotos na galeria.</p>}
      </div>
    </main>
  );
}
