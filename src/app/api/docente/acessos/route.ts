import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { Pool } from 'pg';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const VALID_STATUS = new Set(['pendente', 'aprovado', 'suspenso', 'recusado']);

async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "SolicitacaoAcesso" (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pendente',
      motivo TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

async function isDocenteAutenticado(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email?.trim().toLowerCase() ?? '';
  if (!email) return null;

  const docenteRes = await pool.query<{ active: boolean }>(
    `SELECT active FROM "Docente" WHERE LOWER(email) = $1 LIMIT 1`,
    [email]
  );

  if (docenteRes.rows.length > 0 && docenteRes.rows[0].active) {
    return email;
  }

  return null;
}

export async function GET() {
  try {
    await ensureTables();
    const docenteEmail = await isDocenteAutenticado();
    if (!docenteEmail) {
      return NextResponse.json({ error: 'Acesso restrito a docentes autorizados.' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT id, email, name, status, motivo, "createdAt", "updatedAt"
       FROM "SolicitacaoAcesso"
       ORDER BY
         CASE status
           WHEN 'pendente' THEN 1
           WHEN 'suspenso' THEN 2
           WHEN 'recusado' THEN 3
           ELSE 4
         END,
         "updatedAt" DESC`
    );

    return NextResponse.json({ solicitacoes: result.rows });
  } catch {
    return NextResponse.json({ error: 'Erro ao consultar solicitações de acesso.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    const body = (await request.json()) as {
      email?: string;
      name?: string;
      tipo?: 'cadastro' | 'login';
    };

    const email = String(body.email ?? '').trim().toLowerCase();
    const name = String(body.name ?? '').trim() || email.split('@')[0];
    const tipo = body.tipo === 'cadastro' ? 'cadastro' : 'login';

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
    }

    const docenteRes = await pool.query<{ active: boolean; name: string }>(
      `SELECT active, name FROM "Docente" WHERE LOWER(email) = $1 LIMIT 1`,
      [email]
    );

    const existingRes = await pool.query<{ status: string; name: string }>(
      `SELECT status, name FROM "SolicitacaoAcesso" WHERE LOWER(email) = $1 LIMIT 1`,
      [email]
    );

    if (docenteRes.rows.length > 0 && docenteRes.rows[0].active) {
      await pool.query(
        `INSERT INTO "SolicitacaoAcesso" (email, name, status, motivo, "updatedAt")
         VALUES ($1, $2, 'aprovado', 'Docente ativo', now())
         ON CONFLICT (email) DO UPDATE
         SET status = 'aprovado', "updatedAt" = now()`,
        [email, docenteRes.rows[0].name || name]
      );

      return NextResponse.json({ permitido: true, status: 'aprovado' });
    }

    if (existingRes.rows.length > 0) {
      const currentStatus = existingRes.rows[0].status;
      if (currentStatus === 'aprovado') {
        await pool.query(
          `INSERT INTO "Docente" ("emailUser", email, name, active, "updatedAt")
           VALUES ($1, $1, $2, true, now())
           ON CONFLICT (email) DO UPDATE
           SET active = true, "updatedAt" = now()`,
          [email, existingRes.rows[0].name || name]
        );
        return NextResponse.json({ permitido: true, status: 'aprovado' });
      }

      await pool.query(
        `UPDATE "SolicitacaoAcesso"
         SET motivo = $2, "updatedAt" = now()
         WHERE LOWER(email) = $1`,
        [
          email,
          tipo === 'cadastro'
            ? 'Nova tentativa de cadastro aguardando aprovação'
            : 'Tentativa de login registrada',
        ]
      );

      return NextResponse.json({
        permitido: false,
        status: currentStatus,
      });
    }

    const motivoInicial =
      tipo === 'cadastro'
        ? 'Solicitação de cadastro aguardando liberação da coordenação'
        : 'Tentativa de login sem pré-autorização';

    await pool.query(
      `INSERT INTO "SolicitacaoAcesso" (email, name, status, motivo, "updatedAt")
       VALUES ($1, $2, 'pendente', $3, now())`,
      [email, name, motivoInicial]
    );

    return NextResponse.json({
      permitido: false,
      status: 'pendente',
    });
  } catch {
    return NextResponse.json({ error: 'Falha na verificação prévia de acesso.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureTables();
    const docenteEmail = await isDocenteAutenticado();
    if (!docenteEmail) {
      return NextResponse.json({ error: 'Acesso restrito a docentes autorizados.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      email?: string;
      name?: string;
      action?: 'aprovar' | 'suspender' | 'recusar' | 'excluir';
      statusOverride?: string;
    };

    const email = String(body.email ?? '').trim().toLowerCase();
    const name = String(body.name ?? '').trim() || email.split('@')[0];
    const action = body.action;

    if (!email || !action) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    if (action === 'excluir') {
      await pool.query(`DELETE FROM "SolicitacaoAcesso" WHERE LOWER(email) = $1`, [email]);
      return NextResponse.json({ ok: true });
    }

    const statusMap = {
      aprovar: 'aprovado',
      suspender: 'suspenso',
      recusar: 'recusado',
    } as const;

    const requestedStatus =
      body.statusOverride && VALID_STATUS.has(body.statusOverride)
        ? body.statusOverride
        : statusMap[action];

    const isApproved = requestedStatus === 'aprovado';

    await pool.query(
      `INSERT INTO "SolicitacaoAcesso" (email, name, status, motivo, "updatedAt")
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name,
           status = EXCLUDED.status,
           motivo = EXCLUDED.motivo,
           "updatedAt" = now()`,
      [
        email,
        name,
        requestedStatus,
        `Atualizado por ${docenteEmail} (${requestedStatus})`,
      ]
    );

    if (isApproved) {
      await pool.query(
        `INSERT INTO "Docente" ("emailUser", email, name, active, "updatedAt")
         VALUES ($1, $1, $2, true, now())
         ON CONFLICT (email) DO UPDATE
         SET name = EXCLUDED.name,
             active = true,
             "updatedAt" = now()`,
        [email, name]
      );
    } else {
      await pool.query(
        `UPDATE "Docente"
         SET active = false, "updatedAt" = now()
         WHERE LOWER(email) = $1`,
        [email]
      );
    }

    return NextResponse.json({ ok: true, status: requestedStatus });
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar permissão.' }, { status: 500 });
  }
}