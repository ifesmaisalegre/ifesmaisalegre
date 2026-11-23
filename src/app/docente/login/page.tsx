'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Hero } from '@/components/Hero';
import { authClient } from '@/lib/auth-client';
import { DocenteLogoutButton } from '@/components/DocenteLogoutButton';

export default function DocenteLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  useEffect(() => {
    let active = true;
    authClient
      .getSession()
      .then((res) => {
        if (active && res?.data?.session) {
          setHasActiveSession(true);
        }
      })
      .catch(() => {
        // ignora erro de leitura inicial de sessão
      });
    return () => {
      active = false;
    };
  }, []);

  async function finalizeAuthNavigation() {
    for (let i = 0; i < 6; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const check = await authClient.getSession();
      if (check?.data?.session) {
        break;
      }
    }
    window.location.assign('/docente');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isSignUp) {
        const res = await authClient.signUp.email({
          email: normalizedEmail,
          password,
          name: name.trim() || normalizedEmail.split('@')[0],
          callbackURL: '/docente',
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
          callbackURL: '/docente',
        });

        if (res.error) {
          setError(res.error.message ?? 'Credenciais inválidas.');
          setLoading(false);
          return;
        }
      }

      await finalizeAuthNavigation();
    } catch {
      setError('Erro de comunicação ao autenticar.');
      setLoading(false);
    }
  }

  return (
    <main>
      <Hero
        title={isSignUp ? 'Ativar acesso docente' : 'Área Docente'}
        subtitle="Acesse o painel para gerenciar atividades, monitorias, avisos e moderação da galeria."
      />
      <div className="container" style={{ maxWidth: 480, padding: '40px 24px 64px' }}>
        <div className="card" style={{ padding: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <p className="hint" style={{ fontWeight: 600, margin: 0 }}>
              IFES+Alegre · Acesso Restrito
            </p>
            {hasActiveSession && <DocenteLogoutButton />}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>
            {isSignUp ? 'Cadastrar credencial docente' : 'Entrar no painel'}
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

            {error && (
              <p role="alert" className="status status-err">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Aguarde...' : isSignUp ? 'Criar conta e entrar' : 'Entrar'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsSignUp((prev) => !prev);
              setError('');
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
            {isSignUp ? 'Já possui conta? Fazer login' : 'Primeiro acesso? Cadastrar credencial'}
          </button>
        </div>
      </div>
    </main>
  );
}