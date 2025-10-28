import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <header className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 text-white min-h-[550px] overflow-hidden">
          {/* Imagem de fundo */}
          <div className="absolute inset-0">
            <Image 
              src="/Doggg.png" 
              alt="Cachorro feliz brincando"
              fill
              className="object-cover"
              priority
              quality={100}
            />
          </div>
          
          {/* Conteúdo */}
          <div className="relative max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center min-h-[550px]">
            <div className="z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight font-baloo">
                Uma experiência única para você e seu melhor amigo pet.
              </h1>
              <p className="mt-4 text-white/90 text-lg">
                Equipe de especialistas altamente qualificada e humanizada para a realização de seus exames.
              </p>
              <div className="mt-6 flex gap-3">
                <Link 
                  href="/exames" 
                  className="bg-white text-teal-700 px-5 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                >
                  Exames →
                </Link>
                <a 
                  href="#servicos" 
                  className="border border-white/70 text-white px-5 py-3 rounded-md hover:bg-white/10 transition-colors"
                >
                  Serviços
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Cards de artigos */}
        <section className="max-w-6xl mx-auto px-4 py-12" id="blog">
          <h2 className="text-2xl font-bold mb-6">Conteúdos para você</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "10 Vantagens de ter um amigo pet", image: "/sasaa.png", slug: "vantagens-amigo-pet" },
              { title: "O que você precisa saber sobre vacina para gato", image: "/gatito.png", slug: "vacina-para-gato" },
              { title: "Dicas para sua fazenda", image: "/cavalo.png", slug: "dicas-fazenda" }
            ].map((item, i) => (
              <article key={i} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="h-48 rounded-t-xl overflow-hidden relative">
                  <Image 
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm">Resumo breve do conteúdo para o tutor de pets.</p>
                  <Link 
                    href={`/artigo/${item.slug}`}
                    className="inline-block mt-3 text-teal-700 font-medium hover:underline text-sm"
                  >
                    Ler mais →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Seção informativa */}
        <section className="bg-gray-100 py-16" id="servicos">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-baloo">
                  Facilite seu atendimento com nosso sistema!
                </h2>
                <p className="text-gray-600 mb-6">
                  Otimize sua rotina de forma simples, rápida e digital. Organize históricos, 
                  gere prescrições e tenha tudo na palma da sua mão.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">📑</span>
                    <span>Históricos sempre disponíveis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <span>Exames Definidos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">💉</span>
                    <span>Prescrições e lembretes de vacina</span>
                  </li>
                </ul>
                <Link 
                  href="/exames" 
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors inline-block"
                >
                  Conheça nosso sistema
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden">
                  <Image 
                    src="/vett.png"
                    alt="Veterinário atendendo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
