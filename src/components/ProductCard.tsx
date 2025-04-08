
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/hooks/useCart';
import { useToast } from "@/hooks/use-toast";
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
      variant: "default",
    });
  };

  const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^\d.-]/g, ''))
      : price;
    return numericPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Link to={`/produto/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:translate-y-[-4px]">
        <div className="relative aspect-video bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              size="icon" 
              className="rounded-full bg-black/70 hover:bg-black text-white w-8 h-8"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                Indisponível
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h3 className="font-medium mb-2 line-clamp-2 h-12">{product.name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-green-700">
              {formatPrice(product.price)}
            </p>
            {product.stock > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
