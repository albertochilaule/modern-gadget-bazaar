import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { useAuth } from '@/hooks/useAuth';
import { determineStatus } from '@/types/product';

export interface ProductsSectionProps {
  products: Product[];
  title: string;
  isLoading?: boolean;
  onProductsChange?: () => void;
}

const ProductsSection = ({ products, title, isLoading = false, onProductsChange }: ProductsSectionProps) => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: 0,
    description: '',
    image: '/placeholder.svg',
    isPublished: true
  });

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'stock' ? parseInt(value) || 0 : value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category: '',
      price: '',
      stock: 0,
      description: '',
      image: '/placeholder.svg',
      isPublished: true
    });
    setSelectedProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: typeof product.price === 'number' ? product.price.toString() : product.price,
      stock: product.stock,
      description: product.description || '',
      image: product.image || '/placeholder.svg',
      isPublished: product.isPublished
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: formData.price,
        stock: formData.stock,
        status: determineStatus(formData.stock),
        description: formData.description,
        image: formData.image,
        isPublished: formData.isPublished
      };

      await createProduct(newProduct);
      
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso!"
      });
      
      setIsAddModalOpen(false);
      resetForm();
      if (onProductsChange) onProductsChange();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto.",
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const updatedProduct = {
        ...selectedProduct,
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: formData.price,
        stock: formData.stock,
        description: formData.description,
        image: formData.image,
        isPublished: formData.isPublished
      };

      await updateProduct(selectedProduct.id, updatedProduct);
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso!"
      });
      
      setIsEditModalOpen(false);
      resetForm();
      if (onProductsChange) onProductsChange();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteProduct(selectedProduct.id);
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso!"
      });
      
      setIsDeleteModalOpen(false);
      resetForm();
      if (onProductsChange) onProductsChange();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {(user && isAdmin) && (
            <Button onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
            </Button>
          )}
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {(user && isAdmin) && (
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            {(user && isAdmin) && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="secondary"
                  className="w-8 h-8 rounded-full bg-white shadow-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openEditModal(product);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="destructive"
                  className="w-8 h-8 rounded-full bg-white shadow-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openDeleteModal(product);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nome do produto" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Marca" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="Nova Categoria">Nova Categoria</SelectItem>
                  </SelectContent>
                </Select>
                {formData.category === "Nova Categoria" && (
                  <Input 
                    className="mt-2" 
                    placeholder="Digite a nova categoria" 
                    value={formData.category === "Nova Categoria" ? "" : formData.category}
                    onChange={(e) => handleSelectChange('category', e.target.value)}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Select name="brand" value={formData.brand} onValueChange={(value) => handleSelectChange('brand', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                    <SelectItem value="Nova Marca">Nova Marca</SelectItem>
                  </SelectContent>
                </Select>
                {formData.brand === "Nova Marca" && (
                  <Input 
                    className="mt-2" 
                    placeholder="Digite a nova marca" 
                    value={formData.brand === "Nova Marca" ? "" : formData.brand}
                    onChange={(e) => handleSelectChange('brand', e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input 
                  id="price" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                  placeholder="0.00" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Estoque</Label>
                <Input 
                  id="stock" 
                  name="stock" 
                  type="number" 
                  value={formData.stock} 
                  onChange={handleNumberChange} 
                  placeholder="0" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="Descrição do produto" 
                rows={3} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input 
                id="image" 
                name="image" 
                value={formData.image} 
                onChange={handleInputChange} 
                placeholder="URL da imagem" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddProduct}>Adicionar Produto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-brand">Marca</Label>
                <Input id="edit-brand" name="brand" value={formData.brand} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Input id="edit-category" name="category" value={formData.category} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Preço</Label>
                <Input id="edit-price" name="price" value={formData.price} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Estoque</Label>
                <Input id="edit-stock" name="stock" type="number" value={formData.stock} onChange={handleNumberChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea id="edit-description" name="description" value={formData.description} onChange={handleInputChange} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">URL da Imagem</Label>
              <Input id="edit-image" name="image" value={formData.image} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditProduct}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja excluir o produto "{selectedProduct?.name}"?</p>
            <p className="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsSection;
