import type { Day } from './types';

export const DAY_ORDER: Day[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const DAY_PLURAL: Record<Day, string> = {
  Seg: 'Segundas-feiras',
  Ter: 'Terças-feiras',
  Qua: 'Quartas-feiras',
  Qui: 'Quintas-feiras',
  Sex: 'Sextas-feiras',
  Sáb: 'Sábados',
};

export const DAY_FULL: Record<Day, string> = {
  Seg: 'Segunda-feira',
  Ter: 'Terça-feira',
  Qua: 'Quarta-feira',
  Qui: 'Quinta-feira',
  Sex: 'Sexta-feira',
  Sáb: 'Sábado',
};

/** "16:00" -> "16h", "15:30" -> "15h30" */
export function fmtTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':');
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

/** "16:00","" -> "16h"; "15:30","17:00" -> "15h30 às 17h" */
export function fmtRange(start: string, end: string): string {
  return end ? `${fmtTime(start)} às ${fmtTime(end)}` : fmtTime(start);
}

/** ["Ter","Qui"] -> "Terças-feiras e Quintas-feiras" */
export function fmtDays(days: Day[]): string {
  const sorted = DAY_ORDER.filter((d) => days.includes(d));
  return sorted.map((d) => DAY_PLURAL[d]).join(' e ');
}

/** "2026-11-12" -> "12/11/2026" */
export function fmtDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Data de hoje como AAAA-MM-DD (horário local). */
export function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const DAY_NUM: Record<Day, string> = { Seg: '2ª', Ter: '3ª', Qua: '4ª', Qui: '5ª', Sex: '6ª', Sáb: 'Sáb' };

/** ["Ter","Qui"] -> "3ª e 5ª feira"; ["Seg"] -> "2ª feira" */
export function fmtDaysShort(days: Day[]): string {
  const sorted = DAY_ORDER.filter((d) => days.includes(d));
  return sorted.map((d) => DAY_NUM[d]).join(' e ') + ' feira';
}
