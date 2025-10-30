# 🚀 Quick Start - Deploy em 5 Minutos

## Passo 1: Gerar NEXTAUTH_SECRET (1 min)

Abra o terminal e execute:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Copie o resultado!** Você vai precisar dele.

---

## Passo 2: Atualizar .env (1 min)

Abra o arquivo `.env` na raiz do projeto e adicione:

```env
DATABASE_URL="mysql://satha35:bts98290@mysql-satha35.alwaysdata.net/satha35_tcc"
NEXTAUTH_SECRET="[COLE AQUI O VALOR DO PASSO 1]"
NEXTAUTH_URL="http://localhost:3000"
```

Salve o arquivo.

---

## Passo 3: Fazer Commit e Push (1 min)

```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

---

## Passo 4: Deploy no Vercel (2 min)

1. Acesse: https://vercel.com
2. Clique em **"Add New Project"**
3. Selecione o repositório `paws-and-clinics`
4. Clique em **"Environment Variables"**
5. Adicione as 3 variáveis:

   ```
   DATABASE_URL = mysql://satha35:bts98290@mysql-satha35.alwaysdata.net/satha35_tcc
   NEXTAUTH_SECRET = [cole o mesmo valor do .env]
   NEXTAUTH_URL = [deixe vazio por enquanto]
   ```

6. Clique em **"Deploy"**

---

## Passo 5: Atualizar NEXTAUTH_URL (30 seg)

1. Após o deploy, copie a URL fornecida (ex: `https://paws-and-clinics-xxx.vercel.app`)
2. Vá em **Settings** → **Environment Variables**
3. Edite `NEXTAUTH_URL` e cole a URL
4. Clique em **"Save"**
5. Em **Deployments**, clique em "..." → **"Redeploy"**

---

## ✅ Pronto!

Seu projeto está no ar! 🎉

Acesse a URL fornecida pela Vercel e teste:

- Login
- Cadastro
- Navegação

---

## ❌ Deu erro?

Verifique:

1. As variáveis de ambiente estão corretas?
2. O banco de dados está acessível?
3. Veja os logs no Vercel Dashboard

Guia completo de troubleshooting: [deploy_vercel.md](./deploy_vercel.md)
