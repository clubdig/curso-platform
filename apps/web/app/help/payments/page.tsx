import Link from 'next/link';
import { ArrowLeft, CreditCard, QrCode, FileText, Shield } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/help" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
        <ArrowLeft className="h-4 w-4" />
        Voltar para a Central de Ajuda
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagamentos</h1>
      <p className="text-xl text-gray-600 mb-12">
        Todas as informações sobre formas de pagamento
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <CreditCard className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Cartão de Crédito</h3>
          <p className="text-sm text-gray-600">
            Parcele em até 12x sem juros. Aceitamos Visa, Mastercard, Elo e Amex.
          </p>
        </div>

        <div className="card text-center">
          <QrCode className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">PIX</h3>
          <p className="text-sm text-gray-600">
            Pagamento instantâneo. Acesso liberado em segundos após a confirmação.
          </p>
        </div>

        <div className="card text-center">
          <FileText className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Boleto Bancário</h3>
          <p className="text-sm text-gray-600">
            Prazo de até 3 dias úteis para compensação. Acesso liberado após confirmação.
          </p>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Política de Reembolso</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            Em conformidade com o Código de Defesa do Consumidor (Art. 49), você tem
            direito ao reembolso em até <strong>7 dias</strong> após a compra.
          </p>
          <p>
            <strong>Condições para reembolso:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Solicitação feita em até 7 dias após a compra</li>
            <li>Não ter acessado mais de 30% do conteúdo do curso</li>
            <li>O reembolso será processado no mesmo meio de pagamento utilizado</li>
          </ul>
          <p>
            Para solicitar um reembolso, entre em contato com nosso suporte através
            do e-mail <strong>suporte@cursoplatform.com</strong>.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start gap-4">
          <Shield className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Segurança nas Transações</h2>
            <p className="text-gray-600">
              Todas as transações são processadas com criptografia SSL e são totalmente
              seguras. Não armazenamos dados de cartão de crédito em nossos servidores.
              O processamento de pagamentos é feito por parceiros certificados PCI DSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
