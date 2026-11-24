'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';

type StatusAcesso = 'pendente' | 'aprovado' | 'suspenso' | 'recusado';

type SolicitacaoItem = {
  id: number;
  email: string;
  name: string;
  status: StatusAcesso;
  motivo?: string | null;
  updatedAt?: string;
};

const STATUS_LABEL: Record<StatusAcesso, string> = {
  pendente: 'Pendente de aprovação',
  aprovado: 'Permitido / Ativo',
  suspenso: 'Suspenso',
  recusado: 'Recusado',
};

export default function DocenteAcessosPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyEmail, setBusyEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoStatus, setNovoStatus] = useState<StatusAcesso>('aprovado');

  const carregarSolicitacoes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/docente/acessos', { cache: 'no-store' });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? 'Não foi possível carregar as tentativas de acesso.');
        setSolicitacoes([]);
        return;
      }
      const data = (await res.json()) as { solicitacoes?: SolicitacaoItem[] };
      setSolicitacoes(Array.isArray(data.solicitacoes) ? data.solicitacoes : []);
    } catch {
      setError('Erro de comunicação ao buscar solicitações de acesso.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarSolicitacoes();
  }, [carregarSolicitacoes]);

  async function executarAcao(
    email: string,
    action: 'aprovar' | 'suspender' | 'recusar' | 'excluir',
    name?: string
  ) {
    setBusyEmail(email);
    setFeedback('');
    setError('');
    try {
      const res = await fetch('/api/docente/acessos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, action }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Falha ao atualizar a solicitação.');
        return;
      }
      setFeedback(`Ação "${action}" aplicada para ${email}.`);
      await carregarSolicitacoes();
    } catch {
      setError('Erro de rede ao processar a ação.');
    } finally {
      setBusyEmail('');
    }
  }

  async function handleCadastrarSolicitacao(e: FormEvent) {
    e.preventDefault();
    const cleanEmail = novoEmail.trim().toLowerCase();
    if (!cleanEmail) return;

    setBusyEmail(cleanEmail);
    setFeedback('');
    setError('');

    try {
      const actionMap: Record<StatusAcesso, 'aprovar' | 'suspender' | 'recusar'> = {
        aprovado: 'aprovar',
        suspenso: 'suspender',
        recusado: 'recusar',
        pendente: 'suspender',
      };

      const res = await fetch('/api/docente/acessos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          name: novoNome.trim() || cleanEmail.split('@')[0],
          action: actionMap[novoStatus],
          statusOverride: novoStatus,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Não foi possível registrar o acesso.');
        return;
      }

      setNovoNome('');
      setNovoEmail('');
      setFeedback(`Registro salvo para ${cleanEmail}.`);
      await carregarSolicitacoes();
    } catch {
      setError('Erro ao salvar o registro de acesso.');
    } finally {
      setBusyEmail('');
    }
  }

  return (
    <main>
      <Hero
        eyebrow="Área Docente · Administração"
        title="Controle de acessos e solicitações"
        subtitle="Analise quem tentou acessar ou criar conta: permita, suspenda, recuse ou exclua solicitações."
      />

      <div className="container" style={{ padding: '24px 16px 64px', maxWidth: 1080 }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/docente" className="btn btn-ghost" style={{ fontSize: 13 }}>
            ← Voltar ao painel docente
          </Link>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            Pré-cadastrar ou definir permissão de e-mail
          </h2>

          <form
            onSubmit={(e) => void handleCadastrarSolicitacao(e)}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 12,
              alignItems: 'end',
            }}
          >
            <div className="field">
              <label htmlFor="acc-name">Nome</label>
              <input
                id="acc-name"
                type="text"
                className="input"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Ex.: Prof. João Silva"
              />
            </div>

            <div className="field">
              <label htmlFor="acc-email">E-mail institucional</label>
              <input
                id="acc-email"
                type="email"
                required
                className="input"
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                placeholder="docente@ifes.edu.br"
              />
            </div>

            <div className="field">
              <label htmlFor="acc-status">Estado inicial</label>
              <select
                id="acc-status"
                className="input"
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value as StatusAcesso)}
              >
                <option value="aprovado">Permitido / Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="suspenso">Suspenso</option>
                <option value="recusado">Recusado</option>
              </select>
            </div>

            <button type="submit" className="btn" disabled={Boolean(busyEmail)}>
              Salvar permissão
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
          <p className="hint">Carregando solicitações de acesso...</p>
        ) : solicitacoes.length === 0 ? (
          <div className="card" style={{ padding: 24 }}>
            <p className="hint" style={{ margin: 0 }}>
              Nenhuma solicitação ou tentativa de acesso registrada até o momento.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(275px, 1fr))',
              gap: 16,
            }}
          >
            {solicitacoes.map((item) => {
              const emProcesso = busyEmail === item.email;
              return (
                <article
                  key={item.email}
                  className="card"
                  style={{
                    padding: 18,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 14,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 999,
                        marginBottom: 8,
                        background: 'var(--surface-2, rgba(0,0,0,0.06))',
                      }}
                    >
                      {STATUS_LABEL[item.status]}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', overflowWrap: 'anywhere' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: 14, margin: '0 0 6px', overflowWrap: 'anywhere' }}>
                      {item.email}
                    </p>
                    {item.motivo && (
                      <p className="hint" style={{ fontSize: 12, margin: 0, overflowWrap: 'anywhere' }}>
                        {item.motivo}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <button
                      type="button"
                      className="btn"
                      disabled={emProcesso || item.status === 'aprovado'}
                      onClick={() => void executarAcao(item.email, 'aprovar', item.name)}
                      style={{ padding: '6px 12px', fontSize: 12 }}
                    >
                      Permitir
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={emProcesso || item.status === 'suspenso'}
                      onClick={() => void executarAcao(item.email, 'suspender', item.name)}
                      style={{ padding: '6px 12px', fontSize: 12 }}
                    >
                      Suspender
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={emProcesso || item.status === 'recusado'}
                      onClick={() => void executarAcao(item.email, 'recusar', item.name)}
                      style={{ padding: '6px 12px', fontSize: 12 }}
                    >
                      Recusar
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={emProcesso}
                      onClick={() => void executarAcao(item.email, 'excluir', item.name)}
                      style={{ padding: '6px 12px', fontSize: 12 }}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}