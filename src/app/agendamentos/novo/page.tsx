'use client';

import NavbarClient from '@/components/NavbarClient';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Pet {
  id: number;
  nome: string;
}

interface Veterinario {
  id: number;
  user: {
    nome: string;
  };
  crmv: string;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracao: number;
}

export default function NovoAgendamento() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [petId, setPetId] = useState('');
  const [veterinarioId, setVeterinarioId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [horaAgendamento, setHoraAgendamento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, vetsRes, servicosRes] = await Promise.all([
          fetch('/api/pets'),
          fetch('/api/veterinarios'),
          fetch('/api/servicos'),
        ]);

        if (petsRes.ok) {
          const petsData = await petsRes.json();
          setPets(petsData);
        }

        if (vetsRes.ok) {
          const vetsData = await vetsRes.json();
          setVeterinarios(vetsData);
        }

        if (servicosRes.ok) {
          const servicosData = await servicosRes.json();
          setServicos(servicosData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!petId || !veterinarioId || !servicoId || !dataAgendamento || !horaAgendamento) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Combinar data e hora em uma única string ISO
    const dataHora = `${dataAgendamento}T${horaAgendamento}:00.000Z`;

    // Validar se a data não é no passado
    const agendamento = new Date(dataHora);
    if (agendamento < new Date()) {
      alert('Não é possível agendar para uma data/hora passada.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: parseInt(petId),
          veterinarioId: parseInt(veterinarioId),
          servicoId: parseInt(servicoId),
          dataHora,
          observacoes: observacoes || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Agendamento criado com sucesso!');
        router.push('/agendamentos');
      } else {
        alert(data.error || 'Erro ao criar agendamento.');
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
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
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Agendamento</h1>
          <p className="mt-2 text-gray-600">Agende uma consulta ou serviço para seu pet</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet <span className="text-red-500">*</span>
              </label>
              <select
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Selecione um pet</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.nome}
                  </option>
                ))}
              </select>
              {pets.length === 0 && (
                <p className="mt-2 text-sm text-amber-600">
                  Você ainda não tem pets cadastrados.{' '}
                  <a href="/pets/novo" className="text-teal-600 hover:text-teal-700 font-medium">
                    Cadastre um pet
                  </a>
                </p>
              )}
            </div>

            {/* Veterinário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Veterinário <span className="text-red-500">*</span>
              </label>
              <select
                value={veterinarioId}
                onChange={(e) => setVeterinarioId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Selecione um veterinário</option>
                {veterinarios.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    {vet.user.nome} - CRMV: {vet.crmv}
                  </option>
                ))}
              </select>
            </div>

            {/* Serviço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serviço <span className="text-red-500">*</span>
              </label>
              <select
                value={servicoId}
                onChange={(e) => setServicoId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Selecione um serviço</option>
                {servicos.map((servico) => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome} - R$ {servico.preco.toFixed(2)} ({servico.duracao} min)
                  </option>
                ))}
              </select>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dataAgendamento}
                  onChange={(e) => setDataAgendamento(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={horaAgendamento}
                  onChange={(e) => setHoraAgendamento(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
                placeholder="Informações adicionais sobre o agendamento..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/agendamentos')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || pets.length === 0}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Criando...' : 'Criar Agendamento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
