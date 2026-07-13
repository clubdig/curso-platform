'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    loadReport();
  }, [period]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString();
      const res = await api.get(`/admin/sales?startDate=${startDate}&endDate=${endDate}`);
      setData(res.data);
    } catch (error) {
      console.error('Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="365">Último ano</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Receita</p>
              <p className="text-2xl font-bold">{formatCurrency(data?.summary?.totalRevenue || 0)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Vendas</p>
              <p className="text-2xl font-bold">{data?.summary?.totalTransactions || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold">{formatCurrency(data?.summary?.averageTicket || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Vendas por Período</h2>
        {data?.payments?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma venda no período selecionado</p>
        ) : (
          <div className="space-y-3">
            {data?.payments?.map((payment: any) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{payment.order?.user?.name || 'Usuário'}</p>
                  <p className="text-sm text-gray-500">
                    {payment.order?.items?.[0]?.course?.title || 'Curso'} •{' '}
                    {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                <span className="font-semibold text-green-600">
                  {formatCurrency(Number(payment.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
