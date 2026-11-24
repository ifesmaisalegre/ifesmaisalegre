import { NextResponse, type NextRequest } from 'next/server';
import { Pool } from 'pg';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const email = session?.user?.email?.trim().toLowerCase() ?? '';
    if (!session || !session.user || !email) {
      return NextResponse.redirect(new URL('/docente/login', origin));
    }

    const docenteRes = await pool.query<{ active: boolean }>(
      `SELECT active FROM "Docente" WHERE LOWER(email) = $1 LIMIT 1`,
      [email]
    );

    const isActiveDocente = docenteRes.rows.length > 0 && Boolean(docenteRes.rows[0].active);

    if (!isActiveDocente) {
      await pool.query(
        `INSERT INTO "SolicitacaoAcesso" (email, name, status, motivo, "updatedAt")
         VALUES ($1, $2, 'pendente', 'Tentativa de entrada no painel sem aprovação', now())
         ON CONFLICT (email) DO UPDATE
         SET "updatedAt" = now()`,
        [email, session.user.name || email.split('@')[0]]
      );

      return NextResponse.redirect(new URL('/docente/login?acesso=nao_autorizado', origin));
    }

    return NextResponse.redirect(new URL('/docente', origin));
  } catch {
    return NextResponse.redirect(new URL('/docente/login', origin));
  }
}