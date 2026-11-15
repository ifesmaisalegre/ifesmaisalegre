import Link from 'next/link';
import { Logo } from './Logo';
import { FOOTER_LINKS, SITE } from '@/lib/site';

const icon = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#14703F', strokeWidth: 2, 'aria-hidden': true } as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid" style={{ padding: '48px 0 24px' }}>
          <div style={{ flex: '1.3 1 280px' }}>
            <div className="brand" style={{ marginBottom: 10 }}>
              <Logo />
              <span>{SITE.name}</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', maxWidth: 320 }}>{SITE.tagline}.</p>
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <h2>Navegação</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: '1.2 1 240px' }}>
            <h2>Campus de Alegre</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 12 }}>
              {SITE.addressLines.slice(0, 2).map((l) => (
                <span key={l}>{l}<br /></span>
              ))}
              <a href={SITE.phoneHref}>{SITE.phone}</a>
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <a className="social" href={SITE.socials.instagram} aria-label="Instagram do Ifes de Alegre">
                <svg {...icon}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="#14703F" /></svg>
              </a>
              <a className="social" href={SITE.socials.facebook} aria-label="Facebook do Ifes de Alegre">
                <svg {...icon} strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z" /></svg>
              </a>
              <a className="social" href={SITE.socials.youtube} aria-label="YouTube do Ifes de Alegre">
                <svg {...icon} strokeLinejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.5l5 2.5-5 2.5z" fill="#14703F" /></svg>
              </a>
            </div>
          </div>
        </div>
        <p className="footer-bottom" style={{ padding: '18px 0 28px' }}>
          Trabalho de conclusão 3ºTII · Projeto Integrador 2026. Projeto sem fins lucrativos do {SITE.institution}, Campus de Alegre.
        </p>
      </div>
    </footer>
  );
}
