import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container" style={{ maxWidth: 640, padding: '72px 24px 88px', textAlign: 'center' }}>
      <p style={{ fontSize: 72, fontWeight: 700, lineHeight: 1, color: 'var(--blue)' }}>404</p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--green-dark)', margin: '14px 0 10px' }}>Página não encontrada</h1>
      <p style={{ color: 'var(--ink-2)', marginBottom: 28 }}>O endereço que você tentou abrir não existe ou foi movido.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
        <Link href="/" className="btn btn-lg">Voltar para o início</Link>
        <Link href="/atividades" className="btn btn-lg btn-outline">Ver atividades</Link>
      </div>
    </main>
  );
}
