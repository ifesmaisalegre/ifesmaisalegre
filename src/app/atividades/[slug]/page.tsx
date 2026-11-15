import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/Hero';
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder';
import { RegistrationForm } from '@/components/RegistrationForm';
import { ACTIVITIES, getActivity } from '@/data/activities';
import { fmtDays, fmtRange } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };

// "monitorias" tem página própria (atividades/monitorias).
export function generateStaticParams() {
  return ACTIVITIES.filter((a) => a.slug !== 'monitorias').map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getActivity(slug);
  return { title: a?.name ?? 'Atividade' };
}

export default async function AtividadePage({ params }: Props) {
  const { slug } = await params;
  const a = getActivity(slug);
  if (!a || a.slug === 'monitorias') notFound();

  const needs = a.signup !== 'nao';
  const info = [
    { label: 'Dia(s)', value: fmtDays(a.days) },
    { label: 'Horário', value: fmtRange(a.start, a.end) },
    { label: 'Local', value: a.place },
    { label: 'Docente responsável', value: a.responsible || 'A definir' },
    ...(needs ? [{ label: 'Vagas', value: a.spots || 'A definir' }] : []),
    { label: 'Inscrição prévia', value: needs ? 'Obrigatória' : 'Não é necessária' },
    { label: 'Quem pode participar', value: a.audience },
  ];
  const others = ACTIVITIES.filter((o) => o.slug !== a.slug && o.status !== 'Inativa');
  const inscriptionsOpen = a.status === 'Inscrições abertas';

  return (
    <main>
      <Hero title={a.name}>
        <Link href="/atividades" className="back-link">← Todas as atividades</Link>
        <div><span className="chip" style={{ background: '#fff', color: 'var(--blue-dark)', padding: '2px 12px' }}>{a.category}</span></div>
      </Hero>

      <div className="container" style={{ padding: '40px 24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <section className="card" style={{ borderRadius: 20, padding: 32 }}>
          <h2 style={{ fontSize: 30, lineHeight: 1.2, fontWeight: 700, marginBottom: 12 }}>Sobre a atividade</h2>
          <p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.6, color: '#2b3630' }}>{a.description}</p>
        </section>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
          <section className="card" style={{ flex: '1.2 1 420px', minWidth: 0 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 14 }}>Informações</h2>
            <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {info.map((i) => (
                <div key={i.label} style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', paddingBottom: 12, borderBottom: '1px solid #eef3f0' }}>
                  <dt style={{ flex: '0 0 190px', fontSize: 14, fontWeight: 600, color: 'var(--ink-2)' }}>{i.label}</dt>
                  <dd style={{ flex: '1 1 200px', margin: 0 }}>{i.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card" style={{ flex: '1 1 320px', minWidth: 0, background: 'var(--cream)', borderColor: '#ECEBD0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!needs ? (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 600 }}>Sem inscrição prévia</h2>
                <p style={{ color: '#2b3630' }}>Não é preciso se inscrever para participar de {a.name}. Basta comparecer no dia e no horário indicados.</p>
                <p className="status status-ok" style={{ fontWeight: 600 }}>Participação livre</p>
              </>
            ) : inscriptionsOpen ? (
              <RegistrationForm activityName={a.name} />
            ) : (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 600 }}>Inscrições encerradas</h2>
                <p style={{ color: '#2b3630' }}>No momento esta atividade não está recebendo inscrições.</p>
              </>
            )}
          </section>
        </div>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 14 }}>Outras atividades</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {others.map((o) => (
              <Link key={o.slug} href={`/atividades/${o.slug}`} className="chip chip-blue" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 18px', fontSize: 15, textDecoration: 'none' }}>
                {o.name}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-cream" style={{ borderTop: '1px solid #ECEBD0' }}>
        <div className="container" style={{ padding: '40px 24px 56px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Fotos da atividade</h2>
          {/* TODO(front/back): mostrar as fotos reais da atividade (campo photos) em vez dos espaços reservados. */}
          <div className="cards" style={{ gap: 16 }}>
            {[a.tone, '#F6E8E2', '#E6E9F8'].map((c, i) => (
              <figure key={i} style={{ flex: '1 1 260px', maxWidth: 380, margin: 0, background: '#fff', border: '1px solid #ECEBD0', borderRadius: 16, padding: 10 }}>
                <PhotoPlaceholder tone={c} />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
