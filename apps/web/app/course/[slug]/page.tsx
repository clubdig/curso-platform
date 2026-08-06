'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Clock, Users, Play, CheckCircle, Lock } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  coverUrl: string;
  type: string;
  producer: {
    name: string;
    avatarUrl: string;
  };
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      type: string;
      duration: number;
      isFree: boolean;
    }[];
  }[];
  _count: {
    enrollments: number;
  };
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    api.get(`/courses/${params.slug}`)
      .then((res) => {
        setCourse(res.data);
        checkEnrollment(res.data.id);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const checkEnrollment = async (courseId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.get(`/enrollments/${courseId}`);
        setIsEnrolled(true);
      }
    } catch {
      setIsEnrolled(false);
    }
  };

  const handleBuy = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Faça login para comprar');
      router.push('/login');
      return;
    }
    router.push(`/checkout?course=${course?.id}`);
  };

  const getTotalLessons = () => {
    return course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
  };

  const getTotalDuration = () => {
    return course?.modules.reduce((acc, m) =>
      acc + m.lessons.reduce((a, l) => a + (l.duration || 0), 0), 0) || 0;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Curso não encontrado</p>
      </div>
    );
  }

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
              <Link href="/courses" className="text-gray-600 hover:text-gray-900">
                Cursos
              </Link>
              <Link href="/login" className="btn-primary">
                {isEnrolled ? 'Acessar Curso' : 'Entrar'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="font-medium">
                    {course.producer?.name?.charAt(0) || 'I'}
                  </span>
                </div>
                <span className="text-gray-300">{course.producer?.name || 'Instrutor'}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">
                {course.shortDescription || course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {course.modules.length} módulos
                </span>
                <span className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  {getTotalLessons()} aulas
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {formatDuration(getTotalDuration())}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {course._count.enrollments} alunos
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 text-gray-900">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {course.coverUrl ? (
                  <img src={course.coverUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="mb-4">
                {course.salePrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary-600">
                      {formatCurrency(Number(course.salePrice))}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(Number(course.price))}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary-600">
                    {formatCurrency(Number(course.price))}
                  </span>
                )}
              </div>

              {isEnrolled ? (
                <Link
                  href={`/course/${course.slug}/learn`}
                  className="w-full btn-primary py-4 text-center block text-lg"
                >
                  Continuar Assistindo
                </Link>
              ) : (
                <button
                  onClick={handleBuy}
                  className="w-full btn-primary py-4 text-lg"
                >
                  Comprar Agora
                </button>
              )}

              <p className="text-center text-sm text-gray-500 mt-4">
                Acesso {course.type === 'SUBSCRIPTION' ? 'enquanto ativo' : 'vitalício'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Sobre o Curso</h2>
            <div className="prose max-w-none text-gray-600">
              <p>{course.description}</p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6">Conteúdo do Curso</h2>
            <div className="space-y-4">
              {course.modules.map((module, idx) => (
                <div key={module.id} className="border rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 font-medium">
                    Módulo {idx + 1}: {module.title}
                  </div>
                  <div className="divide-y">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="px-4 py-3 flex items-center gap-3">
                        {lesson.isFree ? (
                          <Play className="h-5 w-5 text-primary-600" />
                        ) : isEnrolled ? (
                          <Play className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="flex-1">{lesson.title}</span>
                        {lesson.duration && (
                          <span className="text-sm text-gray-500">
                            {formatDuration(lesson.duration)}
                          </span>
                        )}
                        {lesson.isFree && (
                          <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                            Grátis
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="sticky top-24">
              <div className="card">
                <h3 className="font-semibold mb-4">O que você vai aprender</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Acesso a todas as aulas do curso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Certificado de conclusão</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Acesso vitalício</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Suporte do instrutor</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
