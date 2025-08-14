'use client';

export default function InfoSection() {
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-10">
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-4xl font-bold mb-6">
              Facilite seu atendimento com nosso sistema!
            </h2>
            <p className="text-xl mb-8">
              Otimize sua rotina de forma simples, rápida e digital. Organize históricos, gere prescrições e tenha tudo na palma da sua mão.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="text-lg">📑 Históricos sempre disponíveis</li>
              <li className="text-lg">📅 Exames Definidos</li>
              <li className="text-lg">💉 Prescrições e lembretes de vacina</li>
            </ul>
            <a 
              href="#" 
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full transition-colors"
            >
              Conheça nosso sistema
            </a>
          </div>
          <div className="flex-1 min-w-[300px]">
            {/* Adicione uma imagem aqui quando disponível */}
          </div>
        </div>
      </div>
    </section>
  );
}
