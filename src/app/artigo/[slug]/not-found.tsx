import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🐾</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-baloo">
          Artigo não encontrado
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          O conteúdo que você procura pode ter sido movido ou não existe.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <span>←</span>
          <span>Voltar para a página inicial</span>
        </Link>
      </div>
    </div>
  )
}
