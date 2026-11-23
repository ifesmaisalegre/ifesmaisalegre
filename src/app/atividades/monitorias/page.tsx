import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { getActivityBySlugFromDb, getMonitoriasFromDb } from '@/lib/queries';
import { fmtDaysShort, fmtRange } from '@/lib/format';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Monitorias' };

const YEARS = [
  { year: '1' as const, label: 'Horários 1º ano', bg: 'var(--cream)', chip: 'chip-green' },
  { year: '2' as const, label: 'Horários 2º ano', bg: 'var(--lilac-soft)', chip: 'chip-blue' },
  { year: '3' as const, label: 'Horários 3º ano', bg: 'var(--blue-soft)', chip: 'chip-brown' },
];

export default async function MonitoriasPage() {
  const [activity, monitorias] = await Promise.all([
    getActivityBySlugFromDb('monitorias'),
    getMonitoriasFromDb(),
  ]);

  return (
    <main>
      <Hero title="Monitorias">
        <Link href="/atividades" className="back-link">← Todas as atividades</Link>
        <div><span className="chip" style={{ background: '#fff', color: 'var(--blue-dark)', padding: '2px 12px' }}>Estudos</span></div>
      </Hero>

      <section className="container" style={{ padding: '36px 24px 28px' }}>
        <p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.6, color: '#2b3630', marginBottom: 14 }}>
          {activity?.description ?? 'Acompanhe os horários de monitoria ofertados no campus.'}
        </p>
        <span className="chip chip-green" style={{ fontSize: 14, padding: '6px 14px' }}>Participação livre: não precisa de inscrição prévia</span>
      </section>

      {YEARS.map((y) => (
        <section key={y.year} aria-labelledby={`ano${y.year}`} style={{ background: y.bg }}>
          <div className="container" style={{ padding: '48px 24px 56px' }}>
            <h2 id={`ano${y.year}`} style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', color: 'var(--blue-dark)', marginBottom: 24 }}>
              {y.label}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {monitorias.filter((m) => m.year === y.year).map((m) => (
                <article key={m.id} style={{ background: '#fff', borderRadius: 16, padding: 22 }}>
                  <span className={`chip ${y.chip}`} style={{ marginBottom: 10 }}>{fmtDaysShort(m.days)}</span>
                  <h3 style={{ fontSize: 19, lineHeight: 1.3, fontWeight: 600, margin: '10px 0 8px' }}>{m.title}</h3>
                  {m.exclusive && <p style={{ marginBottom: 8 }}><span className="chip chip-amber">{m.exclusive}</span></p>}
                  <p style={{ fontSize: 14, color: '#2b3630' }}>{fmtRange(m.start, m.end)}</p>
                  <p style={{ fontSize: 14, color: '#2b3630' }}>{m.place}</p>
                  <p style={{ fontSize: 14, color: '#2b3630' }}>Monitor(a): {m.monitor}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}