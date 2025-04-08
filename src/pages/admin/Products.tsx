import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ShoppingCart, Edit, Trash2, Filter, Search, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddProductModal from '@/components/admin/AddProductModal';
import SaleModal from '@/components/admin/SaleModal';
import { supabase } from '@/utils/supabaseClient';
import { Product as ProductCardProduct } from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  stock: number;
  status: 'Ativo' | 'Inativo' | 'Estoque Baixo';
  isPublished: boolean;
  is_published?: boolean;
  image?: string;
  processor?: string;
  memory?: string;
  storage?: string;
  screenSize?: string;
  screen_size?: string;
  operatingSystem?: string;
  operating_system?: string;
  graphics?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  
  const [products, setProducts] = useState<Product[]>([]);
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price.toString(),
          stock: product.stock,
          status: determineStatus(product.stock),
          isPublished: product.is_published,
          image: product.image || '/placeholder.svg',
          processor: product.processor,
          memory: product.memory,
          storage: product.storage,
          screenSize: product.screen_size,
          operatingSystem: product.operating_system,
          graphics: product.graphics
        }));
        
        setProducts(formattedProducts);
        localStorage.setItem('adminProducts', JSON.stringify(formattedProducts));
      } else {
        const stored = localStorage.getItem('adminProducts');
        if (stored) {
          setProducts(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Erro ao carregar produtos',
        description: 'Não foi possível carregar os produtos. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      
      const stored = localStorage.getItem('adminProducts');
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const determineStatus = (stock: number): 'Ativo' | 'Inativo' | 'Estoque Baixo' => {
    if (stock === 0) return 'Inativo';
    if (stock <= 3) return 'Estoque Baixo';
    return 'Ativo';
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('');
  
  const categories = [...new Set(products.map(product => product.category))];
  const brands = [...new Set(products.map(product => product.brand))];

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .match({ id });
          
        if (error) throw error;
        
        setProducts(products.filter(product => product.id !== id));
        localStorage.setItem('adminProducts', JSON.stringify(products.filter(product => product.id !== id)));
        
        toast({
          title: "Produto removido",
          description: "O produto foi removido com sucesso."
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Erro ao excluir produto',
          description: 'Não foi possível excluir o produto. Tente novamente mais tarde.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      const newIsPublished = !product.isPublished;
      
      const { error } = await supabase
        .from('products')
        .update({ is_published: newIsPublished })
        .match({ id: product.id });
        
      if (error) throw error;
      
      const updatedProducts = products.map(p => 
        p.id === product.id ? { ...p, isPublished: newIsPublished } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      
      toast({
        title: product.isPublished ? "Produto ocultado" : "Produto publicado",
        description: `O produto foi ${product.isPublished ? 'ocultado do' : 'publicado para o'} público com sucesso.`,
        variant: "success"
      });
    } catch (error) {
      console.error('Error updating product visibility:', error);
      toast({
        title: 'Erro ao alterar visibilidade',
        description: 'Não foi possível alterar a visibilidade do produto. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    }
  };

  const handleAddProduct = async (product: Omit<Product, 'id' | 'status'>) => {
    try {
      const status = determineStatus(product.stock);
      
      const supabaseData = {
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: Number(product.price),
        stock: product.stock,
        is_published: product.is_published !== undefined ? product.is_published : true,
        image: product.image,
        processor: product.processor,
        memory: product.memory,
        storage: product.storage,
        screen_size: product.screenSize || product.screen_size,
        operating_system: product.operatingSystem || product.operating_system,
        graphics: product.graphics
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(supabaseData)
        .select('*')
        .single();
        
      if (error) throw error;
      
      if (!data) {
        throw new Error('No data returned from insert operation');
      }
      
      const newProduct: Product = {
        id: data.id,
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: data.price.toString(),
        stock: data.stock,
        status,
        isPublished: data.is_published,
        image: data.image || '/placeholder.svg',
        processor: data.processor,
        memory: data.memory,
        storage: data.storage,
        screenSize: data.screen_size,
        operatingSystem: data.operating_system,
        graphics: data.graphics
      };
      
      setProducts([...products, newProduct]);
      localStorage.setItem('adminProducts', JSON.stringify([...products, newProduct]));
      
      setIsAddModalOpen(false);
      toast({
        title: "Produto adicionado",
        description: "O novo produto foi adicionado com sucesso."
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Erro ao adicionar produto',
        description: 'Não foi possível adicionar o produto. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    }
  };
  
  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const status = determineStatus(updatedProduct.stock);
      
      const supabaseData = {
        name: updatedProduct.name,
        brand: updatedProduct.brand,
        category: updatedProduct.category,
        price: Number(updatedProduct.price),
        stock: updatedProduct.stock,
        is_published: updatedProduct.isPublished,
        image: updatedProduct.image,
        processor: updatedProduct.processor,
        memory: updatedProduct.memory,
        storage: updatedProduct.storage,
        screen_size: updatedProduct.screenSize || updatedProduct.screen_size,
        operating_system: updatedProduct.operatingSystem || updatedProduct.operating_system,
        graphics: updatedProduct.graphics
      };
      
      const { error } = await supabase
        .from('products')
        .update(supabaseData)
        .match({ id: updatedProduct.id });
        
      if (error) throw error;
      
      const productWithStatus = {
        ...updatedProduct,
        status
      };
      
      setProducts(products.map(product => 
        product.id === updatedProduct.id ? productWithStatus : product
      ));
      
      localStorage.setItem('adminProducts', JSON.stringify(
        products.map(product => product.id === updatedProduct.id ? productWithStatus : product)
      ));
      
      setIsEditModalOpen(false);
      setEditProduct(null);
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Erro ao atualizar produto',
        description: 'Não foi possível atualizar o produto. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    }
  };

  const handleSale = async (saleData: any) => {
    try {
      const productIndex = products.findIndex(p => p.id === saleData.productId);
      if (productIndex >= 0) {
        const newStock = Math.max(0, products[productIndex].stock - saleData.quantity);
        const newStatus = determineStatus(newStock);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .match({ id: saleData.productId });
          
        if (updateError) throw updateError;
        
        const { error: saleError } = await supabase
          .from('sales')
          .insert({
            product_id: saleData.productId,
            customer_name: saleData.customerName,
            quantity: saleData.quantity,
            total_price: saleData.totalPrice || Number(products[productIndex].price) * saleData.quantity,
            created_by: (await supabase.auth.getUser()).data.user?.id
          });
          
        if (saleError) throw saleError;
        
        const updatedProducts = [...products];
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          stock: newStock,
          status: newStatus
        };
        
        setProducts(updatedProducts);
        
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        
        toast({
          title: "Venda registrada",
          description: `Venda de ${saleData.quantity} unidades para ${saleData.customerName} registrada com sucesso.`
        });
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      toast({
        title: 'Erro ao registrar venda',
        description: 'Não foi possível registrar a venda. Tente novamente mais tarde.',
        variant: 'destructive'
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
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    if (brandFilter) {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }
    
    if (statusFilter) {
      filtered = filtered.filter(product => product.status === statusFilter);
    }
    
    if (visibilityFilter) {
      filtered = filtered.filter(product => 
        (visibilityFilter === 'published' && product.isPublished) || 
        (visibilityFilter === 'hidden' && !product.isPublished)
      );
    }
    
    return filtered;
  };
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setBrandFilter('');
    setStatusFilter('');
    setVisibilityFilter('');
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
        <div className="grid grid-cols-2 gap-2">
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
          
          <select 
            className="w-full h-10 pl-3 pr-10 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
          >
            <option value="">Toda Visibilidade</option>
            <option value="published">Publicado</option>
            <option value="hidden">Oculto</option>
          </select>
        </div>
        <div className="flex gap-2 md:col-span-5">
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
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
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
                          onClick={() => handleToggleVisibility(product)}
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
                    <td colSpan={10} className="p-4 text-center text-gray-500">
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

      {isAddModalOpen && (
        <AddProductModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          onAddProduct={handleAddProduct}
        />
      )}

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
