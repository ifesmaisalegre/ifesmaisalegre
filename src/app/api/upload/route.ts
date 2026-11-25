import { NextResponse, type NextRequest } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Nenhum arquivo de imagem enviado.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Formato inválido. Use JPG, PNG, WEBP ou GIF.' },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'A imagem deve ter no máximo 4 MB.' },
        { status: 400 }
      );
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const blob = await put(`atividades/${Date.now()}-${safeName}`, file, {
        access: 'public',
        contentType: file.type,
      });

      return NextResponse.json({ url: blob.url }, { status: 201 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUrl }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao processar o upload da imagem.' },
      { status: 500 }
    );
  }
}