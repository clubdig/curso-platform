'use client';

import Link from 'next/link';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">CursoPlatform</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-gray-600 hover:text-gray-900">
              Cursos
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                {(user.role === 'ADMIN' || user.role === 'PRODUCER') && (
                  <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Entrar
                </Link>
                <Link href="/register" className="btn-primary">
                  Começar Agora
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-4 space-y-3">
            <Link href="/courses" className="block py-2" onClick={() => setMobileMenuOpen(false)}>
              Cursos
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                {(user.role === 'ADMIN' || user.role === 'PRODUCER') && (
                  <Link href="/admin" className="block py-2" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <button onClick={logout} className="block py-2 text-left w-full">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2" onClick={() => setMobileMenuOpen(false)}>
                  Entrar
                </Link>
                <Link href="/register" className="btn-primary block text-center" onClick={() => setMobileMenuOpen(false)}>
                  Começar Agora
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
