# 🚀 Guia de Deploy Gratuito

## Arquitetura de Deploy

```
┌─────────────────────────────────────────────────────────────┐
│                     DEPLOY GRATUITO                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)     →  Vercel (grátis)                  │
│  Backend (NestJS)       →  Railway (grátis)                 │
│  Banco (PostgreSQL)     →  Supabase (grátis)                │
│  Storage (Arquivos)     →  Cloudinary (grátis)              │
└─────────────────────────────────────────────────────────────┘
```

---

## PASSO 1: Criar Conta no Supabase (Banco de Dados)

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub/Google
4. Clique em **"New Project"**
5. Preencha:
   - **Organization**: Crie uma nova
   - **Project name**: `curso-platform`
   - **Database Password**: Crie uma senha forte
   - **Region**: `South America (São Paulo)` ou mais próxima
6. Clique em **"Create new project"**
7. Aguarde criar (~2 minutos)

### Obter credenciais do banco:

1. Vá em **Settings** → **Database**
2. Copie a **Connection string** → **URI**
3. Será algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxx.supabase.co:5432/postgres
   ```

---

## PASSO 2: Criar Conta no Railway (Backend)

1. Acesse [railway.app](https://railway.app)
2. Clique em **"Start a New Project"**
3. Faça login com GitHub

### Criar projeto:

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Conecte seu GitHub e selecione o repositório `curso-platform`
4. Selecione a pasta `apps/api` como **Root Directory**

### Configurar variáveis de ambiente:

1. Vá em **Variables**
2. Adicione:

```env
DATABASE_URL=postgresql://postgres:[SENHA_SUPABASE]@db.xxxxxxxxx.supabase.co:5432/postgres
JWT_SECRET=sua-chave-secreta-muito-forte-aqui-123456
JWT_EXPIRATION=7d
STRIPE_SECRET_KEY=sk_test_sua_chave_stripe
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_stripe
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
API_URL=https://seu-backend.up.railway.app
RESEND_API_KEY=re_seu_chave_resend
```

### Configurar deploy:

1. Vá em **Settings**
2. Em **Build Command**, adicione:
   ```
   npm install && npx prisma generate && npm run build
   ```
3. Em **Start Command**, adicione:
   ```
   npm run start:prod
   ```
4. Em **Port**, adicione:
   ```
   3001
   ```

### Obter URL do backend:

1. Vá em **Settings** → **Networking**
2. Clique em **"Generate Domain"**
3. Copie a URL gerada (ex: `seu-backend.up.railway.app`)

---

## PASSO 3: Criar Conta no Vercel (Frontend)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Faça login com GitHub

### Importar projeto:

1. Clique em **"Add New..."** → **"Project"**
2. Selecione o repositório `curso-platform`
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Configurar variáveis de ambiente:

1. Em **Environment Variables**, adicione:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_stripe
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

### Deploy:

1. Clique em **"Deploy"**
2. Aguarde (~2 minutos)
3. Pronto! Seu frontend estará online

---

## PASSO 4: Configurar Stripe (Pagamentos)

1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta
3. Vá em **Developers** → **API Keys**
4. Copie as chaves de teste:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### Configurar Webhook:

1. Vá em **Developers** → **Webhooks**
2. Clique em **"Add endpoint"**
3. URL: `https://seu-backend.up.railway.app/api/webhooks/stripe`
4. Selecione eventos:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. Copie o **Signing secret** (`whsec_...`)

---

## PASSO 5: Configurar Resend (E-mails)

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Vá em **API Keys**
4. Crie uma chave e copie
5. Adicione no Railway como `RESEND_API_KEY`

---

## PASSO 6: Rodar Migrations e Seed

### Via Supabase Dashboard:

1. Vá em **SQL Editor** no Supabase
2. Cole o conteúdo do arquivo `apps/api/prisma/schema.prisma` convertido para SQL
3. Execute

### Ou via terminal local:

```bash
# Conectar ao banco do Supabase
cd apps/api

# Criar arquivo .env com a URL do Supabase
echo "DATABASE_URL=postgresql://postgres:[SENHA]@db.xxxxxxxxx.supabase.co:5432/postgres" > .env

# Rodar migrations
npx prisma db push

# Rodar seed
npx ts-node prisma/seed.ts
```

---

## PASSO 7: Configurar Domínio Personalizado (Opcional)

### No Vercel:
1. Vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

### No Railway:
1. Vá em **Settings** → **Networking**
2. Adicione domínio personalizado

---

## ✅ Checklist Final

- [ ] Supabase: Projeto criado e banco configurado
- [ ] Railway: Backend deployado e rodando
- [ ] Vercel: Frontend deployado e rodando
- [ Stripe: Chaves configuradas e webhook criado
- [ ] Resend: Chave de API configurada
- [ ] Migrations: Schema aplicado ao banco
- [ ] Seed: Dados de teste inseridos
- [ ] Teste: Login, compra e acesso funcionando

---

## 🔗 URLs Finais

| Serviço | URL |
|---------|-----|
| Frontend | `https://seu-app.vercel.app` |
| Backend | `https://seu-backend.up.railway.app` |
| API Docs | `https://seu-backend.up.railway.app/api/docs` |
| Supabase | `https://app.supabase.com` |

---

## 💰 Custos

| Serviço | Plano | Limite |
|---------|-------|--------|
| Vercel | Free | 100GB bandwidth/mês |
| Railway | Free | $5 créditos/mês |
| Supabase | Free | 500MB banco, 1GB storage |
| Stripe | Pay-as-you-go | 2.9% + R$0.39 por transação |
| Resend | Free | 100 emails/dia |

**Total: GRATUITO para começar!** 🎉

---

## 🐛 Troubleshooting

### Erro de CORS:
No backend, verifique se `NEXT_PUBLIC_APP_URL` está correto

### Erro de Database:
Verifique se a `DATABASE_URL` está correta no Railway

### Webhook não funciona:
Verifique se o Stripe webhook está apontando para a URL correta

### Build falha no Vercel:
Verifique se as variáveis de ambiente estão configuradas
