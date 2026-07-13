'use client';

import { useEffect, useState } from 'react';
import { Users, BookOpen, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

interface DashboardData {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalOrders: number;
    totalRevenue: number;
  };
  recentOrders: any[];
  recentUsers: any[];
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { name: 'Total de Usuários', value: data.stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { name: 'Total de Cursos', value: data.stats.totalCourses, icon: BookOpen, color: 'bg-green-500' },
    { name: 'Total de Pedidos', value: data.stats.totalOrders, icon: ShoppingCart, color: 'bg-yellow-500' },
    { name: 'Receita Total', value: formatCurrency(Number(data.stats.totalRevenue)), icon: DollarSign, color: 'bg-purple-500', isCurrency: true },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name}!
        </h1>
        <p className="text-gray-600">Aqui está um resumo da sua plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Últimas Vendas</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma venda ainda</p>
          ) : (
            <div className="space-y-4">
              {data.recentOrders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{order.user?.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{formatCurrency(Number(order.total))}</p>
                    <p className="text-xs text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Últimos Usuários</h2>
          {data.recentUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum usuário ainda</p>
          ) : (
            <div className="space-y-4">
              {data.recentUsers.slice(0, 5).map((u: any) => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="font-medium text-primary-600">
                        {u.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
