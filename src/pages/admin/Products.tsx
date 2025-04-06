
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ShoppingCart, Edit, Trash2, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddProductModal from '@/components/admin/AddProductModal';
import SaleModal from '@/components/admin/SaleModal';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  stock: number;
  status: 'Ativo' | 'Inativo' | 'Estoque Baixo';
  image?: string;
}

const STATUS_COLORS = {
  'Ativo': 'bg-green-500',
  'Inativo': 'bg-gray-500',
  'Estoque Baixo': 'bg-yellow-500'
};

const AdminProducts = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    { id: '#001', name: 'Dell XPS 15', brand: 'Dell', category: 'Laptops', price: 'R$ 4.999,00', stock: 15, status: 'Ativo', image: '/placeholder.svg' },
    { id: '#002', name: 'MacBook Pro M1', brand: 'Apple', category: 'Laptops', price: 'R$ 8.999,00', stock: 8, status: 'Ativo', image: '/placeholder.svg' },
    { id: '#003', name: 'Lenovo ThinkPad X1', brand: 'Lenovo', category: 'Laptops', price: 'R$ 6.999,00', stock: 3, status: 'Estoque Baixo', image: '/placeholder.svg' },
    { id: '#004', name: 'HP Spectre', brand: 'HP', category: 'Laptops', price: 'R$ 7.899,00', stock: 0, status: 'Inativo', image: '/placeholder.svg' },
  ]);

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso."
    });
  };

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newId = `#${String(products.length + 1).padStart(3, '0')}`;
    setProducts([...products, { ...product, id: newId }]);
    setIsAddModalOpen(false);
    toast({
      title: "Produto adicionado",
      description: "O novo produto foi adicionado com sucesso."
    });
  };

  const handleSale = (saleData: any) => {
    // Aqui você implementaria a lógica para registrar a venda
    toast({
      title: "Venda registrada",
      description: `Venda de ${saleData.quantity} unidades para ${saleData.customerName} registrada com sucesso.`
    });
    setIsSaleModalOpen(false);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciamento de Produtos</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
          </Button>
          <Button 
            onClick={() => setIsSaleModalOpen(true)} 
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> VENDA ONLINE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <Input 
            placeholder="Buscar por nome..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <select className="w-full h-10 pl-3 pr-10 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option>Todas as Categorias</option>
            <option>Laptops</option>
            <option>Smartphones</option>
            <option>Acessórios</option>
          </select>
        </div>
        <div>
          <select className="w-full h-10 pl-3 pr-10 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option>Todas as Marcas</option>
            <option>Dell</option>
            <option>Apple</option>
            <option>Lenovo</option>
            <option>HP</option>
          </select>
        </div>
        <div>
          <select className="w-full h-10 pl-3 pr-10 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option>Status</option>
            <option>Ativo</option>
            <option>Inativo</option>
            <option>Estoque Baixo</option>
          </select>
        </div>
        <div>
          <Button className="w-full bg-gray-600 hover:bg-gray-700">
            <Filter className="mr-2 h-4 w-4" /> Filtrar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
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
                  <th className="text-right p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4">{product.id}</td>
                    <td className="p-4">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.brand}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">{product.price}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium text-white ${STATUS_COLORS[product.status]}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-4">
        <div>
          Mostrando 1-{filteredProducts.length} de {filteredProducts.length} produtos
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>&lt;</Button>
          <Button variant="outline" className="bg-green-600 text-white">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">&gt;</Button>
        </div>
      </div>

      {isAddModalOpen && (
        <AddProductModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          onAddProduct={handleAddProduct}
        />
      )}

      {isSaleModalOpen && (
        <SaleModal 
          isOpen={isSaleModalOpen} 
          onClose={() => setIsSaleModalOpen(false)}
          onSale={handleSale}
          products={products}
        />
      )}
    </div>
  );
};

export default AdminProducts;
