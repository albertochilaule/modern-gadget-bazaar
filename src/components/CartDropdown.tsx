
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Trash2 } from 'lucide-react';

const CartDropdown = () => {
  const { cartItems, removeFromCart, getTotalPrice, getShippingFee, userLocation } = useCart();
  const shippingFee = getShippingFee();
  const subtotal = getTotalPrice();
  const total = subtotal + shippingFee;

  // Helper function to format prices consistently
  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^\d.-]/g, ''))
      : price;
    return numericPrice.toLocaleString();
  };

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
                  <p className="text-sm text-century-muted">MZN {formatPrice(item.price)}</p>
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
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Subtotal:</span>
            <span className="text-sm">MZN {formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <MapPin className="mr-1" size={12} />
              <span className="text-xs text-gray-500">Entrega {userLocation.province}:</span>
            </div>
            <span className={`text-sm ${userLocation.isMaputo ? "text-green-600" : ""}`}>
              {userLocation.isMaputo ? 'Grátis' : `MZN ${formatPrice(shippingFee)}`}
            </span>
          </div>
          
          <div className="flex justify-between my-2 pt-2 border-t border-gray-100">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">MZN {formatPrice(total)}</span>
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
