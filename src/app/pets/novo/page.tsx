'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import NavbarClient from '@/components/NavbarClient'
import Footer from '@/components/Footer'

interface Tutor {
  id: number
  nome: string
  email: string
  telefone?: string
  _count: {
    pets: number
  }
}

export default function NovoPetPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [nome, setNome] = useState('')
  const [especie, setEspecie] = useState('')
  const [raca, setRaca] = useState('')
  const [dataNasc, setDataNasc] = useState('')
  const [cor, setCor] = useState('')
  const [peso, setPeso] = useState('')
  const [sexo, setSexo] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [tutorId, setTutorId] = useState('')
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingTutores, setLoadingTutores] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isTutor = session?.user?.tipo === 'TUTOR'
  const isEquipe = !isTutor && session?.user

  // Buscar lista de tutores se for equipe
  useEffect(() => {
    if (isEquipe) {
      const fetchTutores = async () => {
        setLoadingTutores(true)
        try {
          const res = await fetch('/api/tutores')
          if (res.ok) {
            const data = await res.json()
            setTutores(data.tutores || [])
          }
        } catch (err) {
          console.error('Erro ao buscar tutores:', err)
        } finally {
          setLoadingTutores(false)
        }
      }
      fetchTutores()
    }
  }, [isEquipe])

  // Redirecionar se não estiver autenticado
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validações
    if (!nome.trim() || !especie.trim()) {
      setError('Preencha pelo menos o nome e a espécie do pet')
      setLoading(false)
      return
    }

    if (isEquipe && !tutorId) {
      setError('Selecione um tutor')
      setLoading(false)
      return
    }

    try {
      const body: any = {
        nome: nome.trim(),
        especie: especie.trim(),
        raca: raca.trim() || undefined,
        dataNasc: dataNasc || undefined,
        cor: cor.trim() || undefined,
        peso: peso ? parseFloat(peso) : undefined,
        sexo: sexo || undefined,
        observacoes: observacoes.trim() || undefined
      }

      // Se for equipe, adiciona tutorId
      if (isEquipe && tutorId) {
        body.tutorId = parseInt(tutorId)
      }

      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao cadastrar pet')
        setLoading(false)
        return
      }

      // Sucesso!
      setSuccess(true)
      setTimeout(() => {
        router.push('/pets')
      }, 1500)
    } catch (err) {
      setError('Erro ao cadastrar pet. Tente novamente.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavbarClient />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-teal-700 mb-4">
              Pet cadastrado com sucesso!
            </h2>
            <p className="text-gray-600">
              Redirecionando para a lista de pets...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarClient />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pets"
            className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 mb-4"
          >
            <span>←</span>
            <span>Voltar para meus pets</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Pet</h1>
          <p className="text-gray-600 mt-1">
            {isTutor 
              ? 'Preencha os dados do seu pet' 
              : 'Cadastre um pet para um tutor'}
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Seletor de Tutor (apenas para equipe) */}
            {isEquipe && (
              <div>
                <label htmlFor="tutor" className="block text-sm font-medium text-gray-700 mb-2">
                  Tutor *
                </label>
                {loadingTutores ? (
                  <div className="text-gray-500">Carregando tutores...</div>
                ) : (
                  <select
                    id="tutor"
                    required
                    value={tutorId}
                    onChange={(e) => setTutorId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Selecione um tutor</option>
                    {tutores.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.nome} ({tutor.email}) - {tutor._count.pets} pets
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Selecione o tutor responsável por este pet
                </p>
              </div>
            )}

            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Pet *
              </label>
              <input
                id="nome"
                type="text"
                required
                placeholder="Ex: Rex, Mimi, Bob"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Espécie */}
            <div>
              <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-2">
                Espécie *
              </label>
              <select
                id="especie"
                required
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecione a espécie</option>
                <option value="Cão">🐕 Cão</option>
                <option value="Gato">🐈 Gato</option>
                <option value="Pássaro">🦜 Pássaro</option>
                <option value="Coelho">🐰 Coelho</option>
                <option value="Hamster">🐹 Hamster</option>
                <option value="Outro">🐾 Outro</option>
              </select>
            </div>

            {/* Raça */}
            <div>
              <label htmlFor="raca" className="block text-sm font-medium text-gray-700 mb-2">
                Raça (opcional)
              </label>
              <input
                id="raca"
                type="text"
                placeholder="Ex: Labrador, Persa, SRD"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label htmlFor="dataNasc" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento (opcional)
              </label>
              <input
                id="dataNasc"
                type="date"
                value={dataNasc}
                onChange={(e) => setDataNasc(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ajuda a calcular a idade do pet
              </p>
            </div>

            {/* Sexo */}
            <div>
              <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-2">
                Sexo (opcional)
              </label>
              <select
                id="sexo"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecione</option>
                <option value="Macho">♂️ Macho</option>
                <option value="Fêmea">♀️ Fêmea</option>
              </select>
            </div>

            {/* Grid de 2 colunas - Cor e Peso */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Cor */}
              <div>
                <label htmlFor="cor" className="block text-sm font-medium text-gray-700 mb-2">
                  Cor/Pelagem (opcional)
                </label>
                <input
                  id="cor"
                  type="text"
                  placeholder="Ex: Preto, Branco, Caramelo"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Peso */}
              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg - opcional)
                </label>
                <input
                  id="peso"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Ex: 5.5"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                id="observacoes"
                rows={4}
                placeholder="Ex: Alergias, comportamento, cuidados especiais, etc."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Informações importantes sobre o pet (alergias, medicamentos, temperamento)
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/pets"
                className="flex-1 text-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Pet'}
              </button>
            </div>
          </form>
        </div>

        {/* Dica */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Dica</h3>
              <p className="text-sm text-blue-800">
                {isTutor 
                  ? 'Depois de cadastrar seu pet, você poderá agendar consultas e ver o histórico de atendimentos.'
                  : 'Certifique-se de selecionar o tutor correto. O tutor poderá ver e gerenciar este pet.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
