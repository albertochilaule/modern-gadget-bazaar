
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

type OrderStatus = 'Pago' | 'Pendente' | 'Em Processamento';

interface Order {
  id: string;
  cliente: string;
  produto: string;
  valor: string;
  status: OrderStatus;
}

const orders: Order[] = [
  { id: '#12345', cliente: 'João Silva', produto: 'Dell XPS 15', valor: 'R$ 4.999,00', status: 'Pago' },
  { id: '#12344', cliente: 'Maria Santos', produto: 'MacBook Pro', valor: 'R$ 8.999,00', status: 'Pendente' },
  { id: '#12343', cliente: 'Pedro Oliveira', produto: 'Lenovo ThinkPad', valor: 'R$ 3.999,00', status: 'Em Processamento' },
];

const getStatusClass = (status: OrderStatus) => {
  switch (status) {
    case 'Pago':
      return 'bg-green-500 text-white';
    case 'Pendente':
      return 'bg-yellow-500 text-white';
    case 'Em Processamento':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-200';
  }
};

const RecentOrders = () => {
  return (
    <Card className="border shadow-sm mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Últimos Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.cliente}</TableCell>
                <TableCell>{order.produto}</TableCell>
                <TableCell>{order.valor}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
