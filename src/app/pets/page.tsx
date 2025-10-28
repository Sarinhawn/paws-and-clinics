import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { TipoUsuario } from '@prisma/client'

export default async function PetsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const userId = parseInt(session.user.id)
  const userTipo = session.user.tipo

  // Buscar pets
  let pets
  if (userTipo === TipoUsuario.TUTOR) {
    pets = await prisma.pet.findMany({
      where: { tutorId: userId },
      include: {
        clinica: {
          select: {
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
    pets = await prisma.pet.findMany({
      include: {
        tutor: {
          select: {
            nome: true,
            telefone: true
          }
        },
        clinica: {
          select: {
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

  // Mapear espécie para emoji
  const getEmojiEspecie = (especie: string) => {
    const especieLower = especie.toLowerCase()
    if (especieLower.includes('cão') || especieLower.includes('cachorro') || especieLower.includes('dog')) return '🐕'
    if (especieLower.includes('gato') || especieLower.includes('cat')) return '🐈'
    if (especieLower.includes('pássaro') || especieLower.includes('ave')) return '🦜'
    if (especieLower.includes('coelho')) return '🐰'
    if (especieLower.includes('hamster')) return '🐹'
    return '🐾'
  }

  const calcularIdade = (dataNasc: Date | null) => {
    if (!dataNasc) return null
    const hoje = new Date()
    const nascimento = new Date(dataNasc)
    const anos = hoje.getFullYear() - nascimento.getFullYear()
    const meses = hoje.getMonth() - nascimento.getMonth()
    
    if (anos === 0) {
      return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
    }
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userTipo === TipoUsuario.TUTOR ? 'Meus Pets' : 'Todos os Pets'}
            </h1>
            <p className="text-gray-600 mt-1">
              {pets.length} {pets.length === 1 ? 'pet cadastrado' : 'pets cadastrados'}
            </p>
          </div>
          <Link
            href="/pets/novo"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Cadastrar Pet
          </Link>
        </div>

        {/* Lista de Pets */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🐾</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhum pet cadastrado
            </h2>
            <p className="text-gray-600 mb-6">
              {userTipo === TipoUsuario.TUTOR 
                ? 'Cadastre seu primeiro pet para começar!' 
                : 'Nenhum pet foi cadastrado ainda.'}
            </p>
            <Link
              href="/pets/novo"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Cadastrar Primeiro Pet
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Header do Card */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-400 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">
                      {getEmojiEspecie(pet.especie)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{pet.nome}</h3>
                      <p className="text-teal-50 text-sm">{pet.especie}</p>
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4 space-y-3">
                  {pet.raca && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Raça:</span>
                      <span className="font-medium text-gray-800">{pet.raca}</span>
                    </div>
                  )}

                  {pet.dataNasc && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Idade:</span>
                      <span className="font-medium text-gray-800">
                        {calcularIdade(pet.dataNasc)}
                      </span>
                    </div>
                  )}

                  {userTipo !== TipoUsuario.TUTOR && 'tutor' in pet && (
                    <div className="flex items-center gap-2 text-sm border-t pt-3">
                      <span className="text-gray-500">Tutor:</span>
                      <span className="font-medium text-gray-800">
                        {(pet as any).tutor?.nome || 'N/A'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Clínica:</span>
                    <span className="font-medium text-gray-800">{pet.clinica.nome}</span>
                  </div>

                  {/* Estatísticas */}
                  <div className="flex gap-4 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">
                        {pet._count.agendamentos}
                      </div>
                      <div className="text-xs text-gray-500">Consultas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">
                        {pet._count.exames}
                      </div>
                      <div className="text-xs text-gray-500">Exames</div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-3">
                    <Link
                      href={`/pets/${pet.id}`}
                      className="flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
