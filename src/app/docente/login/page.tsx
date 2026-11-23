'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function DocenteLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.trim().split('@')[0],
          callbackURL: '/docente',
        });
        if (res.error) {
          setError(res.error.message ?? 'Não foi possível criar a conta.');
          setLoading(false);
          return;
        }
      } else {
        const res = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: '/docente',
        });
        if (res.error) {
          setError(res.error.message ?? 'Credenciais inválidas.');
          setLoading(false);
          return;
        }
      }

      router.push('/docente');
      router.refresh();
    } catch {
      setError('Erro de comunicação ao autenticar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          IFES+Alegre · Área Docente
        </p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900">
          {isSignUp ? 'Ativar acesso docente' : 'Entrar na Área Docente'}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Acesse o painel para gerenciar atividades, monitorias, avisos e moderação da galeria.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-zinc-700">Nome completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                placeholder="Ex.: Prof. Maria Silva"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700">E-mail institucional</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              placeholder="docente@ifes.edu.br"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? 'Aguarde...' : isSignUp ? 'Criar conta e entrar' : 'Entrar'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsSignUp((prev) => !prev);
            setError('');
          }}
          className="mt-4 w-full text-center text-xs font-medium text-zinc-600 hover:text-zinc-900"
        >
          {isSignUp ? 'Já possui conta? Fazer login' : 'Primeiro acesso? Cadastrar credencial'}
        </button>
      </div>
    </main>
  );
}