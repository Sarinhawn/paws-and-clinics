import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/servicos
 * Lista serviços ativos
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

    const { searchParams } = new URL(request.url)
    const clinicaId = searchParams.get('clinicaId')

    const where: any = {
      ativo: true
    }

    if (clinicaId) {
      where.clinicaId = parseInt(clinicaId)
    }

    const servicos = await prisma.servico.findMany({
      where,
      include: {
        clinica: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json({ servicos }, { status: 200 })
  } catch (error) {
    console.error('Erro ao listar serviços:', error)
    return NextResponse.json(
      { error: 'Erro ao listar serviços' },
      { status: 500 }
    )
  }
}
