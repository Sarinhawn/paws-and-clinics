# 🐾 Pawns & Clinics - Clínica Veterinária

Uma plataforma moderna e completa para clínicas veterinárias, desenvolvida com Next.js 14, React 18 e Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## 📋 Sobre o Projeto

Pawns & Clinics é uma aplicação web desenvolvida para facilitar o gerenciamento de clínicas veterinárias, oferecendo funcionalidades como:

- 🏥 Consulta de resultados de exames
- 📚 Blog com artigos sobre cuidados com pets
- 🔐 Sistema de autenticação
- 📱 Design responsivo e moderno
- ⚡ Performance otimizada com Next.js

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **Next/Image** - Otimização automática de imagens
- **Next/Link** - Navegação otimizada entre páginas

## 📁 Estrutura do Projeto

```
pawns-clinics/
├── public/                 # Arquivos estáticos (imagens, etc)
├── src/
│   ├── app/               # App Router (Next.js 14)
│   │   ├── layout.tsx     # Layout raiz
│   │   ├── page.tsx       # Página inicial
│   │   ├── globals.css    # Estilos globais
│   │   ├── login/         # Página de login
│   │   ├── exames/        # Página de exames
│   │   └── artigo/        # Páginas de artigos (rotas dinâmicas)
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── lib/              # Utilitários e helpers
│       └── articles.ts   # Database de artigos
├── next.config.js        # Configuração do Next.js
├── tailwind.config.js    # Configuração do Tailwind
├── tsconfig.json         # Configuração do TypeScript
└── package.json          # Dependências do projeto
```

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passos para executar localmente

1. **Clone o repositório**
```bash
git clone https://github.com/Sarinhawn/Projet_Escola.git
cd Projet_Escola
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Abra no navegador**
```
http://localhost:3000
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🌐 Páginas e Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com hero, artigos e informações |
| `/login` | Página de autenticação |
| `/exames` | Consulta de resultados de exames |
| `/artigo/[slug]` | Páginas dinâmicas de artigos |

### Artigos Disponíveis

- `/artigo/vantagens-amigo-pet` - 10 Vantagens de ter um amigo pet
- `/artigo/vacina-para-gato` - O que você precisa saber sobre vacina para gato
- `/artigo/dicas-fazenda` - Dicas para sua fazenda
- `/artigo/vaquinha-feliz` - Como manter sua vaquinha feliz

## 🎨 Funcionalidades

### Página Inicial
- Hero section com call-to-action
- Grid de artigos do blog
- Seção informativa sobre o sistema
- Navbar e Footer responsivos

### Página de Exames
- Sistema de busca em tempo real
- Filtros por tipo e data
- Cards informativos de cada exame
- Download de resultados

### Sistema de Login
- Formulário com validação
- Toggle para mostrar/ocultar senha
- Design moderno com background
- Redirecionamento após login

### Blog de Artigos
- Rotas dinâmicas para cada artigo
- Breadcrumbs de navegação
- Imagens otimizadas
- Página 404 customizada

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente (se necessário)
4. Deploy automático!

```bash
npm run build
```

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**Sarinhawn**
- GitHub: [@Sarinhawn](https://github.com/Sarinhawn)

## 🙏 Agradecimentos

- Next.js pela excelente documentação
- Tailwind CSS pela facilidade de estilização
- Comunidade open source

---

Desenvolvido com ❤️ e ☕ por Sarinhawn
