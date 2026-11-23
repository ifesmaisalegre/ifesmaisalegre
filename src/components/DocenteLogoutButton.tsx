'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

function clearAuthCookies() {
  if (typeof document === 'undefined') return;
  const cookieNames = [
    'better-auth.session_token',
    '__Secure-better-auth.session_token',
    'better-auth.session_data',
    '__Secure-better-auth.session_data',
  ];

  for (const name of cookieNames) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=None; Secure`;
  }
}

export function DocenteLogoutButton() {
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    if (signingOut) return;
    setSigningOut(true);

    try {
      await authClient.signOut();
    } catch {
      // prossegue para limpar cookies locais e redirecionar
    } finally {
      clearAuthCookies();
      window.location.replace('/docente/login');
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={signingOut}
      className="btn"
      style={{ padding: '8px 14px', fontSize: 13 }}
    >
      {signingOut ? 'Saindo...' : 'Sair'}
    </button>
  );
}