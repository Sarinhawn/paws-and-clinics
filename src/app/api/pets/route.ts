import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { TipoUsuario } from '@prisma/client'

// Schema de validação
const criarPetSchema = z.object({
  nome: z.string().min(2, 'Nome do pet deve ter pelo menos 2 caracteres'),
  especie: z.string().min(2, 'Espécie é obrigatória'),
  raca: z.string().optional(),
  dataNasc: z.string().optional(),
  cor: z.string().optional(),
  peso: z.number().positive().optional(),
  sexo: z.string().optional(),
  observacoes: z.string().optional(),
  tutorId: z.number().int().positive().optional(), // Opcional: se não informado, usa o usuário logado
  clinicaId: z.number().int().positive().optional() // Opcional: pega a primeira clínica do tutor
})

/**
 * GET /api/pets
 * Lista pets do usuário logado ou todos (se for equipe/admin)
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

    let pets

    // Se for TUTOR, só vê seus próprios pets
    if (userTipo === TipoUsuario.TUTOR) {
      pets = await prisma.pet.findMany({
        where: { tutorId: userId },
        include: {
          tutor: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          },
          clinica: {
            select: {
              id: true,
              nome: true
            }
          },
          _count: {
            select: {
              agendamentos: true,
              exames: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // EQUIPE, ADMIN_CLINICA ou ADMIN_GERAL veem todos os pets
      pets = await prisma.pet.findMany({
        include: {
          tutor: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true
            }
          },
          clinica: {
            select: {
              id: true,
              nome: true
            }
          },
          _count: {
            select: {
              agendamentos: true,
              exames: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    return NextResponse.json({ pets }, { status: 200 })
  } catch (error) {
    console.error('Erro ao listar pets:', error)
    return NextResponse.json(
      { error: 'Erro ao listar pets' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pets
 * Cadastra um novo pet
 * - Tutores cadastram para si mesmos
 * - Equipe pode cadastrar para qualquer tutor
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
    const dados = criarPetSchema.parse(body)

    // Determinar o tutorId
    let tutorId: number
    
    if (userTipo === TipoUsuario.TUTOR) {
      // Tutor só pode cadastrar para si mesmo
      tutorId = userId
    } else {
      // Equipe/Admin pode cadastrar para qualquer tutor
      if (!dados.tutorId) {
        return NextResponse.json(
          { error: 'tutorId é obrigatório para equipe/admin' },
          { status: 400 }
        )
      }
      tutorId = dados.tutorId
    }

    // Verificar se o tutor existe
    const tutor = await prisma.user.findUnique({
      where: { id: tutorId },
      include: {
        clinicas: {
          select: {
            clinicaId: true
          }
        }
      }
    })

    if (!tutor) {
      return NextResponse.json(
        { error: 'Tutor não encontrado' },
        { status: 404 }
      )
    }

    // Determinar a clínica (OPCIONAL)
    let clinicaId: number | null = null

    if (dados.clinicaId) {
      clinicaId = dados.clinicaId
    } else if (tutor.clinicas.length > 0) {
      // Se o tutor tiver clínica vinculada, usa a primeira
      clinicaId = tutor.clinicas[0].clinicaId
    }
    // Se não tiver clínica, deixa como null (permitido)

    // Criar o pet
    const pet = await prisma.pet.create({
      data: {
        nome: dados.nome,
        especie: dados.especie,
        raca: dados.raca,
        dataNasc: dados.dataNasc ? new Date(dados.dataNasc) : null,
        cor: dados.cor,
        peso: dados.peso,
        sexo: dados.sexo,
        observacoes: dados.observacoes,
        tutorId,
        ...(clinicaId && { clinicaId })
      },
      include: {
        tutor: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        clinica: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: 'Pet cadastrado com sucesso!',
        pet
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao cadastrar pet:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao cadastrar pet' },
      { status: 500 }
    )
  }
}
