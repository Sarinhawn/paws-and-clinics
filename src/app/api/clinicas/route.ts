import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminGeral } from "@/lib/auth";
import { criarClinicaSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { TipoUsuario, CargoClinica } from "@prisma/client";

/**
 * GET /api/clinicas
 * Lista todas as clínicas
 * Requer: ADMIN_GERAL
 */
export async function GET() {
  try {
    await requireAdminGeral();

    const clinicas = await prisma.clinica.findMany({
      include: {
        admin: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        _count: {
          select: {
            veterinarios: true,
            pets: true,
            servicos: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ clinicas }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar clínicas:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro ao listar clínicas"
      },
      {
        status:
          error instanceof Error && error.message.includes("autenticado")
            ? 401
            : 500
      }
    );
  }
}

/**
 * POST /api/clinicas
 * Cria uma nova clínica e seu administrador
 * Requer: ADMIN_GERAL
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar permissão
    await requireAdminGeral();

    // Validar dados
    const body = await request.json();
    const dados = criarClinicaSchema.parse(body);

    // Verificar se o email do admin já existe
    const adminExistente = await prisma.user.findUnique({
      where: { email: dados.adminEmail }
    });

    if (adminExistente) {
      return NextResponse.json(
        { error: "Email do administrador já está em uso" },
        { status: 400 }
      );
    }

    // Criar hash da senha do admin
    const senhaHash = await bcrypt.hash(dados.adminSenha, 10);

    // Criar clínica e admin em uma transação
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Criar o usuário administrador
      const admin = await tx.user.create({
        data: {
          nome: dados.adminNome,
          email: dados.adminEmail,
          senhaHash,
          telefone: dados.adminTelefone,
          tipo: TipoUsuario.ADMIN_CLINICA
        }
      });

      // 2. Criar a clínica
      const clinica = await tx.clinica.create({
        data: {
          nome: dados.nome,
          cnpj: dados.cnpj,
          endereco: dados.endereco,
          telefone: dados.telefone,
          email: dados.email,
          adminId: admin.id
        },
        include: {
          admin: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      });

      // 3. Criar relação na tabela UsuariosClinicas
      await tx.usuariosClinicas.create({
        data: {
          userId: admin.id,
          clinicaId: clinica.id,
          cargo: CargoClinica.ADMIN_CLINICA
        }
      });

      return { clinica, admin };
    });

    return NextResponse.json(
      {
        message: "Clínica criada com sucesso",
        clinica: resultado.clinica
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar clínica:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("autenticado") ||
        error.message.includes("Acesso negado")
      ) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      if (error.name === "ZodError") {
        return NextResponse.json(
          { error: "Dados inválidos", details: error },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erro ao criar clínica" },
      { status: 500 }
    );
  }
}
