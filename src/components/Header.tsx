
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, UserPlus, LogOut, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CartDropdown from './CartDropdown';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [showCart, setShowCart] = useState(false);
  const { cartItems } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="bg-century-dark text-white py-3">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-white no-underline">
            <div className="flex items-center">
              <span className="text-xl font-bold">Century Tech</span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                className="text-white"
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="h-5 w-5 mr-1" />
                <span className="absolute -top-2 -right-2 bg-century-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              </Button>
              {showCart && <CartDropdown />}
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm hidden md:inline">Olá, {user?.name}</span>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" className="text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-century-dark" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-century-dark">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button className="bg-century-primary hover:bg-green-600 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastre-se
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
