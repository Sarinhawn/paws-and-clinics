'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmSenha, setConfirmSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validações
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setError('Preencha todos os campos obrigatórios')
      setLoading(false)
      return
    }

    if (senha !== confirmSenha) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/tutores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha,
          telefone: telefone.trim() || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar cadastro')
        setLoading(false)
        return
      }

      // Sucesso!
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError('Erro ao criar cadastro. Tente novamente.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full relative flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/popo.png"
            alt="Fundo com ilustração de pets"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 bg-white/92 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-teal-700 mb-4">
            Cadastro realizado!
          </h2>
          <p className="text-gray-600 mb-4">
            Redirecionando para o login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center py-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/popo.png"
          alt="Fundo com ilustração de pets"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Cadastro Box */}
      <div className="relative z-10 bg-white/92 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">
          Criar Conta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Nome Input */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Seu nome completo"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Telefone Input */}
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Senha Input */}
          <div className="relative">
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha *
            </label>
            <input
              id="senha"
              name="senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Confirmar Senha Input */}
          <div>
            <label htmlFor="confirmSenha" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar senha *
            </label>
            <input
              id="confirmSenha"
              name="confirmSenha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite a senha novamente"
              required
              autoComplete="new-password"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-teal-700 hover:text-teal-800 font-semibold transition-colors">
            Fazer login
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1"
          >
            <span>←</span>
            <span>Voltar</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
