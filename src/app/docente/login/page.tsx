'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Hero } from '@/components/Hero';
import { authClient } from '@/lib/auth-client';

type PreCheckResponse = {
  permitido?: boolean;
  status?: 'pendente' | 'aprovado' | 'suspenso' | 'recusado';
  error?: string;
};

function DocenteLoginForm() {
  const searchParams = useSearchParams();
  const acessoParam = searchParams.get('acesso');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(
    acessoParam === 'nao_autorizado'
      ? 'Seu e-mail ainda não possui acesso liberado. A solicitação foi registrada para aprovação da administração.'
      : ''
  );
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  async function verificarAcessoPrevio(
    normalizedEmail: string,
    displayName: string,
    tipo: 'cadastro' | 'login'
  ): Promise<PreCheckResponse> {
    const res = await fetch('/api/docente/acessos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        name: displayName,
        tipo,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as PreCheckResponse;
    if (!res.ok) {
      return { permitido: false, error: data.error ?? 'Não foi possível validar o e-mail.' };
    }
    return data;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const displayName = name.trim() || normalizedEmail.split('@')[0];

      const preCheck = await verificarAcessoPrevio(
        normalizedEmail,
        displayName,
        isSignUp ? 'cadastro' : 'login'
      );

      if (preCheck.error) {
        setError(preCheck.error);
        setLoading(false);
        return;
      }

      if (!preCheck.permitido) {
        if (preCheck.status === 'suspenso') {
          setError('Este e-mail está temporariamente suspenso pela administração.');
        } else if (preCheck.status === 'recusado') {
          setError('A solicitação de acesso para este e-mail foi recusada.');
        } else {
          setInfo(
            'Solicitação registrada! Seu e-mail precisa ser aprovado na aba Controle de Acessos antes de concluir o cadastro ou entrar.'
          );
        }
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const res = await authClient.signUp.email({
          email: normalizedEmail,
          password,
          name: displayName,
          callbackURL: '/api/docente/entrar',
        });

        if (res.error) {
          setError(res.error.message ?? 'Não foi possível criar a conta.');
          setLoading(false);
          return;
        }
      } else {
        const res = await authClient.signIn.email({
          email: normalizedEmail,
          password,
          callbackURL: '/api/docente/entrar',
        });

        if (res.error) {
          setError(res.error.message ?? 'Credenciais inválidas.');
          setLoading(false);
          return;
        }
      }

      window.location.assign('/api/docente/entrar');
    } catch {
      setError('Erro de comunicação ao autenticar.');
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480, padding: '40px 16px 64px' }}>
      <div className="card" style={{ padding: 24 }}>
        <p className="hint" style={{ fontWeight: 600, marginBottom: 4 }}>
          IFES+Alegre · Acesso Restrito
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>
          {isSignUp ? 'Solicitar / ativar credencial docente' : 'Entrar no painel'}
        </h2>

        <form onSubmit={(e) => void handleSubmit(e)} className="form" style={{ gap: 16 }}>
          {isSignUp && (
            <div className="field">
              <label htmlFor="d-name">Nome completo</label>
              <input
                id="d-name"
                type="text"
                required
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Prof. Maria Silva"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="d-email">E-mail institucional</label>
            <input
              id="d-email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="docente@ifes.edu.br"
            />
          </div>

          <div className="field">
            <label htmlFor="d-password">Senha</label>
            <input
              id="d-password"
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {info && (
            <p role="status" className="status">
              {info}
            </p>
          )}

          {error && (
            <p role="alert" className="status status-err">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Verificando...' : isSignUp ? 'Verificar e criar conta' : 'Entrar'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsSignUp((prev) => !prev);
            setError('');
            setInfo('');
          }}
          style={{
            marginTop: 16,
            width: '100%',
            background: 'none',
            border: 0,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ink-2)',
          }}
        >
          {isSignUp ? 'Já possui conta aprovada? Fazer login' : 'Primeiro acesso? Verificar e cadastrar credencial'}
        </button>
      </div>
    </div>
  );
}

export default function DocenteLoginPage() {
  return (
    <main>
      <Hero
        title="Área Docente"
        subtitle="Acesse o painel para gerenciar atividades, monitorias, avisos e moderação da galeria."
      />
      <Suspense fallback={<div className="container" style={{ padding: '40px 16px 64px' }} />}>
        <DocenteLoginForm />
      </Suspense>
    </main>
  );
}