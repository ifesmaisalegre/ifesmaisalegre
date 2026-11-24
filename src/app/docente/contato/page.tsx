'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';

type ContatoDb = {
  id: number;
  name: string;
  email: string;
  setor: string;
  cargo?: string | null;
  telefone?: string | null;
};

const SETORES_OPCOES = ['Professores', 'CGAC', 'DIREN', 'Coordenação', 'Secretaria', 'Outro'];

export default function DocenteContatosPage() {
  const [contatos, setContatos] = useState<ContatoDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [setor, setSetor] = useState('Professores');
  const [cargo, setCargo] = useState('');
  const [telefone, setTelefone] = useState('');

  const carregarContatos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/docente/contatos', { cache: 'no-store' });
      const data = (await res.json()) as { contatos?: ContatoDb[] };
      setContatos(Array.isArray(data.contatos) ? data.contatos : []);
    } catch {
      setError('Não foi possível carregar os contatos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarContatos();
  }, [carregarContatos]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setFeedback('');

    try {
      const res = await fetch('/api/docente/contatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, setor, cargo, telefone }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Erro ao cadastrar contato.');
        return;
      }

      setName('');
      setEmail('');
      setCargo('');
      setTelefone('');
      setFeedback('Contato adicionado com sucesso.');
      await carregarContatos();
    } catch {
      setError('Falha de comunicação ao salvar contato.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setError('');
    setFeedback('');
    try {
      const res = await fetch(`/api/docente/contatos?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setError('Não foi possível excluir o contato.');
        return;
      }
      setFeedback('Contato removido.');
      await carregarContatos();
    } catch {
      setError('Erro ao remover contato.');
    }
  }

  return (
    <main>
      <Hero
        eyebrow="Área Docente · Administração"
        title="Gerenciar contatos"
        subtitle="Adicione ou remova contatos oficiais organizados por tag (Professores, CGAC, DIREN, Coordenação)."
      />

      <div className="container" style={{ padding: '24px 16px 64px', maxWidth: 1080 }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/docente" className="btn btn-ghost" style={{ fontSize: 13 }}>
            ← Voltar ao painel docente
          </Link>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Novo contato</h2>

          <form
            onSubmit={(e) => void handleCreate(e)}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 12,
              alignItems: 'end',
            }}
          >
            <div className="field">
              <label htmlFor="c-name">Nome / Setor</label>
              <input
                id="c-name"
                type="text"
                required
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: CGAC · Atendimento"
              />
            </div>

            <div className="field">
              <label htmlFor="c-email">E-mail</label>
              <input
                id="c-email"
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="setor.alegre@ifes.edu.br"
              />
            </div>

            <div className="field">
              <label htmlFor="c-setor">Tag / Divisão</label>
              <select
                id="c-setor"
                className="input"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
              >
                {SETORES_OPCOES.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="c-cargo">Descrição / Cargo (opcional)</label>
              <input
                id="c-cargo"
                type="text"
                className="input"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ex.: Coordenação de Ensino"
              />
            </div>

            <div className="field">
              <label htmlFor="c-tel">Telefone / Ramal (opcional)</label>
              <input
                id="c-tel"
                type="text"
                className="input"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(28) 3564-1800"
              />
            </div>

            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Salvando...' : 'Adicionar contato'}
            </button>
          </form>
        </div>

        {feedback && (
          <p className="status" style={{ marginBottom: 16 }}>
            {feedback}
          </p>
        )}

        {error && (
          <p role="alert" className="status status-err" style={{ marginBottom: 16 }}>
            {error}
          </p>
        )}

        {loading ? (
          <p className="hint">Carregando contatos cadastrados...</p>
        ) : contatos.length === 0 ? (
          <div className="card" style={{ padding: 20 }}>
            <p className="hint" style={{ margin: 0 }}>
              Nenhum contato extra cadastrado no banco ainda (os docentes e setores padrão já aparecem na página pública).
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: 16,
            }}
          >
            {contatos.map((c) => (
              <article
                key={c.id}
                className="card"
                style={{
                  padding: 18,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: 999,
                      marginBottom: 8,
                      background: 'var(--surface-2, rgba(0,0,0,0.06))',
                    }}
                  >
                    {c.setor}
                  </span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', overflowWrap: 'anywhere' }}>
                    {c.name}
                  </h3>
                  {c.cargo && (
                    <p className="hint" style={{ fontSize: 12, margin: '0 0 4px' }}>
                      {c.cargo}
                    </p>
                  )}
                  <p style={{ fontSize: 13, margin: '0 0 4px', overflowWrap: 'anywhere' }}>{c.email}</p>
                  {c.telefone && (
                    <p className="hint" style={{ fontSize: 12, margin: 0 }}>
                      Tel.: {c.telefone}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => void handleDelete(c.id)}
                  style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: 12 }}
                >
                  Excluir
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}