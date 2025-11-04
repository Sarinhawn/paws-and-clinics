import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const dynamic = 'force-dynamic';

// GET - Buscar dados do perfil do usuário autenticado
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo: true,
        createdAt: true,
        clinicas: {
          include: {
            clinica: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        veterinarios: {
          include: {
            clinica: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        pets: {
          select: {
            id: true,
            nome: true,
            especie: true,
          },
        },
        _count: {
          select: {
            pets: true,
            clinicas: true,
            veterinarios: true,
          },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar perfil' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar dados do perfil
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nome, telefone, senhaAtual, novaSenha } = body;

    // Buscar usuário atual
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Se está tentando alterar a senha, verificar a senha atual
    if (novaSenha) {
      if (!senhaAtual) {
        return NextResponse.json(
          { error: 'Senha atual é obrigatória para alterar a senha' },
          { status: 400 }
        );
      }

      const senhaValida = await bcrypt.compare(senhaAtual, usuario.senhaHash);
      if (!senhaValida) {
        return NextResponse.json(
          { error: 'Senha atual incorreta' },
          { status: 400 }
        );
      }

      // Hash da nova senha
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

      // Atualizar com nova senha
      const usuarioAtualizado = await prisma.user.update({
        where: { id: usuario.id },
        data: {
          nome: nome || usuario.nome,
          telefone: telefone || usuario.telefone,
          senhaHash: novaSenhaHash,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          tipo: true,
        },
      });

      return NextResponse.json(
        { message: 'Perfil e senha atualizados com sucesso', usuario: usuarioAtualizado },
        { status: 200 }
      );
    }

    // Atualizar apenas dados básicos
    const usuarioAtualizado = await prisma.user.update({
      where: { id: usuario.id },
      data: {
        nome: nome || usuario.nome,
        telefone: telefone || usuario.telefone,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo: true,
      },
    });

    return NextResponse.json(
      { message: 'Perfil atualizado com sucesso', usuario: usuarioAtualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil' },
      { status: 500 }
    );
  }
}
