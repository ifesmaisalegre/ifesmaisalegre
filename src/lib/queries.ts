import { db } from '@/prisma/db';
import type { Activity, Aviso, Day, GalleryPhoto, Inscricao, Monitoria } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ormPublic = (db as unknown as { orm: { public: Record<string, any> } }).orm.public;

function parseDays(raw: unknown): Day[] {
  if (typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Day[]) : [];
  } catch {
    return [];
  }
}

export async function getActivitiesFromDb(): Promise<Activity[]> {
  const rows = await ormPublic.Activity.all();
  const list = Array.isArray(rows) ? rows : [];

  return list
    .filter((r: Record<string, unknown>) => String(r.status ?? '') !== 'Inativa')
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => Number(a.id ?? 0) - Number(b.id ?? 0))
    .map((r: Record<string, unknown>, idx: number) => ({
      id: Number(r.id ?? idx + 1),
      slug: String(r.slug ?? ''),
      name: String(r.name ?? ''),
      category: String(r.category ?? 'Outra') as Activity['category'],
      description: String(r.description ?? ''),
      days: parseDays(r.days),
      start: String(r.start ?? ''),
      end: String(r.end ?? ''),
      place: String(r.place ?? ''),
      responsible: String(r.responsible ?? 'A definir'),
      email: String(r.email ?? ''),
      spots: r.spots === null || r.spots === undefined ? '' : String(r.spots),
      audience: String(r.audience ?? 'Todos os alunos'),
      status: String(r.status ?? 'Inscrições abertas') as Activity['status'],
      signup: r.signup === 'nao' ? 'nao' : 'sim',
      photos: [],
      tone: String(r.tone ?? '#E6E9F8'),
    }));
}

export async function getActivityBySlugFromDb(slug: string): Promise<Activity | undefined> {
  const all = await getActivitiesFromDb();
  return all.find((a) => a.slug === slug);
}

export async function getActiveAvisosFromDb(todayIso: string): Promise<Aviso[]> {
  const rows = await ormPublic.Aviso.all();
  const list = Array.isArray(rows) ? rows : [];

  return list
    .filter((r: Record<string, unknown>) => {
      const published = Boolean(r.published);
      const until = String(r.until ?? '');
      return published && (!until || until >= todayIso);
    })
    .sort(
      (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(b.date ?? '').localeCompare(String(a.date ?? '')) || Number(b.id ?? 0) - Number(a.id ?? 0)
    )
    .map((r: Record<string, unknown>, idx: number) => ({
      id: Number(r.id ?? idx + 1),
      title: String(r.title ?? ''),
      body: String(r.body ?? ''),
      category: String(r.category ?? 'Geral') as Aviso['category'],
      target: String(r.target ?? 'Todas as atividades'),
      date: String(r.date ?? ''),
      until: String(r.until ?? ''),
      published: Boolean(r.published),
    }));
}

export async function getApprovedGalleryPhotosFromDb(): Promise<GalleryPhoto[]> {
  const rows = await ormPublic.GalleryPhoto.all();
  const list = Array.isArray(rows) ? rows : [];

  return list
    .filter((r: Record<string, unknown>) => String(r.status ?? '') === 'approved')
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => Number(b.id ?? 0) - Number(a.id ?? 0))
    .map((r: Record<string, unknown>, idx: number) => ({
      id: Number(r.id ?? idx + 1),
      code: String(r.code ?? ''),
      imageUrl: typeof r.imageUrl === 'string' && r.imageUrl.trim() ? r.imageUrl : null,
      caption: typeof r.caption === 'string' && r.caption.trim() ? r.caption : null,
      date: String(r.date ?? ''),
      status: 'approved',
      tone: String(r.tone ?? '#E6E9F8'),
    }));
}

export async function getMonitoriasFromDb(): Promise<Monitoria[]> {
  const rows = await ormPublic.Monitoria.all();
  const list = Array.isArray(rows) ? rows : [];

  return list
    .sort(
      (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.year ?? '').localeCompare(String(b.year ?? '')) || Number(a.id ?? 0) - Number(b.id ?? 0)
    )
    .map((r: Record<string, unknown>, idx: number) => ({
      id: Number(r.id ?? idx + 1),
      title: String(r.title ?? ''),
      year: String(r.year ?? '1') as Monitoria['year'],
      exclusive: String(r.exclusive ?? ''),
      days: parseDays(r.days),
      start: String(r.start ?? ''),
      end: String(r.end ?? ''),
      place: String(r.place ?? ''),
      monitor: String(r.monitor ?? ''),
    }));
}

export async function getAllAvisosForDocenteFromDb(): Promise<Aviso[]> {
  const rows = await ormPublic.Aviso.all();
  const list = Array.isArray(rows) ? rows : [];

  return list
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => Number(b.id ?? 0) - Number(a.id ?? 0))
    .map((r: Record<string, unknown>, idx: number) => ({
      id: Number(r.id ?? idx + 1),
      title: String(r.title ?? ''),
      body: String(r.body ?? ''),
      category: String(r.category ?? 'Geral') as Aviso['category'],
      target: String(r.target ?? 'Todas as atividades'),
      date: String(r.date ?? ''),
      until: String(r.until ?? ''),
      published: Boolean(r.published),
    }));
}

export async function getAllPhotosForDocenteFromDb(): Promise<GalleryPhoto[]> {
  const rows = await ormPublic.GalleryPhoto.all();
  const list = Array.isArray(rows) ? rows : [];

  return list
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => Number(b.id ?? 0) - Number(a.id ?? 0))
    .map((r: Record<string, unknown>, idx: number) => {
      const rawStatus = String(r.status ?? 'pending');
      const status: GalleryPhoto['status'] =
        rawStatus === 'approved' || rawStatus === 'rejected' ? rawStatus : 'pending';
      return {
        id: Number(r.id ?? idx + 1),
        code: String(r.code ?? ''),
        imageUrl: typeof r.imageUrl === 'string' && r.imageUrl.trim() ? r.imageUrl : null,
        caption: typeof r.caption === 'string' && r.caption.trim() ? r.caption : null,
        date: String(r.date ?? ''),
        status,
        tone: String(r.tone ?? '#E6E9F8'),
      };
    });
}

export async function getInscricoesFromDb(): Promise<Inscricao[]> {
  const rows = await ormPublic.Inscricao.all();
  const list = Array.isArray(rows) ? rows : [];

  return list
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => Number(b.id ?? 0) - Number(a.id ?? 0))
    .map((r: Record<string, unknown>, idx: number) => ({
      id: Number(r.id ?? idx + 1),
      name: String(r.name ?? ''),
      matricula: String(r.matricula ?? ''),
      email: String(r.email ?? ''),
      phone: String(r.phone ?? ''),
      activity: String(r.activityName ?? ''),
      date: String(r.date ?? ''),
    }));
}

export async function getInscricoesByActivitySlugFromDb(activitySlug: string): Promise<Inscricao[]> {
  const rows = await ormPublic.Inscricao.all();
  const list = Array.isArray(rows) ? rows : [];

  return list
    .filter((r: Record<string, unknown>) => String(r.activitySlug ?? '') === activitySlug)
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => Number(b.id ?? 0) - Number(a.id ?? 0))
    .map((r: Record<string, unknown>, idx: number) => ({
      id: Number(r.id ?? idx + 1),
      name: String(r.name ?? ''),
      matricula: String(r.matricula ?? ''),
      email: String(r.email ?? ''),
      phone: String(r.phone ?? ''),
      activity: String(r.activityName ?? ''),
      date: String(r.date ?? ''),
    }));
}