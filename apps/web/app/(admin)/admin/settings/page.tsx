'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'CursoPlatform',
    supportEmail: 'suporte@cursoplatform.com',
    defaultCurrency: 'BRL',
    allowRegistration: true,
    requireEmailVerification: false,
    defaultCourseStatus: 'DRAFT',
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Configurações da Plataforma</h1>

      <div className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Geral</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Plataforma
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de Suporte
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moeda Padrão
              </label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                className="input-field"
              >
                <option value="BRL">Real Brasileiro (R$)</option>
                <option value="USD">Dólar Americano ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Cadastro e Acesso</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="rounded border-gray-300"
              />
              <div>
                <span className="font-medium">Permitir cadastro público</span>
                <p className="text-sm text-gray-500">Novos usuários podem se cadastrar</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                className="rounded border-gray-300"
              />
              <div>
                <span className="font-medium">Exigir verificação de email</span>
                <p className="text-sm text-gray-500">Usuários devem confirmar o email para acessar</p>
              </div>
            </label>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Cursos</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Padrão ao Criar Curso
              </label>
              <select
                value={settings.defaultCourseStatus}
                onChange={(e) => setSettings({ ...settings, defaultCourseStatus: e.target.value })}
                className="input-field"
              >
                <option value="DRAFT">Rascunho</option>
                <option value="PUBLISHED">Publicado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="h-5 w-5" />
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}
