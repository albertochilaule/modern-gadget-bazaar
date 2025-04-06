
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AdminUsers = () => {
  const users = [
    { id: '1', name: 'João Silva', email: 'joao@exemplo.com', role: 'Cliente' },
    { id: '2', name: 'Maria Santos', email: 'maria@exemplo.com', role: 'Cliente' },
    { id: '3', name: 'Admin', email: 'admin@centurytech.com', role: 'Administrador' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Adicionar usuário
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Nome</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Função</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-4">{user.id}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
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

export default AdminUsers;
