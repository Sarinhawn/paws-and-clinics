import { z } from 'zod'
import { TipoUsuario, CargoClinica, StatusAgendamento, StatusPagamento, MetodoPagamento } from '@prisma/client'

// ==================== USER ====================
export const criarUserSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  telefone: z.string().optional(),
  tipo: z.nativeEnum(TipoUsuario)
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória')
})

// ==================== CLÍNICA ====================
export const criarClinicaSchema = z.object({
  nome: z.string().min(3, 'Nome da clínica deve ter pelo menos 3 caracteres'),
  cnpj: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  // Dados do administrador da clínica
  adminNome: z.string().min(3, 'Nome do admin deve ter pelo menos 3 caracteres'),
  adminEmail: z.string().email('Email do admin inválido'),
  adminSenha: z.string().min(6, 'Senha do admin deve ter pelo menos 6 caracteres'),
  adminTelefone: z.string().optional()
})

export const atualizarClinicaSchema = z.object({
  nome: z.string().min(3).optional(),
  cnpj: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional()
})

// ==================== EQUIPE ====================
export const criarEquipeSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  telefone: z.string().optional(),
  cargo: z.nativeEnum(CargoClinica),
  // Se for veterinário
  crmv: z.string().optional(),
  especialidade: z.string().optional()
})

// ==================== PET ====================
export const criarPetSchema = z.object({
  nome: z.string().min(2, 'Nome do pet deve ter pelo menos 2 caracteres'),
  especie: z.string().min(2, 'Espécie é obrigatória'),
  raca: z.string().optional(),
  dataNasc: z.string().datetime().optional(),
  tutorId: z.number().int().positive('ID do tutor inválido'),
  clinicaId: z.number().int().positive('ID da clínica inválido')
})

export const atualizarPetSchema = z.object({
  nome: z.string().min(2).optional(),
  especie: z.string().min(2).optional(),
  raca: z.string().optional(),
  dataNasc: z.string().datetime().optional()
})

// ==================== SERVIÇO ====================
export const criarServicoSchema = z.object({
  nome: z.string().min(3, 'Nome do serviço deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  valorBase: z.number().positive('Valor deve ser positivo'),
  duracaoMin: z.number().int().positive('Duração deve ser positiva'),
  clinicaId: z.number().int().positive('ID da clínica inválido')
})

// ==================== AGENDAMENTO ====================
export const criarAgendamentoSchema = z.object({
  petId: z.number().int().positive(),
  veterinarioId: z.number().int().positive(),
  servicoId: z.number().int().positive(),
  dataHora: z.string().datetime(),
  observacoes: z.string().optional()
})

export const atualizarAgendamentoSchema = z.object({
  dataHora: z.string().datetime().optional(),
  status: z.nativeEnum(StatusAgendamento).optional(),
  observacoes: z.string().optional()
})

// ==================== PAGAMENTO ====================
export const criarPagamentoSchema = z.object({
  agendamentoId: z.number().int().positive(),
  valor: z.number().positive('Valor deve ser positivo'),
  metodo: z.nativeEnum(MetodoPagamento),
  dataPagamento: z.string().datetime().optional()
})

// ==================== EXAME ====================
export const criarExameSchema = z.object({
  petId: z.number().int().positive(),
  veterinarioId: z.number().int().positive(),
  tipoExame: z.string().min(3, 'Tipo de exame é obrigatório'),
  dataExame: z.string().datetime(),
  resultado: z.string().optional(),
  arquivoUrl: z.string().url('URL inválida').optional()
})

// Tipos TypeScript inferidos dos schemas
export type CriarUserInput = z.infer<typeof criarUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CriarClinicaInput = z.infer<typeof criarClinicaSchema>
export type AtualizarClinicaInput = z.infer<typeof atualizarClinicaSchema>
export type CriarEquipeInput = z.infer<typeof criarEquipeSchema>
export type CriarPetInput = z.infer<typeof criarPetSchema>
export type AtualizarPetInput = z.infer<typeof atualizarPetSchema>
export type CriarServicoInput = z.infer<typeof criarServicoSchema>
export type CriarAgendamentoInput = z.infer<typeof criarAgendamentoSchema>
export type AtualizarAgendamentoInput = z.infer<typeof atualizarAgendamentoSchema>
export type CriarPagamentoInput = z.infer<typeof criarPagamentoSchema>
export type CriarExameInput = z.infer<typeof criarExameSchema>
