'use client';

import NavbarClient from '@/components/NavbarClient';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Clinica {
  id: number;
  nome: string;
}

interface Veterinario {
  id: number;
  crmv: string;
  especialidade: string | null;
  clinica: {
    id: number;
    nome: string;
  };
}

interface Pet {
  id: number;
  nome: string;
  especie: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  tipo: string;
  createdAt: string;
  clinicas: {
    cargo: string;
    clinica: Clinica;
  }[];
  veterinarios: Veterinario[];
  pets: Pet[];
  _count: {
    pets: number;
    clinicas: number;
    veterinarios: number;
  };
}

export default function Perfil() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Dados do formulário
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPerfil();
    }
  }, [status]);

  const fetchPerfil = async () => {
    try {
      const response = await fetch('/api/perfil');
      if (response.ok) {
        const data = await response.json();
        setUsuario(data);
        setNome(data.nome);
        setTelefone(data.telefone || '');
      } else {
        alert('Erro ao carregar perfil');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      alert('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validações
      if (!nome.trim()) {
        alert('Nome é obrigatório');
        return;
      }

      const body = {
        nome,
        telefone: telefone || null,
      };

      const response = await fetch('/api/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert('Perfil atualizado com sucesso!');
        setEditMode(false);
        fetchPerfil();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil');
    }
  };

  const handleCancel = () => {
    if (usuario) {
      setNome(usuario.nome);
      setTelefone(usuario.telefone || '');
    }
    setEditMode(false);
  };

  const getTipoUsuarioLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      ADMIN_GERAL: 'Administrador Geral',
      ADMIN_CLINICA: 'Administrador de Clínica',
      EQUIPE_CLINICA: 'Equipe de Clínica',
      TUTOR: 'Tutor',
    };
    return labels[tipo] || tipo;
  };

  const getCargoLabel = (cargo: string) => {
    const labels: Record<string, string> = {
      ADMIN_CLINICA: 'Administrador',
      VETERINARIO: 'Veterinário',
      RECEPCIONISTA: 'Recepcionista',
      AUXILIAR: 'Auxiliar',
    };
    return labels[cargo] || cargo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarClient />
        <div className="flex justify-center items-center h-96">
          <div className="text-xl text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarClient />
        <div className="flex justify-center items-center h-96">
          <div className="text-xl text-red-600">Erro ao carregar perfil</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarClient />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Pessoais */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Informações Pessoais</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Editar
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={usuario.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 mt-1">O e-mail não pode ser alterado</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nome Completo</label>
                    <p className="text-lg text-gray-900">{usuario.nome}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">E-mail</label>
                    <p className="text-lg text-gray-900">{usuario.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-lg text-gray-900">{usuario.telefone || 'Não informado'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tipo de Usuário</label>
                    <p className="text-lg text-gray-900">{getTipoUsuarioLabel(usuario.tipo)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Membro desde</label>
                    <p className="text-lg text-gray-900">
                      {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Clínicas Vinculadas */}
            {usuario.clinicas.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Clínicas Vinculadas ({usuario.clinicas.length})
                </h2>
                <div className="space-y-3">
                  {usuario.clinicas.map((uc) => (
                    <div
                      key={uc.clinica.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-teal-500 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{uc.clinica.nome}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Cargo: {getCargoLabel(uc.cargo)}
                          </p>
                        </div>
                        <button
                          onClick={() => router.push(`/clinicas/${uc.clinica.id}`)}
                          className="text-teal-600 hover:text-teal-700 text-sm"
                        >
                          Ver Detalhes →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Veterinários */}
            {usuario.veterinarios.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Perfis de Veterinário ({usuario.veterinarios.length})
                </h2>
                <div className="space-y-3">
                  {usuario.veterinarios.map((vet) => (
                    <div
                      key={vet.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <p className="font-medium text-gray-900">CRMV: {vet.crmv}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Clínica: {vet.clinica.nome}
                      </p>
                      {vet.especialidade && (
                        <p className="text-sm text-gray-600 mt-1">
                          Especialidade: {vet.especialidade}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pets */}
            {usuario.pets.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Meus Pets ({usuario.pets.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {usuario.pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-teal-500 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{pet.nome}</p>
                      <p className="text-sm text-gray-600 mt-1">{pet.especie}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Estatísticas */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Estatísticas</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-teal-500 pl-4">
                  <p className="text-2xl font-bold text-gray-900">{usuario._count.pets}</p>
                  <p className="text-sm text-gray-600">Pets Cadastrados</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-2xl font-bold text-gray-900">{usuario._count.clinicas}</p>
                  <p className="text-sm text-gray-600">Clínicas Vinculadas</p>
                </div>

                {usuario._count.veterinarios > 0 && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="text-2xl font-bold text-gray-900">{usuario._count.veterinarios}</p>
                    <p className="text-sm text-gray-600">Perfis de Veterinário</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-2">
                {usuario.tipo === 'TUTOR' && (
                  <button
                    onClick={() => router.push('/pets/novo')}
                    className="w-full px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 text-left"
                  >
                    + Cadastrar Pet
                  </button>
                )}

                {usuario.tipo === 'ADMIN_GERAL' && (
                  <button
                    onClick={() => router.push('/clinicas/nova')}
                    className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-left"
                  >
                    + Nova Clínica
                  </button>
                )}

                <button
                  onClick={() => router.push('/agendamentos')}
                  className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-left"
                >
                  Ver Agendamentos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
