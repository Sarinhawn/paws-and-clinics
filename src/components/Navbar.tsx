import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-teal-700 text-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-baloo">
          Pawns & Clinics
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li>
            <Link className="text-white/80 hover:text-white transition-colors" href="/">
              Início
            </Link>
          </li>
          <li>
            <a className="text-white/80 hover:text-white transition-colors" href="#servicos">
              Serviços
            </a>
          </li>
          <li>
            <a className="text-white/80 hover:text-white transition-colors" href="#blog">
              Blog
            </a>
          </li>
          <li>
            <a className="text-white/80 hover:text-white transition-colors" href="#contato">
              Contato
            </a>
          </li>
          <li>
            <a className="text-white/80 hover:text-white transition-colors" href="#vet">
              Vet Parceiro
            </a>
          </li>
        </ul>
        <Link 
          href="/exames" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Resultado de Exame
        </Link>
      </div>
    </nav>
  )
}