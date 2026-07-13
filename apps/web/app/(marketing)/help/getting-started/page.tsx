import Link from 'next/link';
import { ArrowLeft, BookOpen, CreditCard, GraduationCap, Award } from 'lucide-react';

export default function GettingStartedPage() {
  const steps = [
    {
      step: 1,
      icon: BookOpen,
      title: 'Explore os Cursos',
      description: 'Navegue pela nossa catalogo e encontre o curso perfeito para você.',
    },
    {
      step: 2,
      icon: CreditCard,
      title: 'Realize a Compra',
      description: 'Escolha a forma de pagamento: cartão, PIX ou boleto.',
    },
    {
      step: 3,
      icon: GraduationCap,
      title: 'Comece a Estudar',
      description: 'Acesse suas aulas imediatamente após a confirmação do pagamento.',
    },
    {
      step: 4,
      icon: Award,
      title: 'Receba seu Certificado',
      description: 'Conclua o curso e receba seu certificado de conclusão.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/help" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
        <ArrowLeft className="h-4 w-4" />
        Voltar para a Central de Ajuda
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Primeiros Passos</h1>
      <p className="text-xl text-gray-600 mb-12">
        Siga estos passos para começar a usar a plataforma
      </p>

      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.step} className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{step.step}</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 card">
        <h2 className="text-xl font-semibold mb-4">Dica Importante</h2>
        <p className="text-gray-600">
          Após a compra, você receberá um e-mail de confirmação com todas as informações
          para acessar seu curso. Verifique também a caixa de spam!
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link href="/courses" className="btn-primary inline-block">
          Explorar Cursos
        </Link>
      </div>
    </div>
  );
}
