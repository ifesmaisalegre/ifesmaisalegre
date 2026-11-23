'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function DocenteLogoutButton() {
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    if (signingOut) return;
    setSigningOut(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.assign('/docente/login');
          },
          onError: () => {
            window.location.assign('/docente/login');
          },
        },
      });
    } catch {
      window.location.assign('/docente/login');
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