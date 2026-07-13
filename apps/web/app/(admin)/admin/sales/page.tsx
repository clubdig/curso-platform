'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface SalesData {
  payments: any[];
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    averageTicket: number;
  };
}

export default function AdminSalesPage() {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/sales')
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Relatório de Vendas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.summary.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.summary.totalTransactions}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.summary.averageTicket)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">Últimas Transações</h2>
        {data.payments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma transação encontrada</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.payments.map((payment: any) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{payment.order?.user?.name}</p>
                    <p className="text-sm text-gray-500">{payment.order?.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    {payment.order?.items?.[0]?.course?.title || '-'}
                  </td>
                  <td className="px-6 py-4 font-medium text-green-600">
                    {formatCurrency(Number(payment.amount))}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {payment.method === 'CREDIT_CARD' ? 'Cartão' :
                       payment.method === 'PIX' ? 'PIX' : 'Boleto'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status === 'PAID' ? 'Pago' :
                       payment.status === 'PENDING' ? 'Pendente' : 'Falhou'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {payment.paidAt ? formatDate(payment.paidAt) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
