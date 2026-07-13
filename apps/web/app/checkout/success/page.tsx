import Link from 'next/link';
import { CheckCircle, BookOpen, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Compra Realizada com Sucesso!
          </h1>
          <p className="text-gray-600 mb-8">
            Seu pagamento foi processado e o acesso ao curso foi liberado.
            Você já pode começar a assistir suas aulas!
          </p>

          <div className="space-y-3">
            <Link
              href="/my-courses"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Acessar Meus Cursos
            </Link>
            <Link
              href="/courses"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              Explorar Mais Cursos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Um e-mail de confirmação foi enviado para seu endereço de e-mail.
          </p>
        </div>
      </div>
    </div>
  );
}
