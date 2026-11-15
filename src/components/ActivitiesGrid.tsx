'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Activity } from '@/lib/types';

const FILTERS = ['Todas', 'Esporte', 'Cultura e arte', 'Estudos', 'Jogos'] as const;

export function ActivitiesGrid({ activities }: { activities: Activity[] }) {
  const [cat, setCat] = useState<(typeof FILTERS)[number]>('Todas');
  const list = cat === 'Todas' ? activities : activities.filter((a) => a.category === cat);

  return (
    <>
      <div role="group" aria-label="Filtrar atividades por categoria" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {FILTERS.map((f) => (
          <button key={f} type="button" className="filter-btn" aria-pressed={cat === f} onClick={() => setCat(f)}>
            {f}
          </button>
        ))}
      </div>
      <div className="cards" style={{ gap: 20 }}>
        {list.map((a) => (
          <Link key={a.id} href={`/atividades/${a.slug}`} className="tile-card" style={{ flex: '1 1 240px' }}>
            <div className="tile" style={{ height: 170, background: a.tone }}>
              <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
                <path d="M14 4h12v10h10v12H26v10H14V26H4V14h10z" fill="#FFFFFF" fillOpacity="0.75" stroke="#14703F" strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ padding: '16px 20px 18px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{a.name}</h2>
              <span className="chip chip-blue">{a.category}</span>{' '}
              <span className={`chip ${a.signup === 'nao' ? 'chip-green' : 'chip-amber'}`}>
                {a.signup === 'nao' ? 'Sem inscrição' : 'Com inscrição'}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {list.length === 0 && (
        <p role="status" className="hint">
          Nenhuma atividade nesta categoria.
        </p>
      )}
    </>
  );
}
