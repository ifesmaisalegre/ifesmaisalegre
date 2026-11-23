'use client';

import Link from 'next/link';
import { useState } from 'react';
import { deleteMonitoriaAction, upsertMonitoriaAction } from '@/app/actions';
import { DAY_FULL, fmtDaysShort, fmtRange } from '@/lib/format';
import type { Day, Monitoria } from '@/lib/types';

const DAYS: Day[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const COLS = '1.6fr 0.6fr 1.6fr 1.1fr 1.2fr 1.5fr 1.6fr';

type Form = {
  title: string;
  year: '1' | '2' | '3';
  exclusive: string;
  start: string;
  end: string;
  place: string;
  monitor: string;
};
type Errors = Partial<Record<keyof Form | 'days', string>>;
const emptyForm = (): Form => ({
  title: '',
  year: '1',
  exclusive: '',
  start: '15:40',
  end: '16:30',
  place: '',
  monitor: '',
});

export function AdminMonitorias({
  initialMonitorias = [],
}: {
  initialMonitorias?: Monitoria[];
}) {
  const [items, setItems] = useState<Monitoria[]>(initialMonitorias);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState<Form>(emptyForm());
  const [days, setDays] = useState<Day[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [q, setQ] = useState('');
  const [fYear, setFYear] = useState('all');

  function openNew() {
    setView('form');
    setEditingId(null);
    setForm(emptyForm());
    setDays([]);
    setErrors({});
    setNotice('');
    setDeletingId(null);
  }

  function openEdit(m: Monitoria) {
    setView('form');
    setEditingId(m.id);
    setDays(m.days.slice());
    setErrors({});
    setNotice('');
    setDeletingId(null);
    setForm({
      title: m.title,
      year: m.year,
      exclusive: m.exclusive,
      start: m.start,
      end: m.end,
      place: m.place,
      monitor: m.monitor,
    });
  }

  const upd = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  async function save() {
    const er: Errors = {};
    const need = (k: keyof Form, msg: string) => {
      if (!String(form[k] || '').trim()) er[k] = msg;
    };
    need('title', 'Informe a disciplina.');
    need('start', 'Informe o horário de início.');
    need('end', 'Informe o horário de término.');
    need('place', 'Informe o local.');
    need('monitor', 'Informe o(a) monitor(a).');
    if (!er.start && !er.end && form.end <= form.start) {
      er.end = 'O término deve ser depois do início.';
    }
    if (days.length === 0) er.days = 'Escolha pelo menos um dia.';
    setErrors(er);
    if (Object.keys(er).some((k) => er[k as keyof Errors])) return;

    const sortedDays = DAYS.filter((d) => days.includes(d));
    const rec = {
      title: form.title.trim(),
      year: form.year,
      exclusive: form.exclusive.trim(),
      days: sortedDays,
      start: form.start,
      end: form.end,
      place: form.place.trim(),
      monitor: form.monitor.trim(),
    };

    setSaving(true);
    try {
      const res = await upsertMonitoriaAction({
        id: editingId ?? undefined,
        title: rec.title,
        year: rec.year,
        exclusive: rec.exclusive,
        daysJson: JSON.stringify(rec.days),
        start: rec.start,
        end: rec.end,
        place: rec.place,
        monitor: rec.monitor,
      });

      if (!res.ok) {
        setNotice(res.message);
        return;
      }

      if (editingId !== null) {
        setItems((l) => l.map((x) => (x.id === editingId ? { ...rec, id: x.id } : x)));
      } else {
        setItems((l) => [
          ...l,
          { ...rec, id: res.data?.id ?? Math.max(0, ...l.map((x) => x.id)) + 1 },
        ]);
      }

      setNotice(res.message);
      setView('list');
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(m: Monitoria) {
    const res = await deleteMonitoriaAction({ id: m.id });
    setDeletingId(null);
    if (!res.ok) {
      setNotice(res.message);
      return;
    }
    setItems((l) => l.filter((x) => x.id !== m.id));
    setNotice(`Monitoria de "${m.title}" excluída.`);
  }

  const qn = q.trim().toLowerCase();
  const visible = items.filter(
    (m) =>
      (!qn || `${m.title} ${m.monitor}`.toLowerCase().includes(qn)) &&
      (fYear === 'all' || m.year === fYear)
  );
  const errCount = Object.values(errors).filter(Boolean).length;

  const text = (
    key: keyof Form,
    id: string,
    label: string,
    opts: { type?: string; placeholder?: string; flex?: string } = {}
  ) => (
    <div className="field" style={{ flex: opts.flex ?? '1 1 100%' }}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={opts.type ?? 'text'}
        className="input"
        value={form[key]}
        placeholder={opts.placeholder}
        aria-invalid={errors[key] ? true : undefined}
        onChange={(e) => upd(key, e.target.value as never)}
      />
      {errors[key] && <p className="err">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="container" style={{ padding: '28px 24px 56px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
          <Link href="/docente" style={{ fontWeight: 600 }}>← Voltar ao painel</Link>
          <Link href="/docente/atividades" style={{ fontWeight: 600 }}>Gerenciar atividades →</Link>
        </span>
        {view === 'list' && <button type="button" className="btn btn-lg" onClick={openNew}>+ Nova monitoria</button>}
      </div>

      {notice && <p role="status" className="status status-ok" style={{ marginBottom: 16 }}>{notice}</p>}

      {view === 'list' && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: '1 1 400px' }}>
              <div className="field" style={{ flex: '2 1 220px' }}>
                <label htmlFor="m-q">Buscar</label>
                <input id="m-q" type="search" className="input" value={q} placeholder="Disciplina ou monitor(a)" onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="field" style={{ flex: '1 1 140px' }}>
                <label htmlFor="m-y">Ano</label>
                <select id="m-y" className="input" value={fYear} onChange={(e) => setFYear(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="1">1º ano</option>
                  <option value="2">2º ano</option>
                  <option value="3">3º ano</option>
                </select>
              </div>
            </div>
            <p role="status" style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>
              {visible.length} de {items.length} {items.length === 1 ? 'monitoria' : 'monitorias'}
            </p>
          </div>
          <div className="table-wrap">
            <div style={{ minWidth: 980 }}>
              <div className="t-head" style={{ gridTemplateColumns: COLS }}>
                <span>Disciplina</span><span>Ano</span><span>Turma exclusiva</span><span>Dia e horário</span><span>Local</span><span>Monitor(a)</span><span>Ações</span>
              </div>
              {visible.map((m) => (
                <div key={m.id} className="t-row" style={{ gridTemplateColumns: COLS }}>
                  <span style={{ fontWeight: 600 }}>{m.title}</span>
                  <span>{m.year}º</span>
                  <span>{m.exclusive || 'Todas as turmas'}</span>
                  <span>{fmtDaysShort(m.days)} · {fmtRange(m.start, m.end)}</span>
                  <span>{m.place}</span>
                  <span>{m.monitor}</span>
                  <span>
                    {deletingId === m.id ? (
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>Excluir esta monitoria?</span>
                        <span className="actions">
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => void handleDelete(m)}>Sim, excluir</button>
                          <button type="button" className="btn btn-gray btn-sm" onClick={() => setDeletingId(null)}>Cancelar</button>
                        </span>
                      </span>
                    ) : (
                      <span className="actions">
                        <button type="button" className="btn btn-outline btn-sm" aria-label={`Editar ${m.title} ${m.year}º ano`} onClick={() => openEdit(m)}>Editar</button>
                        <button type="button" className="btn btn-danger-outline btn-sm" aria-label={`Excluir ${m.title} ${m.year}º ano`} onClick={() => { setDeletingId(m.id); setNotice(''); }}>Excluir</button>
                      </span>
                    )}
                  </span>
                </div>
              ))}
              {visible.length === 0 && (
                <p style={{ padding: '24px 20px', color: 'var(--ink-3)' }}>
                  {items.length === 0 ? 'Nenhuma monitoria cadastrada.' : 'Nenhuma monitoria encontrada com esses filtros.'}
                </p>
              )}
            </div>
          </div>
          <p className="hint" style={{ marginTop: 12 }}>As monitorias aparecem na página Monitorias, separadas por ano.</p>
        </>
      )}

      {view === 'form' && (
        <div className="card" style={{ padding: 28, maxWidth: 860 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{editingId !== null ? 'Editar monitoria' : 'Nova monitoria'}</h2>
          <p className="hint" style={{ marginBottom: 20 }}>Os campos marcados com * são obrigatórios.</p>
          {errCount > 0 && <p role="alert" className="status status-err" style={{ marginBottom: 18 }}>{errCount === 1 ? 'Corrija 1 campo para salvar.' : `Corrija ${errCount} campos para salvar.`}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
            {text('title', 'mm-title', 'Disciplina *', { flex: '2 1 300px' })}
            <div className="field" style={{ flex: '1 1 140px' }}>
              <label htmlFor="mm-year">Ano *</label>
              <select id="mm-year" className="input" value={form.year} onChange={(e) => upd('year', e.target.value as Form['year'])}>
                <option value="1">1º ano</option>
                <option value="2">2º ano</option>
                <option value="3">3º ano</option>
              </select>
            </div>
            {text('exclusive', 'mm-excl', 'Turma exclusiva (opcional)', { placeholder: 'Ex.: Exclusiva para 3ºTII' })}
            <fieldset style={{ flex: '1 1 100%' }}>
              <legend className="legend" style={{ marginBottom: 8 }}>Dias da semana *</legend>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DAYS.map((d) => (
                  <label key={d} className={days.includes(d) ? 'pill on' : 'pill'}>
                    <input
                      type="checkbox"
                      checked={days.includes(d)}
                      aria-label={DAY_FULL[d]}
                      onChange={() => {
                        setDays((l) => (l.includes(d) ? l.filter((x) => x !== d) : [...l, d]));
                        setErrors((e) => ({ ...e, days: '' }));
                      }}
                    />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
              {errors.days && <p className="err" style={{ marginTop: 6 }}>{errors.days}</p>}
            </fieldset>
            {text('start', 'mm-start', 'Início *', { type: 'time', flex: '1 1 160px' })}
            {text('end', 'mm-end', 'Término *', { type: 'time', flex: '1 1 160px' })}
            {text('place', 'mm-place', 'Local *', { placeholder: 'Ex.: Bloco C – Sala 2', flex: '2 1 260px' })}
            {text('monitor', 'mm-mon', 'Monitor(a) *')}
          </div>
          <div className="actions" style={{ marginTop: 24, gap: 10 }}>
            <button type="button" className="btn btn-lg" disabled={saving} onClick={() => void save()}>
              {saving ? 'Salvando...' : editingId !== null ? 'Salvar alterações' : 'Criar monitoria'}
            </button>
            <button type="button" className="btn btn-lg btn-gray" onClick={() => { setView('list'); setEditingId(null); setErrors({}); }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}