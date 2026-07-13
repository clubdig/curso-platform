#!/bin/bash

echo "🚀 Configurando projeto para deploy gratuito..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}Execute este script na raiz do projeto!${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Instalando dependências...${NC}"
npm install

echo ""
echo -e "${BLUE}🔧 Configurando Prisma...${NC}"
cd apps/api
npx prisma generate

echo ""
echo -e "${GREEN}✅ Projeto configurado!${NC}"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo ""
echo "1. Crie conta no Supabase (https://supabase.com)"
echo "2. Crie conta no Railway (https://railway.app)"
echo "3. Crie conta no Vercel (https://vercel.com)"
echo "4. Siga o guia em DEPLOY.md"
echo ""
echo -e "${GREEN}Boa sorte! 🎉${NC}"
