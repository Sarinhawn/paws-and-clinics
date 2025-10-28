'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import NavbarClient from '@/components/NavbarClient'
import Footer from '@/components/Footer'

export default function NovaClinicaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [endereco, setEndereco] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [cep, setCep] = useState('')
  
  // Dados do admin
  const [nomeAdmin, setNomeAdmin] = useState('')
  const [emailAdmin, setEmailAdmin] = useState('')
  const [senhaAdmin, setSenhaAdmin] = useState('')
  const [telefoneAdmin, setTelefoneAdmin] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect se não estiver autenticado ou não for ADMIN_GERAL
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  if (session.user.tipo !== 'ADMIN_GERAL') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavbarClient />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-6">
              Apenas administradores gerais podem cadastrar clínicas.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validações
    if (!nome.trim() || !cnpj.trim() || !nomeAdmin.trim() || !emailAdmin.trim() || !senhaAdmin.trim()) {
      setError('Preencha todos os campos obrigatórios (*)')
      setLoading(false)
      return
    }

    if (senhaAdmin.length < 6) {
      setError('A senha do administrador deve ter no mínimo 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/clinicas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Dados da clínica
          nome: nome.trim(),
          cnpj: cnpj.trim(),
          telefone: telefone.trim() || undefined,
          email: email.trim() || undefined,
          endereco: endereco.trim() || undefined,
          cidade: cidade.trim() || undefined,
          estado: estado.trim() || undefined,
          cep: cep.trim() || undefined,
          // Dados do admin
          nomeAdmin: nomeAdmin.trim(),
          emailAdmin: emailAdmin.trim(),
          senhaAdmin: senhaAdmin,
          telefoneAdmin: telefoneAdmin.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar clínica')
      }

      setSuccess(true)
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar clínica. Tente novamente.')
    } finally {
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
              Clínica cadastrada com sucesso!
            </h2>
            <p className="text-gray-600">
              Redirecionando para o dashboard...
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
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4 transition-colors"
          >
            <span className="mr-2">←</span>
            Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            🏥 Cadastrar Nova Clínica
          </h1>
          <p className="text-gray-600 mt-2">
            Preencha os dados da clínica e do administrador responsável
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Seção: Dados da Clínica */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              📋 Dados da Clínica
            </h2>
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Clínica *
                </label>
                <input
                  id="nome"
                  type="text"
                  required
                  placeholder="Ex: Clínica Veterinária Paws & Care"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* CNPJ */}
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ *
                </label>
                <input
                  id="cnpj"
                  type="text"
                  required
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Grid de 2 colunas - Telefone e Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone (opcional)
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email (opcional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="contato@clinica.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço (opcional)
                </label>
                <input
                  id="endereco"
                  type="text"
                  placeholder="Rua, número, bairro"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Grid de 3 colunas - Cidade, Estado, CEP */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade (opcional)
                  </label>
                  <input
                    id="cidade"
                    type="text"
                    placeholder="São Paulo"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                    Estado (opcional)
                  </label>
                  <select
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Selecione</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                    CEP (opcional)
                  </label>
                  <input
                    id="cep"
                    type="text"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Dados do Administrador */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              👤 Dados do Administrador
            </h2>
            <div className="space-y-4">
              {/* Nome Admin */}
              <div>
                <label htmlFor="nomeAdmin" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Administrador *
                </label>
                <input
                  id="nomeAdmin"
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={nomeAdmin}
                  onChange={(e) => setNomeAdmin(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Grid de 2 colunas - Email e Telefone Admin */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emailAdmin" className="block text-sm font-medium text-gray-700 mb-2">
                    Email do Administrador *
                  </label>
                  <input
                    id="emailAdmin"
                    type="email"
                    required
                    placeholder="admin@email.com"
                    value={emailAdmin}
                    onChange={(e) => setEmailAdmin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="telefoneAdmin" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone do Administrador (opcional)
                  </label>
                  <input
                    id="telefoneAdmin"
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={telefoneAdmin}
                    onChange={(e) => setTelefoneAdmin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Senha Admin */}
              <div>
                <label htmlFor="senhaAdmin" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha do Administrador *
                </label>
                <input
                  id="senhaAdmin"
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={senhaAdmin}
                  onChange={(e) => setSenhaAdmin(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Esta será a senha de acesso do administrador da clínica
                </p>
              </div>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Cadastrando...' : '✅ Cadastrar Clínica'}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
