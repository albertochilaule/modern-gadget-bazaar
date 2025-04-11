
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'colaborador' | 'cliente';
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isCollaborator: boolean;
  register?: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile?: (name: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword?: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  isAdmin: false,
  isCollaborator: false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const isAdmin = user?.role === 'admin';
  const isCollaborator = user?.role === 'colaborador';

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('user');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Local auth bypass for specified users
      if (email === 'admin@centurytech.com' && password === 'senha123') {
        const adminUser = {
          id: 'admin-local-id',
          email: 'admin@centurytech.com',
          name: 'Admin',
          role: 'admin' as const
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        return { success: true };
      }
      
      if (email === 'colaborador@centurytech.com' && password === 'senha123') {
        const collaboratorUser = {
          id: 'colaborador-local-id',
          email: 'colaborador@centurytech.com',
          name: 'Colaborador',
          role: 'colaborador' as const
        };
        setUser(collaboratorUser);
        localStorage.setItem('user', JSON.stringify(collaboratorUser));
        
        return { success: true };
      }
      
      // Fall back to Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }
        
        const userObj = {
          id: data.user.id,
          email: data.user.email || '',
          name: profileData?.name || data.user.email?.split('@')[0] || 'User',
          role: (profileData?.role as 'admin' | 'colaborador' | 'cliente') || 'cliente'
        };
        
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Falha na autenticação. Tente novamente.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Não foi possível sair. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registro realizado",
        description: "Sua conta foi criada com sucesso. Verifique seu email para confirmar.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro no registro",
        description: error.message || "Não foi possível criar a conta. Tente novamente.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (name: string) => {
    try {
      if (!user) throw new Error('Usuário não está logado');
      
      // For local users, just update the localStorage
      if (user.id === 'admin-local-id' || user.id === 'colaborador-local-id') {
        const updatedUser = { ...user, name };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        name
      });
      
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name
      }));
      
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Erro na atualização",
        description: error.message || "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      if (!user) throw new Error('Usuário não está logado');
      
      // Local users don't need password updates
      if (user.id === 'admin-local-id' || user.id === 'colaborador-local-id') {
        return { success: true };
      }
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        title: "Erro na atualização",
        description: error.message || "Não foi possível atualizar a senha. Tente novamente.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        logout,
        isAdmin,
        isCollaborator,
        register,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
