import { createAuthClient } from 'better-auth/react';

function resolveAuthBaseURL(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api/auth`;
  }

  const configuredUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://ifesmaisalegre.vercel.app';

  return `${configuredUrl.replace(/\/+$/, '')}/api/auth`;
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseURL(),
});