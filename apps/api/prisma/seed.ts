import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cursoplatform.com' },
    update: {},
    create: {
      email: 'admin@cursoplatform.com',
      name: 'Administrador',
      passwordHash: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin criado:', admin.email);

  // Criar produtor
  const producerPassword = await bcrypt.hash('producer123', 12);
  const producer = await prisma.user.upsert({
    where: { email: 'produtor@cursoplatform.com' },
    update: {},
    create: {
      email: 'produtor@cursoplatform.com',
      name: 'João Produtor',
      passwordHash: producerPassword,
      role: 'PRODUCER',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Produtor criado:', producer.email);

  // Criar aluno
  const studentPassword = await bcrypt.hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'aluno@cursoplatform.com' },
    update: {},
    create: {
      email: 'aluno@cursoplatform.com',
      name: 'Maria Aluna',
      passwordHash: studentPassword,
      role: 'STUDENT',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Aluno criado:', student.email);

  // Criar cursos de exemplo
  const course1 = await prisma.course.upsert({
    where: { slug: 'marketing-digital-completo' },
    update: {},
    create: {
      title: 'Marketing Digital Completo',
      slug: 'marketing-digital-completo',
      description: 'Aprenda todas as estratégias de marketing digital do zero. Desde tráfego pago até SEO e marketing de conteúdo.',
      shortDescription: 'Curso completo de marketing digital para iniciantes e profissionais.',
      price: 497,
      salePrice: 297,
      type: 'ONE_TIME',
      status: 'PUBLISHED',
      producerId: producer.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: 'programacao-web-fullstack' },
    update: {},
    create: {
      title: 'Programação Web Full Stack',
      slug: 'programacao-web-fullstack',
      description: 'Domine HTML, CSS, JavaScript, React, Node.js e banco de dados. Torne-se um desenvolvedor full stack completo.',
      shortDescription: 'Do zero ao deploy: torne-se um desenvolvedor full stack.',
      price: 697,
      type: 'ONE_TIME',
      status: 'PUBLISHED',
      producerId: producer.id,
    },
  });
  console.log('✅ Cursos criados');

  // Criar módulos para o primeiro curso
  const module1 = await prisma.courseModule.create({
    data: {
      title: 'Introdução ao Marketing Digital',
      description: 'Fundamentos do marketing digital',
      order: 1,
      courseId: course1.id,
    },
  });

  const module2 = await prisma.courseModule.create({
    data: {
      title: 'Tráfego Pago',
      description: 'Google Ads e Facebook Ads',
      order: 2,
      courseId: course1.id,
    },
  });

  // Criar aulas
  await prisma.lesson.createMany({
    data: [
      {
        title: 'O que é Marketing Digital',
        type: 'VIDEO',
        duration: 900,
        order: 1,
        isFree: true,
        moduleId: module1.id,
      },
      {
        title: 'Por que o Marketing Digital é Importante',
        type: 'VIDEO',
        duration: 720,
        order: 2,
        moduleId: module1.id,
      },
      {
        title: 'Os 4 Pilares do Marketing Digital',
        type: 'VIDEO',
        duration: 1200,
        order: 3,
        moduleId: module1.id,
      },
      {
        title: 'Introdução ao Google Ads',
        type: 'VIDEO',
        duration: 1500,
        order: 1,
        moduleId: module2.id,
      },
      {
        title: 'Criando sua Primeira Campanha',
        type: 'VIDEO',
        duration: 1800,
        order: 2,
        moduleId: module2.id,
      },
    ],
  });
  console.log('✅ Módulos e aulas criados');

  // Criar cupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'PRIMEIRACOMPRA',
        type: 'PERCENTAGE',
        value: 10,
        maxUses: 100,
      },
      {
        code: 'DESCONTO50',
        type: 'FIXED',
        value: 50,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ],
  });
  console.log('✅ Cupons criados');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📧 Credenciais de teste:');
  console.log('   Admin:   admin@cursoplatform.com / admin123');
  console.log('   Produtor: produtor@cursoplatform.com / producer123');
  console.log('   Aluno:   aluno@cursoplatform.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
