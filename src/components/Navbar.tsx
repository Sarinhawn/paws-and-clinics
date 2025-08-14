'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-teal-700 p-5">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Pawns & Clinics</h1>
        <ul className="flex space-x-6">
          <li><Link href="/" className="text-blue-100 hover:text-white">Pawns & Clinics</Link></li>
          <li><Link href="/servicos" className="text-blue-100 hover:text-white">Serviços</Link></li>
          <li><Link href="/blog" className="text-blue-100 hover:text-white">Blog</Link></li>
          <li><Link href="/contato" className="text-blue-100 hover:text-white">Contato</Link></li>
          <li><Link href="/vet-parceiro" className="text-blue-100 hover:text-white">Vet Parceiro</Link></li>
        </ul>
        <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
          RESULTADO DE EXAME
        </button>
      </div>
    </nav>
  );
}
