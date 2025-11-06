import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { TipoUsuario } from "@prisma/client";
import { z } from "zod";

// Schema de validação para cadastro de tutor
const cadastroTutorSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  telefone: z.string().optional()
});

/**
 * GET /api/tutores
 * Lista todos os tutores (apenas para equipe/admin)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Apenas equipe/admin pode listar tutores
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (session.user.tipo === TipoUsuario.TUTOR) {
      return NextResponse.json(
        { error: "Sem permissão para listar tutores" },
        { status: 403 }
      );
    }

    const tutores = await prisma.user.findMany({
      where: { tipo: TipoUsuario.TUTOR },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        createdAt: true,
        _count: {
          select: {
            pets: true
          }
        }
      },
      orderBy: {
        nome: "asc"
      }
    });

    return NextResponse.json({ tutores }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar tutores:", error);
    return NextResponse.json(
      { error: "Erro ao listar tutores" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tutores
 * Cadastra um novo tutor (registro público)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dados = cadastroTutorSchema.parse(body);

    // Verificar se o email já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email: dados.email }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Criar hash da senha
    const senhaHash = await bcrypt.hash(dados.senha, 10);

    // Criar o tutor
    const tutor = await prisma.user.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senhaHash,
        telefone: dados.telefone,
        tipo: TipoUsuario.TUTOR
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true
      }
    });

    return NextResponse.json(
      {
        message: "Cadastro realizado com sucesso!",
        user: tutor
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar tutor:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar cadastro. Tente novamente." },
      { status: 500 }
    );
  }
}
