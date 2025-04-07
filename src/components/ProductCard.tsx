
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: number | string;
  name: string;
  brand: string;
  price: number | string;
  stock: number;
  image: string;
  isPublished?: boolean;
  category?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    // For consistency, ensure product has a numeric price before adding to cart
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
  };

  // Helper to convert price to number if it's a string
  const displayPrice = typeof product.price === 'string' 
    ? parseFloat(product.price.replace(/[^\d.-]/g, '')) 
    : product.price;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h5 className="font-bold text-lg">{product.name}</h5>
        <p className="text-century-muted mb-1">{product.brand}</p>
        {product.category && (
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        )}
        <p className="font-bold text-lg mb-1">
          MZN {typeof displayPrice === 'number' ? displayPrice.toLocaleString() : displayPrice}
        </p>
        <p className="text-century-primary mb-3">Stock Disponível: {product.stock}</p>
        
        <div className="flex justify-between mt-3">
          <Link to={`/produto/${product.id}`}>
            <Button variant="outline" className="flex items-center">
              <Eye className="h-4 w-4 mr-1" /> Ver
            </Button>
          </Link>
          <Button 
            className="bg-century-primary hover:bg-green-600 text-white flex items-center"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-1" /> 
            {product.stock > 0 ? 'Comprar' : 'Sem Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
