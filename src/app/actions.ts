'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { db } from '@/prisma/db';
import { getServerSession } from '@/lib/session';
import {
  activityStatusSchema,
  avisoCreateSchema,
  avisoToggleSchema,
  galleryModerateSchema,
  galleryPhotoUploadSchema,
  inscricaoSchema,
  monitoriaCreateSchema,
} from '@/lib/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ormPublic = (db as unknown as { orm: { public: Record<string, any> } }).orm.public;

export type ActionResult = {
  ok: boolean;
  message: string;
};

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

async function requireDocenteSession(): Promise<{ ok: true; email: string } | { ok: false; message: string }> {
  const session = await getServerSession();
  const userEmail = session?.user?.email?.trim().toLowerCase();
  if (!session?.user || !userEmail) {
    return { ok: false, message: 'Acesso não autorizado. Faça login na Área Docente.' };
  }

  const docentes = await ormPublic.Docente.all();
  const list = Array.isArray(docentes) ? docentes : [];
  const matched = list.find(
    (d: Record<string, unknown>) =>
      String(d.email ?? '').trim().toLowerCase() === userEmail && Boolean(d.active ?? true)
  );

  if (!matched && list.length > 0) {
    return { ok: false, message: 'E-mail não habilitado como docente ativo.' };
  }

  return { ok: true, email: userEmail };
}

export async function createInscricaoAction(input: {
  name: string;
  matricula: string;
  email: string;
  phone: string;
  activitySlug: string;
  activityName: string;
  privacyOk: boolean;
}): Promise<ActionResult> {
  const parsed = inscricaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Dados de inscrição inválidos.',
    };
  }

  const data = parsed.data;
  const activities = await ormPublic.Activity.all();
  const activity = (Array.isArray(activities) ? activities : []).find(
    (a: Record<string, unknown>) => String(a.slug ?? '') === data.activitySlug
  ) as Record<string, unknown> | undefined;

  if (!activity) {
    return { ok: false, message: 'Atividade não encontrada.' };
  }

  const status = String(activity.status ?? '');
  const signup = String(activity.signup ?? 'sim');
  if (signup === 'nao' || status === 'Encerrada' || status === 'Inativa') {
    return { ok: false, message: 'As inscrições para esta atividade estão encerradas.' };
  }

  const existingInscricoes = await ormPublic.Inscricao.all();
  const inscricoesList = Array.isArray(existingInscricoes) ? existingInscricoes : [];

  const sameActivity = inscricoesList.filter(
    (r: Record<string, unknown>) => String(r.activitySlug ?? '') === data.activitySlug
  );

  const duplicateMatricula = sameActivity.some(
    (r: Record<string, unknown>) =>
      String(r.matricula ?? '').trim().toLowerCase() === data.matricula.toLowerCase()
  );
  if (duplicateMatricula) {
    return { ok: false, message: 'Esta matrícula já está inscrita nesta atividade.' };
  }

  const spotsRaw = activity.spots;
  if (typeof spotsRaw === 'number' && Number.isFinite(spotsRaw) && spotsRaw >= 0) {
    if (sameActivity.length >= spotsRaw) {
      return { ok: false, message: 'Não há vagas disponíveis para esta atividade.' };
    }
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  await ormPublic.Inscricao.create({
    name: data.name,
    matricula: data.matricula,
    email: data.email,
    phone: data.phone,
    activitySlug: data.activitySlug,
    activityName: String(activity.name ?? data.activityName),
    privacyOk: true,
    date: todayIso,
  });

  revalidatePath('/atividades');
  revalidatePath(`/atividades/${data.activitySlug}`);
  revalidatePath('/docente');

  return { ok: true, message: 'Inscrição confirmada com sucesso!' };
}

export async function uploadGalleryPhotoAction(formData: FormData): Promise<ActionResult> {
  const file = formData.get('photo');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: 'Escolha uma foto para enviar.' };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false, message: 'Envie uma imagem válida (JPG, PNG, WEBP ou GIF).' };
  }

  if (file.size > MAX_PHOTO_BYTES) {
    return { ok: false, message: 'A foto deve ter no máximo 5 MB.' };
  }

  const parsed = galleryPhotoUploadSchema.safeParse({
    lgpdConsent: formData.get('lgpdConsent') === 'true',
    guardianAuth: formData.get('guardianAuth') !== 'false',
    caption: String(formData.get('caption') ?? ''),
    activitySlug: String(formData.get('activitySlug') ?? ''),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Dados de autorização inválidos.',
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      message: 'Armazenamento de mídia não configurado no ambiente.',
    };
  }

  const safeExt = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
  const uniqueCode = `IFES-${Date.now().toString(36).toUpperCase()}`;
  const blobPath = `galeria/${uniqueCode}.${safeExt}`;

  const blob = await put(blobPath, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  const todayIso = new Date().toISOString().slice(0, 10);
  await ormPublic.GalleryPhoto.create({
    code: uniqueCode,
    imageUrl: blob.url,
    caption: parsed.data.caption || null,
    date: todayIso,
    status: 'pending',
    tone: '#E6E9F8',
    lgpdConsent: true,
    guardianAuth: parsed.data.guardianAuth,
    activitySlug: parsed.data.activitySlug || null,
    approvedBy: null,
    updatedAt: new Date(),
  });

  revalidatePath('/galeria');
  revalidatePath('/docente');

  return {
    ok: true,
    message: 'Foto enviada! Ela aparecerá na galeria depois da aprovação dos docentes.',
  };
}

export async function updateActivityStatusAction(input: {
  id: number;
  status: 'Inscrições abertas' | 'Vagas esgotadas' | 'Encerrada' | 'Inativa';
  signup: 'sim' | 'nao';
}): Promise<ActionResult> {
  const authCheck = await requireDocenteSession();
  if (!authCheck.ok) return authCheck;

  const parsed = activityStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'Dados inválidos para atualizar a atividade.' };
  }

  await ormPublic.Activity.where({ id: parsed.data.id }).update({
    status: parsed.data.status,
    signup: parsed.data.signup,
    updatedAt: new Date(),
  });

  revalidatePath('/atividades');
  revalidatePath('/docente');
  revalidatePath('/docente/atividades');

  return { ok: true, message: 'Atividade atualizada.' };
}

export async function createAvisoAction(input: {
  title: string;
  body: string;
  category?: string;
  target?: string;
  until?: string;
  published?: boolean;
}): Promise<ActionResult> {
  const authCheck = await requireDocenteSession();
  if (!authCheck.ok) return authCheck;

  const parsed = avisoCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Dados do aviso inválidos.',
    };
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  await ormPublic.Aviso.create({
    title: parsed.data.title,
    body: parsed.data.body,
    category: parsed.data.category,
    target: parsed.data.target,
    date: todayIso,
    until: parsed.data.until,
    published: parsed.data.published,
    updatedAt: new Date(),
  });

  revalidatePath('/');
  revalidatePath('/avisos');
  revalidatePath('/docente');

  return { ok: true, message: 'Aviso salvo com sucesso.' };
}

export async function toggleAvisoPublishedAction(input: {
  id: number;
  published: boolean;
}): Promise<ActionResult> {
  const authCheck = await requireDocenteSession();
  if (!authCheck.ok) return authCheck;

  const parsed = avisoToggleSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'Parâmetro inválido para publicar/ocultar aviso.' };
  }

  await ormPublic.Aviso.where({ id: parsed.data.id }).update({
    published: parsed.data.published,
    updatedAt: new Date(),
  });

  revalidatePath('/');
  revalidatePath('/avisos');
  revalidatePath('/docente');

  return { ok: true, message: 'Status do aviso atualizado.' };
}

export async function createMonitoriaAction(input: {
  title: string;
  year: '1' | '2' | '3' | 'Todos';
  exclusive?: string;
  daysJson: string;
  start: string;
  end: string;
  place: string;
  monitor: string;
}): Promise<ActionResult> {
  const authCheck = await requireDocenteSession();
  if (!authCheck.ok) return authCheck;

  const parsed = monitoriaCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Dados da monitoria inválidos.',
    };
  }

  await ormPublic.Monitoria.create({
    title: parsed.data.title,
    year: parsed.data.year,
    exclusive: parsed.data.exclusive ?? '',
    days: parsed.data.daysJson,
    start: parsed.data.start,
    end: parsed.data.end,
    place: parsed.data.place,
    monitor: parsed.data.monitor,
    updatedAt: new Date(),
  });

  revalidatePath('/atividades/monitorias');
  revalidatePath('/docente');
  revalidatePath('/docente/monitorias');

  return { ok: true, message: 'Monitoria cadastrada com sucesso.' };
}

export async function moderateGalleryPhotoAction(input: {
  id: number;
  status: 'approved' | 'rejected';
}): Promise<ActionResult> {
  const authCheck = await requireDocenteSession();
  if (!authCheck.ok) return authCheck;

  const parsed = galleryModerateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'Ação de moderação inválida.' };
  }

  const photos = await ormPublic.GalleryPhoto.all();
  const photo = (Array.isArray(photos) ? photos : []).find(
    (p: Record<string, unknown>) => Number(p.id) === parsed.data.id
  ) as Record<string, unknown> | undefined;

  if (!photo) {
    return { ok: false, message: 'Foto não encontrada.' };
  }

  if (parsed.data.status === 'approved') {
    const hasLgpd = Boolean(photo.lgpdConsent);
    const hasGuardian = Boolean(photo.guardianAuth);
    if (!hasLgpd || !hasGuardian) {
      return {
        ok: false,
        message: 'Aprovação bloqueada: requer consentimento LGPD e autorização do responsável.',
      };
    }
  }

  await ormPublic.GalleryPhoto.where({ id: parsed.data.id }).update({
    status: parsed.data.status,
    approvedBy: parsed.data.status === 'approved' ? authCheck.email : null,
    updatedAt: new Date(),
  });

  revalidatePath('/galeria');
  revalidatePath('/docente');

  return {
    ok: true,
    message: parsed.data.status === 'approved' ? 'Foto aprovada na galeria.' : 'Foto rejeitada.',
  };
}