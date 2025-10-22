# 🐾 Instruções de Desenvolvimento – Sistema de Clínicas Veterinárias

## 📌 Visão Geral

Este projeto é um **sistema de gestão para clínicas veterinárias**, desenvolvido em **Next.js** com **Prisma ORM** e banco de dados **MySQL**.  
Ele gerencia clínicas, equipes, tutores, pets, agendamentos, exames e pagamentos.

O sistema possui **quatro tipos de usuários**, com permissões hierárquicas:

| Nível | Tipo de usuário  | Funções principais                                             |
| ----- | ---------------- | -------------------------------------------------------------- |
| 1️⃣    | `ADMIN_GERAL`    | Cadastra novas clínicas e administradores de clínica           |
| 2️⃣    | `ADMIN_CLINICA`  | Gerencia equipe da clínica (veterinários, recepcionistas etc.) |
| 3️⃣    | `EQUIPE_CLINICA` | Cadastra tutores e pets                                        |
| 4️⃣    | `TUTOR`          | Pode visualizar e cadastrar seus próprios pets (opcional)      |

---

## 🧩 Modelagem do Banco (Prisma)

O arquivo `schema.prisma` já foi atualizado e contém:

- Enums `TipoUsuario` e `CargoClinica`
- Campo `adminId` em `Clinica` (referência ao administrador principal)
- Campos `tipo` e `cargo` utilizando enums em vez de strings

Antes de iniciar, execute:

```bash
npx prisma generate
npx prisma migrate dev --name init_veterinaria
```

---

## ⚙️ Estrutura de Pastas Sugerida

```
/src
 ├─ /app
 │   ├─ /api
 │   │   ├─ /clinicas
 │   │   │   ├─ route.ts             → CRUD de clínicas (admin geral)
 │   │   │   ├─ [id]/equipe/route.ts → CRUD de equipe (admin clínica)
 │   │   │   └─ [id]/pets/route.ts   → CRUD de pets (equipe)
 │   │   ├─ /tutores/route.ts        → CRUD de tutores
 │   │   └─ /auth/[...nextauth].ts   → NextAuth configuração
 │   └─ /dashboard                   → Painéis por tipo de usuário
 ├─ /lib
 │   ├─ prisma.ts                    → cliente Prisma
 │   ├─ auth.ts                      → funções de autenticação/autorização
 │   └─ validations.ts               → validações Zod
 ├─ /components
 │   └─ formulários, cards, tabelas etc.
 └─ .env
```

---

## 🔒 Controle de Acesso e Sessão

Usar **NextAuth** com credenciais e roles.  
Cada `User` tem o campo `tipo: TipoUsuario`.

### Exemplo de Middleware

```ts
// lib/auth.ts
import { getServerSession } from "next-auth";

export async function requireRole(roles: string[]) {
  const session = await getServerSession();
  if (!session || !roles.includes(session.user.tipo)) {
    throw new Error("Acesso não autorizado");
  }
}
```

---

## 🚀 Fluxos de Cadastro

### 1️⃣ Cadastro de Clínica (ADMIN_GERAL)

- **Rota:** `POST /api/clinicas`
- **Permissão:** `ADMIN_GERAL`
- **Ação:**
  - Cria a clínica (`Clinica`)
  - Cria o `User` administrador da clínica (`ADMIN_CLINICA`)
  - Cria relação em `UsuariosClinicas` com `cargo: ADMIN_CLINICA`
  - Atualiza `Clinica.adminId` com o ID do admin criado

### 2️⃣ Cadastro de Equipe (ADMIN_CLINICA)

- **Rota:** `POST /api/clinicas/:id/equipe`
- **Permissão:** `ADMIN_CLINICA`
- **Ação:**
  - Cria `User` (`tipo: EQUIPE_CLINICA` ou `VETERINARIO`)
  - Cria relação em `UsuariosClinicas`
  - Se for veterinário, cria também registro em `Veterinario`

### 3️⃣ Cadastro de Tutor (EQUIPE_CLINICA ou ADMIN_CLINICA)

- **Rota:** `POST /api/tutores`
- **Ação:**
  - Cria `User` com `tipo: TUTOR`
  - Relaciona à clínica via `UsuariosClinicas`

### 4️⃣ Cadastro de Pet (EQUIPE_CLINICA ou TUTOR)

- **Rota:** `POST /api/pets`
- **Ação:**
  - Cria `Pet` com relação a `tutorId` e `clinicaId`

---

## 🧠 Regras de Negócio Principais

| Ação                | Quem pode fazer                 | Observação                                |
| ------------------- | ------------------------------- | ----------------------------------------- |
| Criar clínica       | ADMIN_GERAL                     | Define automaticamente o admin da clínica |
| Criar equipe        | ADMIN_CLINICA                   | Pode cadastrar veterinários e auxiliares  |
| Criar tutor         | ADMIN_CLINICA ou EQUIPE_CLINICA | Tutor vinculado à clínica                 |
| Criar pet           | EQUIPE_CLINICA ou TUTOR         | Pet vinculado a tutor e clínica           |
| Agendar consulta    | EQUIPE_CLINICA                  | Usa `Agendamento`                         |
| Cadastrar pagamento | EQUIPE_CLINICA                  | Usa `Pagamento`                           |
| Atualizar status    | ADMIN_CLINICA                   | Pode confirmar, cancelar ou concluir      |

---

## 🧰 Tarefas para o Copilot

1. **Criar rotas API**

   - `POST /api/clinicas`
   - `POST /api/clinicas/:id/equipe`
   - `POST /api/tutores`
   - `POST /api/pets`

2. **Implementar autenticação**

   - Configurar `NextAuth` (provider Credentials)
   - Incluir `user.tipo` e `clinicaId` na sessão

3. **Criar middleware de autorização**

   - Função `requireRole([roles])` (vide exemplo)
   - Proteger as rotas de acordo com os tipos de usuário

4. **Validar dados com Zod**

   - Criar schemas em `lib/validations.ts` para cada rota

5. **Criar seed inicial (opcional)**
   - Usuário `ADMIN_GERAL` com credenciais padrão (`admin@vetapp.com`)
   - Script: `/prisma/seed.ts`

---

## 🧾 Exemplo de Seed

```ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@vetapp.com" },
    update: {},
    create: {
      nome: "Administrador Geral",
      email: "admin@vetapp.com",
      senhaHash,
      tipo: "ADMIN_GERAL"
    }
  });
}

main()
  .then(() => console.log("Seed concluído."))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

Execute:

```bash
npx prisma db seed
```

---

## 📦 Dependências sugeridas

```bash
npm install next-auth bcrypt zod @prisma/client
npm install -D prisma
```

---

## ✅ Objetivo final

Ao seguir este documento, o Copilot deve gerar:

- Rotas REST protegidas por roles
- Controle completo de cadastro e autenticação
- Validação de dados robusta
- Base pronta para expandir com agendamentos e pagamentos

---

**Autor:** Sara
**Projeto:** Sistema de Clínicas Veterinárias  
**Stack:** Next.js + Prisma + MySQL + NextAuth
