import type { Aviso, AvisoTipo } from '@/lib/types';
import { fmtDate } from '@/lib/format';

export const AVISO_CHIP: Record<AvisoTipo, string> = {
  Geral: 'chip-blue',
  Atividade: 'chip-green',
  Evento: 'chip-amber',
  Urgente: 'chip-red',
};

export function AvisoCard({ aviso }: { aviso: Aviso }) {
  return (
    <article style={{ background: '#fff', border: '1px solid var(--line)', borderLeft: '6px solid var(--blue)', borderRadius: 14, padding: '18px 22px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span className={`chip ${AVISO_CHIP[aviso.category]}`}>{aviso.category}</span>
        <span className="hint">Publicado em {fmtDate(aviso.date)}</span>
        {aviso.until && <span className="hint">· Válido até {fmtDate(aviso.until)}</span>}
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{aviso.title}</h2>
      <p style={{ color: 'var(--ink-2)' }}>{aviso.body}</p>
    </article>
  );
}
