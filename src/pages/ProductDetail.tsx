
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Plus, 
  Minus,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '@/components/ProductCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
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
              image: foundProduct.image || '/placeholder.svg',
              category: foundProduct.category,
              description: foundProduct.description || ''
            };
            setProduct(formattedProduct);
            
            // Find related products (same category)
            const sameCategory = allProducts
              .filter((p: any) => 
                p.id.toString() !== id?.toString() && 
                p.category === foundProduct.category && 
                p.isPublished
              )
              .slice(0, 4)
              .map((p: any) => ({
                id: p.id,
                name: p.name,
                brand: p.brand,
                price: typeof p.price === 'string' ? parseFloat(p.price.replace(/[^\d.-]/g, '')) : p.price,
                stock: p.stock,
                image: p.image || '/placeholder.svg',
                category: p.category
              }));
              
            setRelatedProducts(sameCategory);
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
      
      // Add the product with selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(productWithNumericPrice);
      }
      
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
        variant: "default",
      });
    }
  };
  
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Helper function to format price display
  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^\d.-]/g, ''))
      : price;
    return numericPrice.toLocaleString('pt-BR');
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
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Início</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <Link to="/" className="text-gray-500 hover:text-gray-700">Produtos</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-900">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-sm" 
            />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-1">{product.name}</h1>
            <p className="text-gray-600 mb-2">Código: {product.id}</p>
            
            {/* Status Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Em Estoque
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-green-700">
                R$ {formatPrice(product.price)}
              </p>
              <p className="text-sm text-gray-500">
                ou 10x de R$ {(Number(product.price) / 10).toLocaleString('pt-BR', {minimumFractionDigits: 2})} sem juros
              </p>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700">
                {product.description || `O ${product.name} é um laptop premium com tela de 15.6 polegadas, processador Intel Core i7, 16GB de RAM e SSD de 512GB. Perfeito para profissionais e criadores de conteúdo.`}
              </p>
            </div>
            
            {/* Specifications */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Especificações</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2">
                    <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  </span>
                  Processador: Intel Core i7 12ª geração
                </li>
                <li className="flex items-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2">
                    <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  </span>
                  Memória: 16GB DDR4
                </li>
                <li className="flex items-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2">
                    <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  </span>
                  Armazenamento: SSD 512GB
                </li>
                <li className="flex items-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2">
                    <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  </span>
                  Tela: 15.6" Full HD
                </li>
                <li className="flex items-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2">
                    <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  </span>
                  Bateria: 60Wh
                </li>
              </ul>
            </div>
            
            {/* Quantity selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Quantidade</h3>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={product.stock <= quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-green-700 hover:bg-green-800 text-white text-lg py-6 flex-1"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                Adicionar ao Carrinho
              </Button>
              
              <Button 
                variant="outline"
                className="border-green-700 text-green-700 hover:bg-green-50 text-lg py-6"
              >
                <Heart className="mr-2 h-5 w-5" /> 
                Adicionar aos Favoritos
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descrição Detalhada</TabsTrigger>
              <TabsTrigger value="specifications">Especificações Técnicas</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-6 border rounded-md mt-2">
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold mb-4">Sobre o {product.name}</h3>
                <p className="mb-4">
                  O {product.name} é um laptop premium que oferece o equilíbrio perfeito entre desempenho e portabilidade. 
                  Com seu design elegante e construção premium, ele é a escolha ideal para profissionais que precisam de um 
                  computador confiável e poderoso.
                </p>
                <p>
                  Equipado com a mais recente tecnologia Intel e uma tela de alta resolução, o {product.name} oferece uma 
                  experiência de computação excepcional. Seu teclado confortável e touchpad preciso tornam a digitação e 
                  navegação uma experiência agradável.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="p-6 border rounded-md mt-2">
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Especificações Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Processador</h4>
                    <p>Intel Core i7 12ª geração</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Memória</h4>
                    <p>16GB DDR4 (expansível até 32GB)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Armazenamento</h4>
                    <p>SSD 512GB NVMe</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Placa de Vídeo</h4>
                    <p>Intel Iris Xe Graphics</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tela</h4>
                    <p>15.6" Full HD (1920 x 1080) Anti-reflexo</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Sistema Operacional</h4>
                    <p>Windows 11 Home</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Bateria</h4>
                    <p>60Wh (até 10 horas de uso)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Peso</h4>
                    <p>1.8 kg</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="p-6 border rounded-md mt-2">
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma avaliação disponível para este produto.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
