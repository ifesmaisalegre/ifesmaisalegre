import { Star, Triangle } from './Logo';

export function Hero({
  title,
  subtitle,
  eyebrow,
  tone = 'blue',
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  tone?: 'blue' | 'green';
  children?: React.ReactNode;
}) {
  return (
    <section className={`hero ${tone === 'green' ? 'hero-green' : 'hero-blue'}`}>
      <Star size={110} className="deco" style={{ right: '4%', top: 14 }} />
      <Triangle style={{ position: 'absolute', right: '16%', bottom: 0, pointerEvents: 'none' }} />
      <div className="container">
        {children}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
