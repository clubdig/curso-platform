'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'Como acesso meus cursos após a compra?',
    answer: 'Após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso. Basta fazer login na plataforma e acessar a seção "Meus Cursos".',
  },
  {
    question: 'Qual a política de reembolso?',
    answer: 'Você tem até 7 dias para solicitar o reembolso após a compra, desde que não tenha acessado mais de 30% do conteúdo do curso.',
  },
  {
    question: 'Os cursos têm prazo de validade?',
    answer: 'Depende do tipo de acesso comprado. Alguns cursos oferecem acesso vitalício, enquanto outros têm prazo determinado. Verifique as informações na página do curso.',
  },
  {
    question: 'Posso parcelar a compra?',
    answer: 'Sim! Aceitamos parcelamento em até 12x sem juros no cartão de crédito. Também é possível pagar via PIX ou boleto bancário.',
  },
  {
    question: 'Como recebo meu certificado?',
    answer: 'O certificado é gerado automaticamente após a conclusão de 100% do curso. Você pode baixá-lo na seção "Certificados" da sua conta.',
  },
  {
    question: 'Posso assistir as aulas no celular?',
    answer: 'Sim! Nossa plataforma é responsiva e funciona perfeitamente em qualquer dispositivo: computador, tablet ou smartphone.',
  },
  {
    question: 'Tenho dúvidas sobre o conteúdo. Como entro em contato com o instrutor?',
    answer: 'Cada curso possui uma seção de comentários onde você pode interagir diretamente com o instrutor e outros alunos.',
  },
  {
    question: 'Posso comprar um curso para outra pessoa?',
    answer: 'Sim, você pode presentear alguém. Na hora da compra, informe os dados do destinatário para que ele receba o acesso.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h1>
        <p className="text-xl text-gray-600">
          Encontre respostas para as dúvidas mais comuns
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              {openIndex === idx ? (
                <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Não encontrou o que procurava?</p>
        <a href="/contact" className="btn-primary inline-block">
          Fale Conosco
        </a>
      </div>
    </div>
  );
}
