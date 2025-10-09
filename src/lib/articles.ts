// Database de artigos
export const ARTICLES = {
  "vantagens-amigo-pet": {
    title: "10 Vantagens de ter um amigo pet",
    date: "2025-08-12",
    readTime: "5 min",
    cover: "/Doggg.png",
    paragraphs: [
      "Conviver com um pet traz benefícios emocionais e físicos. A companhia reduz o estresse, incentiva rotinas mais ativas e fortalece vínculos afetivos.",
      "Além da alegria do dia a dia, cuidar de um animal estimula a responsabilidade e a organização – especialmente com crianças.",
      "Da socialização a hábitos mais saudáveis, as vantagens se refletem em toda a família."
    ]
  },
  "vacina-para-gato": {
    title: "O que você precisa saber sobre vacina para gato",
    date: "2025-07-28",
    readTime: "6 min",
    cover: "/gatito.png",
    paragraphs: [
      "A vacinação é essencial para a saúde dos felinos, protegendo contra doenças comuns e potencialmente graves.",
      "Mantenha o calendário em dia, conforme orientação do veterinário, e garanta retornos para reforços.",
      "A prevenção é sempre o melhor caminho: economiza tempo, recursos e evita sofrimento."
    ]
  },
  "dicas-fazenda": {
    title: "Dicas para sua fazenda",
    date: "2025-06-10",
    readTime: "4 min",
    cover: "/cavalo.png",
    paragraphs: [
      "Organização, manejo adequado e acompanhamento veterinário são pilares para um ambiente rural saudável.",
      "Invista em nutrição balanceada, água limpa e áreas de descanso seguras.",
      "Monitorar rotinas e registros ajuda a identificar problemas cedo e agir rapidamente."
    ]
  },
  "vaquinha-feliz": {
    title: "Como manter sua vaquinha feliz",
    date: "2025-05-02",
    readTime: "3 min",
    cover: "/vaca.png",
    paragraphs: [
      "Bem-estar animal começa com conforto, alimentação adequada e acompanhamento periódico.",
      "Ambiente limpo, enriquecimento e contato respeitoso fazem toda a diferença.",
      "Pequenos ajustes na rotina elevam a qualidade de vida do rebanho."
    ]
  }
} as const

export type ArticleSlug = keyof typeof ARTICLES

export function getArticle(slug: string) {
  return ARTICLES[slug as ArticleSlug]
}

export function getAllArticleSlugs() {
  return Object.keys(ARTICLES)
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}
