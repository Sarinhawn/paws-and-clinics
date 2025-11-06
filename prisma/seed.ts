import { PrismaClient, TipoUsuario, CargoClinica } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Criar usuário ADMIN_GERAL
  const senhaHash = await bcrypt.hash("admin123", 10);

  const adminGeral = await prisma.user.upsert({
    where: { email: "admin@vetapp.com" },
    update: {},
    create: {
      nome: "Administrador Geral",
      email: "admin@vetapp.com",
      senhaHash,
      tipo: TipoUsuario.ADMIN_GERAL,
      telefone: "(11) 99999-9999"
    }
  });

  console.log("✅ Admin geral criado:", adminGeral.email);

  // Criar clínica de exemplo
  const clinica = await prisma.clinica.upsert({
    where: { cnpj: "12345678000190" },
    update: {},
    create: {
      nome: "Clínica Veterinária Paws & Care",
      cnpj: "12345678000190",
      endereco: "Rua das Flores, 123 - Centro",
      telefone: "(11) 3333-4444",
      email: "contato@pawscare.com"
    }
  });

  console.log("✅ Clínica criada:", clinica.nome);

  // Criar veterinário de exemplo
  const senhaVet = await bcrypt.hash("vet123", 10);
  const userVet = await prisma.user.upsert({
    where: { email: "dra.maria@pawscare.com" },
    update: {},
    create: {
      nome: "Dra. Maria Silva",
      email: "dra.maria@pawscare.com",
      senhaHash: senhaVet,
      tipo: TipoUsuario.EQUIPE_CLINICA,
      telefone: "(11) 98888-7777"
    }
  });

  const veterinario = await prisma.veterinario.upsert({
    where: { crmv: "SP-12345" },
    update: {},
    create: {
      userId: userVet.id,
      clinicaId: clinica.id,
      crmv: "SP-12345",
      especialidade: "Clínica Geral",
      ativo: true
    }
  });

  console.log("✅ Veterinário criado:", userVet.nome);

  // Vincular veterinário à clínica
  await prisma.usuariosClinicas.upsert({
    where: {
      userId_clinicaId: {
        userId: userVet.id,
        clinicaId: clinica.id
      }
    },
    update: {},
    create: {
      userId: userVet.id,
      clinicaId: clinica.id,
      cargo: CargoClinica.VETERINARIO
    }
  });

  // Criar serviços de exemplo
  const servicos = [
    {
      nome: "Consulta Geral",
      descricao: "Consulta veterinária de rotina",
      valorBase: 150.0,
      duracaoMin: 30
    },
    {
      nome: "Vacinação",
      descricao: "Aplicação de vacinas",
      valorBase: 80.0,
      duracaoMin: 15
    },
    {
      nome: "Banho e Tosa",
      descricao: "Banho completo e tosa higiênica",
      valorBase: 120.0,
      duracaoMin: 60
    },
    {
      nome: "Exame de Sangue",
      descricao: "Coleta e análise de sangue",
      valorBase: 200.0,
      duracaoMin: 20
    },
    {
      nome: "Cirurgia Castração",
      descricao: "Procedimento de castração",
      valorBase: 600.0,
      duracaoMin: 120
    }
  ];

  for (const servico of servicos) {
    await prisma.servico.upsert({
      where: {
        clinicaId_nome: {
          clinicaId: clinica.id,
          nome: servico.nome
        }
      },
      update: {},
      create: {
        clinicaId: clinica.id,
        ...servico,
        ativo: true
      }
    });
  }

  console.log("✅ Serviços criados");

  // Criar tutores de exemplo
  const senhaTutor = await bcrypt.hash("tutor123", 10);

  const tutor1 = await prisma.user.upsert({
    where: { email: "joao@email.com" },
    update: {},
    create: {
      nome: "João Silva",
      email: "joao@email.com",
      senhaHash: senhaTutor,
      tipo: TipoUsuario.TUTOR,
      telefone: "(11) 98765-4321"
    }
  });

  const tutor2 = await prisma.user.upsert({
    where: { email: "maria@email.com" },
    update: {},
    create: {
      nome: "Maria Santos",
      email: "maria@email.com",
      senhaHash: senhaTutor,
      tipo: TipoUsuario.TUTOR,
      telefone: "(11) 97654-3210"
    }
  });
  console.log("✅ Tutores criados");

  // Criar pets
  const pet1 = await prisma.pet.create({
    data: {
      nome: "Rex",
      especie: "Cachorro",
      raca: "Golden Retriever",
      dataNasc: new Date("2020-05-15"),
      tutorId: tutor1.id,
      clinicaId: clinica.id,
      cor: "Dourado",
      peso: 30.5,
      sexo: "Macho",
      observacoes: "Muito dócil e brincalhão"
    }
  });

  const pet2 = await prisma.pet.create({
    data: {
      nome: "Mia",
      especie: "Gato",
      raca: "Siamês",
      dataNasc: new Date("2021-08-20"),
      tutorId: tutor1.id,
      clinicaId: clinica.id,
      cor: "Branco com manchas marrom",
      peso: 4.2,
      sexo: "Fêmea",
      observacoes: "Gata calma, gosta de carinho"
    }
  });

  const pet3 = await prisma.pet.create({
    data: {
      nome: "Thor",
      especie: "Cachorro",
      raca: "Husky Siberiano",
      dataNasc: new Date("2019-12-10"),
      tutorId: tutor2.id,
      clinicaId: clinica.id,
      cor: "Preto e branco",
      peso: 28.0,
      sexo: "Macho",
      observacoes: "Muito energético, precisa de exercícios diários"
    }
  });
  console.log("✅ Pets criados");

  // Buscar serviços para criar agendamentos
  const servicosDb = await prisma.servico.findMany({
    where: { clinicaId: clinica.id }
  });

  // Criar agendamentos de exemplo
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const proximaSemana = new Date(hoje);
  proximaSemana.setDate(proximaSemana.getDate() + 7);

  // Agendamento 1 - Consulta para Rex (amanhã às 10h)
  const agendamento1Date = new Date(amanha);
  agendamento1Date.setHours(10, 0, 0, 0);

  await prisma.agendamento.create({
    data: {
      petId: pet1.id,
      veterinarioId: veterinario.id,
      servicoId:
        servicosDb.find((s) => s.nome.includes("Consulta"))?.id ||
        servicosDb[0].id,
      dataHora: agendamento1Date,
      status: "AGENDADO",
      observacoes: "Primeira consulta de rotina"
    }
  });

  // Agendamento 2 - Vacinação para Mia (amanhã às 14h)
  const agendamento2Date = new Date(amanha);
  agendamento2Date.setHours(14, 0, 0, 0);

  await prisma.agendamento.create({
    data: {
      petId: pet2.id,
      veterinarioId: veterinario.id,
      servicoId:
        servicosDb.find((s) => s.nome.includes("Vacinação"))?.id ||
        servicosDb[1].id,
      dataHora: agendamento2Date,
      status: "CONFIRMADO",
      observacoes: "Vacina antirrábica"
    }
  });

  // Agendamento 3 - Banho e Tosa para Thor (próxima semana às 9h)
  const agendamento3Date = new Date(proximaSemana);
  agendamento3Date.setHours(9, 0, 0, 0);

  await prisma.agendamento.create({
    data: {
      petId: pet3.id,
      veterinarioId: veterinario.id,
      servicoId:
        servicosDb.find((s) => s.nome.includes("Banho"))?.id ||
        servicosDb[2].id,
      dataHora: agendamento3Date,
      status: "AGENDADO",
      observacoes: "Banho completo e tosa higiênica"
    }
  });

  // Agendamento 4 - Exame para Rex (próxima semana às 15h)
  const agendamento4Date = new Date(proximaSemana);
  agendamento4Date.setHours(15, 0, 0, 0);

  await prisma.agendamento.create({
    data: {
      petId: pet1.id,
      veterinarioId: veterinario.id,
      servicoId:
        servicosDb.find((s) => s.nome.includes("Exame"))?.id ||
        servicosDb[3].id,
      dataHora: agendamento4Date,
      status: "AGENDADO",
      observacoes: "Exame de rotina - check-up anual"
    }
  });

  console.log("✅ Agendamentos criados");

  console.log("🎉 Seed concluído com sucesso!");
  console.log("\n📝 Credenciais criadas:");
  console.log("Admin: admin@vetapp.com / admin123");
  console.log("Veterinária: dra.maria@pawscare.com / vet123");
  console.log("Tutor 1: joao@email.com / tutor123 (Pets: Rex e Mia)");
  console.log("Tutor 2: maria@email.com / tutor123 (Pet: Thor)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro ao executar seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
