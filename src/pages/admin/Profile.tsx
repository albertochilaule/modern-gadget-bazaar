
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateProfile) return;
    
    setIsLoading(true);
    
    try {
      const { success, error } = await updateProfile(name);
      
      if (success) {
        toast({
          title: 'Perfil atualizado',
          description: 'Seus dados foram atualizados com sucesso.',
        });
      } else {
        throw new Error(error);
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatePassword) return;
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsPasswordLoading(true);
    
    try {
      const { success, error } = await updatePassword(newPassword);
      
      if (success) {
        toast({
          title: 'Senha atualizada',
          description: 'Sua senha foi atualizada com sucesso.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(error);
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível atualizar a senha.',
        variant: 'destructive',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Atualize seu perfil e senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.email || 'email@exemplo.com'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Atualizar Perfil</h2>
              <form onSubmit={handleProfileUpdate} className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name">Nome</label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    'Atualizar Perfil'
                  )}
                </Button>
              </form>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Atualizar Senha</h2>
              <form onSubmit={handlePasswordUpdate} className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="currentPassword">Senha Atual</label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="newPassword">Nova Senha</label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button disabled={isPasswordLoading} type="submit">
                  {isPasswordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    'Atualizar Senha'
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Profile;
