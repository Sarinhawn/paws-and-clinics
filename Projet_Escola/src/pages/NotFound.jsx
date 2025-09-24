export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-teal-700">404</h1>
        <p className="mt-2 text-gray-600">Página não encontrada.</p>
        <a className="mt-4 inline-block text-teal-700 hover:underline" href="/">Voltar ao início</a>
      </div>
    </div>
  )
}
