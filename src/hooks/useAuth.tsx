
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { ExtendedUser, Profile } from "@/types/supabase";

type AuthContextType = {
  user: ExtendedUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Check for existing session and set up auth state listener
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Create extended user with profile data
          const extendedUser = currentSession.user as ExtendedUser;
          
          // Check if user is admin with a setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            if (data) {
              extendedUser.name = data.name;
              setIsAdmin(data.role === 'admin');
            
              // Update last access time
              await supabase
                .from('profiles')
                .update({ last_access: new Date().toISOString() })
                .eq('id', currentSession.user.id);
            }
            
            setUser(extendedUser);
          }, 0);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Create extended user with profile data
        const extendedUser = currentSession.user as ExtendedUser;
        
        // Check if user is admin
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              extendedUser.name = data.name;
              setIsAdmin(data.role === 'admin');
            
              // Update last access time
              return supabase
                .from('profiles')
                .update({ last_access: new Date().toISOString() })
                .eq('id', currentSession.user.id);
            }
          })
          .then(() => {
            setUser(extendedUser);
          });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: error.message || "Email ou senha incorretos.",
        });
        return false;
      }
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta!",
      });
      return true;
    } catch (error: any) {
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
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name,
          }
        } 
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: error.message || "Este e-mail já está em uso.",
        });
        return false;
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada e você já está conectado!"
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro durante o cadastro.",
      });
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Desconectado",
      description: "Você saiu da sua conta com sucesso."
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login, 
      register, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: isAdmin 
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
