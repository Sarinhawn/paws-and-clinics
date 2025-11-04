'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  };
  _count: {
    veterinarios: number;
    pets: number;
    servicos: number;
  };
  createdAt: string;
}

export default function ClinicasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchClinicas = async () => {
      try {
        const response = await fetch('/api/clinicas');
        
        if (response.ok) {
          const data = await response.json();
          setClinicas(data.clinicas);
        } else if (response.status === 403 || response.status === 401) {
          alert('Você não tem permissão para acessar esta página.');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao carregar clínicas:', error);
        alert('Erro ao carregar clínicas.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchClinicas();
    }
  }, [status, router]);

  const clinicasFiltradas = clinicas.filter(clinica =>
    clinica.nome.toLowerCase().includes(busca.toLowerCase()) ||
    clinica.cnpj.includes(busca) ||
    clinica.email.toLowerCase().includes(busca.toLowerCase())
  );

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar a clínica "${nome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/clinicas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Clínica deletada com sucesso!');
        setClinicas(clinicas.filter(c => c.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao deletar clínica');
      }
    } catch (error) {
      console.error('Erro ao deletar clínica:', error);
      alert('Erro ao deletar clínica');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarClient />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clínicas</h1>
              <p className="mt-2 text-gray-600">Gerencie as clínicas cadastradas no sistema</p>
            </div>
            <a
              href="/clinicas/nova"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              + Nova Clínica
            </a>
          </div>

          {/* Busca */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Buscar por nome, CNPJ ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Lista de Clínicas */}
        {clinicasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {busca ? 'Nenhuma clínica encontrada' : 'Nenhuma clínica cadastrada'}
            </h3>
            <p className="text-gray-500 mb-6">
              {busca
                ? 'Tente buscar com outros termos'
                : 'Comece criando a primeira clínica do sistema'}
            </p>
            {!busca && (
              <a
                href="/clinicas/nova"
                className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Criar Primeira Clínica
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicasFiltradas.map((clinica) => (
              <div
                key={clinica.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {clinica.nome}
                      </h3>
                      <p className="text-sm text-gray-500">CNPJ: {clinica.cnpj}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📍</span>
                      <span className="truncate">{clinica.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📞</span>
                      <span>{clinica.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📧</span>
                      <span className="truncate">{clinica.email}</span>
                    </div>
                  </div>

                  {clinica.admin && (
                    <div className="border-t pt-4 mb-4">
                      <p className="text-sm text-gray-500 mb-2">Administrador:</p>
                      <p className="font-medium text-gray-900">{clinica.admin.nome}</p>
                      <p className="text-sm text-gray-600">{clinica.admin.email}</p>
                    </div>
                  )}

                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-teal-600">
                        {clinica._count.veterinarios}
                      </div>
                      <div className="text-xs text-gray-500">Vets</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-teal-600">
                        {clinica._count.pets}
                      </div>
                      <div className="text-xs text-gray-500">Pets</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-teal-600">
                        {clinica._count.servicos}
                      </div>
                      <div className="text-xs text-gray-500">Serviços</div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <a
                      href={`/clinicas/${clinica.id}`}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white text-center rounded hover:bg-teal-700 transition-colors text-sm font-medium"
                    >
                      Ver Detalhes
                    </a>
                    {session?.user?.tipo === 'ADMIN_GERAL' && (
                      <button
                        onClick={() => handleDelete(clinica.id, clinica.nome)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Deletar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
