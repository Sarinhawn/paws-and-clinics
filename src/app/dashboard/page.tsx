import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Se não estiver logado, redireciona para login
  if (!session?.user) {
    redirect('/login')
  }

  // Buscar dados completos do usuário
  const usuario = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    include: {
      pets: {
        select: {
          id: true,
          nome: true,
          especie: true
        }
      },
      clinicas: {
        include: {
          clinica: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      }
    }
  })

  if (!usuario) {
    redirect('/login')
  }

  // Mapear tipo de usuário para texto legível
  const tipoTexto = {
    ADMIN_GERAL: 'Administrador Geral',
    ADMIN_CLINICA: 'Administrador de Clínica',
    EQUIPE_CLINICA: 'Equipe da Clínica',
    TUTOR: 'Tutor'
  }[usuario.tipo]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Olá, {usuario.nome}! 👋
          </h1>
          <p className="text-teal-50 text-lg">
            Tipo de conta: <span className="font-semibold">{tipoTexto}</span>
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card Meus Pets */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Meus Pets</h2>
              <span className="text-3xl">🐾</span>
            </div>
            <p className="text-3xl font-bold text-teal-600 mb-2">
              {usuario.pets.length}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              {usuario.pets.length === 0 ? 'Nenhum pet cadastrado' : 'pets cadastrados'}
            </p>
            <Link
              href="/pets"
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold"
            >
              {usuario.pets.length === 0 ? 'Cadastrar pet' : 'Ver meus pets'}
            </Link>
          </div>

          {/* Card Clínicas */}
          {usuario.clinicas.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Minhas Clínicas</h2>
                <span className="text-3xl">🏥</span>
              </div>
              <p className="text-3xl font-bold text-teal-600 mb-2">
                {usuario.clinicas.length}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                clínicas vinculadas
              </p>
              <Link
                href="/clinicas"
                className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold"
              >
                Ver clínicas
              </Link>
            </div>
          )}

          {/* Card Perfil */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Meu Perfil</h2>
              <span className="text-3xl">👤</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Email:</strong> {usuario.email}
            </p>
            {usuario.telefone && (
              <p className="text-gray-600 text-sm mb-4">
                <strong>Telefone:</strong> {usuario.telefone}
              </p>
            )}
            <Link
              href="/perfil"
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold"
            >
              Editar perfil
            </Link>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {usuario.tipo === 'TUTOR' && (
              <>
                <Link
                  href="/agendamentos"
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
                >
                  <span className="text-2xl">📅</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Agendar Consulta</h3>
                    <p className="text-sm text-gray-600">Marque uma consulta para seu pet</p>
                  </div>
                </Link>
                <Link
                  href="/exames"
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
                >
                  <span className="text-2xl">📊</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Ver Exames</h3>
                    <p className="text-sm text-gray-600">Consulte resultados de exames</p>
                  </div>
                </Link>
              </>
            )}
            
            {usuario.tipo === 'ADMIN_GERAL' && (
              <Link
                href="/admin/clinicas"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
              >
                <span className="text-2xl">🏥</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Gerenciar Clínicas</h3>
                  <p className="text-sm text-gray-600">Criar e administrar clínicas</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
