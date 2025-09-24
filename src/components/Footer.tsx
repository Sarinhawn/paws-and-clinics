export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between">
        <p>© {new Date().getFullYear()} Pawns & Clinics. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <a className="hover:text-gray-800 transition-colors" href="#privacidade">
            Privacidade
          </a>
          <a className="hover:text-gray-800 transition-colors" href="#termos">
            Termos
          </a>
          <a className="hover:text-gray-800 transition-colors" href="#contato">
            Contato
          </a>
        </div>
      </div>
    </footer>
  )
}