import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { TipoUsuario, StatusAgendamento } from '@prisma/client'

// Schema para atualizar status
const atualizarStatusSchema = z.object({
  status: z.nativeEnum(StatusAgendamento),
  observacoes: z.string().optional()
})

/**
 * GET /api/agendamentos/[id]
 * Busca detalhes de um agendamento específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const agendamentoId = parseInt(params.id)

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: {
        pet: {
          select: {
            id: true,
            nome: true,
            especie: true,
            raca: true,
            dataNasc: true,
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
                telefone: true,
                email: true
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
      }
    })

    if (!agendamento) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Se for TUTOR, só pode ver agendamentos de seus pets
    if (userTipo === TipoUsuario.TUTOR && agendamento.pet.tutor.id !== userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    return NextResponse.json({ agendamento }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar agendamento' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/agendamentos/[id]
 * Atualiza status do agendamento
 * - Equipe pode atualizar qualquer status
 * - Tutores só podem cancelar
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const agendamentoId = parseInt(params.id)

    const body = await request.json()
    const dados = atualizarStatusSchema.parse(body)

    // Buscar agendamento
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: {
        pet: {
          select: {
            tutorId: true
          }
        }
      }
    })

    if (!agendamento) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Se for TUTOR
    if (userTipo === TipoUsuario.TUTOR) {
      // Verificar se é o dono do pet
      if (agendamento.pet.tutorId !== userId) {
        return NextResponse.json(
          { error: 'Acesso negado' },
          { status: 403 }
        )
      }

      // Tutores só podem cancelar
      if (dados.status !== StatusAgendamento.CANCELADO) {
        return NextResponse.json(
          { error: 'Você só pode cancelar agendamentos' },
          { status: 403 }
        )
      }
    }

    // Atualizar agendamento
    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        status: dados.status,
        ...(dados.observacoes && { observacoes: dados.observacoes })
      },
      include: {
        pet: {
          select: {
            nome: true,
            tutor: {
              select: {
                nome: true
              }
            }
          }
        },
        veterinario: {
          select: {
            user: {
              select: {
                nome: true
              }
            }
          }
        },
        servico: {
          select: {
            nome: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: 'Agendamento atualizado com sucesso!',
        agendamento: agendamentoAtualizado
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar agendamento' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/agendamentos/[id]
 * Cancela um agendamento (soft delete via status)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const agendamentoId = parseInt(params.id)

    // Buscar agendamento
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: {
        pet: {
          select: {
            tutorId: true
          }
        }
      }
    })

    if (!agendamento) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Se for TUTOR, verificar se é o dono do pet
    if (userTipo === TipoUsuario.TUTOR && agendamento.pet.tutorId !== userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Cancelar agendamento (soft delete)
    await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        status: StatusAgendamento.CANCELADO
      }
    })

    return NextResponse.json(
      { message: 'Agendamento cancelado com sucesso!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro ao cancelar agendamento' },
      { status: 500 }
    )
  }
}
