import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utils/supabaseClient';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

// Update the AuthContextType to include isAdmin and isCollaborator properties
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData?: (data: any) => Promise<void>;
  isAdmin: boolean;  // Add this property
  isCollaborator: boolean; // Add this property
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Determine user roles based on their data
  const isAdmin = user?.role === 'admin';
  const isCollaborator = user?.role === 'colaborador';

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select(`name, email, phone, role, created_at, updated_at`)
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile.name || '',
            role: profile.role || 'cliente',
            phone: profile.phone || '',
            created_at: profile.created_at || '',
            updated_at: profile.updated_at || ''
          });
        }
      }
      setLoading(false);
    };

    getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select(`name, email, phone, role, created_at, updated_at`)
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile.name || '',
            role: profile.role || 'cliente',
            phone: profile.phone || '',
            created_at: profile.created_at || '',
            updated_at: profile.updated_at || ''
          });
        }
      } else {
        setUser(null);
      }
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select(`name, email, phone, role, created_at, updated_at`)
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: profile.name || '',
            role: profile.role || 'cliente',
            phone: profile.phone || '',
            created_at: profile.created_at || '',
            updated_at: profile.updated_at || ''
          });
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            email: email,
            phone: '',
            role: 'cliente',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: name,
              email: email,
              phone: '',
              role: 'cliente',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
          ]);

        if (profileError) {
          throw profileError;
        }

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          role: 'cliente',
          phone: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      console.error("Signout error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      setUser({ ...user!, ...data });
    } catch (error: any) {
      console.error("Update user data error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateUserData,
      isAdmin,
      isCollaborator
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
