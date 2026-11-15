'use client';

import Link from 'next/link';
import { useState } from 'react';

type Fields = { name: string; matricula: string; email: string; phone: string };
const EMPTY: Fields = { name: '', matricula: '', email: '', phone: '' };

/**
 * Formulário de inscrição em uma atividade.
 * TODO(back): enviar os dados para o servidor (Server Action ou rota de API), validar de novo lá,
 * impedir inscrição duplicada, controlar vagas e enviar e-mail de confirmação.
 */
export function RegistrationForm({ activityName }: { activityName: string }) {
  const [form, setForm] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | 'consent', string>>>({});
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: '' }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: typeof errors = {};
    if (!form.name.trim()) er.name = 'Informe seu nome completo.';
    if (!form.matricula.trim()) er.matricula = 'Informe sua matrícula.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = 'Informe um e-mail válido.';
    if (!form.phone.trim()) er.phone = 'Informe um telefone para contato.';
    if (!consent) er.consent = 'Marque a autorização para enviar a inscrição.';
    setErrors(er);
    if (Object.keys(er).length === 0) setSent(true);
  }

  function again() {
    setSent(false);
    setConsent(false);
    setForm(EMPTY);
    setErrors({});
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
          <input id="i-priv" type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setErrors((er) => ({ ...er, consent: '' })); }} />
          <span>
            Li e concordo com a <Link href="/privacidade">política de privacidade</Link>. Autorizo o uso destes dados para organizar a atividade.
          </span>
        </label>
        {errors.consent && <p className="err">{errors.consent}</p>}
      </div>
      <div>
        <button type="submit" className="btn btn-lg">Enviar inscrição</button>
      </div>
    </form>
  );
}
