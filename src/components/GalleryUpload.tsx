'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Envio de foto para a galeria (fica pendente até um docente aprovar).
 * TODO(back): enviar o arquivo para armazenamento real, com limite de tamanho e tipo.
 */
export function GalleryUpload() {
  const [open, setOpen] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const ready = hasFile && consent;

  function toggle() {
    setOpen((v) => !v);
    setSent(false);
    setConsent(false);
    setHasFile(false);
  }

  return (
    <div style={{ marginBottom: 28 }}>
      <button type="button" className="btn btn-lg btn-orange" style={{ border: 0 }} onClick={toggle} aria-expanded={open}>
        Envie sua foto!
      </button>
      {open && (
        <form
          className="card form"
          style={{ marginTop: 16, maxWidth: 520, padding: 22, gap: 12 }}
          onSubmit={(e) => { e.preventDefault(); if (ready) setSent(true); }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 600 }}>Enviar foto para avaliação</h2>
          <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>Os docentes avaliam a foto antes de ela aparecer na galeria.</p>
          <div className="field">
            <label htmlFor="g-file">Escolha a foto</label>
            <input id="g-file" type="file" accept="image/*" style={{ fontSize: 14 }} onChange={(e) => { setHasFile(!!e.target.files?.length); setSent(false); }} />
          </div>
          <label htmlFor="g-consent" className="check">
            <input id="g-consent" type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setSent(false); }} />
            <span>
              Autorizo a utilização e a publicação desta foto no site do IFES+Alegre. Se houver menores de 18 anos na foto, declaro ter a autorização dos responsáveis.{' '}
              <Link href="/privacidade">Política de privacidade</Link>.
            </span>
          </label>
          <div>
            <button type="submit" className="btn" disabled={!ready}>Enviar para avaliação</button>
            {!ready && <p className="hint" style={{ marginTop: 8 }}>{!hasFile ? 'Escolha uma foto para poder enviar.' : 'Marque a autorização para poder enviar.'}</p>}
          </div>
          {sent && <p role="status" className="status status-ok">Foto enviada! Ela aparecerá na galeria depois da aprovação dos docentes.</p>}
        </form>
      )}
    </div>
  );
}
