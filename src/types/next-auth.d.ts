import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'
import { TipoUsuario } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      tipo: TipoUsuario
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    tipo: TipoUsuario
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    tipo: TipoUsuario
  }
}
