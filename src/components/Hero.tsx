'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <header className="relative h-[600px] flex items-center">
      <div className="container mx-auto flex justify-between items-center px-5">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold mb-4">
            Uma experiência única para você e seu melhor amigo Pet.
          </h2>
          <p className="text-lg mb-6">
            Equipe de especialistas altamente qualificada e humanizada para a realização de seus exames.
          </p>
          <button className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800">
            Exames →
          </button>
        </div>
        <div className="relative w-1/2 h-[500px]">
          <Image
            src="/assets/img/sasaa.png"
            alt="Cachorro e Gato"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>
    </header>
  );
}
