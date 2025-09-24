import { useState } from "react";

export default function Exames() {
  const [exames] = useState([
    {
      id: 1,
      nome: "Exame de sangue - Rex",
      data: "01/09/2025",
      arquivo: "/exames/exame_de_sangue.pdf",
    },
    {
      id: 2,
      nome: "Raio-X - Nina",
      data: "20/08/2025",
      arquivo: "/exames/sentado.png",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        Exames dos Pets
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exames.map((exame) => (
          <div
            key={exame.id}
            className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition"
          >
            <h2 className="text-lg font-semibold mb-2">{exame.nome}</h2>
            <p className="text-gray-500 mb-4">Data: {exame.data}</p>
            <a
              href={exame.arquivo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Ver Exame
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
