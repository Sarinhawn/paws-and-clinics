'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import NavbarClient from '@/components/NavbarClient';

interface Clinica {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  admin: {
    nome: string;
    email: string;
    telefone: string | null;
  };
  veterinarios: Array<{
    id: number;
    crmv: string;
    especialidade: string | null;
    user: {
      nome: string;
      email: string;
    };
  }>;
  servicos: Array<{
    id: number;
    nome: string;
    valorBase: number;
    duracaoMin: number;
  }>;
  _count: {
    veterinarios: number;
    pets: number;
    servicos: number;
  };
}

export default function DetalhesClinicaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [clinica, setClinica] = useState<Clinica | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchClinica = async () => {
      try {
        const response = await fetch(`/api/clinicas/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setClinica(data);
          setFormData({
            nome: data.nome,
            cnpj: data.cnpj,
            endereco: data.endereco,
            telefone: data.telefone,
            email: data.email,
          });
        } else if (response.status === 404) {
          alert('Clínica não encontrada');
          router.push('/clinicas');
        } else if (response.status === 403) {
          alert('Você não tem permissão para acessar esta clínica');
          router.push('/clinicas');
        }
      } catch (error) {
        console.error('Erro ao carregar clínica:', error);
        alert('Erro ao carregar clínica');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && id) {
      fetchClinica();
    }
  }, [status, id, router]);

  const handleSave = async () => {
    if (!formData.nome || !formData.email) {
      alert('Nome e email são obrigatórios');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/clinicas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setClinica(data);
        setEditing(false);
        alert('Clínica atualizada com sucesso!');
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao atualizar clínica');
      }
    } catch (error) {
      console.error('Erro ao atualizar clínica:', error);
      alert('Erro ao atualizar clínica');
    } finally {
      setSaving(false);
    }
  };

  const canEdit = session?.user?.tipo === 'ADMIN_GERAL' || 
                  (clinica && clinica.admin.email === session?.user?.email);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarClient />
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!clinica) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarClient />
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-600">Clínica não encontrada</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarClient />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/clinicas')}
            className="text-teal-600 hover:text-teal-700 font-medium mb-4"
          >
            ← Voltar para clínicas
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{clinica.nome}</h1>
              <p className="text-gray-600 mt-2">CNPJ: {clinica.cnpj}</p>
            </div>
            {canEdit && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações da Clínica */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informações da Clínica</h2>
              
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400"
                    >
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          nome: clinica.nome,
                          cnpj: clinica.cnpj,
                          endereco: clinica.endereco,
                          telefone: clinica.telefone,
                          email: clinica.email,
                        });
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="font-medium text-gray-900">{clinica.endereco}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium text-gray-900">{clinica.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{clinica.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Veterinários */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Veterinários ({clinica.veterinarios.length})
              </h2>
              {clinica.veterinarios.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum veterinário cadastrado</p>
              ) : (
                <div className="space-y-3">
                  {clinica.veterinarios.map((vet) => (
                    <div key={vet.id} className="border-l-4 border-teal-500 bg-gray-50 p-4 rounded">
                      <p className="font-medium text-gray-900">{vet.user.nome}</p>
                      <p className="text-sm text-gray-600">CRMV: {vet.crmv}</p>
                      {vet.especialidade && (
                        <p className="text-sm text-gray-600">Especialidade: {vet.especialidade}</p>
                      )}
                      <p className="text-sm text-gray-500">{vet.user.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Serviços */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Serviços ({clinica.servicos.length})
              </h2>
              {clinica.servicos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum serviço cadastrado</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {clinica.servicos.map((servico) => (
                    <div key={servico.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-medium text-gray-900">{servico.nome}</p>
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>R$ {Number(servico.valorBase).toFixed(2)}</span>
                        <span>{servico.duracaoMin} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Administrador */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Administrador</h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{clinica.admin.nome}</p>
                <p className="text-sm text-gray-600">{clinica.admin.email}</p>
                {clinica.admin.telefone && (
                  <p className="text-sm text-gray-600">{clinica.admin.telefone}</p>
                )}
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Estatísticas</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Veterinários</span>
                  <span className="text-2xl font-bold text-teal-600">{clinica._count.veterinarios}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pets</span>
                  <span className="text-2xl font-bold text-teal-600">{clinica._count.pets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Serviços</span>
                  <span className="text-2xl font-bold text-teal-600">{clinica._count.servicos}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
