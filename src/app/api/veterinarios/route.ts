import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/veterinarios
 * Lista veterinários ativos
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

    const veterinarios = await prisma.veterinario.findMany({
      where,
      include: {
        user: {
          select: {
            nome: true,
            telefone: true,
            email: true
          }
        },
        clinica: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        user: {
          nome: 'asc'
        }
      }
    })

    return NextResponse.json({ veterinarios }, { status: 200 })
  } catch (error) {
    console.error('Erro ao listar veterinários:', error)
    return NextResponse.json(
      { error: 'Erro ao listar veterinários' },
      { status: 500 }
    )
  }
}
