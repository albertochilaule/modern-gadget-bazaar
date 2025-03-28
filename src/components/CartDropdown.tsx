
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from 'lucide-react';

const CartDropdown = () => {
  const { cartItems, removeFromCart, getTotalPrice } = useCart();

  return (
    <div className="absolute top-10 right-0 z-50 bg-white text-black rounded-md shadow-lg w-72 border border-gray-200">
      <div className="p-3 border-b border-gray-200">
        <h5 className="font-semibold">Carrinho ({cartItems.length})</h5>
      </div>
      
      <ScrollArea className="h-64">
        {cartItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Seu carrinho está vazio
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="p-3 border-b border-gray-100 flex items-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded mr-3" 
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-sm text-century-muted">MZN {item.price.toLocaleString()}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 h-8 w-8"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      {cartItems.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex justify-between my-2">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">MZN {getTotalPrice().toLocaleString()}</span>
          </div>
          
          <Link to="/carrinho">
            <Button className="w-full bg-century-primary hover:bg-green-600">
              Ver Carrinho
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
