export default function Navbar() {
  return (
    <nav className="bg-teal-700 text-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">Pawns & Clinics</a>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li><a className="text-white/80 hover:text-white" href="/">Início</a></li>
          <li><a className="text-white/80 hover:text-white" href="#servicos">Serviços</a></li>
          <li><a className="text-white/80 hover:text-white" href="#blog">Blog</a></li>
          <li><a className="text-white/80 hover:text-white" href="#contato">Contato</a></li>
          <li><a className="text-white/80 hover:text-white" href="#vet">Vet Parceiro</a></li>
        </ul>
        <a href="/exames" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">Resultado de Exame</a>
      </div>
    </nav>
  )
}
