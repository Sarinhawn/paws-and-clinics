'use client';

import Image from 'next/image';
import Link from 'next/link';

const articles = [
  {
    image: '/assets/img/Doggg.png',
    title: 'Os principais motivos que causam queda de pelo em cachorro',
    alt: 'Cachorro'
  },
  {
    image: '/assets/img/gatito.png',
    title: 'O que você precisa saber sobre vacina para gato',
    alt: 'Gato'
  },
  {
    image: '/assets/img/cavalo.png',
    title: 'Dicas para sua fazenda',
    alt: 'Cavalo'
  },
  {
    image: '/assets/img/vaca.png',
    title: 'Como manter sua vaquinha feliz',
    alt: 'Pet feliz'
  }
];

export default function ArticleGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src={article.image}
                  alt={article.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {article.title}
                </h3>
                <Link 
                  href="#" 
                  className="text-maroon-600 font-bold hover:underline"
                >
                  Ler mais
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="#" 
            className="inline-block bg-maroon-600 text-white px-8 py-3 rounded-lg hover:bg-maroon-700 transition-colors"
          >
            Ver mais artigos
          </Link>
        </div>
      </div>
    </section>
  );
}
