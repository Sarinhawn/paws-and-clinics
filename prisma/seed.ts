import { PrismaClient, TipoUsuario } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Criar usuário ADMIN_GERAL
  const senhaHash = await bcrypt.hash('admin123', 10)

  const adminGeral = await prisma.user.upsert({
    where: { email: 'admin@vetapp.com' },
    update: {},
    create: {
      nome: 'Administrador Geral',
      email: 'admin@vetapp.com',
      senhaHash,
      tipo: TipoUsuario.ADMIN_GERAL,
      telefone: '(11) 99999-9999'
    }
  })

  console.log('✅ Admin geral criado:', adminGeral.email)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro ao executar seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
