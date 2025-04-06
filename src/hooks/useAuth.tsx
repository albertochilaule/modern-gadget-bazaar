
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Verificar se o usuário está autenticado ao carregar o componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular uma verificação com o localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${foundUser.name}!`,
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Email ou senha incorretos.",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Verificar se já existe um usuário com o mesmo e-mail
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.some((u: any) => u.email === email)) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Este e-mail já está em uso."
      });
      return false;
    }
    
    // Criar novo usuário
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password
    };
    
    // Adicionar à "base de dados" (localStorage)
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    // Login automático após cadastro
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };
    
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    toast({
      title: "Cadastro realizado com sucesso",
      description: "Sua conta foi criada e você já está conectado!"
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Desconectado",
      description: "Você saiu da sua conta com sucesso."
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
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
