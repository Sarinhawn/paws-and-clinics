import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getArticle, getAllArticleSlugs, formatDate } from '@/lib/articles'

// Gera as rotas estáticas em build time
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Artigo não encontrado - Pawns & Clinics'
    }
  }

  return {
    title: `${article.title} - Pawns & Clinics`,
    description: article.paragraphs[0]
  }
}

export default function ArtigoPage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar compacta */}
      <nav className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold text-teal-700 font-baloo">
            Pawns & Clinics
          </Link>
          <Link 
            href="/exames" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Resultado de Exame
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link href="/#blog" className="hover:text-gray-700 transition-colors">
            Artigos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{article.title}</span>
        </nav>

        {/* Header do artigo */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 font-baloo">
            {article.title}
          </h1>
          <p className="text-gray-500 text-sm">
            Publicado em {formatDate(article.date)} • {article.readTime} de leitura
          </p>
        </header>

        {/* Imagem de capa */}
        {article.cover && (
          <figure className="mb-8">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border shadow-md">
              <Image
                src={article.cover}
                alt={`Capa do artigo: ${article.title}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </figure>
        )}

        {/* Conteúdo do artigo */}
        <article className="prose prose-teal prose-lg max-w-none">
          <div className="bg-white rounded-xl p-8 shadow-sm border space-y-6">
            {article.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Botão de voltar */}
        <div className="mt-8">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-medium transition-colors"
          >
            <span>←</span>
            <span>Voltar para artigos</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Pawns & Clinics. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
