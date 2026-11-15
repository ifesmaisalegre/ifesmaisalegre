import type { Day, Monitoria } from '@/lib/types';

// TODO(back): trocar por consultas ao banco (tabela de monitorias). Dados reais do site original.
const S = '15:40';
const E = '16:30';
const m = (
  id: number,
  title: string,
  year: '1' | '2' | '3',
  exclusive: string,
  days: Day[],
  start: string,
  end: string,
  place: string,
  monitor: string,
): Monitoria => ({ id, title, year, exclusive, days, start, end, place, monitor });

export const MONITORIAS: Monitoria[] = [
  m(1, 'Artes I', '1', '', ['Seg'], S, E, 'Bloco C – Sala 2', 'Alice Duarte Calvi'),
  m(2, 'Filosofia I', '1', '', ['Seg'], S, E, 'Bloco C – Sala 2', 'Alice Duarte Calvi'),
  m(3, 'Física I', '1', '', ['Ter'], S, E, 'Bloco C – Sala 3', 'Emanuele Marinho da Silva'),
  m(4, 'Química I', '1', '', ['Qua'], S, E, 'Bloco C – Sala 3', 'Isabella Cristina Pontini Schimidt'),
  m(5, 'Inglês I', '1', '', ['Ter'], S, E, 'Bloco C – Sala 2', 'Aira Micaela Ribeiro Montozo'),
  m(6, 'Matemática I', '1', 'Exclusiva para 1º TAI I, II e III', ['Qua'], S, E, 'Bloco C – Sala 4', 'Mateus Valadares'),
  m(7, 'Introdução à Programação', '1', 'Exclusiva para 1º TII', ['Ter'], S, E, 'Lab. de Informática 1', 'Maria Eduarda da Silva Valadares'),
  m(8, 'Matemática I', '1', 'Exclusiva para 1º TII', ['Qui'], S, E, 'Bloco C – Sala 2', 'Bernardo Santiago da Vitória'),
  m(9, 'Física II', '2', '', ['Seg'], S, E, 'Bloco C – Sala 3', 'Davi Rodrigues Rossi Machado'),
  m(10, 'Matemática II', '2', 'Exclusiva para 2ºTII e 2ºTGI', ['Qui'], S, E, 'Bloco C – Sala 2', 'Bernardo Santiago da Vitória'),
  m(11, 'Inglês II', '2', '', ['Ter'], S, E, 'Bloco C – Sala 2', 'Aira Micaela Ribeiro Montozo'),
  m(12, 'Gestão Agropecuária I', '2', 'Exclusiva para 2ºTAIs', ['Qui'], S, E, 'Bloco C – Sala 3', 'Maria Gabrielly Duarte Serafim'),
  m(13, 'Programação II', '2', 'Exclusiva para 2ºTII', ['Ter', 'Qui'], S, E, 'Lab. de Informática 1', 'Maria Eduarda da Silva Valadares'),
  m(14, 'Matemática III', '3', '', ['Ter'], S, E, 'Bloco C – Sala 4', 'Eduardo Duarte Rodrigues'),
  m(15, 'Matemática III', '3', 'Exclusiva para 3ºTII', ['Seg'], '14:40', '15:30', 'Informática Sala 10', 'Mateus Moreira Mendes'),
  m(16, 'Inglês III', '3', '', ['Ter'], S, E, 'Bloco C – Sala 2', 'Aira Micaela Ribeiro Montozo'),
  m(17, 'Matemática III', '3', 'Exclusiva para 3ºTGI', ['Qui'], S, E, 'Bloco C – Sala 2', 'Bernardo Santiago da Vitória'),
  m(18, 'Química III', '3', '', ['Qua'], S, E, 'Bloco C – Sala 2', 'Gustavo Tristão Pinto'),
  m(19, 'Gestão Agropecuária II', '3', 'Exclusiva para 3ºTAIs', ['Qui'], S, E, 'Bloco C – Sala 3', 'Maria Gabrielly Duarte Serafim'),
];
