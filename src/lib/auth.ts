import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const resolvedBaseURL = (
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3000'
).replace(/\/+$/, '');

const resolvedSecret =
  process.env.BETTER_AUTH_SECRET ||
  (process.env.NODE_ENV !== 'production' ? 'dev-secret-change-in-production' : undefined);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  secret: resolvedSecret,
  baseURL: resolvedBaseURL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});