'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Play, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    slug: string;
    coverUrl: string;
    description: string;
    modules: {
      lessons: any[];
    }[];
    producer: {
      name: string;
    };
  };
  status: string;
  createdAt: string;
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    api.get('/enrollments')
      .then((res) => setEnrollments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const calculateProgress = (enrollment: Enrollment) => {
    let totalLessons = 0;
    let completedLessons = 0;

    enrollment.course.modules.forEach((module) => {
      totalLessons += module.lessons.length;
      module.lessons.forEach((lesson: any) => {
        if (lesson.progress?.[0]?.completed) {
          completedLessons++;
        }
      });
    });

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const filteredEnrollments = enrollments.filter((e) => {
    const progress = calculateProgress(e);
    if (filter === 'in_progress') return progress < 100;
    if (filter === 'completed') return progress === 100;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Meus Cursos</h1>
        <div className="flex gap-2">
          {(['all', 'in_progress', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'in_progress' ? 'Em Andamento' : 'Concluídos'}
            </button>
          ))}
        </div>
      </div>

      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum curso encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'Você ainda não está matriculado em nenhum curso.'
              : filter === 'in_progress'
              ? 'Todos os seus cursos foram concluídos!'
              : 'Você ainda não concluiu nenhum curso.'}
          </p>
          <Link href="/courses" className="btn-primary inline-block">
            Explorar Cursos
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => {
            const progress = calculateProgress(enrollment);
            return (
              <Link
                key={enrollment.id}
                href={`/course/${enrollment.course.slug}`}
                className="card hover:shadow-md transition-shadow group"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
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
                  {progress === 100 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  por {enrollment.course.producer?.name || 'Instrutor'}
                </p>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Play className="h-4 w-4 mr-1" />
                  {enrollment.course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} aulas
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
