import type { GalleryPhoto, Inscricao } from '@/lib/types';

// Dados de EXEMPLO da Área Docente. TODO(back): trocar por consultas ao banco.
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: 1, code: '2026-001', date: '2026-11-03', status: 'pending', tone: '#F6E8E2' },
  { id: 2, code: '2026-002', date: '2026-11-04', status: 'pending', tone: '#E6E9F8' },
  { id: 3, code: '2026-003', date: '2026-11-06', status: 'pending', tone: '#DDF1E5' },
  { id: 4, code: '2026-004', date: '2026-10-28', status: 'approved', tone: '#FDE9C8' },
  { id: 5, code: '2026-005', date: '2026-10-29', status: 'approved', tone: '#F6E8E2' },
  { id: 6, code: '2026-006', date: '2026-10-30', status: 'approved', tone: '#E6E9F8' },
  { id: 7, code: '2026-007', date: '2026-10-25', status: 'rejected', tone: '#DDF1E5' },
  { id: 8, code: '2026-008', date: '2026-10-26', status: 'rejected', tone: '#FDE9C8' },
];

export const INSCRICOES: Inscricao[] = [
  { id: 1, name: 'Ana Beatriz Lima', matricula: '2024TII0001', email: 'ana.lima@exemplo.com', phone: '(28) 90000-0001', activity: 'Clube de teatro', date: '2026-08-11' },
  { id: 2, name: 'Bruno Carvalho', matricula: '2024TII0002', email: 'bruno.c@exemplo.com', phone: '(28) 90000-0002', activity: 'Vôlei', date: '2026-08-11' },
  { id: 3, name: 'Carla Menezes', matricula: '2024TII0003', email: 'carla.m@exemplo.com', phone: '(28) 90000-0003', activity: 'Clube do livro', date: '2026-08-14' },
  { id: 4, name: 'Diego Ferreira', matricula: '2024TII0004', email: 'diego.f@exemplo.com', phone: '(28) 90000-0004', activity: 'Clube de xadrez', date: '2026-09-01' },
  { id: 5, name: 'Elisa Rocha', matricula: '2024TII0005', email: 'elisa.r@exemplo.com', phone: '(28) 90000-0005', activity: 'Vôlei', date: '2026-09-02' },
  { id: 6, name: 'Felipe Andrade', matricula: '2024TII0006', email: 'felipe.a@exemplo.com', phone: '(28) 90000-0006', activity: 'Clube de corrida', date: '2026-09-15' },
];
