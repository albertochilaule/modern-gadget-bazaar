
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import PaymentModal from "@/components/payment/PaymentModal";
import { useToast } from "@/hooks/use-toast";
import { generateTransactionReference } from "@/services/mpesaService";

const Cart = () => {
  const { cartItems, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [transactionReference, setTransactionReference] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Helper function to format prices consistently
  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^\d.-]/g, ''))
      : price;
    return numericPrice.toLocaleString();
  };
  
  const handleCheckout = () => {
    // Generate a transaction reference
    setTransactionReference(generateTransactionReference());
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentSuccess = () => {
    // Close the modal
    setIsPaymentModalOpen(false);
    
    // Show success toast
    toast({
      title: "Pagamento bem-sucedido",
      description: "Seu pedido foi processado com sucesso!",
      variant: "success",
    });
    
    // Clear cart
    clearCart();
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione alguns produtos para continuar comprando</p>
            <Link to="/">
              <Button className="bg-century-primary hover:bg-green-600">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded" />
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          MZN {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between mt-6">
                <Link to="/">
                  <Button variant="outline" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Continuar Comprando
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="text-red-500 border-red-500 hover:bg-red-50" 
                  onClick={clearCart}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Limpar Carrinho
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span>MZN {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Entrega</span>
                    <span className="text-century-primary">Grátis</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>MZN {getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-century-primary hover:bg-green-600"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={getTotalPrice()}
        onSuccess={handlePaymentSuccess}
        reference={transactionReference}
      />
    </div>
  );
};

export default Cart;
