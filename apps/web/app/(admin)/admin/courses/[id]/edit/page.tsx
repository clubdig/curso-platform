'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

const courseSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().min(0.01, 'Preço deve ser maior que 0'),
  salePrice: z.number().optional(),
  type: z.enum(['ONE_TIME', 'SUBSCRIPTION']),
  accessDuration: z.number().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Module {
  id?: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id?: string;
  title: string;
  type: string;
  contentUrl?: string;
  duration?: number;
  isFree: boolean;
  order: number;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [showLessonModal, setShowLessonModal] = useState<number | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: '', type: 'VIDEO', contentUrl: '', duration: 0, isFree: false });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  const status = watch('status');

  useEffect(() => {
    loadCourse();
  }, [params.id]);

  const loadCourse = async () => {
    try {
      const res = await api.get(`/courses/${params.id}`);
      reset({
        title: res.data.title,
        description: res.data.description,
        shortDescription: res.data.shortDescription,
        price: Number(res.data.price),
        salePrice: res.data.salePrice ? Number(res.data.salePrice) : undefined,
        type: res.data.type,
        accessDuration: res.data.accessDuration,
        status: res.data.status,
      });

      const modulesRes = await api.get(`/courses/${params.id}/modules`);
      setModules(modulesRes.data.map((m: any, idx: number) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        order: m.order || idx + 1,
        lessons: m.lessons.map((l: any) => ({
          id: l.id,
          title: l.title,
          type: l.type,
          contentUrl: l.contentUrl,
          duration: l.duration,
          isFree: l.isFree,
          order: l.order,
        })),
      })));
    } catch (error) {
      toast.error('Erro ao carregar curso');
      router.push('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      await api.put(`/courses/${params.id}`, data);
      toast.success('Curso atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar curso');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      await api.put(`/courses/${params.id}/publish`);
      toast.success('Curso publicado com sucesso!');
      loadCourse();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao publicar curso');
    }
  };

  const addModule = async () => {
    const title = prompt('Nome do módulo:');
    if (!title) return;

    try {
      const res = await api.post(`/courses/${params.id}/modules`, { title });
      setModules([...modules, { ...res.data, lessons: [] }]);
      toast.success('Módulo criado!');
    } catch (error) {
      toast.error('Erro ao criar módulo');
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Excluir este módulo e todas as aulas?')) return;
    try {
      await api.delete(`/modules/${moduleId}`);
      setModules(modules.filter(m => m.id !== moduleId));
      toast.success('Módulo excluído!');
    } catch (error) {
      toast.error('Erro ao excluir módulo');
    }
  };

  const addLesson = async (moduleIndex: number) => {
    setShowLessonModal(moduleIndex);
  };

  const handleAddLesson = async () => {
    if (!showLessonModal && showLessonModal !== 0) return;
    const moduleId = modules[showLessonModal]?.id;
    if (!moduleId) return;

    try {
      const res = await api.post(`/modules/${moduleId}/lessons`, lessonForm);
      const updatedModules = [...modules];
      updatedModules[showLessonModal].lessons.push(res.data);
      setModules(updatedModules);
      setShowLessonModal(null);
      setLessonForm({ title: '', type: 'VIDEO', contentUrl: '', duration: 0, isFree: false });
      toast.success('Aula criada!');
    } catch (error) {
      toast.error('Erro ao criar aula');
    }
  };

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('Excluir esta aula?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
        }
        return m;
      }));
      toast.success('Aula excluída!');
    } catch (error) {
      toast.error('Erro ao excluir aula');
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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Editar Curso</h1>
        <div className="flex gap-2">
          {status === 'DRAFT' && (
            <button onClick={handlePublish} className="btn-primary">
              Publicar Curso
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input {...register('title')} className="input-field" />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
              <input {...register('shortDescription')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Completa</label>
              <textarea {...register('description')} className="input-field h-32" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Preço e Acesso</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input {...register('price', { valueAsNumber: true })} type="number" step="0.01" className="input-field" />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço Promocional</label>
              <input {...register('salePrice', { valueAsNumber: true })} type="number" step="0.01" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Acesso</label>
              <select {...register('type')} className="input-field">
                <option value="ONE_TIME">Compra Única</option>
                <option value="SUBSCRIPTION">Assinatura</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="input-field">
                <option value="DRAFT">Rascunho</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ARCHIVED">Arquivado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      {/* Módulos */}
      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Módulos e Aulas</h2>
          <button onClick={addModule} className="btn-primary text-sm py-2">
            <Plus className="h-4 w-4 mr-1 inline" />
            Novo Módulo
          </button>
        </div>

        {modules.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhum módulo criado. Adicione módulos para organizar suas aulas.
          </p>
        ) : (
          <div className="space-y-3">
            {modules.map((module, moduleIndex) => (
              <div key={module.id || moduleIndex} className="border rounded-lg">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedModules({ ...expandedModules, [moduleIndex]: !expandedModules[moduleIndex] })}
                    >
                      {expandedModules[moduleIndex] ? <ChevronDown /> : <ChevronRight />}
                    </button>
                    <span className="font-medium">Módulo {moduleIndex + 1}: {module.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => addLesson(moduleIndex)} className="text-sm text-primary-600 hover:underline">
                      + Adicionar Aula
                    </button>
                    {module.id && (
                      <button onClick={() => deleteModule(module.id!)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {expandedModules[moduleIndex] && (
                  <div className="divide-y">
                    {module.lessons.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-gray-500">Nenhuma aula</p>
                    ) : (
                      module.lessons.map((lesson) => (
                        <div key={lesson.id} className="px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm">{lesson.title}</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{lesson.type}</span>
                            {lesson.isFree && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Grátis</span>
                            )}
                          </div>
                          {lesson.id && (
                            <button
                              onClick={() => deleteLesson(module.id!, lesson.id!)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Aula */}
      {showLessonModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Nova Aula</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="input-field"
                  placeholder="Nome da aula"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={lessonForm.type}
                    onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="VIDEO">Vídeo</option>
                    <option value="TEXT">Texto</option>
                    <option value="PDF">PDF</option>
                    <option value="LINK">Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duração (seg)</label>
                  <input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Conteúdo</label>
                <input
                  value={lessonForm.contentUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, contentUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lessonForm.isFree}
                  onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Aula gratuita (preview)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowLessonModal(null)} className="btn-secondary">Cancelar</button>
              <button onClick={handleAddLesson} className="btn-primary">Criar Aula</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
