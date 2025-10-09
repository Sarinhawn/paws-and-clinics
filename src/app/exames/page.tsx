'use client'

import { useState } from "react";
import Link from 'next/link';

export default function ExamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('data');
  
  const [exames] = useState([
    {
      id: 1,
      nome: "Exame de sangue - Rex",
      pet: "Rex",
      tipo: "Sangue",
      data: "2025-09-01",
      dataFormatada: "01/09/2025",
      arquivo: "/exames/exame_de_sangue.pdf",
      status: "Disponível"
    },
    {
      id: 2,
      nome: "Raio-X - Nina", 
      pet: "Nina",
      tipo: "Raio-X",
      data: "2025-08-20",
      dataFormatada: "20/08/2025",
      arquivo: "/exames/sentado.png",
      status: "Disponível"
    },
  ]);

  const filteredExames = exames
    .filter(exame => 
      exame.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exame.pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exame.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'data') {
        return new Date(b.data).getTime() - new Date(a.data).getTime();
      }
      return a.nome.localeCompare(b.nome);
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-teal-700 font-baloo">
            Pawns & Clinics
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Voltar ao início
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-baloo">Resultados de Exames</h1>
            <p className="mt-2 text-white/90">Consulte e baixe os exames do seu pet com segurança.</p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-lg p-3">
            <div className="text-xs uppercase tracking-wide text-white/80">Total</div>
            <div className="text-2xl font-bold">{filteredExames.length} exames</div>
          </div>
        </div>
      </header>

      {/* BUSCA / FILTRO */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por nome do exame ou pet
            </label>
            <div className="relative">
              <input 
                id="search" 
                type="text" 
                placeholder="Ex.: sangue, raio-x, Rex, Nina..." 
                className="w-full rounded-md border-gray-300 focus:border-teal-600 focus:ring-teal-600 pl-10 py-3 border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar</label>
            <select 
              className="w-full rounded-md border-gray-300 focus:border-teal-600 focus:ring-teal-600 py-3 border"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="data">Mais recentes</option>
              <option value="nome">Nome A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* LISTA DE EXAMES */}
      <section className="max-w-6xl mx-auto px-4 py-8" id="lista">
        {filteredExames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum exame encontrado</h3>
            <p className="text-gray-500">Tente ajustar os termos de busca.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExames.map((exame) => (
              <div
                key={exame.id}
                className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                    {exame.tipo}
                  </div>
                  <div className="text-green-600 text-sm font-medium">
                    ✅ {exame.status}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {exame.nome}
                </h3>
                
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🐾</span>
                    <span>Pet: {exame.pet}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Data: {exame.dataFormatada}</span>
                  </div>
                </div>
                
                <a
                  href={exame.arquivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-teal-600 text-white px-4 py-3 rounded-lg hover:bg-teal-700 transition-colors text-center font-medium flex items-center justify-center gap-2"
                >
                  📄 Ver Exame
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
