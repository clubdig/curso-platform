'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { BookOpen, CreditCard, QrCode, FileText, Tag } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const checkoutSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  paymentMethod: z.enum(['credit_card', 'pix', 'boleto']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  couponCode: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface Course {
  id: string;
  title: string;
  price: number;
  salePrice: number | null;
  coverUrl: string;
  producer: { name: string };
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('course');
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'credit_card' },
  });

  const paymentMethod = watch('paymentMethod');
  const couponCode = watch('couponCode');

  useEffect(() => {
    if (courseId) {
      api.get(`/courses/${courseId}`)
        .then((res) => setCourse(res.data))
        .finally(() => setLoading(false));
    }
  }, [courseId]);

  const applyCoupon = async () => {
    if (!couponCode || !courseId) return;
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode,
        courseId,
      });
      setDiscount(res.data.discount);
      setCouponApplied(true);
      toast.success(`Cupom aplicado! Desconto de ${formatCurrency(res.data.discount)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cupom inválido');
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const getFinalPrice = () => {
    if (!course) return 0;
    const basePrice = course.salePrice || course.price;
    return Math.max(0, Number(basePrice) - discount);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setProcessing(true);
    try {
      const orderRes = await api.post('/orders', {
        courseId,
        couponCode: couponApplied ? couponCode : undefined,
        paymentMethod: data.paymentMethod,
      });

      const checkoutRes = await api.post('/payments/checkout', {
        orderId: orderRes.data.id,
      });

      if (checkoutRes.data.url) {
        window.location.href = checkoutRes.data.url;
      } else {
        toast.success('Pedido criado! Redirecionando...');
        router.push('/checkout/success');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setProcessing(false);
    }
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
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">CursoPlatform</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Dados pessoais */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Dados Pessoais</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <input {...register('name')} className="input-field" placeholder="João Silva" />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input {...register('email')} type="email" className="input-field" placeholder="seu@email.com" />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF
                    </label>
                    <input {...register('cpf')} className="input-field" placeholder="000.000.000-00" />
                    {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>}
                  </div>
                </div>
              </div>

              {/* Cupom */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Cupom de Desconto
                </h2>
                <div className="flex gap-2">
                  <input
                    {...register('couponCode')}
                    className="input-field flex-1"
                    placeholder="Digite seu cupom"
                    disabled={couponApplied}
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponApplied || !couponCode}
                    className="btn-secondary whitespace-nowrap"
                  >
                    {couponApplied ? 'Aplicado!' : 'Aplicar'}
                  </button>
                </div>
                {discount > 0 && (
                  <p className="mt-2 text-sm text-green-600">
                    Desconto de {formatCurrency(discount)} aplicado!
                  </p>
                )}
              </div>

              {/* Pagamento */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Forma de Pagamento</h2>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <label className={`border-2 rounded-lg p-4 cursor-pointer text-center transition-colors ${
                    paymentMethod === 'credit_card' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
                  }`}>
                    <input type="radio" {...register('paymentMethod')} value="credit_card" className="sr-only" />
                    <CreditCard className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Cartão</span>
                  </label>
                  <label className={`border-2 rounded-lg p-4 cursor-pointer text-center transition-colors ${
                    paymentMethod === 'pix' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
                  }`}>
                    <input type="radio" {...register('paymentMethod')} value="pix" className="sr-only" />
                    <QrCode className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">PIX</span>
                  </label>
                  <label className={`border-2 rounded-lg p-4 cursor-pointer text-center transition-colors ${
                    paymentMethod === 'boleto' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
                  }`}>
                    <input type="radio" {...register('paymentMethod')} value="boleto" className="sr-only" />
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Boleto</span>
                  </label>
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número do cartão
                      </label>
                      <input {...register('cardNumber')} className="input-field" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Validade
                        </label>
                        <input {...register('cardExpiry')} className="input-field" placeholder="MM/AA" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input {...register('cardCvv')} className="input-field" placeholder="000" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-600 mb-2">Após confirmar, um QR Code PIX será gerado</p>
                    <p className="text-sm text-gray-500">O acesso será liberado após a confirmação do pagamento</p>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-600 mb-2">O boleto será gerado após a confirmação</p>
                    <p className="text-sm text-gray-500">Prazo de até 3 dias úteis para compensação</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full btn-primary py-4 text-lg"
              >
                {processing ? 'Processando...' : `Pagar ${formatCurrency(getFinalPrice())}`}
              </button>
            </form>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
              <div className="flex gap-3 mb-4">
                <div className="h-16 w-16 bg-gray-200 rounded-lg flex-shrink-0">
                  {course.coverUrl ? (
                    <img src={course.coverUrl} alt={course.title} className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{course.title}</h3>
                  <p className="text-xs text-gray-500">por {course.producer?.name}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(Number(course.salePrice || course.price))}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(getFinalPrice())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
