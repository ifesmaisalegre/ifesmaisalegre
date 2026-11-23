import { z } from 'zod';

export const idSchema = z.object({
  id: z.coerce.number().int().positive('Identificador inválido.'),
});

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

export const activityUpsertSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  slug: z.string().trim().min(1, 'Slug inválido.'),
  name: z.string().trim().min(2, 'Informe o nome da atividade.'),
  category: z.string().trim().min(1, 'Categoria obrigatória.'),
  description: z.string().trim().min(5, 'Escreva uma descrição para a atividade.'),
  daysJson: z.string().trim().min(2, 'Escolha pelo menos um dia da semana.'),
  start: z.string().trim().min(3, 'Informe o horário de início.'),
  end: z.string().trim().optional().default(''),
  place: z.string().trim().min(2, 'Informe o local.'),
  responsible: z.string().trim().min(2, 'Informe o docente responsável.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  spots: z.number().int().positive().nullable().optional().default(null),
  audience: z.string().trim().min(2, 'Informe quem pode participar.'),
  status: z.enum(['Inscrições abertas', 'Inscrições encerradas', 'Ativa', 'Inativa']),
  signup: z.enum(['sim', 'nao']),
  tone: z.string().trim().optional().default('#E6E9F8'),
});

export const activityStatusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(['Inscrições abertas', 'Inscrições encerradas', 'Ativa', 'Inativa']),
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

export const monitoriaUpsertSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  title: z.string().trim().min(2, 'Informe a disciplina/monitoria.'),
  year: z.enum(['1', '2', '3']),
  exclusive: z.string().trim().optional().default(''),
  daysJson: z.string().trim().min(2, 'Informe ao menos um dia/horário.'),
  start: z.string().trim().min(3, 'Horário inicial obrigatório.'),
  end: z.string().trim().min(3, 'Horário final obrigatório.'),
  place: z.string().trim().min(2, 'Local obrigatório.'),
  monitor: z.string().trim().min(2, 'Nome do monitor obrigatório.'),
});

export const galleryModerateSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(['approved', 'rejected', 'pending']),
});