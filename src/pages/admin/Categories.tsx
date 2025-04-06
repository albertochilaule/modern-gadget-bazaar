
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AdminCategories = () => {
  const categories = [
    { id: '1', name: 'Laptops', products: 15 },
    { id: '2', name: 'Desktops', products: 8 },
    { id: '3', name: 'Smartphones', products: 22 },
    { id: '4', name: 'Acessórios', products: 34 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Adicionar categoria
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Nome</th>
                <th className="text-left p-4">Produtos</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="p-4">{category.id}</td>
                  <td className="p-4">{category.name}</td>
                  <td className="p-4">{category.products}</td>
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

export default AdminCategories;
