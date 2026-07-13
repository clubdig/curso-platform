'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, Mail, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put('/users/' + user?.id, { name: formData.name });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não conferem');
      return;
    }
    setIsLoading(true);
    try {
      await api.put('/users/' + user?.id + '/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Senha alterada com sucesso!');
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Informações Pessoais</h2>
              <p className="text-sm text-gray-500">Atualize seus dados pessoais</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="input-field bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado</p>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Lock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Alterar Senha</h2>
              <p className="text-sm text-gray-500">Mantenha sua conta segura</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {isLoading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
