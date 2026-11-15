const STAR = '50,0 61,30 90,15 70,40 100,50 70,60 90,85 61,70 50,100 39,70 10,85 30,60 0,50 30,40 10,15 39,30';

export function Star({ size = 100, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={className} style={style}>
      <polygon points={STAR} fill="#DDA3F0" />
    </svg>
  );
}

export function Triangle({ width = 130, height = 90, color = '#F59E0B', style }: { width?: number; height?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={style}>
      <polygon points="0,100 50,0 100,100" fill={color} />
    </svg>
  );
}

/** Logo: cruz laranja com contorno verde e duas estrelas lilás atrás. */
export function Logo({ size = 46, label }: { size?: number; label?: string }) {
  const decorative = !label;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={label}
    >
      <g transform="translate(25 -3) scale(0.26)"><polygon points={STAR} fill="#DDA3F0" /></g>
      <g transform="translate(-2 28) scale(0.26)"><polygon points={STAR} fill="#DDA3F0" /></g>
      <g transform="translate(5 5)">
        <path d="M14 4h12v10h10v12H26v10H14V26H4V14h10z" fill="#F79005" stroke="#0F6B43" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
