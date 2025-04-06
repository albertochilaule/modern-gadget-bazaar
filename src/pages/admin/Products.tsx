
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ShoppingCart, Edit, Trash2, Filter, Search } from 'lucide-react';
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
  processor?: string;
  memory?: string;
  storage?: string;
  screenSize?: string;
  operatingSystem?: string;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([
    { id: '#001', name: 'Dell XPS 15', brand: 'Dell', category: 'Laptops', price: 'R$ 4.999,00', stock: 15, status: 'Ativo', image: '/placeholder.svg', processor: 'Intel i7', memory: '16GB', storage: '512GB SSD', screenSize: '15.6"', operatingSystem: 'Windows 11' },
    { id: '#002', name: 'MacBook Pro M1', brand: 'Apple', category: 'Laptops', price: 'R$ 8.999,00', stock: 8, status: 'Ativo', image: '/placeholder.svg', processor: 'Apple M1', memory: '8GB', storage: '256GB SSD', screenSize: '13.3"', operatingSystem: 'macOS' },
    { id: '#003', name: 'Lenovo ThinkPad X1', brand: 'Lenovo', category: 'Laptops', price: 'R$ 6.999,00', stock: 3, status: 'Estoque Baixo', image: '/placeholder.svg', processor: 'Intel i5', memory: '8GB', storage: '256GB SSD', screenSize: '14"', operatingSystem: 'Windows 10' },
    { id: '#004', name: 'HP Spectre', brand: 'HP', category: 'Laptops', price: 'R$ 7.899,00', stock: 0, status: 'Inativo', image: '/placeholder.svg', processor: 'Intel i7', memory: '16GB', storage: '1TB SSD', screenSize: '13.5"', operatingSystem: 'Windows 11' },
    { id: '#005', name: 'Samsung Galaxy S21', brand: 'Samsung', category: 'Smartphones', price: 'R$ 3.999,00', stock: 12, status: 'Ativo', image: '/placeholder.svg', processor: 'Exynos 2100', memory: '8GB', storage: '128GB', screenSize: '6.2"', operatingSystem: 'Android 11' },
    { id: '#006', name: 'iPhone 13', brand: 'Apple', category: 'Smartphones', price: 'R$ 5.999,00', stock: 7, status: 'Ativo', image: '/placeholder.svg', processor: 'A15 Bionic', memory: '4GB', storage: '128GB', screenSize: '6.1"', operatingSystem: 'iOS 15' },
  ]);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Extract unique categories and brands for filters
  const categories = [...new Set(products.map(product => product.category))];
  const brands = [...new Set(products.map(product => product.brand))];

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: "Produto removido",
        description: "O produto foi removido com sucesso."
      });
    }
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
  
  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    setIsEditModalOpen(false);
    setEditProduct(null);
    toast({
      title: "Produto atualizado",
      description: "O produto foi atualizado com sucesso."
    });
  };

  const handleSale = (saleData: any) => {
    // Find the product being sold
    const productIndex = products.findIndex(p => p.id === saleData.productId);
    if (productIndex >= 0) {
      // Create a copy of the products array
      const updatedProducts = [...products];
      // Subtract the sold quantity from the product's stock
      const newStock = Math.max(0, updatedProducts[productIndex].stock - saleData.quantity);
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        stock: newStock,
        // Update status if stock is low or depleted
        status: newStock === 0 ? 'Inativo' : newStock <= 3 ? 'Estoque Baixo' : 'Ativo'
      };
      
      setProducts(updatedProducts);
      
      toast({
        title: "Venda registrada",
        description: `Venda de ${saleData.quantity} unidades para ${saleData.customerName} registrada com sucesso.`
      });
    }
    setIsSaleModalOpen(false);
  };
  
  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const applyFilters = () => {
    let filtered = [...products];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Apply brand filter
    if (brandFilter) {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(product => product.status === statusFilter);
    }
    
    return filtered;
  };
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setBrandFilter('');
    setStatusFilter('');
  };

  const filteredProducts = applyFilters();

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
            <ShoppingCart className="mr-2 h-4 w-4" /> VENDA OFFLINE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input 
              className="pl-10"
              placeholder="Buscar produtos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <select 
            className="w-full h-10 pl-3 pr-10 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <select 
            className="w-full h-10 pl-3 pr-10 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">Todas as Marcas</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div>
          <select 
            className="w-full h-10 pl-3 pr-10 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Estoque Baixo">Estoque Baixo</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button 
            className="w-full bg-gray-600 hover:bg-gray-700"
            onClick={handleResetFilters}
          >
            <Filter className="mr-2 h-4 w-4" /> Limpar Filtros
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
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                          onClick={() => openEditModal(product)}
                        >
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-500">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                )}
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AddProductModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          onAddProduct={handleAddProduct}
        />
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editProduct && (
        <AddProductModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setEditProduct(null);
          }}
          onAddProduct={handleEditProduct}
          editProduct={editProduct}
        />
      )}

      {/* Sale Modal */}
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
