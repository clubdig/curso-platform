'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'Assunto é obrigatório'),
  message: z.string().min(20, 'Mensagem deve ter no mínimo 20 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    reset();
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Fale Conosco</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tem alguma dúvida ou sugestão? Estamos aqui para ajudar!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
              <p className="text-gray-600">suporte@cursoplatform.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Telefone</h3>
              <p className="text-gray-600">(11) 99999-9999</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Endereço</h3>
              <p className="text-gray-600">São Paulo, SP - Brasil</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  {...register('name')}
                  className="input-field"
                  placeholder="Seu nome"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
              <input
                {...register('subject')}
                className="input-field"
                placeholder="Como podemos ajudar?"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea
                {...register('message')}
                className="input-field h-32"
                placeholder="Descreva sua dúvida ou sugestão..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
