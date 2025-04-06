
import { useState, useEffect } from 'react';
import { PencilIcon, Trash2Icon, UserIcon, UserPlusIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define the user type
type UserType = 'admin' | 'colaborador' | 'cliente';

// Define the User interface
interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserType;
  lastAccess: string;
  registrationDate: string;
  status: 'ativo' | 'inativo';
}

// Form schema
const userFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'colaborador', 'cliente']).optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme a senha')
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userFormSchema>;

const AdminUsers = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  // Form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'cliente',
      password: '',
      confirmPassword: ''
    }
  });

  // Load initial users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Default users
      const defaultUsers = [
        { 
          id: '1', 
          name: 'João Silva', 
          email: 'joao.silva@century.com', 
          role: 'admin' as UserType, 
          lastAccess: '2024-03-15T14:30:00',
          registrationDate: '2024-01-15',
          status: 'ativo' as const
        },
        { 
          id: '2', 
          name: 'Maria Santos', 
          email: 'maria.santos@century.com', 
          role: 'colaborador' as UserType, 
          lastAccess: '2024-03-15T13:45:00',
          registrationDate: '2024-01-20',
          status: 'ativo' as const
        },
        { 
          id: '3', 
          name: 'Pedro Oliveira', 
          email: 'pedro.oliveira@email.com', 
          role: 'cliente' as UserType, 
          lastAccess: '2024-03-15T12:15:00',
          registrationDate: '2024-03-01',
          status: 'ativo' as const
        },
        { 
          id: '4', 
          name: 'Ana Silva', 
          email: 'ana.silva@email.com', 
          role: 'cliente' as UserType, 
          lastAccess: '2024-03-15T10:30:00',
          registrationDate: '2024-03-05',
          status: 'ativo' as const
        },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Reset form when modal is opened
  useEffect(() => {
    if (isAddUserOpen) {
      // If editing, populate the form
      if (editingUser) {
        form.reset({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          password: '',
          confirmPassword: ''
        });
      } else {
        // Reset form for new user
        form.reset({
          name: '',
          email: '',
          role: 'cliente',
          password: '',
          confirmPassword: ''
        });
      }
    }
  }, [isAddUserOpen, editingUser, form]);

  // Handle form submission
  const onSubmit = (values: UserFormValues) => {
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map((user) => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              name: values.name,
              email: values.email,
              role: values.role || user.role
            } 
          : user
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      toast({
        title: "Usuário atualizado",
        description: `${values.name} foi atualizado com sucesso`,
      });
    } else {
      // Add new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: values.name,
        email: values.email,
        role: values.role || 'cliente',
        lastAccess: '-',
        registrationDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'ativo'
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      toast({
        title: "Usuário adicionado",
        description: `${values.name} foi adicionado com sucesso`,
      });
    }
    
    // Close modal
    setIsAddUserOpen(false);
    setEditingUser(null);
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso",
    });
  };

  // Edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsAddUserOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (dateString === '-') return '-';
    try {
      if (dateString.includes('T')) {
        // Format with time
        return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
      } else {
        // Format date only
        return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
      }
    } catch (error) {
      return dateString;
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Group users by role
  const adminUsers = users.filter(user => user.role === 'admin');
  const collaboratorUsers = users.filter(user => user.role === 'colaborador');
  const clientUsers = users.filter(user => user.role === 'cliente');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
        <Button onClick={() => { setEditingUser(null); setIsAddUserOpen(true); }}>
          <UserPlusIcon className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      {/* Administradores Section */}
      {adminUsers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Administradores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 flex items-start">
                <div className="bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center text-white mr-4">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-2">Último acesso: {formatDate(user.lastAccess)}</p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colaboradores Section */}
      {collaboratorUsers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Colaboradores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collaboratorUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 flex items-start">
                <div className="bg-green-600 h-10 w-10 rounded-full flex items-center justify-center text-white mr-4">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    {user.name}
                    <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">Colaborador</Badge>
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-2">Último acesso: {formatDate(user.lastAccess)}</p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clientes Section */}
      {clientUsers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Clientes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.filter(user => user.role === 'cliente').map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.registrationDate)}</TableCell>
                  <TableCell>{formatDate(user.lastAccess)}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-600">{user.status === 'ativo' ? 'Ativo' : 'Inativo'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, clientUsers.length)} de {clientUsers.length} clientes
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Usuário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="colaborador">Colaborador</SelectItem>
                        <SelectItem value="cliente">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={editingUser ? '••••••••' : 'Digite a senha'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={editingUser ? '••••••••' : 'Confirme a senha'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsAddUserOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
