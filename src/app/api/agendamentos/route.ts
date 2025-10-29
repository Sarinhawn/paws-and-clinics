import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { TipoUsuario, StatusAgendamento } from '@prisma/client'

// Schema de validação
const criarAgendamentoSchema = z.object({
  petId: z.number().int().positive('Pet é obrigatório'),
  veterinarioId: z.number().int().positive('Veterinário é obrigatório'),
  servicoId: z.number().int().positive('Serviço é obrigatório'),
  dataHora: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data/hora inválida'
  }),
  observacoes: z.string().optional()
})

/**
 * GET /api/agendamentos
 * Lista agendamentos com filtros opcionais
 * - Tutores veem apenas agendamentos de seus pets
 * - Equipe vê todos da clínica
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const userTipo = session.user.tipo
    const { searchParams } = new URL(request.url)
    
    // Filtros opcionais
    const status = searchParams.get('status') as StatusAgendamento | null
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const petId = searchParams.get('petId')

    // Construir where clause
    const where: any = {}

    // Filtro por status
    if (status) {
      where.status = status
    }

    // Filtro por período
    if (dataInicio || dataFim) {
      where.dataHora = {}
      if (dataInicio) {
        where.dataHora.gte = new Date(dataInicio)
      }
      if (dataFim) {
        where.dataHora.lte = new Date(dataFim)
      }
    }

    // Filtro por pet
    if (petId) {
      where.petId = parseInt(petId)
    }

    // Se for TUTOR, só vê agendamentos de seus pets
    if (userTipo === TipoUsuario.TUTOR) {
      where.pet = {
        tutorId: userId
      }
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        pet: {
          select: {
            id: true,
            nome: true,
            especie: true,
            tutor: {
              select: {
                id: true,
                nome: true,
                telefone: true,
                email: true
              }
            }
          }
        },
        veterinario: {
          select: {
            id: true,
            crmv: true,
            especialidade: true,
            user: {
              select: {
                nome: true,
                telefone: true
              }
            }
          }
        },
        servico: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            valorBase: true,
            duracaoMin: true
          }
        },
        pagamento: {
          select: {
            id: true,
            valor: true,
            status: true,
            metodo: true,
            dataPagamento: true
          }
        }
      },
      orderBy: {
        dataHora: 'asc'
      }
    })

    return NextResponse.json({ agendamentos }, { status: 200 })
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao listar agendamentos' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/agendamentos
 * Cria um novo agendamento
 * - Tutores podem agendar para seus pets
 * - Equipe pode agendar para qualquer pet
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const userTipo = session.user.tipo

    const body = await request.json()
    const dados = criarAgendamentoSchema.parse(body)

    // Verificar se o pet existe
    const pet = await prisma.pet.findUnique({
      where: { id: dados.petId },
      include: {
        tutor: true
      }
    })

    if (!pet) {
      return NextResponse.json(
        { error: 'Pet não encontrado' },
        { status: 404 }
      )
    }

    // Se for TUTOR, só pode agendar para seus próprios pets
    if (userTipo === TipoUsuario.TUTOR && pet.tutorId !== userId) {
      return NextResponse.json(
        { error: 'Você só pode agendar para seus próprios pets' },
        { status: 403 }
      )
    }

    // Verificar se o veterinário existe e está ativo
    const veterinario = await prisma.veterinario.findUnique({
      where: { id: dados.veterinarioId }
    })

    if (!veterinario || !veterinario.ativo) {
      return NextResponse.json(
        { error: 'Veterinário não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Verificar se o serviço existe e está ativo
    const servico = await prisma.servico.findUnique({
      where: { id: dados.servicoId }
    })

    if (!servico || !servico.ativo) {
      return NextResponse.json(
        { error: 'Serviço não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Verificar conflito de horário para o veterinário
    const dataHora = new Date(dados.dataHora)
    const dataHoraFim = new Date(dataHora.getTime() + servico.duracaoMin * 60000)

    const conflito = await prisma.agendamento.findFirst({
      where: {
        veterinarioId: dados.veterinarioId,
        status: {
          in: [StatusAgendamento.AGENDADO, StatusAgendamento.CONFIRMADO]
        },
        AND: [
          { dataHora: { lt: dataHoraFim } },
          { dataHora: { gte: dataHora } }
        ]
      }
    })

    if (conflito) {
      return NextResponse.json(
        { error: 'Já existe um agendamento neste horário para este veterinário' },
        { status: 409 }
      )
    }

    // Criar o agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        petId: dados.petId,
        veterinarioId: dados.veterinarioId,
        servicoId: dados.servicoId,
        dataHora,
        observacoes: dados.observacoes,
        status: StatusAgendamento.AGENDADO
      },
      include: {
        pet: {
          select: {
            nome: true,
            especie: true,
            tutor: {
              select: {
                nome: true,
                telefone: true
              }
            }
          }
        },
        veterinario: {
          select: {
            crmv: true,
            user: {
              select: {
                nome: true
              }
            }
          }
        },
        servico: {
          select: {
            nome: true,
            valorBase: true,
            duracaoMin: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: 'Agendamento criado com sucesso!',
        agendamento
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar agendamento' },
      { status: 500 }
    )
  }
}
