
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart } from 'lucide-react';
import AddProductModal from '@/components/admin/AddProductModal';
import SaleModal from '@/components/admin/SaleModal';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductFilters from '@/components/admin/ProductFilters';
import ProductPagination from '@/components/admin/ProductPagination';
import { useProductManagement } from '@/hooks/useProductManagement';
import { Product } from '@/types/product';

const AdminProducts = () => {
  const {
    products,
    isLoading,
    handleDelete,
    handleToggleVisibility,
    handleAddProduct,
    handleEditProduct,
    handleSale
  } = useProductManagement();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('');
  
  const categories = [...new Set(products.map(product => product.category))];
  const brands = [...new Set(products.map(product => product.brand))];

  const openEditModal = (product: Product) => {
    const productWithStringPrice = {
      ...product,
      price: String(product.price)
    };
    
    setEditProduct(productWithStringPrice);
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
        product.id.toString().toLowerCase().includes(query)
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
  
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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

      <ProductFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        visibilityFilter={visibilityFilter}
        setVisibilityFilter={setVisibilityFilter}
        handleResetFilters={handleResetFilters}
        categories={categories}
        brands={brands}
      />

      <Card>
        <CardContent className="p-0">
          <ProductsTable 
            products={currentProducts}
            isLoading={isLoading}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
          />
        </CardContent>
      </Card>

      <ProductPagination 
        totalItems={filteredProducts.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
      />

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
