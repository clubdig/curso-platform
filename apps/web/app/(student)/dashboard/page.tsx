'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    slug: string;
    coverUrl: string;
    modules: any[];
  };
  createdAt: string;
}

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments')
      .then((res) => setEnrollments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { name: 'Cursos Matriculados', value: enrollments.length, icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Em Andamento', value: enrollments.filter(e => true).length, icon: Clock, color: 'bg-yellow-500' },
    { name: 'Concluídos', value: 0, icon: Award, color: 'bg-green-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Meus Cursos Recentes</h2>
          <Link href="/my-courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Ver todos
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Você ainda não está matriculado em nenhum curso</p>
            <Link href="/courses" className="btn-primary inline-block">
              Explorar Cursos
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.slice(0, 6).map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/course/${enrollment.course.slug}`}
                className="group block"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                  {enrollment.course.coverUrl ? (
                    <img
                      src={enrollment.course.coverUrl}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {enrollment.course.modules.length} módulos
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
