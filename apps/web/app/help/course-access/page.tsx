import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, MessageCircle, HelpCircle } from 'lucide-react';

export default function CourseAccessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/help" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
        <ArrowLeft className="h-4 w-4" />
        Voltar para a Central de Ajuda
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Acesso aos Cursos</h1>
      <p className="text-xl text-gray-600 mb-12">
        Tudo o que você precisa saber sobre como assistir suas aulas
      </p>

      <div className="space-y-8">
        <div className="card">
          <div className="flex items-start gap-4">
            <Play className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Como Assistir as Aulas</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                <li>Faça login na plataforma</li>
                <li>Acesse "Meus Cursos" no menu lateral</li>
                <li>Clique no curso que deseja assistir</li>
                <li>Selecione o módulo e aula desejada</li>
                <li>Clique no botão de play para iniciar</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Controle de Progresso</h2>
              <p className="text-gray-600 mb-4">
                Você pode marcar aulas como concluídas para acompanhar seu progresso.
                Ao final do curso, se atingir 100%, poderá gerar seu certificado.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Marque aulas como concluídas ao finalizá-las</li>
                <li>Acompanhe sua barra de progresso no dashboard</li>
                <li>Certificado gerado automaticamente ao concluir 100%</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <MessageCircle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Interação com Instrutores</h2>
              <p className="text-gray-600">
                Cada aula possui uma seção de comentários onde você pode:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2">
                <li>Tirar dúvidas sobre o conteúdo</li>
                <li>Solicitar esclarecimentos</li>
                <li>Compartilhar experiências</li>
                <li>Interagir com outros alunos</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <HelpCircle className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Problemas Comuns</h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-900">Vídeo não carrega</h3>
                  <p>Verifique sua conexão com a internet e tente atualizar a página.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Não consigo acessar o curso</h3>
                  <p>Certifique-se de que o pagamento foi confirmado. Se o problema persistir, entre em contato com o suporte.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Progresso não atualiza</h3>
                  <p>Aguarde alguns segundos e verifique se a aula foi marcada como concluída corretamente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/contact" className="btn-primary inline-block">
          Ainda tem dúvidas? Fale Conosco
        </Link>
      </div>
    </div>
  );
}
