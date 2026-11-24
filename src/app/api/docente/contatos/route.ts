import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { Pool } from 'pg';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ensureContatoTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "Contato" (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      setor TEXT NOT NULL DEFAULT 'Professores',
      cargo TEXT,
      telefone TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

async function isDocenteAutenticado(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email?.trim().toLowerCase() ?? '';
  if (!email) return false;

  const res = await pool.query<{ active: boolean }>(
    `SELECT active FROM "Docente" WHERE LOWER(email) = $1 LIMIT 1`,
    [email]
  );
  return res.rows.length > 0 && Boolean(res.rows[0].active);
}

export async function GET() {
  try {
    await ensureContatoTable();
    const res = await pool.query(
      `SELECT id, name, email, setor, cargo, telefone
       FROM "Contato"
       ORDER BY setor ASC, name ASC`
    );
    return NextResponse.json({ contatos: res.rows });
  } catch {
    return NextResponse.json({ contatos: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureContatoTable();
    if (!(await isDocenteAutenticado())) {
      return NextResponse.json({ error: 'Acesso restrito a docentes.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      setor?: string;
      cargo?: string;
      telefone?: string;
    };

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const setor = String(body.setor ?? 'Professores').trim() || 'Professores';
    const cargo = String(body.cargo ?? '').trim() || null;
    const telefone = String(body.telefone ?? '').trim() || null;

    if (!name || !email || !email.includes('@')) {
      return NextResponse.json({ error: 'Nome e e-mail válido são obrigatórios.' }, { status: 400 });
    }

    const inserted = await pool.query(
      `INSERT INTO "Contato" (name, email, setor, cargo, telefone, "updatedAt")
       VALUES ($1, $2, $3, $4, $5, now())
       RETURNING id, name, email, setor, cargo, telefone`,
      [name, email, setor, cargo, telefone]
    );

    return NextResponse.json({ contato: inserted.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao salvar contato.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureContatoTable();
    if (!(await isDocenteAutenticado())) {
      return NextResponse.json({ error: 'Acesso restrito a docentes.' }, { status: 401 });
    }

    const id = Number(request.nextUrl.searchParams.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
    }

    await pool.query(`DELETE FROM "Contato" WHERE id = $1`, [id]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao excluir contato.' }, { status: 500 });
  }
}