import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Logo } from '@/components/Logo';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Sobre o projeto',
  description:
    'Conheça a iniciativa IFES+Alegre, criada para reunir atividades extracurriculares, monitorias e eventos do Campus de Alegre.',
};

const PILARES = [
  {
    titulo: 'Informação centralizada',
    texto:
      'Reúne horários, locais, vagas e responsáveis de clubes, projetos esportivos, culturais e monitorias em um único portal.',
  },
  {
    titulo: 'Integração estudantil',
    texto:
      'Aproxima estudantes de diferentes cursos e turmas com interesses em comum, fortalecendo a vivência no campus.',
  },
  {
    titulo: 'Apoio acadêmico e bem-estar',
    texto:
      'Facilita o acesso às monitorias e incentiva práticas esportivas, artísticas e colaborativas no contraturno.',
  },
  {
    titulo: 'Gestão docente simplificada',
    texto:
      'Oferece painel administrativo para publicação de avisos, acompanhamento de inscrições e moderação da galeria.',
  },
];

export default function SobrePage() {
  return (
    <main>
      <Hero
        eyebrow="IFES · Campus de Alegre"
        title="Sobre o IFES+Alegre"
        subtitle="Conectando histórias, pessoas e momentos que vão além da sala de aula."
      />

      <div
        className="container"
        style={{
          maxWidth: 1040,
          padding: '40px 16px 64px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <section
          className="card"
          style={{
            padding: 28,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 28,
            alignItems: 'center',
          }}
        >
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>
              O que é o projeto?
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: 1.65, margin: '0 0 12px' }}>
              O <strong>IFES+Alegre</strong> nasceu da necessidade de tornar mais acessível e organizada a
              divulgação das atividades extracurriculares do <strong>{SITE.institution} · {SITE.campus}</strong>.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: 1.65, margin: '0 0 16px' }}>
              Muitas vezes, clubes de leitura, xadrez, corrida, teatro, modalidades esportivas e horários de
              monitoria passam despercebidos na rotina acadêmica. A plataforma reúne essas oportunidades em
              um só lugar, permitindo que cada estudante encontre atividades compatíveis com seus horários e
              interesses.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Link href="/atividades" className="btn">
                Explorar atividades
              </Link>
              <Link href="/contatos" className="btn btn-outline">
                Falar com setores e docentes
              </Link>
            </div>
          </div>

          <div
            style={{
              flex: '1 1 240px',
              minWidth: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              className="tile"
              style={{
                width: '100%',
                maxWidth: 320,
                aspectRatio: '4/3',
                borderRadius: 20,
                background: '#F6E8E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Logo size={116} label="Logo IFES+Alegre" />
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>
            Pilares da plataforma
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))',
              gap: 16,
            }}
          >
            {PILARES.map((pilar) => (
              <article key={pilar.titulo} className="card" style={{ padding: 20, minWidth: 0 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>{pilar.titulo}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55, margin: 0 }}>
                  {pilar.texto}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
            Compromisso com privacidade e uso institucional
          </h2>
          <p style={{ color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            Todas as inscrições e envios de fotos seguem as diretrizes descritas na nossa{' '}
            <Link href="/privacidade" style={{ fontWeight: 600 }}>
              Política de Privacidade e LGPD
            </Link>
            , com moderação realizada pela equipe docente autorizada do campus.
          </p>
        </section>
      </div>
    </main>
  );
}