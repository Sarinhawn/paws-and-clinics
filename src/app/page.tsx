import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <header className="bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 text-white">
          <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
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
            <div className="hidden md:block">
              <div className="aspect-[4/3] w-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-white/80 text-6xl">🐶🐱</span>
              </div>
            </div>
          </div>
        </header>

        {/* Cards de artigos */}
        <section className="max-w-6xl mx-auto px-4 py-12" id="blog">
          <h2 className="text-2xl font-bold mb-6">Conteúdos para você</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "10 Vantagens de ter um amigo pet", emoji: "🐕", slug: "vantagens-amigo-pet" },
              { title: "O que você precisa saber sobre vacina para gato", emoji: "🐈", slug: "vacina-para-gato" },
              { title: "Dicas para sua fazenda", emoji: "🐴", slug: "dicas-fazenda" },
              { title: "Como manter sua vaquinha feliz", emoji: "🐮", slug: "vaquinha-feliz" }
            ].map((item, i) => (
              <article key={i} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="h-36 bg-gradient-to-br from-teal-50 to-teal-100 rounded-t-xl flex items-center justify-center">
                  <span className="text-6xl">{item.emoji}</span>
                </div>
                <div className="p-4">
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
                <div className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <span className="text-8xl">🏥</span>
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
