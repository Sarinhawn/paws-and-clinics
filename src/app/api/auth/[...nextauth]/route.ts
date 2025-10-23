import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        // Buscar usuário no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('Credenciais inválidas')
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(credentials.password, user.senhaHash)

        if (!senhaValida) {
          throw new Error('Credenciais inválidas')
        }

        // Retornar usuário (sem o hash da senha)
        return {
          id: user.id.toString(),
          name: user.nome,
          email: user.email,
          tipo: user.tipo
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Adicionar informações extras ao token
      if (user) {
        token.id = user.id
        token.tipo = user.tipo
      }
      return token
    },
    async session({ session, token }) {
      // Adicionar informações extras à sessão
      if (session.user) {
        session.user.id = token.id as string
        session.user.tipo = token.tipo
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
