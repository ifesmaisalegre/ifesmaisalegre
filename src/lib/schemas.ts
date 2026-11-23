import { z } from 'zod';

export const inscricaoSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome completo.'),
  matricula: z.string().trim().min(3, 'Informe a matrícula.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  phone: z.string().trim().min(8, 'Informe um telefone para contato.'),
  activitySlug: z.string().trim().min(1, 'Atividade inválida.'),
  activityName: z.string().trim().min(1),
  privacyOk: z.literal(true, {
    message: 'É necessário aceitar a política de privacidade (LGPD).',
  }),
});

export const galleryPhotoUploadSchema = z.object({
  lgpdConsent: z.literal(true, {
    message: 'É necessário marcar a autorização LGPD e de responsável para enviar.',
  }),
  guardianAuth: z.boolean().default(true),
  caption: z.string().trim().max(240).optional().default(''),
  activitySlug: z.string().trim().max(120).optional().default(''),
});

export const activityStatusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(['Inscrições abertas', 'Vagas esgotadas', 'Encerrada', 'Inativa']),
  signup: z.enum(['sim', 'nao']),
});

export const avisoCreateSchema = z.object({
  title: z.string().trim().min(3, 'Título obrigatório.'),
  body: z.string().trim().min(5, 'Conteúdo do aviso obrigatório.'),
  category: z.string().trim().min(1).default('Geral'),
  target: z.string().trim().min(1).default('Todas as atividades'),
  until: z.string().trim().optional().default(''),
  published: z.boolean().default(true),
});

export const avisoToggleSchema = z.object({
  id: z.coerce.number().int().positive(),
  published: z.boolean(),
});

export const monitoriaCreateSchema = z.object({
  title: z.string().trim().min(2, 'Informe a disciplina/monitoria.'),
  year: z.enum(['1', '2', '3', 'Todos']),
  exclusive: z.string().trim().optional().default(''),
  daysJson: z.string().trim().min(2, 'Informe ao menos um dia/horário.'),
  start: z.string().trim().min(3, 'Horário inicial obrigatório.'),
  end: z.string().trim().min(3, 'Horário final obrigatório.'),
  place: z.string().trim().min(2, 'Local obrigatório.'),
  monitor: z.string().trim().min(2, 'Nome do monitor obrigatório.'),
});

export const galleryModerateSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(['approved', 'rejected']),
});