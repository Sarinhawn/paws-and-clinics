import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { TipoUsuario } from '@prisma/client'

export const dynamic = 'force-dynamic'

// Schema para atualizar clínica
const atualizarClinicaSchema = z.object({
  nome: z.string().min(2).optional(),
  cnpj: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
})

/**
 * GET /api/clinicas/[id]
 * Busca detalhes de uma clínica específica
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

    const clinicaId = parseInt(params.id)

    const clinica = await prisma.clinica.findUnique({
      where: { id: clinicaId },
      include: {
        admin: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true
          }
        },
        veterinarios: {
          include: {
            user: {
              select: {
                nome: true,
                email: true
              }
            }
          }
        },
        servicos: {
          where: { ativo: true }
        },
        usuarios: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                tipo: true
              }
            }
          }
        },
        _count: {
          select: {
            veterinarios: true,
            pets: true,
            servicos: true
          }
        }
      }
    })

    if (!clinica) {
      return NextResponse.json(
        { error: 'Clínica não encontrada' },
        { status: 404 }
      )
    }

    // Verificar permissão
    const isAdminGeral = session.user.tipo === 'ADMIN_GERAL'
    const isAdminClinica = clinica.adminId === parseInt(session.user.id)
    const isEquipeClinica = clinica.usuarios.some(
      uc => uc.userId === parseInt(session.user.id)
    )

    if (!isAdminGeral && !isAdminClinica && !isEquipeClinica) {
      return NextResponse.json(
        { error: 'Sem permissão para acessar esta clínica' },
        { status: 403 }
      )
    }

    return NextResponse.json(clinica)
  } catch (error) {
    console.error('Erro ao buscar clínica:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar clínica' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/clinicas/[id]
 * Atualiza dados de uma clínica
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

    const clinicaId = parseInt(params.id)

    // Buscar clínica
    const clinica = await prisma.clinica.findUnique({
      where: { id: clinicaId }
    })

    if (!clinica) {
      return NextResponse.json(
        { error: 'Clínica não encontrada' },
        { status: 404 }
      )
    }

    // Verificar permissão (só admin geral ou admin da clínica)
    const isAdminGeral = session.user.tipo === 'ADMIN_GERAL'
    const isAdminClinica = clinica.adminId === parseInt(session.user.id)

    if (!isAdminGeral && !isAdminClinica) {
      return NextResponse.json(
        { error: 'Sem permissão para editar esta clínica' },
        { status: 403 }
      )
    }

    // Validar dados
    const body = await request.json()
    const dados = atualizarClinicaSchema.parse(body)

    // Atualizar clínica
    const clinicaAtualizada = await prisma.clinica.update({
      where: { id: clinicaId },
      data: dados,
      include: {
        admin: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(clinicaAtualizada)
  } catch (error) {
    console.error('Erro ao atualizar clínica:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar clínica' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/clinicas/[id]
 * Deleta uma clínica (apenas ADMIN_GERAL)
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

    // Apenas admin geral pode deletar clínicas
    if (session.user.tipo !== 'ADMIN_GERAL') {
      return NextResponse.json(
        { error: 'Apenas administradores gerais podem deletar clínicas' },
        { status: 403 }
      )
    }

    const clinicaId = parseInt(params.id)

    // Verificar se existe
    const clinica = await prisma.clinica.findUnique({
      where: { id: clinicaId }
    })

    if (!clinica) {
      return NextResponse.json(
        { error: 'Clínica não encontrada' },
        { status: 404 }
      )
    }

    // Deletar clínica (cascade vai deletar relações)
    await prisma.clinica.delete({
      where: { id: clinicaId }
    })

    return NextResponse.json(
      { message: 'Clínica deletada com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar clínica:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar clínica' },
      { status: 500 }
    )
  }
}
