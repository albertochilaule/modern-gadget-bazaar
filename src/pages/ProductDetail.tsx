
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '@/components/ProductCard';
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProduct = () => {
      setLoading(true);
      try {
        // Get products from localStorage
        const storedProducts = localStorage.getItem('adminProducts');
        if (storedProducts) {
          const allProducts = JSON.parse(storedProducts);
          // Find the product with matching ID
          const foundProduct = allProducts.find((p: any) => p.id.toString() === id?.toString());
          
          if (foundProduct) {
            // Format the product to match our Product interface
            const formattedProduct: Product = {
              id: foundProduct.id,
              name: foundProduct.name,
              brand: foundProduct.brand,
              price: typeof foundProduct.price === 'string' 
                ? parseFloat(foundProduct.price.replace(/[^\d.-]/g, '')) 
                : foundProduct.price,
              stock: foundProduct.stock,
              image: foundProduct.image || '/placeholder.svg'
            };
            setProduct(formattedProduct);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      // Format price as number to ensure consistency
      const productWithNumericPrice = {
        ...product,
        price: typeof product.price === 'string' 
          ? parseFloat(product.price.replace(/[^\d.-]/g, ''))
          : product.price
      };
      
      addToCart(productWithNumericPrice);
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
        variant: "default",
      });
    }
  };
  
  // Helper function to format price display
  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^\d.-]/g, ''))
      : price;
    return numericPrice.toLocaleString();
  };
  
  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Link to="/" className="inline-flex items-center text-century-primary hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="w-3/4 h-8" />
              <Skeleton className="w-1/2 h-6" />
              <Skeleton className="w-1/4 h-8" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-1/2 h-12" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
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
            <p className="text-2xl font-bold mb-4">MZN {formatPrice(product.price)}</p>
            <p className="text-century-primary mb-6">Stock Disponível: {product.stock}</p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700">
                {product.description || `${product.name} é um produto de alta qualidade da marca ${product.brand}, ideal para suas necessidades diárias.`}
              </p>
            </div>
            
            <Button 
              className="bg-century-primary hover:bg-green-600 text-white text-lg px-8 py-6"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> 
              {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Sem Stock'}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
