import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utils/supabaseClient';

// Update the User interface to include phone and avatar
export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string; // Add this property
  avatar?: string; // Add this property
  role?: 'admin' | 'colaborador' | 'cliente';
}

// Update the context type to include updateUserData
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  updateUserData: (userData: Partial<User>) => void; // Add this method
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => ({ success: false }),
  loading: true,
  updateUserData: () => {}, // Add default implementation
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          return { success: false, error: profileError.message };
        }

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: profileData?.name || '',
          role: profileData?.role || 'cliente',
          phone: profileData?.phone || '',
          avatar: profileData?.avatar || '',
        });
      }
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            name: name,
            email: email,
            role: 'cliente',
            status: 'ativo',
          },
        ]);

        if (profileError) {
          console.error('Error creating profile:', profileError.message);
          return { success: false, error: profileError.message };
        }

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          role: 'cliente',
        });
      }
      return { success: true };
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      }
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError.message);
          }

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profileData?.name || '',
            role: profileData?.role || 'cliente',
            phone: profileData?.phone || '',
            avatar: profileData?.avatar || '',
          });
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const fetchProfile = async () => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching profile:', profileError.message);
            }

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profileData?.name || '',
              role: profileData?.role || 'cliente',
              phone: profileData?.phone || '',
              avatar: profileData?.avatar || '',
            });
          } catch (error) {
            console.error('Error fetching profile after sign-in:', error);
          }
        };
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
  }, []);

  // Add this function to update user data
  const updateUserData = (userData: Partial<User>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      return { ...currentUser, ...userData };
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      register, 
      loading,
      updateUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
