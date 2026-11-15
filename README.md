# IFES+Alegre

Site das atividades extracurriculares do IFES Campus de Alegre (Projeto Integrador 2026, 3ºTII).
Migração do site feito no Wix (https://ifesmaisalegre.wixsite.com/ifesmaisalegre) para código próprio.

**Estado atual:** o front-end está completo e usa dados de exemplo guardados em arquivos (`src/data/`).
Ainda não há banco de dados, login nem upload real de fotos. Veja "O que falta" abaixo.

> Este código foi escrito sem poder instalar pacotes nem rodar o projeto. O primeiro passo é rodar
> `npm install` e `npm run dev` e corrigir qualquer erro pequeno que apareça.

## Como rodar

Você precisa do [Node.js](https://nodejs.org) 20 ou mais novo.

```bash
npm install      # baixa as dependências (só na primeira vez)
npm run dev      # abre o site em http://localhost:3000
npm run build    # confere se o projeto compila (rode antes de publicar)
```

## Estrutura

```
src/
  app/                 páginas (cada pasta = uma rota)
    page.tsx             Home
    sobre/               Sobre o projeto
    atividades/          lista, [slug] (página de cada atividade) e monitorias/
    avisos/  galeria/  contatos/  privacidade/
    docente/             Área Docente: painel, atividades/ e monitorias/
    not-found.tsx        página 404
    layout.tsx           cabeçalho + rodapé + fonte Poppins
    globals.css          cores, botões, formulários e demais estilos
  components/          peças reutilizáveis (cabeçalho, rodapé, formulários, painel docente)
  data/                dados de exemplo (trocar pelo banco depois)
  lib/                 tipos, formatação de datas/horários e dados fixos do site
prototipo/             protótipo visual original (somente referência; não roda aqui)
```

Para achar tudo o que ainda precisa de trabalho no código, procure por `TODO(back)` e `TODO(front)`.

## Regras do projeto

- Foto só aparece na galeria depois de aprovada por um docente.
- Envio de foto exige autorização de uso e, se houver menores de 18 anos, autorização dos responsáveis.
- Inscrição exige aceite da política de privacidade.
- Atividades como as monitorias não exigem inscrição prévia (`signup: 'nao'`): sem formulário e sem vagas.
- A Área Docente (`/docente`) só pode ser acessada por docentes autenticados.
- Avisos têm "Válido até"; depois da data deixam de aparecer no site (`visibleAvisos` em `src/data/avisos.ts`).
- Identidade visual: fonte Poppins; azul-lilás `#5F6DB5`, verde `#14703F`, laranja `#F79005`, fundo `#FAFFFF`.
  As cores estão em `src/app/globals.css`.

## O que falta

### Conteúdo (front)
- [ ] E-mails reais dos 12 docentes (`src/data/docentes.ts`; hoje `@ifes.com`, provavelmente errado)
- [ ] Dados reais de futebol, teatro, xadrez e corrida (`src/data/activities.ts`). Já são reais: Clube do livro, Vôlei e Monitorias
- [ ] Fotos de todas as atividades, fotos da galeria e foto do grupo
- [ ] Comparar o texto de `/sobre` com o do site original (foi reescrito)
- [ ] Coordenação revisar `/privacidade` (texto modelo)
- [ ] Corrigir a descrição do Vôlei no Wix (mostra o texto do clube do livro por engano)
- [ ] Confirmar telefone, endereço e redes sociais (`src/lib/site.ts`)
- [ ] Trocar o mapa ilustrativo da Home pelo Google Maps incorporado
- [ ] Mostrar fotos reais nas páginas de atividade e na galeria (hoje há espaços reservados)

### Back
- [ ] Banco de dados (sugestão: PostgreSQL no Neon + Prisma): atividades, monitorias, avisos, fotos, inscrições, docentes
- [ ] Login obrigatório na Área Docente, protegendo `/docente` e as subpáginas (sugestão: Better Auth + `middleware.ts`)
- [ ] Verificação de segurança: senhas, permissões, proteção dos formulários, envio seguro de fotos
- [ ] Validação no servidor em todos os cadastros (inscrição, avisos, atividades, monitorias)
- [ ] Upload real de fotos, com limite de tamanho e tipo, e armazenamento das imagens
- [ ] Controle de vagas (bloquear quando lotar) e inscrição duplicada
- [ ] E-mail de confirmação da inscrição e exportação CSV para os docentes
- [ ] LGPD: dados de inscrição e fotos de menores
- [ ] Publicar na Vercel, com domínio e cópia de segurança do banco

### Ordem sugerida
1. Rodar o projeto e corrigir erros pequenos.
2. Criar o banco (Neon + Prisma) e trocar `src/data/*` por consultas.
3. Login e proteção da Área Docente.
4. Gravar de verdade os formulários (inscrição, avisos, fotos, administração).
5. Upload de fotos, validações e segurança.
6. Conteúdo real, revisão da coordenação e publicação.

## Como pedir ajuda a uma IA
Envie o arquivo `CONTEXTO-PARA-IA.md` junto com o pedido e diga qual etapa quer fazer.
Quem estiver aprendendo deve pedir que cada comando e cada arquivo sejam explicados passo a passo.
