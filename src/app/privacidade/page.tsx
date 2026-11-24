import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Política de Privacidade e LGPD',
  description:
    'Diretrizes de tratamento de dados pessoais, inscrições e uso de imagens na plataforma IFES+Alegre.',
};

export default function PrivacidadePage() {
  return (
    <main>
      <Hero
        eyebrow="Transparência e LGPD"
        title="Política de Privacidade"
        subtitle="Como coletamos, utilizamos e protegemos os dados pessoais e registros fotográficos da comunidade acadêmica do IFES · Campus de Alegre."
      />

      <div
        className="container"
        style={{
          maxWidth: 860,
          padding: '40px 16px 64px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <section className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>
            1. Finalidade e Base Legal (Lei nº 13.709/2018 — LGPD)
          </h2>
          <p style={{ color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            A plataforma <strong>IFES+Alegre</strong> tem caráter exclusivamente acadêmico e institucional,
            destinando-se à divulgação de atividades extracurriculares, clubes, projetos, monitorias,
            avisos e registros culturais/esportivos do <strong>{SITE.institution} · {SITE.campus}</strong>.
            O tratamento de dados ocorre mediante consentimento do titular (ou de seu responsável legal,
            quando aplicável) e para o cumprimento de finalidades educacionais e de extensão.
          </p>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>
            2. Dados Coletados nos Formulários
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              color: 'var(--ink-2)',
              lineHeight: 1.65,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <li>
              <strong>Inscrições em atividades e monitorias:</strong> nome completo, e-mail, turma/curso
              e informações estritamente necessárias para controle de vagas e comunicação com o docente responsável.
            </li>
            <li>
              <strong>Envio de fotos para a galeria:</strong> arquivo de imagem, legenda/descrição e
              identificação do remetente. Todas as imagens passam por moderação prévia na Área Docente
              antes de qualquer publicação pública.
            </li>
            <li>
              <strong>Acesso docente e administrativo:</strong> nome, e-mail institucional e credenciais
              criptografadas, sujeitas à aprovação prévia pela administração do sistema.
            </li>
          </ul>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>
            3. Proteção de Imagem e Estudantes Menores de Idade
          </h2>
          <p style={{ color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            Ao enviar fotografias para a galeria do IFES+Alegre, o remetente declara possuir autorização
            das pessoas retratadas — e, no caso de estudantes menores de 18 anos, ciência e consentimento
            dos pais ou responsáveis legais, conforme as normas institucionais do IFES. Qualquer registro
            pode ser ocultado ou removido imediatamente mediante solicitação.
          </p>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>
            4. Compartilhamento, Armazenamento e Segurança
          </h2>
          <p style={{ color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            Os dados não são comercializados nem cedidos a terceiros para fins publicitários. As informações
            são armazenadas em banco de dados protegido com controle de acesso restrito aos docentes e
            coordenadores autorizados do campus.
          </p>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>
            5. Direitos do Titular e Contato para Remoção
          </h2>
          <p style={{ color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 14 }}>
            Você pode solicitar a consulta, correção ou exclusão de seus dados de inscrição ou de qualquer
            fotografia publicada entrando em contato com a coordenação ou setores do campus pela página de{' '}
            <Link href="/contatos" style={{ fontWeight: 600 }}>
              Contatos
            </Link>{' '}
            ou pelo telefone <a href={SITE.phoneHref} style={{ fontWeight: 600 }}>{SITE.phone}</a>.
          </p>
          <p className="hint" style={{ fontSize: 13, margin: 0 }}>
            Documento sujeito à revisão periódica junto à Diretoria de Ensino (DIREN) e à Coordenadoria
            Geral de Atenção aos Discentes (CGAC) do IFES · Campus de Alegre.
          </p>
        </section>
      </div>
    </main>
  );
}