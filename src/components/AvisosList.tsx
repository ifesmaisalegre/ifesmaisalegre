'use client';

import { useState } from 'react';
import type { Aviso } from '@/lib/types';
import { AvisoCard } from './AvisoCard';

const FILTERS = ['Todos', 'Urgente', 'Evento', 'Atividade', 'Geral'] as const;

export function AvisosList({ avisos }: { avisos: Aviso[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Todos');
  const shown = filter === 'Todos' ? avisos : avisos.filter((a) => a.category === filter);

  return (
    <>
      <div role="group" aria-label="Filtrar avisos por tipo" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {FILTERS.map((f) => (
          <button key={f} type="button" className="filter-btn" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {shown.map((a) => (
          <li key={a.id}>
            <AvisoCard aviso={a} />
          </li>
        ))}
      </ul>
      {shown.length === 0 && (
        <p role="status" className="empty" style={{ textAlign: 'center' }}>
          Nenhum aviso deste tipo no momento.
        </p>
      )}
    </>
  );
}
