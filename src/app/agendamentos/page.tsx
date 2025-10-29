'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavbarClient from '@/components/NavbarClient'
import Footer from '@/components/Footer'

interface Agendamento {
  id: number
  dataHora: string
  status: string
  observacoes?: string
  pet: {
    id: number
    nome: string
    especie: string
    tutor: {
      nome: string
      telefone?: string
    }
  }
  veterinario: {
    id: number
    crmv: string
    user: {
      nome: string
    }
  }
  servico: {
    nome: string
    valorBase: number
    duracaoMin: number
  }
  pagamento?: {
    valor: number
    status: string
  }
}

const statusColors = {
  AGENDADO: 'bg-blue-100 text-blue-800',
  CONFIRMADO: 'bg-green-100 text-green-800',
  REALIZADO: 'bg-gray-100 text-gray-800',
  CANCELADO: 'bg-red-100 text-red-800'
}

const statusLabels = {
  AGENDADO: '📅 Agendado',
  CONFIRMADO: '✅ Confirmado',
  REALIZADO: '✔️ Realizado',
  CANCELADO: '❌ Cancelado'
}

export default function AgendamentosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('TODOS')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      carregarAgendamentos()
    }
  }, [session, filtroStatus])

  const carregarAgendamentos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filtroStatus !== 'TODOS') {
        params.append('status', filtroStatus)
      }

      const response = await fetch(`/api/agendamentos?${params}`)
      const data = await response.json()

      if (response.ok) {
        setAgendamentos(data.agendamentos)
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelarAgendamento = async (id: number) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return
    }

    try {
      const response = await fetch(`/api/agendamentos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Agendamento cancelado com sucesso!')
        carregarAgendamentos()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao cancelar agendamento')
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error)
      alert('Erro ao cancelar agendamento')
    }
  }

  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatarHora = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarClient />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📅 Agendamentos
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie seus agendamentos e consultas
              </p>
            </div>
            <Link
              href="/agendamentos/novo"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              + Novo Agendamento
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            {['TODOS', 'AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO'].map((status) => (
              <button
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroStatus === status
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status === 'TODOS' ? 'Todos' : statusLabels[status as keyof typeof statusLabels]}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Agendamentos */}
        {agendamentos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {filtroStatus === 'TODOS' 
                ? 'Você ainda não tem agendamentos.'
                : `Não há agendamentos com status "${statusLabels[filtroStatus as keyof typeof statusLabels]}".`
              }
            </p>
            <Link
              href="/agendamentos/novo"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Criar Primeiro Agendamento
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {agendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Data e Hora */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-600">
                          {formatarData(agendamento.dataHora).split('/')[0]}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatarData(agendamento.dataHora).substring(3)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800">
                          {formatarHora(agendamento.dataHora)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duração: {agendamento.servico.duracaoMin} min
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[agendamento.status as keyof typeof statusColors]}`}>
                        {statusLabels[agendamento.status as keyof typeof statusLabels]}
                      </span>
                    </div>

                    {/* Informações */}
                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pet</p>
                        <p className="font-semibold text-gray-800">
                          🐾 {agendamento.pet.nome}
                        </p>
                        <p className="text-sm text-gray-600">{agendamento.pet.especie}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Veterinário</p>
                        <p className="font-semibold text-gray-800">
                          👨‍⚕️ {agendamento.veterinario.user.nome}
                        </p>
                        <p className="text-sm text-gray-600">CRMV: {agendamento.veterinario.crmv}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Serviço</p>
                        <p className="font-semibold text-gray-800">
                          {agendamento.servico.nome}
                        </p>
                        <p className="text-sm text-teal-600 font-semibold">
                          {formatarValor(Number(agendamento.servico.valorBase))}
                        </p>
                      </div>
                    </div>

                    {/* Tutor (para equipe) */}
                    {session?.user.tipo !== 'TUTOR' && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Tutor</p>
                        <p className="text-sm text-gray-700">
                          {agendamento.pet.tutor.nome}
                          {agendamento.pet.tutor.telefone && ` • ${agendamento.pet.tutor.telefone}`}
                        </p>
                      </div>
                    )}

                    {/* Observações */}
                    {agendamento.observacoes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Observações</p>
                        <p className="text-sm text-gray-700">{agendamento.observacoes}</p>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      href={`/agendamentos/${agendamento.id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                      Ver Detalhes
                    </Link>
                    {agendamento.status !== 'CANCELADO' && agendamento.status !== 'REALIZADO' && (
                      <button
                        onClick={() => cancelarAgendamento(agendamento.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
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
