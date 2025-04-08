
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (product: Product) => void;
}

const STATUS_COLORS = {
  'Ativo': 'bg-green-500',
  'Inativo': 'bg-gray-500',
  'Estoque Baixo': 'bg-yellow-500'
};

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  onToggleVisibility
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Imagem</th>
            <th className="text-left p-4">Nome</th>
            <th className="text-left p-4">Marca</th>
            <th className="text-left p-4">Categoria</th>
            <th className="text-left p-4">Preço</th>
            <th className="text-left p-4">Estoque</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Visibilidade</th>
            <th className="text-right p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="p-4 text-center">
                Carregando produtos...
              </td>
            </tr>
          ) : products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4">{typeof product.id === 'string' && product.id.length > 10 ? product.id.substring(0, 8) + '...' : product.id}</td>
                <td className="p-4">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.brand}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">
                  {typeof product.price === 'number' 
                    ? `R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` 
                    : product.price}
                </td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${STATUS_COLORS[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`flex items-center ${product.isPublished ? 'text-green-600' : 'text-gray-500'}`}
                    onClick={() => onToggleVisibility(product)}
                  >
                    {product.isPublished ? (
                      <>
                        <Eye className="h-4 w-4 mr-1" /> Publicado
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" /> Oculto
                      </>
                    )}
                  </Button>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="p-4 text-center text-gray-500">
                Nenhum produto encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
