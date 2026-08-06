'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Search } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  coverUrl: string;
  producer: {
    name: string;
    avatarUrl: string;
  };
  _count: {
    enrollments: number;
    modules: number;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/courses')
      .then((res) => setCourses(res.data.courses))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">CursoPlatform</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Entrar
              </Link>
              <Link href="/register" className="btn-primary">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Nossos Cursos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre o curso perfeito para impulsionar sua carreira
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum curso encontrado
            </h2>
            <p className="text-gray-600">
              {search ? 'Tente outro termo de busca.' : 'Volte novamente em breve.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/course/${course.slug}`}
                className="card hover:shadow-lg transition-all group"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {course.coverUrl ? (
                    <img
                      src={course.coverUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {course.producer?.name?.charAt(0) || 'I'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {course.producer?.name || 'Instrutor'}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors text-lg">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.shortDescription || course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course._count.modules} módulos
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course._count.enrollments} alunos
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  {course.salePrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatCurrency(Number(course.salePrice))}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(Number(course.price))}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(Number(course.price))}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
