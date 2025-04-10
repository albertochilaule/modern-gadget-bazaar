
import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  app_metadata?: any;
  user_metadata?: any;
  aud?: string;
  created_at?: string;
}

export type ExtendedUser = User;

interface AuthContextType {
  user: ExtendedUser | null;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for local authentication
const MOCK_USERS = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@centurytech.com',
    password: 'senha123',
    role: 'admin',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Colaborador',
    email: 'colaborador@centurytech.com',
    password: 'senha123',
    role: 'colaborador',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString()
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Check if user data exists in local storage
  const getUserFromStorage = (): ExtendedUser | null => {
    const userJson = localStorage.getItem('auth_user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Failed to parse user data from localStorage');
        return null;
      }
    }
    return null;
  };

  const [user, setUser] = useState<ExtendedUser | null>(getUserFromStorage);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Find user with matching email
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      // Check if user exists and password matches
      if (foundUser && foundUser.password === password) {
        // Create user object without the password
        const { password: _, ...userWithoutPassword } = foundUser;
        
        // Save user to local storage
        localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
        
        // Update state
        setUser(userWithoutPassword as ExtendedUser);
        
        return {
          success: true,
          message: 'Login bem-sucedido!'
        };
      }
      
      return {
        success: false,
        message: 'Email ou senha inválidos'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Erro ao fazer login'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove user data from local storage
    localStorage.removeItem('auth_user');
    
    // Update state
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
