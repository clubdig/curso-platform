import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">CursoPlatform</span>
            </div>
            <p className="text-sm">
              Plataforma completa para venda e acesso a cursos online.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-white transition-colors">Cursos</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Começar Agora</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Entrar</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contato</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CursoPlatform. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
