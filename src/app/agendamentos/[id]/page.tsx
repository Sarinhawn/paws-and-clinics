'use client';

import NavbarClient from '@/components/NavbarClient';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

interface Agendamento {
  id: number;
  dataHora: string;
  status: string;
  observacoes: string | null;
  pet: {
    nome: string;
    especie: string;
  };
  veterinario: {
    user: {
      nome: string;
    };
    crmv: string;
  };
  servico: {
    nome: string;
    preco: number;
    duracao: number;
  };
  tutor?: {
    nome: string;
    email: string;
    telefone: string | null;
  };
}

export default function DetalhesAgendamento() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const isStaff = session?.user?.tipo === 'ADMIN_GERAL' || 
                  session?.user?.tipo === 'ADMIN_CLINICA' || 
                  session?.user?.tipo === 'EQUIPE_CLINICA';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        const response = await fetch(`/api/agendamentos/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setAgendamento(data);
        } else if (response.status === 404) {
          alert('Agendamento não encontrado.');
          router.push('/agendamentos');
        } else if (response.status === 403) {
          alert('Você não tem permissão para visualizar este agendamento.');
          router.push('/agendamentos');
        }
      } catch (error) {
        console.error('Erro ao carregar agendamento:', error);
        alert('Erro ao carregar agendamento. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && id) {
      fetchAgendamento();
    }
  }, [status, id, router]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!confirm(`Tem certeza que deseja alterar o status para ${newStatus}?`)) {
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`/api/agendamentos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Status atualizado com sucesso!');
        setAgendamento(data);
      } else {
        alert(data.error || 'Erro ao atualizar status.');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status. Por favor, tente novamente.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`/api/agendamentos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Agendamento cancelado com sucesso!');
        router.push('/agendamentos');
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao cancelar agendamento.');
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Erro ao cancelar agendamento. Por favor, tente novamente.');
    } finally {
      setUpdating(false);
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

  if (!agendamento) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarClient />
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-600">Agendamento não encontrado.</div>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    AGENDADO: 'bg-blue-100 text-blue-800',
    CONFIRMADO: 'bg-green-100 text-green-800',
    REALIZADO: 'bg-gray-100 text-gray-800',
    CANCELADO: 'bg-red-100 text-red-800',
  };

  const dataFormatada = new Date(agendamento.dataHora).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const horaFormatada = new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const canConfirm = isStaff && agendamento.status === 'AGENDADO';
  const canComplete = isStaff && agendamento.status === 'CONFIRMADO';
  const canCancel = agendamento.status !== 'REALIZADO' && agendamento.status !== 'CANCELADO';

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarClient />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/agendamentos')}
            className="text-teal-600 hover:text-teal-700 font-medium mb-4"
          >
            ← Voltar para agendamentos
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Agendamento</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header com Status */}
          <div className="bg-teal-50 px-6 py-4 border-b border-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agendamento #{agendamento.id}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dataFormatada} às {horaFormatada}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[agendamento.status]}`}>
                {agendamento.status}
              </span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 space-y-6">
            {/* Informações do Pet */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Pet</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 font-medium">{agendamento.pet.nome}</p>
                <p className="text-gray-600 text-sm">{agendamento.pet.especie}</p>
              </div>
            </div>

            {/* Informações do Veterinário */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Veterinário</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 font-medium">{agendamento.veterinario.user.nome}</p>
                <p className="text-gray-600 text-sm">CRMV: {agendamento.veterinario.crmv}</p>
              </div>
            </div>

            {/* Informações do Serviço */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Serviço</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 font-medium">{agendamento.servico.nome}</p>
                <div className="flex gap-4 mt-2">
                  <p className="text-gray-600 text-sm">
                    💰 R$ {agendamento.servico.preco.toFixed(2)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    ⏱️ {agendamento.servico.duracao} minutos
                  </p>
                </div>
              </div>
            </div>

            {/* Informações do Tutor (apenas para staff) */}
            {isStaff && agendamento.tutor && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Tutor</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 font-medium">{agendamento.tutor.nome}</p>
                  <p className="text-gray-600 text-sm">📧 {agendamento.tutor.email}</p>
                  {agendamento.tutor.telefone && (
                    <p className="text-gray-600 text-sm">📱 {agendamento.tutor.telefone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Observações */}
            {agendamento.observacoes && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Observações</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{agendamento.observacoes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              {canConfirm && (
                <button
                  onClick={() => handleUpdateStatus('CONFIRMADO')}
                  disabled={updating}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Confirmar Agendamento
                </button>
              )}
              
              {canComplete && (
                <button
                  onClick={() => handleUpdateStatus('REALIZADO')}
                  disabled={updating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Marcar como Realizado
                </button>
              )}
              
              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Cancelar Agendamento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
