import type { Aviso } from '@/lib/types';

// TODO(back): trocar por consultas ao banco. Dados de EXEMPLO.
export const AVISOS: Aviso[] = [
  { id: 1, title: 'Inscrições abertas para o Clube de teatro', body: 'Os interessados devem se inscrever pelo site até o fim do mês.', category: 'Atividade', target: 'Clube de teatro', date: '2026-11-12', until: '2026-12-31', published: true },
  { id: 2, title: 'Treino de vôlei remarcado', body: 'O treino desta semana será na quinta-feira, no mesmo horário.', category: 'Urgente', target: 'Vôlei', date: '2026-11-10', until: '2026-12-31', published: true },
  { id: 3, title: 'Reunião dos docentes responsáveis', body: 'Rascunho: alinhar calendário de atividades do próximo trimestre.', category: 'Geral', target: 'Todas as atividades', date: '2026-11-09', until: '', published: false },
  { id: 4, title: 'Envie suas fotos para a galeria', body: 'Fotos enviadas passam por avaliação dos docentes antes de serem publicadas.', category: 'Geral', target: 'Todas as atividades', date: '2026-11-05', until: '2026-12-31', published: true },
  { id: 5, title: 'Clube do livro: novo encontro', body: 'Os encontros acontecem às terças, às 16h, ao lado do ginásio.', category: 'Evento', target: 'Clube do livro', date: '2026-11-02', until: '2026-12-31', published: true },
];

/** Avisos publicados e ainda dentro da validade. `today` = AAAA-MM-DD. */
export function visibleAvisos(avisos: Aviso[], today: string): Aviso[] {
  return avisos
    .filter((a) => a.published && (!a.until || a.until >= today))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
