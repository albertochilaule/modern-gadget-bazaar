
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
    console.log("Auth provider initialized, setting up listeners");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Create extended user with profile data
          const extendedUser = currentSession.user as ExtendedUser;
          console.log("User authenticated:", extendedUser.email);
          
          // Check if user is admin with a setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
                
              if (error) {
                console.error("Error fetching profile:", error);
                return;
              }
              
              if (data) {
                console.log("Profile data fetched:", data);
                extendedUser.name = data.name;
                const userRole = data.role;
                console.log("User role:", userRole);
                setIsAdmin(userRole === 'admin');
              
                // Update last access time
                await supabase
                  .from('profiles')
                  .update({ last_access: new Date().toISOString() })
                  .eq('id', currentSession.user.id);
              }
              
              setUser(extendedUser);
            } catch (error) {
              console.error("Error in auth state change handler:", error);
            }
          }, 0);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Existing session check:", currentSession ? "Session exists" : "No session");
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
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching profile:", error);
              return;
            }
            
            if (data) {
              console.log("Profile data from existing session:", data);
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
          })
          .catch(error => {
            console.error("Error handling existing session:", error);
          });
      }
    }).catch(error => {
      console.error("Error getting session:", error);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: error.message || "Email ou senha incorretos.",
        });
        return false;
      }
      
      console.log("Login successful, session:", data.session);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta!",
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
      console.log("Attempting registration for:", email);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name,
          }
        } 
      });
      
      if (error) {
        console.error("Registration error:", error);
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: error.message || "Este e-mail já está em uso.",
        });
        return false;
      }
      
      console.log("Registration successful, user:", data.user);
      
      // Explicitly create profile entry to avoid delays with the trigger
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: data.user.id,
                name: name,
                email: email,
                role: 'cliente' // Default role for new users
              }
            ]);
            
          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        } catch (profileErr) {
          console.error("Exception creating profile:", profileErr);
        }
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada e você já está conectado!"
      });
      
      return true;
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

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      console.log("User logged out");
      toast({
        title: "Desconectado",
        description: "Você saiu da sua conta com sucesso."
      });
    } catch (error) {
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
