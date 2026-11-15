import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';

export const metadata: Metadata = { title: 'Política de privacidade' };

// TODO(front): texto MODELO. A coordenação do campus precisa revisar antes da publicação oficial.
const SECTIONS = [
  { title: 'Quais dados coletamos', text: 'Na inscrição em uma atividade pedimos nome, matrícula, e-mail e telefone. No envio de fotos para a galeria, recebemos a imagem enviada.' },
  { title: 'Para que usamos', text: 'Os dados de inscrição servem apenas para que o docente responsável organize a atividade e entre em contato. As fotos são publicadas na galeria somente depois da avaliação dos docentes.' },
  { title: 'Fotos e autorização', text: 'Ao enviar uma foto, você autoriza a sua publicação no site. Se aparecerem menores de 18 anos, é necessária a autorização do responsável. Você pode pedir a remoção de uma foto a qualquer momento.' },
  { title: 'Compartilhamento', text: 'Os dados não são vendidos nem compartilhados com terceiros, exceto quando exigido por lei.' },
  { title: 'Seus direitos', text: 'Você pode pedir acesso, correção ou exclusão dos seus dados pelo telefone (27) 3083-4310 ou procurando a coordenação do campus.' },
];

export default function PrivacidadePage() {
  return (
    <main>
      <Hero tone="green" title="Política de privacidade" subtitle="Como tratamos os dados e as fotos enviados ao site." />
      <div className="container" style={{ maxWidth: 820, padding: '36px 24px 56px' }}>
        <p role="note" style={{ marginBottom: 28, padding: '12px 16px', borderRadius: 10, background: '#fde9c8', color: '#5b3a00', fontSize: 14 }}>
          Texto modelo. Deve ser revisado pela coordenação do campus antes da publicação oficial.
        </p>
        {SECTIONS.map((s) => (
          <section key={s.title} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>{s.title}</h2>
            <p style={{ color: 'var(--ink-2)' }}>{s.text}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
