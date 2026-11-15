'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AVISOS } from '@/data/avisos';
import { ACTIVITIES } from '@/data/activities';
import { GALLERY_PHOTOS, INSCRICOES } from '@/data/docente-demo';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { AVISO_CHIP } from './AvisoCard';
import { fmtDate, todayISO } from '@/lib/format';
import type { Aviso, AvisoTipo, GalleryPhoto, Inscricao, PhotoStatus } from '@/lib/types';

type Tab = 'overview' | 'avisos' | 'fotos' | 'inscr';

/**
 * Painel da Área Docente (visão geral, avisos, fotos da galeria e inscrições).
 * Hoje tudo fica na memória do navegador.
 * TODO(back): ler e gravar no banco e proteger a rota com login (somente docentes).
 */
export function DocentePanel() {
  const [tab, setTab] = useState<Tab>('overview');
  const [avisos, setAvisos] = useState<Aviso[]>(AVISOS);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(GALLERY_PHOTOS);
  const [inscr, setInscr] = useState<Inscricao[]>(INSCRICOES);
  const [photoTab, setPhotoTab] = useState<PhotoStatus>('pending');
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [delPhoto, setDelPhoto] = useState<number | null>(null);
  const [delInscr, setDelInscr] = useState<number | null>(null);

  // formulário de aviso
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [cat, setCat] = useState<AvisoTipo>('Geral');
  const [target, setTarget] = useState('Todas as atividades');
  const [until, setUntil] = useState('');
  const [error, setError] = useState('');

  const pend = photos.filter((p) => p.status === 'pending').length;
  const published = avisos.filter((a) => a.published).length;
  const latest = avisos.find((a) => a.published);
  const names = ACTIVITIES.map((a) => a.name);

  const go = (t: Tab) => { setTab(t); setNotice(''); setDelPhoto(null); setDelInscr(null); };

  function addAviso(isPublished: boolean) {
    if (!title.trim() || !body.trim()) { setError('Preencha o título e a mensagem do aviso.'); return; }
    setAvisos((list) => [
      { id: Math.max(0, ...list.map((a) => a.id)) + 1, title: title.trim(), body: body.trim(), category: cat, target, date: todayISO(), until, published: isPublished },
      ...list,
    ]);
    setTitle(''); setBody(''); setUntil(''); setError('');
  }

  const tabs: { id: Tab; label: string; count: string }[] = [
    { id: 'overview', label: 'Visão geral', count: '' },
    { id: 'avisos', label: 'Avisos', count: String(avisos.length) },
    { id: 'fotos', label: 'Fotos da galeria', count: String(pend) },
    { id: 'inscr', label: 'Inscrições', count: String(inscr.length) },
  ];

  const setStatus = (id: number, status: PhotoStatus) =>
    setPhotos((l) => l.map((p) => (p.id === id ? { ...p, status } : p)));

  const rows = inscr.filter((r) => filter === 'all' || r.activity === filter);

  const noticeEl = notice && <p role="status" className="status status-ok" style={{ marginBottom: 12 }}>{notice}</p>;

  return (
    <div className="container panel">
      <nav aria-label="Seções do painel" className="side">
        {tabs.map((t) => (
          <button key={t.id} type="button" aria-current={tab === t.id} onClick={() => go(t.id)}>
            <span>{t.label}</span>
            {t.count !== '' && <span className="badge">{t.count}</span>}
          </button>
        ))}
        <Link href="/docente/atividades"><span>Gerenciar atividades</span><span aria-hidden="true">→</span></Link>
        <Link href="/docente/monitorias"><span>Gerenciar monitorias</span><span aria-hidden="true">→</span></Link>
      </nav>

      <div style={{ flex: '999 1 560px', minWidth: 0 }}>
        {tab === 'overview' && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Visão geral</h2>
            <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Resumo do que precisa da sua atenção hoje.</p>
            <div className="cards" style={{ marginBottom: 24 }}>
              {[
                { label: 'Fotos aguardando avaliação', value: pend, to: 'fotos' as Tab },
                { label: 'Avisos publicados', value: published, to: 'avisos' as Tab },
                { label: 'Inscrições registradas', value: inscr.length, to: 'inscr' as Tab },
                { label: 'Atividades no campus', value: ACTIVITIES.length, to: 'inscr' as Tab },
              ].map((s) => (
                <button key={s.label} type="button" className="stat" style={{ flex: '1 1 200px' }} onClick={() => go(s.to)}>
                  <b>{s.value}</b>
                  <span style={{ display: 'block', marginTop: 6, fontSize: 14, color: 'var(--ink-2)' }}>{s.label}</span>
                </button>
              ))}
            </div>
            <div className="card">
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Último aviso publicado</h3>
              {latest ? (
                <>
                  <p style={{ fontWeight: 500 }}>{latest.title}</p>
                  <p className="hint" style={{ fontSize: 14, marginTop: 2 }}>{latest.category} · {fmtDate(latest.date)}</p>
                </>
              ) : (
                <p style={{ color: 'var(--ink-3)' }}>Nenhum aviso publicado ainda.</p>
              )}
            </div>
          </>
        )}

        {tab === 'avisos' && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Avisos</h2>
            <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Crie comunicados para os alunos. Só os avisos publicados e dentro da validade aparecem no site.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
              <form className="card form" style={{ flex: '1 1 320px' }} onSubmit={(e) => { e.preventDefault(); addAviso(true); }}>
                <h3 style={{ fontSize: 17, fontWeight: 600 }}>Novo aviso</h3>
                <div className="field">
                  <label htmlFor="f-title">Título</label>
                  <input id="f-title" className="input" value={title} placeholder="Ex.: Treino de vôlei remarcado" onChange={(e) => { setTitle(e.target.value); setError(''); }} />
                </div>
                <div className="field">
                  <label htmlFor="f-body">Mensagem</label>
                  <textarea id="f-body" rows={4} className="input" value={body} placeholder="Escreva o comunicado para os alunos" onChange={(e) => { setBody(e.target.value); setError(''); }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div className="field" style={{ flex: '1 1 130px' }}>
                    <label htmlFor="f-cat">Tipo</label>
                    <select id="f-cat" className="input" value={cat} onChange={(e) => setCat(e.target.value as AvisoTipo)}>
                      {(['Geral', 'Atividade', 'Evento', 'Urgente'] as AvisoTipo[]).map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field" style={{ flex: '1 1 160px' }}>
                    <label htmlFor="f-target">Destino</label>
                    <select id="f-target" className="input" value={target} onChange={(e) => setTarget(e.target.value)}>
                      {['Todas as atividades', ...names].map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="f-until">Válido até (opcional)</label>
                  <input id="f-until" type="date" className="input" value={until} onChange={(e) => setUntil(e.target.value)} />
                  <span className="hint" style={{ fontSize: 12 }}>Depois dessa data o aviso deixa de aparecer no site.</span>
                </div>
                {error && <p role="alert" className="status status-err">{error}</p>}
                <div className="actions">
                  <button type="submit" className="btn">Publicar aviso</button>
                  <button type="button" className="btn btn-outline" onClick={() => addAviso(false)}>Salvar rascunho</button>
                </div>
              </form>

              <div style={{ flex: '1.4 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {avisos.map((a) => (
                  <article key={a.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span className={`chip ${AVISO_CHIP[a.category]}`}>{a.category}</span>
                      <span className={`chip ${a.published ? 'chip-solid' : 'chip-gray'}`}>{a.published ? 'Publicado' : 'Rascunho'}</span>
                      <span className="hint" style={{ marginLeft: 'auto' }}>{fmtDate(a.date)}</span>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{a.title}</h3>
                    <p style={{ color: 'var(--ink-2)', marginBottom: 4 }}>{a.body}</p>
                    <p className="hint" style={{ marginBottom: 4 }}>{a.until ? `Válido até ${fmtDate(a.until)}` : 'Sem data de validade'}</p>
                    <p className="hint" style={{ marginBottom: 14 }}>Destino: {a.target}</p>
                    <div className="actions">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setAvisos((l) => l.map((x) => (x.id === a.id ? { ...x, published: !x.published } : x)))}>
                        {a.published ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => setAvisos((l) => l.filter((x) => x.id !== a.id))}>Excluir</button>
                    </div>
                  </article>
                ))}
                {avisos.length === 0 && <p className="empty">Nenhum aviso criado ainda.</p>}
              </div>
            </div>
          </>
        )}

        {tab === 'fotos' && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Fotos da galeria</h2>
            <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Avalie as fotos enviadas pelos alunos. Só as aprovadas aparecem na galeria do site.</p>
            {noticeEl}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {([['pending', 'Pendentes'], ['approved', 'Aprovadas'], ['rejected', 'Não aprovadas']] as [PhotoStatus, string][]).map(([id, label]) => (
                <button key={id} type="button" className="tab-btn" aria-pressed={photoTab === id} onClick={() => setPhotoTab(id)}>
                  {label} ({photos.filter((p) => p.status === id).length})
                </button>
              ))}
            </div>
            <div className="cards" style={{ gap: 16 }}>
              {photos.filter((p) => p.status === photoTab).map((p) => (
                <article key={p.id} className="card" style={{ flex: '1 1 210px', maxWidth: 280, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <PhotoPlaceholder tone={p.tone} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>Foto {p.code}</p>
                    <p className="hint">Enviada em {fmtDate(p.date)}</p>
                  </div>
                  {p.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" className="btn btn-sm" style={{ flex: 1 }} onClick={() => setStatus(p.id, 'approved')}>Aprovar</button>
                      <button type="button" className="btn btn-danger-outline btn-sm" style={{ flex: 1 }} onClick={() => setStatus(p.id, 'rejected')}>Recusar</button>
                    </div>
                  ) : (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setStatus(p.id, 'pending')}>Retornar para avaliação</button>
                  )}
                  {delPhoto === p.id ? (
                    <>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>Excluir esta foto definitivamente?</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => { setPhotos((l) => l.filter((x) => x.id !== p.id)); setDelPhoto(null); setNotice(`Foto ${p.code} excluída.`); }}>Sim, excluir</button>
                        <button type="button" className="btn btn-gray btn-sm" style={{ flex: 1 }} onClick={() => setDelPhoto(null)}>Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <button type="button" className="btn btn-danger-outline btn-sm" aria-label={`Excluir foto ${p.code}`} onClick={() => { setDelPhoto(p.id); setNotice(''); }}>Excluir foto</button>
                  )}
                </article>
              ))}
            </div>
            {photos.filter((p) => p.status === photoTab).length === 0 && (
              <p className="empty">{photoTab === 'pending' ? 'Nenhuma foto aguardando avaliação.' : photoTab === 'approved' ? 'Nenhuma foto aprovada ainda.' : 'Nenhuma foto não aprovada.'}</p>
            )}
          </>
        )}

        {tab === 'inscr' && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Controle de inscrições</h2>
            <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Veja quem se inscreveu em cada atividade.</p>
            {noticeEl}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <div className="field" style={{ flex: '0 1 300px' }}>
                <label htmlFor="f-filter">Filtrar por atividade</label>
                <select id="f-filter" className="input" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">Todas as atividades</option>
                  {names.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <p role="status" style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>{rows.length === 1 ? '1 inscrição' : `${rows.length} inscrições`}</p>
            </div>
            <div className="table-wrap">
              <div style={{ minWidth: 1000 }}>
                <div className="t-head" style={{ gridTemplateColumns: '1.4fr 1fr 1.6fr 1.1fr 1.2fr 0.9fr 1.5fr' }}>
                  <span>Aluno</span><span>Matrícula</span><span>E-mail</span><span>Telefone</span><span>Atividade</span><span>Inscrição</span><span>Ações</span>
                </div>
                {rows.map((r) => (
                  <div key={r.id} className="t-row" style={{ gridTemplateColumns: '1.4fr 1fr 1.6fr 1.1fr 1.2fr 0.9fr 1.5fr' }}>
                    <span style={{ fontWeight: 600 }}>{r.name}</span>
                    <span>{r.matricula}</span>
                    <span style={{ overflowWrap: 'anywhere' }}>{r.email}</span>
                    <span>{r.phone}</span>
                    <span>{r.activity}</span>
                    <span>{fmtDate(r.date)}</span>
                    <span>
                      {delInscr === r.id ? (
                        <span className="actions">
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => { setInscr((l) => l.filter((x) => x.id !== r.id)); setDelInscr(null); setNotice(`Inscrição de ${r.name} cancelada.`); }}>Confirmar</button>
                          <button type="button" className="btn btn-gray btn-sm" onClick={() => setDelInscr(null)}>Voltar</button>
                        </span>
                      ) : (
                        <button type="button" className="btn btn-danger-outline btn-sm" aria-label={`Cancelar inscrição de ${r.name}`} onClick={() => { setDelInscr(r.id); setNotice(''); }}>Cancelar inscrição</button>
                      )}
                    </span>
                  </div>
                ))}
                {rows.length === 0 && <p style={{ padding: '24px 20px', color: 'var(--ink-3)' }}>Nenhuma inscrição nesta atividade.</p>}
              </div>
            </div>
            <p className="hint" style={{ marginTop: 12 }}>Dados de exemplo apenas para demonstração do layout.</p>
          </>
        )}
      </div>
    </div>
  );
}
