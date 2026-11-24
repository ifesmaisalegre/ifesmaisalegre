import Link from 'next/link';
import { Star, Triangle, Logo } from '@/components/Logo';
import { AvisoCard } from '@/components/AvisoCard';
import { getActivitiesFromDb, getActiveAvisosFromDb } from '@/lib/queries';
import { SITE } from '@/lib/site';
import { todayISO } from '@/lib/format';

export const dynamic = 'force-dynamic';

const BENEFITS = [
  { title: 'Mais informação', text: 'Fique por dentro de todas as novidades!', color: '#5F6DB5' },
  { title: 'Mais socialização', text: 'Encontre pessoas com o mesmo gosto que você!', color: '#F9A100' },
  { title: 'Mais conexão', text: 'Comunique-se com outros discentes e docentes!', color: '#0F6B43' },
  { title: 'Você mais alegre', text: 'Transforme sua rotina em algo mais leve e divertido!', color: '#DDA3F0' },
];

const QUOTES = [
  { text: 'Acho que é uma excelente ideia, já que nós não somos informados geralmente sobre os clubes e monitorias de forma eficiente, além de que um site só pra isso seria muito melhor para se informar sobre. Eu particularmente usaria', author: 'Aitor Vride' },
  { text: 'Eu acho q manter os alunos informados é importante, já que graças a nossa carga horária a gente não tem tempo pra ficar olhando isso, e tbm, normalmente, ninguém vem avisar sobre', author: 'Mita, sula' },
  { text: 'Ah! É um trabalho muito interessante. É muito importante pois visa melhorar a interação entre os alunos e os professores e entre os próprio alunos mesmo. Além de divulgar eventos que comumente não são divulgados na escola.', author: 'Purple tato' },
];

export default async function HomePage() {
  const [activeAvisos, allActivities] = await Promise.all([
    getActiveAvisosFromDb(todayISO()),
    getActivitiesFromDb(),
  ]);
  const avisos = activeAvisos.slice(0, 2);
  const featured = allActivities.filter((a) => ['livro', 'volei', 'monitorias'].includes(a.slug));

  return (
    <main>
      {/* Hero */}
      <section className="hero hero-blue">
        <svg className="deco" width="170" height="85" viewBox="0 0 100 50" aria-hidden="true" style={{ left: '3%', bottom: 0 }}><path d="M0 50a50 50 0 0 1 100 0z" fill="#F47B20" /></svg>
        <Triangle width={130} height={130} color="#F9A100" style={{ position: 'absolute', right: '18%', bottom: 0 }} />
        <svg className="deco" width="90" height="150" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ right: '8%', bottom: 0 }}><rect width="100" height="100" fill="#F9A100" /></svg>
        <Star size={100} className="deco" style={{ right: '34%', top: 28 }} />
        <div className="container" style={{ paddingTop: 84, paddingBottom: 120 }}>
          <h1 style={{ maxWidth: 620, fontSize: 'clamp(32px, 6vw, 46px)', lineHeight: 1.1, marginBottom: 18, overflowWrap: 'anywhere' }}>{SITE.tagline}</h1>
          <p style={{ maxWidth: 520, marginBottom: 30 }}>Todas as atividades extracurriculares do Campus de Alegre reunidas em um só lugar.</p>
          <a href="#mapa" className="btn btn-lg btn-orange" style={{ padding: '0 28px' }}>Como chegar</a>
        </div>
      </section>

      {/* Sobre */}
      <section>
        <div className="container section-lg" style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 12 }}>Sobre o IFES+Alegre</h2>
            <p style={{ color: 'var(--ink-2)', marginBottom: 12 }}>Conheça melhor o Ifes+Alegre. Um projeto que vem com o intuito de ajudar os estudantes a encontrarem em um só local todas as atividades extracurriculares do nosso Campus.</p>
            <p style={{ color: 'var(--ink-2)' }}>Se divirta, faça novas amizades, melhore sua saúde mental e fique mais alegre.</p>
            <p style={{ marginTop: 16 }}><Link href="/sobre" className="btn">Saiba mais</Link></p>
          </div>
          <div style={{ flex: '1 1 260px', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
            <div className="tile" style={{ width: '100%', maxWidth: 360, aspectRatio: '4/3', borderRadius: 20, background: '#F6E8E2' }}>
              <Logo size={120} label="Logo IFES+Alegre" />
            </div>
          </div>
        </div>
      </section>

      {/* Por que utilizar */}
      <section className="rel bg-cream">
        <div className="container section-lg">
          <h2 style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>Por que utilizar?</h2>
          <div className="cards cards-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card" style={{ borderColor: '#ECEBD0', minWidth: 0 }}>
                <span style={{ display: 'block', width: 16, height: 16, borderRadius: '50%', background: b.color }} />
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: '14px 0 6px', overflowWrap: 'anywhere' }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, overflowWrap: 'anywhere' }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avisos */}
      <section className="bg-lilac">
        <div className="container" style={{ padding: '56px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 22 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700 }}>Avisos recentes</h2>
            <Link href="/avisos" style={{ fontWeight: 600 }}>Ver todos os avisos</Link>
          </div>
          {avisos.length === 0 ? (
            <p className="hint">Nenhum aviso no momento.</p>
          ) : (
            <div className="cards">
              {avisos.map((a) => (
                <div key={a.id} style={{ flex: '1 1 280px', minWidth: 0 }}>
                  <AvisoCard aviso={a} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Principais atividades */}
      <section>
        <div className="container section-lg">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 22 }}>
            <h2 style={{ fontSize: 30, fontWeight: 700 }}>Principais atividades</h2>
            <Link href="/atividades" style={{ fontWeight: 600 }}>Ver todas as atividades</Link>
          </div>
          <div className="cards">
            {featured.map((a) => (
              <Link key={a.id} href={`/atividades/${a.slug}`} className="tile-card" style={{ flex: '1 1 240px', maxWidth: 'none', minWidth: 0 }}>
                <div style={{ height: 150, background: a.tone }} />
                <div style={{ padding: '14px 18px 16px', fontWeight: 600, overflowWrap: 'anywhere' }}>{a.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-blue">
        <div className="container section-lg">
          <h2 style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>O que os alunos pensam?</h2>
          <div className="cards">
            {QUOTES.map((q) => (
              <figure key={q.author} style={{ flex: '1 1 260px', minWidth: 0, margin: 0, background: '#fff', borderRadius: 16, padding: 20 }}>
                <blockquote style={{ margin: '0 0 14px', fontSize: 14, overflowWrap: 'anywhere' }}>“{q.text}”</blockquote>
                <figcaption style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue-dark)', overflowWrap: 'anywhere' }}>{q.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Campus e mapa */}
      <section id="mapa" className="rel bg-green">
        <Star size={120} className="deco" style={{ right: -20, top: 30 }} />
        <div className="container section-lg" style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Conheça melhor o nosso campus!</h2>
          <p style={{ marginBottom: 28 }}>Veja onde fica e como chegar ao Ifes · Campus de Alegre.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'stretch' }}>
            <div style={{ flex: '1 1 280px', minWidth: 0 }}>
              <div style={{ background: '#fff', color: 'var(--ink)', borderRadius: 16, padding: 24 }}>
                <p className="hint" style={{ fontWeight: 600, marginBottom: 2 }}>Instituição</p>
                <p style={{ fontWeight: 600, marginBottom: 14, overflowWrap: 'anywhere' }}>{SITE.institution}<br />{SITE.campus}</p>
                <p className="hint" style={{ fontWeight: 600, marginBottom: 2 }}>Endereço</p>
                <p style={{ marginBottom: 14, overflowWrap: 'anywhere' }}>{SITE.addressLines.map((l) => <span key={l}>{l}<br /></span>)}</p>
                <p className="hint" style={{ fontWeight: 600, marginBottom: 2 }}>Contato</p>
                <p style={{ marginBottom: 18, overflowWrap: 'anywhere' }}><a href={SITE.phoneHref} style={{ fontWeight: 600 }}>{SITE.phone}</a></p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <a className="btn" href={SITE.mapsHref} target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>
                  <a className="btn btn-outline" href={SITE.phoneHref}>Ligar</a>
                </div>
              </div>
            </div>
            <div style={{ flex: '1.6 1 300px', minWidth: 0, minHeight: 320, borderRadius: 16, overflow: 'hidden', background: '#E9F1EC' }}>
              <iframe
                title="Mapa do IFES Campus de Alegre na Rodovia BR-482, Km 72"
                src="https://maps.google.com/maps?q=IFES%20Campus%20de%20Alegre%2C%20Rodovia%20BR-482%2C%20Km%2072%2C%20Rive%2C%20Alegre%20-%20ES&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', width: '100%', height: '100%', minHeight: 320 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}