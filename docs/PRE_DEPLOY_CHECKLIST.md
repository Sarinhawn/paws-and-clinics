# ⚠️ AÇÕES NECESSÁRIAS ANTES DO DEPLOY

Este arquivo lista as ações que você **DEVE** fazer antes de deployar no Vercel.

## 🔴 CRÍTICO - Fazer ANTES do Deploy

### 1. Gerar NEXTAUTH_SECRET

Execute um destes comandos para gerar uma chave secreta:

```bash
# Opção 1: Se você tem OpenSSL instalado (Git Bash no Windows tem)
openssl rand -base64 32

# Opção 2: No Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 3: Use um gerador online
# https://generate-secret.vercel.app/32
```

Copie o resultado e adicione ao seu arquivo `.env` local:

```bash
NEXTAUTH_SECRET="cole-o-valor-gerado-aqui"
```

### 2. Atualizar seu arquivo .env local

Abra o arquivo `.env` na raiz do projeto e certifique-se de que ele contém:

```env
# Database
DATABASE_URL="mysql://satha35:bts98290@mysql-satha35.alwaysdata.net/satha35_tcc"

# NextAuth
NEXTAUTH_SECRET="[cole aqui a chave gerada no passo 1]"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Testar Localmente (Recomendado)

Antes de fazer deploy, teste se tudo funciona:

```bash
# 1. Instalar dependências (se ainda não fez)
npm install

# 2. Gerar Prisma Client
npx prisma generate

# 3. Executar migrações do banco (se necessário)
npx prisma db push

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse http://localhost:3000 e teste:

- ✅ Login
- ✅ Cadastro
- ✅ Navegação pelas páginas

## 🟡 IMPORTANTE - Durante o Deploy

### 1. Configurar Variáveis de Ambiente no Vercel

Quando você importar o projeto no Vercel, você precisará adicionar estas variáveis:

#### DATABASE_URL

```
mysql://satha35:bts98290@mysql-satha35.alwaysdata.net/satha35_tcc
```

#### NEXTAUTH_SECRET

```
[cole aqui a mesma chave que você gerou no passo 1]
```

#### NEXTAUTH_URL

```
[deixe em branco no primeiro deploy]
```

### 2. Após o Primeiro Deploy

1. A Vercel vai gerar uma URL como: `https://paws-and-clinics-xxx.vercel.app`
2. Volte nas configurações de variáveis de ambiente
3. Adicione ou edite `NEXTAUTH_URL` com essa URL
4. Faça um redeploy

## 🟢 OPCIONAL - Melhorias Recomendadas

### 1. Domínio Customizado

Se você tem um domínio próprio (ex: `pawsandclinics.com`):

1. Vá em Settings → Domains no Vercel
2. Adicione seu domínio
3. Atualize `NEXTAUTH_URL` para usar seu domínio

### 2. Banco de Dados em Produção

Considere migrar o banco de dados para um serviço otimizado:

**Opções recomendadas:**

- **PlanetScale** (MySQL serverless, plano gratuito)
- **Railway** (MySQL, $5 crédito mensal)
- **Vercel Postgres** (PostgreSQL, integrado)

**Por quê?**

- ⚡ Melhor performance (servidores próximos à Vercel)
- 🔒 Mais seguro
- 📈 Escalabilidade automática

### 3. Seed do Banco de Dados

Se você quiser popular o banco com dados iniciais:

```bash
npm run db:seed
```

## 📋 Checklist de Pré-Deploy

Use esta lista para garantir que não esqueceu nada:

- [ ] ✅ Gerei o `NEXTAUTH_SECRET`
- [ ] ✅ Atualizei o arquivo `.env` local
- [ ] ✅ Testei a aplicação localmente
- [ ] ✅ Fiz commit das mudanças (exceto .env)
- [ ] ✅ Fiz push para o GitHub
- [ ] ✅ Tenho as 3 variáveis de ambiente anotadas
- [ ] ✅ Estou pronto para configurá-las no Vercel

## 🚀 Próximo Passo

Depois de completar tudo acima, siga o guia completo:

👉 **[docs/deploy_vercel.md](./deploy_vercel.md)**

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique os logs no Vercel Dashboard
2. Consulte o troubleshooting em `deploy_vercel.md`
3. Revise se todas as variáveis de ambiente estão corretas
4. Certifique-se de que o banco de dados está acessível

---

**Boa sorte com o deploy! 🎉**
