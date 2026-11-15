/** Espaço reservado para foto. TODO(front): trocar por <Image> quando houver fotos reais. */
export function PhotoPlaceholder({ tone, ratio = '4/3' }: { tone: string; ratio?: string }) {
  return (
    <div className="tile" style={{ aspectRatio: ratio, borderRadius: 10, background: tone }}>
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#3C4741" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Espaço da foto">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="M21 16l-5-5-8 9" />
      </svg>
    </div>
  );
}
