# 🚀 Guia de Deploy no Vercel

## ✅ Checklist de Pré-Deploy

Antes de fazer o deploy, certifique-se de que:

- [x] ✅ Projeto está em um repositório Git (GitHub, GitLab ou Bitbucket)
- [x] ✅ `vercel.json` está configurado
- [x] ✅ `next.config.js` está presente
- [x] ✅ `.gitignore` protege arquivos sensíveis (`.env`)
- [x] ✅ `.env.example` contém todas as variáveis necessárias
- [ ] ⚠️ **Banco de dados de produção configurado**
- [ ] ⚠️ **Variáveis de ambiente configuradas no Vercel**

---

## 🔑 Variáveis de Ambiente Necessárias

Você precisará configurar as seguintes variáveis no **painel da Vercel**:

### 1. DATABASE_URL

```
DATABASE_URL="mysql://user:password@host/database"
```

**Descrição:** String de conexão com o banco MySQL em produção

**Onde obter:**

- Seu provedor de banco de dados atual: AlwaysData (já configurado)
- Ou migrar para: PlanetScale, Railway, ou Vercel Postgres

### 2. NEXTAUTH_SECRET

```bash
# Gere um secret seguro com o comando:
openssl rand -base64 32
```

**Descrição:** Chave secreta para criptografia de sessões do NextAuth

**Como gerar:**

```bash
# No terminal/Git Bash:
openssl rand -base64 32

# Ou use um gerador online:
# https://generate-secret.vercel.app/32
```

### 3. NEXTAUTH_URL

```
NEXTAUTH_URL="https://seu-projeto.vercel.app"
```

**Descrição:** URL da sua aplicação em produção

**Valor:**

- Após o primeiro deploy, a Vercel fornecerá uma URL
- Use essa URL aqui (ex: `https://paws-and-clinics.vercel.app`)

---

## 📝 Passo a Passo do Deploy

### **1. Preparar Variáveis de Ambiente Localmente**

Antes de fazer o deploy, adicione ao seu arquivo `.env` local:

```bash
DATABASE_URL="mysql://satha35:bts98290@mysql-satha35.alwaysdata.net/satha35_tcc"
NEXTAUTH_SECRET="[gere um secret aqui]"
NEXTAUTH_URL="http://localhost:3000"
```

### **2. Testar Build Localmente** (Opcional mas Recomendado)

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Testar build
npm run build

# Testar produção localmente
npm start
```

### **3. Fazer Push para o GitHub**

```bash
git add .
git commit -m "Preparar projeto para deploy"
git push origin main
```

### **4. Deploy no Vercel**

#### Opção A: Via Dashboard da Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório `paws-and-clinics`
5. Configure as variáveis de ambiente:
   - `DATABASE_URL` (copie do seu .env)
   - `NEXTAUTH_SECRET` (gere um novo)
   - `NEXTAUTH_URL` (deixe em branco por enquanto)
6. Clique em **"Deploy"**

#### Opção B: Via CLI da Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Seguir as instruções no terminal
```

### **5. Configurar NEXTAUTH_URL Após Primeiro Deploy**

1. Após o deploy, a Vercel fornecerá uma URL (ex: `https://paws-and-clinics.vercel.app`)
2. Vá em **Settings** → **Environment Variables** no painel da Vercel
3. Adicione/edite `NEXTAUTH_URL` com a URL fornecida
4. Faça um **Redeploy** para aplicar as mudanças

---

## 🗄️ Configuração do Banco de Dados

### Opção 1: Continuar com AlwaysData (Atual)

**Prós:**

- ✅ Já está configurado
- ✅ MySQL tradicional
- ✅ Gratuito

**Contras:**

- ⚠️ Pode ter latência com Vercel (servidor fora da região)
- ⚠️ Limites de conexões simultâneas

**Configuração:**

- Já está feito! Apenas use a mesma `DATABASE_URL` do .env local

### Opção 2: Migrar para PlanetScale (Recomendado)

**Prós:**

- ✅ MySQL serverless
- ✅ Otimizado para edge/serverless
- ✅ Plano gratuito generoso
- ✅ Branches de banco de dados

**Passos:**

1. Criar conta em [planetscale.com](https://planetscale.com)
2. Criar novo database
3. Obter connection string
4. Executar `npx prisma db push` para criar tabelas
5. Atualizar `DATABASE_URL` no Vercel

### Opção 3: Railway

**Prós:**

- ✅ MySQL/PostgreSQL
- ✅ Fácil configuração
- ✅ Plano gratuito ($5 de crédito mensal)

**Passos:**

1. Criar conta em [railway.app](https://railway.app)
2. Criar novo MySQL database
3. Copiar connection string
4. Atualizar `DATABASE_URL` no Vercel

---

## 🔧 Configurações Importantes do Vercel

### Build Settings

O arquivo `vercel.json` já está configurado:

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Configurações Recomendadas

No painel da Vercel, vá em **Settings**:

1. **General**

   - Node.js Version: `18.x` ou superior
   - Install Command: `npm install`
   - Build Command: `prisma generate && next build`
   - Output Directory: `.next`

2. **Environment Variables**

   - Adicione as 3 variáveis mencionadas acima
   - Marque em qual ambiente elas devem estar (Production, Preview, Development)

3. **Domains** (Opcional)
   - Adicione um domínio customizado se tiver

---

## 🐛 Troubleshooting

### ❌ Erro: "No native build was found for bcrypt" (MAIS COMUM)

**Erro completo:**

```
No native build was found for platform=linux arch=x64 runtime=node
loaded from: /var/task/node_modules/bcrypt
```

**Causa:** O pacote `bcrypt` usa binários nativos que não funcionam em serverless.

**Solução:** Este projeto já foi atualizado para usar `bcryptjs`. Execute:

```bash
npm uninstall bcrypt @types/bcrypt
npm install bcryptjs @types/bcryptjs
git add .
git commit -m "fix: substituir bcrypt por bcryptjs para Vercel"
git push
```

📖 **Guia completo:** [docs/FIX_BCRYPT_ERROR.md](./FIX_BCRYPT_ERROR.md)

### ❌ Erro: "PrismaClient is unable to run in this environment"

**Solução:** Certifique-se de que `prisma generate` está no build command:

```json
"buildCommand": "prisma generate && next build"
```

### ❌ Erro: "NEXTAUTH_SECRET is not set"

**Solução:** Adicione a variável de ambiente `NEXTAUTH_SECRET` no Vercel Dashboard

### ❌ Erro de Conexão com Banco de Dados

**Soluções:**

1. Verifique se a `DATABASE_URL` está correta no Vercel
2. Certifique-se de que o banco permite conexões externas
3. Verifique se há limite de conexões simultâneas

### ❌ Erro: "Module not found"

**Solução:** Execute `npm install` localmente e certifique-se de que o `package-lock.json` está commitado

### ⚠️ Build funciona local mas não no Vercel

**Soluções:**

1. Verifique se todas as dependências estão em `dependencies` (não em `devDependencies`)
2. Certifique-se de que não há imports de arquivos que não existem
3. Verifique os logs de build no Vercel para mais detalhes

---

## 📊 Após o Deploy

### Verificações Pós-Deploy

1. ✅ Acesse a URL fornecida pela Vercel
2. ✅ Teste a página de login
3. ✅ Teste cadastro de usuário
4. ✅ Verifique se o banco de dados está respondendo
5. ✅ Teste as principais funcionalidades

### Monitoramento

- **Analytics:** Vercel fornece analytics automático
- **Logs:** Acesse em Runtime Logs no dashboard
- **Errors:** Considere integrar Sentry para error tracking

---

## 🔄 Deploys Futuros

Após o primeiro deploy, todo `git push` para a branch `main` fará um deploy automático!

```bash
git add .
git commit -m "Nova feature"
git push origin main
# Deploy automático iniciado! 🚀
```

### Preview Deploys

Pull requests criam deploys de preview automaticamente, permitindo testar antes de mergear.

---

## 📚 Recursos Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma + Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth + Vercel](https://next-auth.js.org/deployment)

---

## 🎯 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] ✅ Site está acessível na URL da Vercel
- [ ] ✅ Login funciona
- [ ] ✅ Cadastro funciona
- [ ] ✅ Banco de dados responde corretamente
- [ ] ✅ Imagens carregam
- [ ] ✅ API routes funcionam
- [ ] ✅ Não há erros no console do navegador
- [ ] ✅ Performance está aceitável (use Lighthouse)

---

**Pronto! Seu projeto está no ar! 🎉**

Para suporte, consulte os logs da Vercel ou a documentação oficial.
