import Link from 'next/link';
import { ArrowLeft, Award, Download, CheckCircle, ExternalLink } from 'lucide-react';

export default function CertificatesHelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/help" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
        <ArrowLeft className="h-4 w-4" />
        Voltar para a Central de Ajuda
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Certificados</h1>
      <p className="text-xl text-gray-600 mb-12">
        Tudo sobre como emitir e verificar certificados
      </p>

      <div className="space-y-8">
        <div className="card">
          <div className="flex items-start gap-4">
            <Award className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Como Emitir seu Certificado</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                <li>Acesse seu curso na seção "Meus Cursos"</li>
                <li>Assista todas as aulas e marque como concluídas</li>
                <li>Quando atingir 100% de progresso, o botão de certificado será liberado</li>
                <li>Clique em "Gerar Certificado"</li>
                <li>Baixe ou imprima seu certificado em PDF</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Requisitos para Emissão</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Estar matriculado no curso</li>
                <li>Ter assistido 100% das aulas</li>
                <li>Ter marcado todas as aulas como concluídas</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <Download className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Formatos Disponíveis</h2>
              <p className="text-gray-600 mb-4">
                Seu certificado é gerado em formato PDF de alta qualidade, pronto para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Impressão</li>
                <li>Compartilhamento nas redes sociais</li>
                <li>Anexo ao currículo</li>
                <li>Verificação de autenticidade online</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <ExternalLink className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Verificação de Autenticidade</h2>
              <p className="text-gray-600">
                Cada certificado possui um número único que pode ser verificado
                na nossa plataforma. qualquer pessoa pode confirmar a autenticidade
                do seu certificado acessando nossa página de verificação.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/certificates" className="btn-primary inline-block">
          Acessar Meus Certificados
        </Link>
      </div>
    </div>
  );
}
