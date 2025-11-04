'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import LogoutButton from './LogoutButton'

export default function NavbarClient() {
  const { data: session } = useSession()

  return (
    <nav className="bg-teal-700 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-baloo">
          Pawns & Clinics
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li>
            <Link className="text-white/80 hover:text-white transition-colors" href="/">
              Início
            </Link>
          </li>
          <li>
            <a className="text-white/80 hover:text-white transition-colors" href="#servicos">
              Serviços
            </a>
          </li>
          <li>
            <a className="text-white/80 hover:text-white transition-colors" href="#blog">
              Blog
            </a>
          </li>
          <li>
            <a className="text-white/80 hover:text-white transition-colors" href="#contato">
              Contato
            </a>
          </li>
          <li>
            <a className="text-white/80 hover:text-white transition-colors" href="#vet">
              Vet Parceiro
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link 
                href="/dashboard" 
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                Dashboard
              </Link>
              {session.user.tipo === 'ADMIN_GERAL' && (
                <Link 
                  href="/clinicas" 
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Clínicas
                </Link>
              )}
              <Link 
                href="/agendamentos" 
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                Agendamentos
              </Link>
              <Link 
                href="/exames" 
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                Exames
              </Link>
              <Link 
                href="/perfil" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Meu Perfil
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                Entrar
              </Link>
              <Link 
                href="/cadastro" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
