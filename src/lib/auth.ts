import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { TipoUsuario } from '@prisma/client'

/**
 * Retorna a sessão do usuário atual
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Verifica se o usuário tem permissão baseado no seu tipo
 * @param allowedTypes - Array de tipos de usuário permitidos
 * @throws Error se o usuário não estiver autenticado ou não tiver permissão
 */
export async function requireRole(allowedTypes: TipoUsuario[]) {
  const session = await getSession()

  if (!session || !session.user) {
    throw new Error('Usuário não autenticado')
  }

  const userType = session.user.tipo as TipoUsuario

  if (!allowedTypes.includes(userType)) {
    throw new Error(`Acesso negado. Requer um dos seguintes tipos: ${allowedTypes.join(', ')}`)
  }

  return session
}

/**
 * Verifica se o usuário é admin geral
 */
export async function requireAdminGeral() {
  return await requireRole([TipoUsuario.ADMIN_GERAL])
}

/**
 * Verifica se o usuário é admin de clínica
 */
export async function requireAdminClinica() {
  return await requireRole([TipoUsuario.ADMIN_GERAL, TipoUsuario.ADMIN_CLINICA])
}

/**
 * Verifica se o usuário faz parte da equipe da clínica
 */
export async function requireEquipeClinica() {
  return await requireRole([
    TipoUsuario.ADMIN_GERAL,
    TipoUsuario.ADMIN_CLINICA,
    TipoUsuario.EQUIPE_CLINICA
  ])
}

/**
 * Verifica se o usuário está autenticado (qualquer tipo)
 */
export async function requireAuth() {
  const session = await getSession()

  if (!session || !session.user) {
    throw new Error('Usuário não autenticado')
  }

  return session
}
