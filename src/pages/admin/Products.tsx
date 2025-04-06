
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AdminProducts = () => {
  const [products] = useState([
    { id: '1', name: 'Dell XPS 15', brand: 'Dell', price: 'R$ 8.999,00', stock: 10 },
    { id: '2', name: 'MacBook Pro', brand: 'Apple', price: 'R$ 12.999,00', stock: 5 },
    { id: '3', name: 'Lenovo ThinkPad', brand: 'Lenovo', price: 'R$ 6.499,00', stock: 8 },
    { id: '4', name: 'HP Spectre', brand: 'HP', price: 'R$ 7.899,00', stock: 3 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Adicionar produto
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Nome</th>
                <th className="text-left p-4">Marca</th>
                <th className="text-left p-4">Preço</th>
                <th className="text-left p-4">Estoque</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-4">{product.id}</td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.brand}</td>
                  <td className="p-4">{product.price}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="outline" size="sm">Editar</Button>
                    <Button variant="destructive" size="sm">Remover</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;
