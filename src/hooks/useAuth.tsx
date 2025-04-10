
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { ExtendedUser } from "@/types/supabase";

type AuthContextType = {
  user: ExtendedUser | null;
  session: any | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCollaborator: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<any>) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local user accounts for offline development
const LOCAL_USERS = [
  {
    id: "admin-id-123",
    name: "Admin User",
    email: "admin@centurytech.com",
    password: "senha123",
    role: "admin",
  },
  {
    id: "colab-id-456",
    name: "Colaborador",
    email: "colaborador@centurytech.com",
    password: "senha123",
    role: "colaborador",
  },
  {
    id: "client-id-789",
    name: "Cliente",
    email: "cliente@centurytech.com",
    password: "senha123",
    role: "cliente",
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCollaborator, setIsCollaborator] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Check for existing session in localStorage
  useEffect(() => {
    console.log("Auth provider initialized, checking localStorage");
    
    // Check if we have a stored session
    const storedSession = localStorage.getItem('centurytech_session');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        setSession(sessionData);
        
        // Create extended user from stored data
        const storedUser = sessionData.user;
        if (storedUser) {
          console.log("Restored user session:", storedUser.email);
          
          setIsAdmin(storedUser.role === 'admin');
          setIsCollaborator(storedUser.role === 'colaborador');
          setUser(storedUser as ExtendedUser);
        }
      } catch (error) {
        console.error("Error parsing stored session:", error);
        localStorage.removeItem('centurytech_session');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting local login for:", email);
      
      // Find matching local user
      const matchedUser = LOCAL_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!matchedUser) {
        console.error("Login error: Invalid credentials");
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Email ou senha incorretos.",
        });
        return false;
      }
      
      // Create session object
      const newSession = {
        user: {
          ...matchedUser,
        },
        access_token: "local-token-123",
        created_at: new Date().toISOString(),
      };
      
      // Set session state
      setSession(newSession);
      setUser(matchedUser as ExtendedUser);
      setIsAdmin(matchedUser.role === 'admin');
      setIsCollaborator(matchedUser.role === 'colaborador');
      
      // Store in localStorage
      localStorage.setItem('centurytech_session', JSON.stringify(newSession));
      
      console.log("Login successful, session:", newSession);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta, " + matchedUser.name + "!",
      });
      return true;
    } catch (error: any) {
      console.error("Login exception:", error);
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: error.message || "Ocorreu um erro durante o login.",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log("Local registration not supported in offline mode");
      toast({
        variant: "destructive",
        title: "Funcionalidade não disponível",
        description: "O registro de novos usuários está desativado no modo offline."
      });
      return false;
    } catch (error: any) {
      console.error("Registration exception:", error);
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro durante o cadastro.",
      });
      return false;
    }
  };

  const updateProfile = async (data: Partial<any>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Update local user data
      const updatedUser = {
        ...user,
        ...data
      };
      
      setUser(updatedUser);
      
      // Update session in localStorage
      if (session) {
        const updatedSession = {
          ...session,
          user: updatedUser
        };
        setSession(updatedSession);
        localStorage.setItem('centurytech_session', JSON.stringify(updatedSession));
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: "Ocorreu um erro ao atualizar o perfil."
      });
      return false;
    }
  };
  
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // In local mode, we don't actually update passwords
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso (modo simulado)."
      });
      return true;
    } catch (error: any) {
      console.error("Password update exception:", error);
      toast({
        variant: "destructive",
        title: "Erro na atualização da senha",
        description: error.message || "Ocorreu um erro ao atualizar a senha."
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear local storage and state
      localStorage.removeItem('centurytech_session');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsCollaborator(false);
      
      console.log("User logged out");
      toast({
        title: "Desconectado",
        description: "Você saiu da sua conta com sucesso."
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair da sua conta."
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login, 
      register, 
      logout, 
      isAuthenticated: !!user,
      isAdmin, 
      isCollaborator,
      updateProfile,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
