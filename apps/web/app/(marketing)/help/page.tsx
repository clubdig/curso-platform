import Link from 'next/link';
import { BookOpen, CreditCard, User, Award, MessageCircle, ArrowRight } from 'lucide-react';

const helpTopics = [
  {
    icon: User,
    title: 'Primeiros Passos',
    description: 'Como criar sua conta e acessar a plataforma',
    href: '/help/getting-started',
  },
  {
    icon: CreditCard,
    title: 'Pagamentos',
    description: 'Formas de pagamento, parcelamento e reembolso',
    href: '/help/payments',
  },
  {
    icon: BookOpen,
    title: 'Acesso aos Cursos',
    description: 'Como assistir aulas e acompanhar progresso',
    href: '/help/course-access',
  },
  {
    icon: Award,
    title: 'Certificados',
    description: 'Como emitir e verificar certificados',
    href: '/help/certificates',
  },
  {
    icon: MessageCircle,
    title: 'Suporte',
    description: 'Entre em contato com nossa equipe',
    href: '/contact',
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Central de Ajuda</h1>
        <p className="text-xl text-gray-600">
          Como podemos ajudar você?
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpTopics.map((topic) => (
          <Link
            key={topic.title}
            href={topic.href}
            className="card hover:shadow-md transition-shadow group"
          >
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <topic.icon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {topic.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
            <span className="text-primary-600 text-sm font-medium flex items-center gap-1">
              Saiba mais <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Ainda precisa de ajuda?</h2>
          <p className="text-gray-600 mb-4">
            Nossa equipe de suporte está pronta para ajudar você.
          </p>
          <Link href="/contact" className="btn-primary inline-block">
            Fale Conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
