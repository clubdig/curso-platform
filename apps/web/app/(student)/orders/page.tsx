'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Download } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: {
    course: {
      title: string;
      slug: string;
    };
    price: number;
  }[];
  payments: {
    method: string;
    status: string;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido realizado</h2>
          <p className="text-gray-600">Seus pedidos aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  order.status === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'PAID' ? 'Pago' :
                   order.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                </span>
              </div>

              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.course.title}</p>
                      <p className="text-sm text-gray-500">
                        {order.payments[0]?.method === 'CREDIT_CARD' ? 'Cartão de crédito' :
                         order.payments[0]?.method === 'PIX' ? 'PIX' : 'Boleto'}
                      </p>
                    </div>
                    <span className="font-medium">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
