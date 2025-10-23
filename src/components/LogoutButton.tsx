'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-white/80 hover:text-white text-sm transition-colors"
    >
      Sair
    </button>
  )
}
