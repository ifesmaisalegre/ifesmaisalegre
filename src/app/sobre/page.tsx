import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';

export const metadata: Metadata = { title: 'Sobre o projeto' };

// TODO(front): este texto foi reescrito; comparar com o texto da página "Sobre" do site original (Wix).
const GOALS = [
  { title: 'Divulgar', text: 'Mostrar todas as atividades do campus de forma clara e atualizada.', color: '#F9C46B' },
  { title: 'Facilitar', text: 'Permitir que o estudante conheça horários e faça a inscrição sem burocracia.', color: '#DDA3F0' },
  { title: 'Registrar', text: 'Guardar na galeria os melhores momentos vividos no campus.', color: '#B9E3C9' },
  { title: 'Aproximar', text: 'Conectar estudantes e docentes em torno de interesses em comum.', color: '#C7CEF2' },
];

export default function SobrePage() {
  return (
    <main>
      <Hero title="Sobre o projeto" subtitle="Conheça a ideia por trás do IFES+Alegre." />
      <section className="container" style={{ padding: '44px 24px 28px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 12 }}>O que é o IFES+Alegre?</h2>
        <p style={{ maxWidth: 760, fontSize: 16, color: 'var(--ink-2)' }}>O IFES+Alegre é um site criado por estudantes do 3ºTII para reunir, em um só lugar, as atividades extracurriculares do Campus de Alegre. Aqui você descobre o que está acontecendo, vê os horários, entra em contato com os docentes responsáveis e acompanha os avisos e as fotos do campus.</p>
      </section>
      <section className="bg-cream">
        <div className="container" style={{ padding: '44px 24px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }}>Nossos objetivos</h2>
          <div className="cards" style={{ gap: 16 }}>
            {GOALS.map((g, i) => (
              <div key={g.title} className="card" style={{ flex: '1 1 220px', borderColor: '#E8E8D0' }}>
                <div className="tile" aria-hidden="true" style={{ width: 36, height: 36, borderRadius: '50%', fontWeight: 700, background: g.color }}>{i + 1}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: '12px 0 6px' }}>{g.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-2)' }}>{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container" style={{ padding: '44px 24px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 12 }}>Por que criamos o site?</h2>
        <p style={{ maxWidth: 760, fontSize: 16, color: 'var(--ink-2)' }}>Muitas atividades do campus eram pouco conhecidas porque a informação ficava espalhada em cartazes e grupos de mensagens. Queremos que todo estudante saiba o que existe, consiga participar com facilidade e sinta que faz parte da vida do campus.</p>
      </section>
      <section className="bg-lilac">
        <div className="container" style={{ padding: '40px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Continue explorando</h2>
            <p style={{ color: 'var(--ink-2)' }}>Veja as atividades e encontre a sua.</p>
          </div>
          <Link href="/atividades" className="btn btn-lg">Ver atividades</Link>
        </div>
      </section>
    </main>
  );
}
