'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const emailVal = email.trim()
    const pwdVal = password.trim()
    
    if (!emailVal || !pwdVal) {
      setError('Preencha e-mail e senha.')
      setLoading(false)
      return
    }
    
    // Validação simples de email
    const emailRegex = /.+@.+\..+/
    if (!emailRegex.test(emailVal)) {
      setError('Informe um e-mail válido.')
      setLoading(false)
      return
    }
    
    try {
      // Login usando NextAuth
      const result = await signIn('credentials', {
        email: emailVal,
        password: pwdVal,
        redirect: false
      })

      if (result?.error) {
        setError('Email ou senha incorretos')
        setLoading(false)
        return
      }

      // Sucesso! Redirecionar para dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
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

      {/* Login Box */}
      <div className="relative z-10 bg-white/92 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">
          Entrar no Pawns & Clinics
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="sr-only">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/cadastro" className="hover:text-teal-700 transition-colors">
            Criar conta
          </Link>
          <span className="mx-2">•</span>
          <span className="text-gray-400">Esqueceu a senha?</span>
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
