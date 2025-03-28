
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample product data (In a real app, you'd fetch this from an API)
const products = [
  {
    id: 1,
    name: "Nav 3000",
    brand: "HP",
    price: 15000,
    stock: 5,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop",
    description: "O Nav 3000 é um laptop de alta performance da HP, perfeito para trabalho e estudo com processador rápido e tela de alta definição."
  },
  {
    id: 2,
    name: "Tivo 3000",
    brand: "Acer",
    price: 35000,
    stock: 3,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop",
    description: "O Tivo 3000 da Acer combina desempenho e preço acessível, ideal para usuários que precisam de um computador confiável para tarefas diárias."
  },
  // ... Incluiria mais produtos aqui
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Find the product based on the ID
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
      variant: "default",
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-century-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-lg" 
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-century-muted mb-4">{product.brand}</p>
            <p className="text-2xl font-bold mb-4">MZN {product.price.toLocaleString()}</p>
            <p className="text-century-primary mb-6">Stock Disponível: {product.stock}</p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <Button 
              className="bg-century-primary hover:bg-green-600 text-white text-lg px-8 py-6"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
