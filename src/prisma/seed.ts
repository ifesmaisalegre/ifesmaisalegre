import { db } from './db';
import { ACTIVITIES } from '../data/activities';
import { MONITORIAS } from '../data/monitorias';
import { AVISOS } from '../data/avisos';
import { DOCENTES, EMAIL_DOMAIN } from '../data/docentes';
import { GALLERY_PHOTOS } from '../data/docente-demo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ormPublic = (db as unknown as { orm: { public: Record<string, any> } }).orm.public;

async function seed() {
  const docenteTbl = ormPublic.Docente;
  const existingDocentes = await docenteTbl.all();
  const existingEmails = new Set(
    (Array.isArray(existingDocentes) ? existingDocentes : []).map((d: Record<string, unknown>) =>
      String(d.email ?? '')
    )
  );

  for (const d of DOCENTES) {
    const email = `${d.emailUser}@${EMAIL_DOMAIN}`;
    if (!existingEmails.has(email)) {
      await docenteTbl.create({
        name: d.name,
        email,
        emailUser: d.emailUser,
        active: true,
        updatedAt: new Date(),
      });
    }
  }

  const activityTbl = ormPublic.Activity;
  const existingActivities = await activityTbl.all();
  const existingSlugs = new Set(
    (Array.isArray(existingActivities) ? existingActivities : []).map((a: Record<string, unknown>) =>
      String(a.slug ?? '')
    )
  );

  for (const act of ACTIVITIES) {
    const spotsNum = act.spots && /^\d+$/.test(act.spots) ? Number(act.spots) : null;
    if (!existingSlugs.has(act.slug)) {
      await activityTbl.create({
        slug: act.slug,
        name: act.name,
        category: act.category,
        description: act.description,
        days: JSON.stringify(act.days),
        start: act.start,
        end: act.end,
        place: act.place,
        responsible: act.responsible,
        email: act.email,
        spots: spotsNum,
        audience: act.audience,
        status: act.status,
        signup: act.signup,
        tone: act.tone,
        updatedAt: new Date(),
      });
    }
  }

  const monitoriaTbl = ormPublic.Monitoria;
  const existingMonitorias = await monitoriaTbl.all();
  if (!Array.isArray(existingMonitorias) || existingMonitorias.length === 0) {
    for (const mon of MONITORIAS) {
      await monitoriaTbl.create({
        title: mon.title,
        year: mon.year,
        exclusive: mon.exclusive,
        days: JSON.stringify(mon.days),
        start: mon.start,
        end: mon.end,
        place: mon.place,
        monitor: mon.monitor,
        updatedAt: new Date(),
      });
    }
  }

  const avisoTbl = ormPublic.Aviso;
  const existingAvisos = await avisoTbl.all();
  if (!Array.isArray(existingAvisos) || existingAvisos.length === 0) {
    for (const av of AVISOS) {
      await avisoTbl.create({
        title: av.title,
        body: av.body,
        category: av.category,
        target: av.target,
        date: av.date,
        until: av.until,
        published: av.published,
        updatedAt: new Date(),
      });
    }
  }

  const photoTbl = ormPublic.GalleryPhoto;
  const existingPhotos = await photoTbl.all();
  const existingCodes = new Set(
    (Array.isArray(existingPhotos) ? existingPhotos : []).map((p: Record<string, unknown>) =>
      String(p.code ?? '')
    )
  );

  for (const ph of GALLERY_PHOTOS) {
    if (!existingCodes.has(ph.code)) {
      await photoTbl.create({
        code: ph.code,
        imageUrl: null,
        caption: null,
        date: ph.date,
        status: ph.status,
        tone: ph.tone,
        lgpdConsent: true,
        guardianAuth: true,
        updatedAt: new Date(),
      });
    }
  }

  console.log('Seed do IFES+Alegre concluído com sucesso.');
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});