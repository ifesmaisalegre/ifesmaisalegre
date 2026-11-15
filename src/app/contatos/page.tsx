import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { DOCENTES, EMAIL_DOMAIN } from '@/data/docentes';

export const metadata: Metadata = { title: 'Contatos' };

const TONES = ['#E6E9F8', '#FDE9C8', '#DDF1E5', '#EBDDF3'];

export default function ContatosPage() {
  return (
    <main>
      <Hero
        title="Contatos"
        subtitle="Alunos e professores encontram aqui os meios de contato de forma rápida e prática, para tirar dúvidas, trocar informações e fortalecer a conexão entre todos do IFES · Campus de Alegre."
      />
      <div className="container" style={{ padding: '40px 24px 56px' }}>
        <ul className="cards">
          {DOCENTES.map((d, i) => {
            const email = `${d.emailUser}@${EMAIL_DOMAIN}`;
            const parts = d.name.split(' ');
            const initials = parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
            return (
              <li key={d.name} className="card" style={{ flex: '1 1 260px', maxWidth: 380, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span className="tile" aria-hidden="true" style={{ flex: '0 0 44px', width: 44, height: 44, borderRadius: '50%', fontSize: 14, fontWeight: 600, background: TONES[i % 4] }}>{initials}</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 600 }}>{d.name}</p>
                  <a href={`mailto:${email}`} style={{ fontSize: 14, overflowWrap: 'anywhere' }}>{email}</a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
