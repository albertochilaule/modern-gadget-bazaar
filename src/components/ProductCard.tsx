
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
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
      variant: "default",
    });
  };

  // Helper to convert price to number if it's a string
  const displayPrice = typeof product.price === 'string' 
    ? parseInt(product.price.replace(/\D/g, '')) 
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
          >
            <ShoppingCart className="h-4 w-4 mr-1" /> Comprar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
