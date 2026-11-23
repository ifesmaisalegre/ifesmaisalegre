'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createInscricaoAction } from '@/app/actions';

type Fields = { name: string; matricula: string; email: string; phone: string };
const EMPTY: Fields = { name: '', matricula: '', email: '', phone: '' };

export function RegistrationForm({
  activitySlug,
  activityName,
}: {
  activitySlug: string;
  activityName: string;
}) {
  const [form, setForm] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | 'consent', string>>>({});
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: '' }));
    setServerError('');
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    const er: typeof errors = {};
    if (!form.name.trim()) er.name = 'Informe seu nome completo.';
    if (!form.matricula.trim()) er.matricula = 'Informe sua matrícula.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = 'Informe um e-mail válido.';
    if (!form.phone.trim()) er.phone = 'Informe um telefone para contato.';
    if (!consent) er.consent = 'Marque a autorização para enviar a inscrição.';
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    setSubmitting(true);
    try {
      const res = await createInscricaoAction({
        name: form.name.trim(),
        matricula: form.matricula.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        activitySlug,
        activityName,
        privacyOk: consent,
      });
      if (!res.ok) {
        setServerError(res.message);
        setSubmitting(false);
        return;
      }
      setSent(true);
    } catch {
      setServerError('Não foi possível enviar a inscrição agora.');
    } finally {
      setSubmitting(false);
    }
  }

  function again() {
    setSent(false);
    setConsent(false);
    setForm(EMPTY);
    setErrors({});
    setServerError('');
  }

  if (sent) {
    return (
      <>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Inscrição enviada!</h2>
        <p role="status" className="status status-ok">
          Recebemos sua inscrição em {activityName}. O docente responsável entrará em contato.
        </p>
        <div>
          <button type="button" className="btn btn-outline" onClick={again}>Nova inscrição</button>
        </div>
      </>
    );
  }

  const field = (key: keyof Fields, id: string, label: string, type: string) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        className="input"
        value={form[key]}
        onChange={set(key)}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? `${id}-err` : undefined}
      />
      {errors[key] && <p id={`${id}-err`} className="err">{errors[key]}</p>}
    </div>
  );

  return (
    <form className="form" onSubmit={submit} noValidate>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Quero participar</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)' }}>Preencha seus dados para se inscrever em {activityName}.</p>
      {field('name', 'i-name', 'Nome completo', 'text')}
      {field('matricula', 'i-mat', 'Matrícula', 'text')}
      {field('email', 'i-mail', 'E-mail', 'email')}
      {field('phone', 'i-tel', 'Telefone', 'tel')}
      <div className="field">
        <label htmlFor="i-priv" className="check" style={{ fontWeight: 400, color: 'var(--ink)' }}>
          <input
            id="i-priv"
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setErrors((er) => ({ ...er, consent: '' }));
              setServerError('');
            }}
          />
          <span>
            Li e concordo com a <Link href="/privacidade">política de privacidade</Link>. Autorizo o uso destes dados para organizar a atividade.
          </span>
        </label>
        {errors.consent && <p className="err">{errors.consent}</p>}
      </div>
      {serverError && <p role="alert" className="status status-err">{serverError}</p>}
      <div>
        <button type="submit" className="btn btn-lg" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Enviar inscrição'}
        </button>
      </div>
    </form>
  );
}