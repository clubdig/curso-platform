'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice: number | null;
  status: string;
  _count: {
    enrollments: number;
    modules: number;
  };
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await api.get('/courses/my');
      setCourses(res.data);
    } catch {
      const res = await api.get('/courses');
      setCourses(res.data.courses);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (error) {
      alert('Erro ao excluir curso');
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Cursos</h1>
        <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Novo Curso
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum curso criado</h2>
          <p className="text-gray-600 mb-6">Comece criando seu primeiro curso</p>
          <Link href="/admin/courses/new" className="btn-primary inline-block">
            Criar Curso
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Alunos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-500">{course._count.modules} módulos</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">
                      {formatCurrency(Number(course.salePrice || course.price))}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : course.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status === 'PUBLISHED' ? 'Publicado' :
                       course.status === 'DRAFT' ? 'Rascunho' : 'Arquivado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {course._count.enrollments}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/course/${course.slug}`}
                        className="p-2 text-gray-600 hover:text-primary-600"
                        title="Ver"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="p-2 text-gray-600 hover:text-primary-600"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
