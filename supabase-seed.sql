-- Seed do banco de dados

-- Users
INSERT INTO "users" ("id", "email", "password_hash", "name", "role", "email_verified", "created_at", "updated_at") VALUES
('clx0admin0000000000000001', 'admin@cursoplatform.com', '$2a$12$DBAWs49ybn4pE9HQgoy46OFiAsuu9fjxiZr/iQs8jUGa63po2DfrK', 'Administrador', 'ADMIN', NOW(), NOW(), NOW()),
('clx0admin0000000000000002', 'produtor@cursoplatform.com', '$2a$12$LlyIFbwONZIOipym2.w/N.nHw6Zyv4ouiorWDgRcbdec1uAv4vWoq', 'João Produtor', 'PRODUCER', NOW(), NOW(), NOW()),
('clx0admin0000000000000003', 'aluno@cursoplatform.com', '$2a$12$UAq3.mhZ.p7ptErfPU36Ae.7zaMKTeavaDdzj5oH5wlhdPfL.SQ0O', 'Maria Aluna', 'STUDENT', NOW(), NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

-- Courses
INSERT INTO "courses" ("id", "title", "slug", "description", "short_description", "price", "sale_price", "type", "status", "producer_id", "created_at", "updated_at") VALUES
('clx0course000000000000001', 'Marketing Digital Completo', 'marketing-digital-completo', 'Aprenda todas as estratégias de marketing digital do zero. Desde tráfego pago até SEO e marketing de conteúdo.', 'Curso completo de marketing digital para iniciantes e profissionais.', 497, 297, 'ONE_TIME', 'PUBLISHED', 'clx0admin0000000000000002', NOW(), NOW()),
('clx0course000000000000002', 'Programação Web Full Stack', 'programacao-web-fullstack', 'Domine HTML, CSS, JavaScript, React, Node.js e banco de dados. Torne-se um desenvolvedor full stack completo.', 'Do zero ao deploy: torne-se um desenvolvedor full stack.', 697, NULL, 'ONE_TIME', 'PUBLISHED', 'clx0admin0000000000000002', NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Course Modules
INSERT INTO "course_modules" ("id", "title", "description", "order", "course_id", "created_at") VALUES
('clx0module00000000000001', 'Introdução ao Marketing Digital', 'Fundamentos do marketing digital', 1, 'clx0course000000000000001', NOW()),
('clx0module00000000000002', 'Tráfego Pago', 'Google Ads e Facebook Ads', 2, 'clx0course000000000000001', NOW());

-- Lessons
INSERT INTO "lessons" ("id", "title", "type", "duration", "order", "is_free", "module_id", "created_at") VALUES
('clx0lesson0000000000001', 'O que é Marketing Digital', 'VIDEO', 900, 1, true, 'clx0module00000000000001', NOW()),
('clx0lesson0000000000002', 'Por que o Marketing Digital é Importante', 'VIDEO', 720, 2, false, 'clx0module00000000000001', NOW()),
('clx0lesson0000000000003', 'Os 4 Pilares do Marketing Digital', 'VIDEO', 1200, 3, false, 'clx0module00000000000001', NOW()),
('clx0lesson0000000000004', 'Introdução ao Google Ads', 'VIDEO', 1500, 1, false, 'clx0module00000000000002', NOW()),
('clx0lesson0000000000005', 'Criando sua Primeira Campanha', 'VIDEO', 1800, 2, false, 'clx0module00000000000002', NOW());

-- Coupons
INSERT INTO "coupons" ("id", "code", "type", "value", "max_uses", "used_count", "created_at") VALUES
('clx0coupon000000000001', 'PRIMEIRACOMPRA', 'PERCENTAGE', 10, 100, 0, NOW()),
('clx0coupon000000000002', 'DESCONTO50', 'FIXED', 50, NULL, 0, NOW());
