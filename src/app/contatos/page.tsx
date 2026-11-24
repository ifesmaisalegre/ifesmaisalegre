'use client';

import { useMemo, useState } from 'react';
import { Hero } from '@/components/Hero';
import { DOCENTES, EMAIL_DOMAIN } from '@/data/docentes';

const TONES = ['#E6E9F8', '#FDE9C8', '#DDF1E5', '#EBDDF3'];
const SETORES = ['Todos', 'Professores', 'CGAC', 'DIREN', 'Coordenação'] as const;

type SetorFiltro = (typeof SETORES)[number];

type ContatoItem = {
  id: string;
  name: string;
  email: string;
  setor: Exclude<SetorFiltro, 'Todos'>;
  cargo?: string;
};

const CONTATOS_SETORIAIS: ContatoItem[] = [
  {
    id: 'cgac-geral',
    name: 'Coordenadoria Geral de Atenção aos Discentes (CGAC)',
    email: `cgac.alegre@${EMAIL_DOMAIN}`,
    setor: 'CGAC',
    cargo: 'Atendimento estudantil e assistência',
  },
  {
    id: 'diren-geral',
    name: 'Diretoria de Ensino (DIREN)',
    email: `diren.alegre@${EMAIL_DOMAIN}`,
    setor: 'DIREN',
    cargo: 'Gestão acadêmica e ensino',
  },
  {
    id: 'coord-tii',
    name: 'Coordenação de Informática / Cursos',
    email: `informatica.alegre@${EMAIL_DOMAIN}`,
    setor: 'Coordenação',
    cargo: 'Coordenação acadêmica',
  },
];

export default function ContatosPage() {
  const [setorAtivo, setSetorAtivo] = useState<SetorFiltro>('Todos');

  const todosContatos = useMemo<ContatoItem[]>(() => {
    const docentesFormatados: ContatoItem[] = DOCENTES.map((d, idx) => ({
      id: `docente-${idx}-${d.emailUser}`,
      name: d.name,
      email: `${d.emailUser}@${EMAIL_DOMAIN}`,
      setor: 'Professores',
      cargo: 'Docente · IFES Campus de Alegre',
    }));

    return [...CONTATOS_SETORIAIS, ...docentesFormatados];
  }, []);

  const contatosFiltrados = useMemo(() => {
    if (setorAtivo === 'Todos') return todosContatos;
    return todosContatos.filter((item) => item.setor === setorAtivo);
  }, [setorAtivo, todosContatos]);

  return (
    <main>
      <Hero
        title="Contatos"
        subtitle="Alunos e professores encontram aqui os meios de contato de forma rápida e prática, para tirar dúvidas, trocar informações e fortalecer a conexão entre todos do IFES · Campus de Alegre."
      />

      <div
        className="container"
        style={{ padding: '32px 16px 64px', maxWidth: 1120 }}
      >
        <div
          role="group"
          aria-label="Filtrar contatos por setor"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {SETORES.map((setor) => {
            const ativo = setorAtivo === setor;
            return (
              <button
                key={setor}
                type="button"
                onClick={() => setSetorAtivo(setor)}
                className={ativo ? 'btn' : 'btn btn-ghost'}
                style={{
                  padding: '8px 14px',
                  fontSize: 13,
                  borderRadius: 999,
                }}
              >
                {setor}
              </button>
            );
          })}
        </div>

        <ul
          className="cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            padding: 0,
            margin: 0,
            listStyle: 'none',
          }}
        >
          {contatosFiltrados.map((item, i) => {
            const parts = item.name.trim().split(/\s+/);
            const initials =
              parts.length > 1
                ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
                : parts[0].slice(0, 2).toUpperCase();

            return (
              <li
                key={item.id}
                className="card"
                style={{
                  width: '100%',
                  minWidth: 0,
                  padding: '18px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span
                  className="tile"
                  aria-hidden="true"
                  style={{
                    flex: '0 0 44px',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    fontSize: 14,
                    fontWeight: 600,
                    background: TONES[i % TONES.length],
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {initials}
                </span>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      flexWrap: 'wrap',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: 'var(--surface-2, rgba(0,0,0,0.06))',
                      }}
                    >
                      {item.setor}
                    </span>
                  </div>

                  <p
                    style={{
                      fontWeight: 600,
                      margin: '0 0 4px',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {item.name}
                  </p>

                  {item.cargo && (
                    <p
                      className="hint"
                      style={{
                        fontSize: 12,
                        margin: '0 0 6px',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {item.cargo}
                    </p>
                  )}

                  <a
                    href={`mailto:${item.email}`}
                    style={{
                      fontSize: 13,
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.email}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}