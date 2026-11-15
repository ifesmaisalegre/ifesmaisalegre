# Contexto para assistentes de IA

Projeto: site IFES+Alegre (atividades extracurriculares do IFES Campus de Alegre), Projeto Integrador 2026, 3ºTII.
Leia também `README.md`.

## Situação
- Next.js (App Router) + React + TypeScript. Estilos em `src/app/globals.css` (sem Tailwind).
- Front-end completo, com dados de exemplo em `src/data/`. Sem banco, sem login, sem upload real.
- Formulários e painel docente guardam o estado só na memória do navegador. Os pontos a trocar estão marcados com `TODO(back)`.
- `prototipo/` guarda o protótipo visual original (arquivos `.dc.html`): serve só como referência de layout e textos. Não importar.
- O código foi escrito sem rodar `npm install`; pode haver erros pequenos de compilação.

## Stack planejada para o back
PostgreSQL no Neon, Prisma, Better Auth, deploy na Vercel. Pode ser trocada se o grupo preferir, mantendo as funcionalidades.

## Regras de negócio
- Foto só aparece na galeria depois de aprovada por docente; envio exige autorização de uso (e dos responsáveis se houver menores).
- Inscrição exige aceite da política de privacidade; atividades com `signup: 'nao'` não têm inscrição nem vagas.
- Área Docente só para docentes autenticados.
- Avisos têm validade ("Válido até") e expiram sozinhos.
- Validar sempre no servidor, e não só no navegador.

## Como trabalhar com o usuário
- Idioma: português do Brasil.
- O usuário ainda está aprendendo: explique cada comando e cada arquivo, passo a passo, e trabalhe em etapas pequenas.
- Mantenha a identidade visual atual (Poppins, azul-lilás #5F6DB5, verde #14703F, laranja #F79005).
- Acessibilidade: labels nos campos, botões reais, alvos de toque de 44px, foco visível.
- Ao terminar uma etapa, atualize as listas "O que falta" no README.
