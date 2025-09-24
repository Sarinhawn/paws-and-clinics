export default function Home() {
  return (
    <div>
      {/* Hero */}
      <header className="bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Uma experiência única para você e seu melhor amigo pet.
            </h1>
            <p className="mt-4 text-white/90 text-lg">
              Equipe de especialistas altamente qualificada e humanizada para a realização de seus exames.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="/exames" className="bg-white text-teal-700 px-5 py-3 rounded-md font-semibold hover:bg-gray-100">Exames →</a>
              <a href="#servicos" className="border border-white/70 text-white px-5 py-3 rounded-md hover:bg-white/10">Serviços</a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="aspect-[4/3] w-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <span className="text-white/80">Imagem bonita aqui 🐶🐱</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cards */}
      <section className="max-w-6xl mx-auto px-4 py-12" id="blog">
        <h2 className="text-2xl font-bold mb-6">Conteúdos para você</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <article key={i} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="h-36 bg-gray-100 rounded-t-xl" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Título do artigo {i}</h3>
                <p className="text-gray-600 mt-2">Resumo breve do conteúdo para o tutor de pets.</p>
                <a href="#" className="inline-block mt-3 text-teal-700 font-medium hover:underline">Ler mais</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
