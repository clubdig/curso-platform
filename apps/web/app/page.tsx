'use client';

import Link from 'next/link';
import { BookOpen, Users, Award, CreditCard, Shield, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  coverUrl: string;
  producer: { name: string };
  _count: { enrollments: number };
}

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get('/courses?limit=3')
      .then((res) => setFeaturedCourses(res.data.courses))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transforme sua Carreira com{' '}
              <span className="text-primary-200">Cursos Online</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Aprenda com os melhores instrutores, no seu ritmo, de qualquer lugar do mundo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="bg-white text-primary-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                Explorar Cursos
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center"
              >
                Começar Gratuitamente
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold">500+</p>
              <p className="text-primary-200">Cursos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold">50k+</p>
              <p className="text-primary-200">Alunos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold">4.9</p>
              <p className="text-primary-200">Avaliação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência de aprendizado online
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Acesso Imediato',
                description: 'Comece a assistir suas aulas assim que a compra for confirmada.',
              },
              {
                icon: Award,
                title: 'Certificados',
                description: 'Receba certificados reconhecidos ao concluir seus cursos.',
              },
              {
                icon: Shield,
                title: 'Pagamento Seguro',
                description: 'Compre com total segurança usando cartão, PIX ou boleto.',
              },
              {
                icon: Users,
                title: 'Comunidade',
                description: 'Interaja com outros alunos e instrutores.',
              },
              {
                icon: CreditCard,
                title: 'Parcelamento',
                description: 'Pague em até 12x sem juros no cartão de crédito.',
              },
              {
                icon: Star,
                title: 'Suporte',
                description: 'Tire suas dúvidas com nossos instrutores.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Cursos em Destaque</h2>
                <p className="text-gray-600">Os cursos mais populares da plataforma</p>
              </div>
              <Link href="/courses" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.slug}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="aspect-video bg-gray-200 relative">
                    {course.coverUrl ? (
                      <img
                        src={course.coverUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {course.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      {course.salePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary-600">
                            {formatCurrency(course.salePrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(course.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-primary-600">
                          {formatCurrency(course.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos alunos dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ana Silva',
                role: 'Designer',
                text: 'Consegui mudar de carreira graços aos cursos da plataforma. O conteúdo é excelente!',
              },
              {
                name: 'Carlos Santos',
                role: 'Empreendedor',
                text: 'As aulas são muito práticas e diretas. Já apliquei o aprendido no meu negócio.',
              },
              {
                name: 'Maria Oliveira',
                role: 'Desenvolvedora',
                text: 'A melhor plataforma de cursos que já usei. Recomendo para todos!',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="font-medium text-primary-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Junte-se a milhares de alunos que já estão transformando suas carreiras.
          </p>
          <Link
            href="/register"
            className="bg-white text-primary-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors inline-flex items-center gap-2"
          >
            Criar Conta Gratuitamente
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
