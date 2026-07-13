'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const courseSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().min(0.01, 'Preço deve ser maior que 0'),
  salePrice: z.number().optional(),
  type: z.enum(['ONE_TIME', 'SUBSCRIPTION']),
  accessDuration: z.number().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function NewCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { type: 'ONE_TIME' },
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      const res = await api.post('/courses', data);
      toast.success('Curso criado com sucesso!');
      router.push(`/admin/courses/${res.data.id}/edit`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar curso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Novo Curso</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Curso *
              </label>
              <input
                {...register('title')}
                className="input-field"
                placeholder="Ex: Curso Completo de Marketing Digital"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Curta
              </label>
              <input
                {...register('shortDescription')}
                className="input-field"
                placeholder="Uma breve descrição do curso"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Completa
              </label>
              <textarea
                {...register('description')}
                className="input-field h-32"
                placeholder="Descreva o conteúdo do curso em detalhes..."
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Preço e Acesso</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$) *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="197.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Promocional (R$)
                </label>
                <input
                  {...register('salePrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="97.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Acesso
              </label>
              <select {...register('type')} className="input-field">
                <option value="ONE_TIME">Compra Única (Acesso Vitalício)</option>
                <option value="SUBSCRIPTION">Assinatura (Recorrência)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração do Acesso (dias, vazio = vitalício)
              </label>
              <input
                {...register('accessDuration', { valueAsNumber: true })}
                type="number"
                className="input-field"
                placeholder="365"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Criando...' : 'Criar Curso'}
          </button>
        </div>
      </form>
    </div>
  );
}
