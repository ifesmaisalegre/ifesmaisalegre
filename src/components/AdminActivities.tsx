'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ACTIVITIES } from '@/data/activities';
import { DAY_FULL, DAY_ORDER, fmtRange } from '@/lib/format';
import type { Activity, ActivityStatus, Category, Day } from '@/lib/types';

const CATEGORIES: Category[] = ['Esporte', 'Cultura e arte', 'Estudos', 'Jogos', 'Bem-estar', 'Outra'];
const CAT_CHIP: Record<Category, string> = {
  Esporte: 'chip-amber', 'Cultura e arte': 'chip-lilac', Estudos: 'chip-blue', Jogos: 'chip-green', 'Bem-estar': 'chip-brown', Outra: 'chip-gray',
};
const STATUS_CHIP: Record<ActivityStatus, string> = {
  Ativa: 'chip-solid', 'Inscrições abertas': 'chip-solid', 'Inscrições encerradas': 'chip-amber', Inativa: 'chip-gray',
};
const COLS = '1.6fr 1.5fr 1.1fr 1fr 0.9fr 1.2fr 1.6fr';

type Form = {
  name: string; category: Category; description: string; start: string; end: string; place: string;
  responsible: string; email: string; spots: string; audience: string; status: ActivityStatus; signup: 'sim' | 'nao';
};
type Errors = Partial<Record<keyof Form | 'days', string>>;

const emptyForm = (): Form => ({
  name: '', category: 'Esporte', description: '', start: '', end: '', place: '', responsible: '', email: '',
  spots: '', audience: 'Todos os alunos', status: 'Inscrições abertas', signup: 'sim',
});

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Administração de atividades (criar, editar, excluir). Hoje na memória do navegador.
 * TODO(back): gravar no banco, proteger com login e enviar as fotos para armazenamento real.
 */
export function AdminActivities() {
  const [items, setItems] = useState<Activity[]>(ACTIVITIES);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState<Form>(emptyForm());
  const [days, setDays] = useState<Day[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [q, setQ] = useState('');
  const [fCat, setFCat] = useState('Todas');
  const [fStatus, setFStatus] = useState('Todas');

  const needsSignup = form.signup !== 'nao';
  const statuses: ActivityStatus[] = needsSignup ? ['Inscrições abertas', 'Inscrições encerradas', 'Inativa'] : ['Ativa', 'Inativa'];

  function openNew() {
    setView('form'); setEditingId(null); setForm(emptyForm()); setDays([]); setPhotos([]); setErrors({}); setNotice(''); setDeletingId(null);
  }
  function openEdit(a: Activity) {
    setView('form'); setEditingId(a.id); setDays(a.days.slice()); setPhotos(a.photos.slice()); setErrors({}); setNotice(''); setDeletingId(null);
    setForm({ name: a.name, category: a.category, description: a.description, start: a.start, end: a.end, place: a.place, responsible: a.responsible, email: a.email, spots: a.spots, audience: a.audience, status: a.status, signup: a.signup });
  }

  const upd = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  function setSignup(v: 'sim' | 'nao') {
    setForm((f) => {
      let status = f.status;
      if (v === 'nao' && status !== 'Inativa') status = 'Ativa';
      if (v === 'sim' && status === 'Ativa') status = 'Inscrições abertas';
      return { ...f, signup: v, status, spots: v === 'nao' ? '' : f.spots };
    });
    setErrors((e) => ({ ...e, spots: '' }));
  }

  function save() {
    const er: Errors = {};
    const need = (k: keyof Form, msg: string) => { if (!String(form[k] || '').trim()) er[k] = msg; };
    need('name', 'Informe o nome da atividade.');
    need('description', 'Escreva uma descrição para a atividade.');
    need('start', 'Informe o horário de início.');
    need('place', 'Informe o local.');
    need('responsible', 'Informe o docente responsável.');
    need('audience', 'Informe quem pode participar.');
    need('email', 'Informe um e-mail de contato.');
    if (needsSignup) need('spots', 'Informe o número de vagas.');
    if (!er.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = 'Informe um e-mail válido.';
    if (needsSignup && !er.spots) {
      const n = Number(form.spots);
      if (!Number.isInteger(n) || n < 1) er.spots = 'Use um número inteiro maior que zero.';
    }
    if (!er.start && form.end && form.end <= form.start) er.end = 'O término deve ser depois do início.';
    if (days.length === 0) er.days = 'Escolha pelo menos um dia da semana.';
    setErrors(er);
    if (Object.keys(er).some((k) => er[k as keyof Errors])) return;

    const sortedDays = DAY_ORDER.filter((d) => days.includes(d));
    const base = {
      name: form.name.trim(), category: form.category, description: form.description.trim(), days: sortedDays,
      start: form.start, end: form.end, place: form.place.trim(), responsible: form.responsible.trim(), email: form.email.trim(),
      spots: needsSignup ? form.spots.trim() : '', audience: form.audience.trim(), status: form.status, signup: form.signup, photos: photos.slice(),
    };
    if (editingId !== null) {
      setItems((l) => l.map((x) => (x.id === editingId ? { ...x, ...base } : x)));
      setNotice(`Atividade "${base.name}" atualizada.`);
    } else {
      setItems((l) => [...l, { ...base, id: Math.max(0, ...l.map((x) => x.id)) + 1, slug: slugify(base.name), tone: '#E6E9F8' }]);
      setNotice(`Atividade "${base.name}" criada.`);
    }
    setView('list'); setEditingId(null);
  }

  const qn = q.trim().toLowerCase();
  const visible = items.filter(
    (a) =>
      (!qn || `${a.name} ${a.responsible} ${a.place}`.toLowerCase().includes(qn)) &&
      (fCat === 'Todas' || a.category === fCat) &&
      (fStatus === 'Todas' || a.status === fStatus),
  );
  const errCount = Object.values(errors).filter(Boolean).length;

  const text = (key: keyof Form, id: string, label: string, opts: { type?: string; placeholder?: string; flex?: string; disabled?: boolean } = {}) => (
    <div className="field" style={{ flex: opts.flex ?? '1 1 260px' }}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={opts.type ?? 'text'} className="input" value={form[key]} placeholder={opts.placeholder} disabled={opts.disabled}
        aria-invalid={errors[key] ? true : undefined} onChange={(e) => upd(key, e.target.value as never)} />
      {errors[key] && <p className="err">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="container" style={{ padding: '28px 24px 56px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
          <Link href="/docente" style={{ fontWeight: 600 }}>← Voltar ao painel</Link>
          <Link href="/docente/monitorias" style={{ fontWeight: 600 }}>Gerenciar monitorias →</Link>
        </span>
        {view === 'list' && <button type="button" className="btn btn-lg" onClick={openNew}>+ Nova atividade</button>}
      </div>

      {notice && <p role="status" className="status status-ok" style={{ marginBottom: 16 }}>{notice}</p>}

      {view === 'list' && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600 }}>Atividades cadastradas</h2>
            <p role="status" style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>
              {visible.length} de {items.length} {items.length === 1 ? 'atividade' : 'atividades'}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
            <div className="field" style={{ flex: '2 1 260px' }}>
              <label htmlFor="f-q">Buscar</label>
              <input id="f-q" type="search" className="input" value={q} placeholder="Nome, responsável ou local" onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="field" style={{ flex: '1 1 170px' }}>
              <label htmlFor="f-cat">Categoria</label>
              <select id="f-cat" className="input" value={fCat} onChange={(e) => setFCat(e.target.value)}>
                {['Todas', ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field" style={{ flex: '1 1 170px' }}>
              <label htmlFor="f-st">Situação</label>
              <select id="f-st" className="input" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
                {['Todas', 'Inscrições abertas', 'Inscrições encerradas', 'Ativa', 'Inativa'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="table-wrap">
            <div style={{ minWidth: 1020 }}>
              <div className="t-head" style={{ gridTemplateColumns: COLS }}>
                <span>Atividade</span><span>Dias e horário</span><span>Local</span><span>Responsável</span><span>Vagas / inscrição</span><span>Situação</span><span>Ações</span>
              </div>
              {visible.map((a) => (
                <div key={a.id} className="t-row" style={{ gridTemplateColumns: COLS }}>
                  <span>
                    <span style={{ display: 'block', fontWeight: 600 }}>{a.name}</span>
                    <span className={`chip ${CAT_CHIP[a.category]}`}>{a.category}</span>
                    <span className="hint" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>
                      {a.photos.length === 0 ? 'Sem fotos' : a.photos.length === 1 ? '1 foto' : `${a.photos.length} fotos`}
                    </span>
                  </span>
                  <span>{a.days.join(', ')} · {fmtRange(a.start, a.end)}</span>
                  <span>{a.place}</span>
                  <span>{a.responsible}</span>
                  <span>{a.signup === 'nao' ? 'Sem inscrição' : a.spots}</span>
                  <span><span className={`chip ${STATUS_CHIP[a.status]}`}>{a.status}</span></span>
                  <span>
                    {deletingId === a.id ? (
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>Excluir esta atividade?</span>
                        <span className="actions">
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => { setItems((l) => l.filter((x) => x.id !== a.id)); setDeletingId(null); setNotice(`Atividade "${a.name}" excluída.`); }}>Sim, excluir</button>
                          <button type="button" className="btn btn-gray btn-sm" onClick={() => setDeletingId(null)}>Cancelar</button>
                        </span>
                      </span>
                    ) : (
                      <span className="actions">
                        <button type="button" className="btn btn-outline btn-sm" aria-label={`Editar ${a.name}`} onClick={() => openEdit(a)}>Editar</button>
                        <button type="button" className="btn btn-danger-outline btn-sm" aria-label={`Excluir ${a.name}`} onClick={() => { setDeletingId(a.id); setNotice(''); }}>Excluir</button>
                      </span>
                    )}
                  </span>
                </div>
              ))}
              {visible.length === 0 && (
                <p style={{ padding: '24px 20px', color: 'var(--ink-3)' }}>
                  {items.length === 0 ? 'Nenhuma atividade cadastrada. Clique em "Nova atividade" para começar.' : 'Nenhuma atividade encontrada com esses filtros.'}
                </p>
              )}
            </div>
          </div>
          <p className="hint" style={{ marginTop: 12 }}>Dados de exemplo apenas para demonstração do layout.</p>
        </>
      )}

      {view === 'form' && (
        <div className="card" style={{ padding: 28, maxWidth: 860 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{editingId !== null ? 'Editar atividade' : 'Nova atividade'}</h2>
          <p className="hint" style={{ marginBottom: 20 }}>Os campos marcados com * são obrigatórios. As fotos são opcionais.</p>
          {errCount > 0 && <p role="alert" className="status status-err" style={{ marginBottom: 18 }}>{errCount === 1 ? 'Corrija 1 campo para salvar.' : `Corrija ${errCount} campos para salvar.`}</p>}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
            {text('name', 'a-name', 'Nome da atividade *', { flex: '2 1 320px' })}
            <div className="field" style={{ flex: '1 1 200px' }}>
              <label htmlFor="a-cat">Categoria *</label>
              <select id="a-cat" className="input" value={form.category} onChange={(e) => upd('category', e.target.value as Category)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field" style={{ flex: '1 1 100%' }}>
              <label htmlFor="a-desc">Descrição *</label>
              <textarea id="a-desc" rows={4} className="input" value={form.description} placeholder="Explique em poucas linhas o que acontece na atividade"
                aria-invalid={errors.description ? true : undefined} onChange={(e) => upd('description', e.target.value)} />
              {errors.description && <p className="err">{errors.description}</p>}
            </div>

            <fieldset style={{ flex: '1 1 100%' }}>
              <legend className="legend" style={{ marginBottom: 8 }}>Dias da semana *</legend>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DAY_ORDER.map((d) => (
                  <label key={d} className={days.includes(d) ? 'pill on' : 'pill'}>
                    <input type="checkbox" checked={days.includes(d)} aria-label={DAY_FULL[d]}
                      onChange={() => { setDays((l) => (l.includes(d) ? l.filter((x) => x !== d) : [...l, d])); setErrors((e) => ({ ...e, days: '' })); }} />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
              {errors.days && <p className="err" style={{ marginTop: 6 }}>{errors.days}</p>}
            </fieldset>

            <fieldset style={{ flex: '1 1 100%' }}>
              <legend className="legend" style={{ marginBottom: 8 }}>A atividade precisa de inscrição prévia? *</legend>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <label className={needsSignup ? 'pill on' : 'pill'}>
                  <input type="radio" name="a-signup" checked={needsSignup} onChange={() => setSignup('sim')} /><span>Sim, exige inscrição</span>
                </label>
                <label className={!needsSignup ? 'pill on' : 'pill'}>
                  <input type="radio" name="a-signup" checked={!needsSignup} onChange={() => setSignup('nao')} /><span>Não, participação livre</span>
                </label>
              </div>
              <p className="hint" style={{ marginTop: 8 }}>Atividades sem inscrição prévia (como as monitorias) não mostram o formulário de inscrição nem o número de vagas no site.</p>
            </fieldset>

            {text('start', 'a-start', 'Início *', { type: 'time', flex: '1 1 160px' })}
            {text('end', 'a-end', 'Término (opcional)', { type: 'time', flex: '1 1 160px' })}
            {text('place', 'a-place', 'Local *', { placeholder: 'Ex.: Ginásio', flex: '2 1 260px' })}
            {text('responsible', 'a-resp', 'Docente responsável *')}
            {text('email', 'a-mail', 'E-mail de contato *', { type: 'email' })}
            {text('spots', 'a-spots', needsSignup ? 'Vagas *' : 'Vagas (não se aplica)', { type: 'number', flex: '1 1 140px', disabled: !needsSignup })}
            {text('audience', 'a-aud', 'Quem pode participar *', { placeholder: 'Ex.: Todos os alunos' })}
            <div className="field" style={{ flex: '1 1 260px' }}>
              <label htmlFor="a-status">Situação *</label>
              <select id="a-status" className="input" value={form.status} onChange={(e) => upd('status', e.target.value as ActivityStatus)}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="field" style={{ flex: '1 1 100%', padding: 16, background: '#f4f7f5', borderRadius: 12 }}>
              <label htmlFor="a-photo">Fotos da atividade (opcional)</label>
              <input id="a-photo" type="file" accept="image/*" multiple style={{ fontSize: 14 }}
                onChange={(e) => { const names = Array.from(e.target.files ?? []).map((f: File) => f.name); if (names.length) setPhotos((l) => [...l, ...names]); e.target.value = ''; }} />
              <p className="hint">Você pode escolher várias fotos de uma vez ou adicionar aos poucos. A primeira da lista é a capa. Sem fotos, o site mostra uma imagem padrão com o logo.</p>
              {/* TODO(back): enviar os arquivos para armazenamento real; hoje só guardamos os nomes. */}
              {photos.length > 0 && (
                <>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
                    <span role="status" style={{ fontSize: 14, fontWeight: 600 }}>{photos.length === 1 ? '1 foto adicionada' : `${photos.length} fotos adicionadas`}</span>
                    <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => setPhotos([])}>Remover todas</button>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {photos.map((name, idx) => (
                      <li key={`${name}-${idx}`} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '6px 6px 6px 12px', background: '#fff', border: '1px solid #d5e0da', borderRadius: 10 }}>
                        <span style={{ fontSize: 14 }}><strong style={{ fontWeight: 600 }}>{idx === 0 ? 'Capa' : `Foto ${idx + 1}`}</strong> · {name}</span>
                        <button type="button" className="btn btn-danger-outline btn-sm" aria-label={`Remover ${name}`} onClick={() => setPhotos((l) => l.filter((_, k) => k !== idx))}>Remover</button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="actions" style={{ marginTop: 24, gap: 10 }}>
            <button type="button" className="btn btn-lg" onClick={save}>{editingId !== null ? 'Salvar alterações' : 'Criar atividade'}</button>
            <button type="button" className="btn btn-lg btn-gray" onClick={() => { setView('list'); setEditingId(null); setErrors({}); }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
