# Curso Platform

Plataforma completa de venda e acesso a cursos online.

## Stack Tecnológica

- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend**: NestJS + Prisma ORM
- **Banco**: PostgreSQL
- **Pagamentos**: Stripe
- **E-mails**: Resend
- **Deploy**: Vercel + Railway

## Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- Docker (opcional)

## Setup Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

```bash
# Copiar arquivo de exemplo
cp apps/api/.env.example apps/api/.env

# Iniciar PostgreSQL com Docker
docker-compose up -d

# Gerar cliente Prisma
npm run db:generate

# Criar tabelas
npm run db:push
```

### 3. Configurar Stripe

1. Crie uma conta em [stripe.com](https://stripe.com)
2. Obtenha as chaves de teste
3. Adicione no arquivo `apps/api/.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 4. Iniciar desenvolvimento

```bash
# Backend (porta 3001)
cd apps/api
npm run dev

# Frontend (porta 3000)
cd apps/web
npm run dev
```

### 5. Acessar

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs

## Estrutura do Projeto

```
curso-platform/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend NestJS
├── packages/         # Código compartilhado
├── docker-compose.yml
└── package.json
```

## Funcionalidades

### MVP (Fase 1)
- ✅ Cadastro/Login de usuários
- ✅ Gestão de cursos, módulos e aulas
- ✅ Checkout com Stripe
- ✅ Liberação automática de acesso
- ✅ Área do aluno com progresso
- ✅ Painel administrativo básico

### Fase 2
- 🔄 Cupons de desconto
- 🔄 Certificados de conclusão
- 🔄 Comentários nas aulas
- 🔄 Relatórios de vendas

### Fase 3
- 📋 Assinatura recorrente
- 📋 Programa de afiliados
- 📋 Upsell/Downsell
- 📋 Automação de e-mails

## Comandos Úteis

```bash
# Gerar Prisma Client
npm run db:generate

# Criar migrations
npm run db:migrate

# Push schema para o banco
npm run db:push

# Seed do banco
npm run db:seed
```

## Deploy

### Frontend (Vercel)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Backend (Railway)
1. Crie um projeto no Railway
2. Adicione PostgreSQL
3. Configure as variáveis de ambiente
4. Deploy automático

## Licença

MIT
