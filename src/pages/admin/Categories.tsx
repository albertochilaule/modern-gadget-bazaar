
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

interface Brand {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

const AdminCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [isDeleteBrandDialogOpen, setIsDeleteBrandDialogOpen] = useState(false);
  
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: 'laptop'
  });
  
  const [brandForm, setBrandForm] = useState({
    name: '',
    description: '',
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('admin-categories');
    const savedBrands = localStorage.getItem('admin-brands');
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Default categories if none exist
      const defaultCategories = [
        { id: '1', name: 'Laptops', description: 'Computadores portáteis e notebooks', icon: 'laptop', productCount: 12 },
        { id: '2', name: 'Desktops', description: 'Computadores de mesa e workstations', icon: 'desktop', productCount: 8 },
        { id: '3', name: 'Acessórios', description: 'Periféricos e acessórios diversos', icon: 'mouse', productCount: 25 },
      ];
      setCategories(defaultCategories);
      localStorage.setItem('admin-categories', JSON.stringify(defaultCategories));
    }
    
    if (savedBrands) {
      setBrands(JSON.parse(savedBrands));
    } else {
      // Default brands if none exist
      const defaultBrands = [
        { id: '1', name: 'Dell', description: 'Computadores e equipamentos Dell', productCount: 15 },
        { id: '2', name: 'Apple', description: 'Produtos Apple', productCount: 8 },
        { id: '3', name: 'Lenovo', description: 'Produtos Lenovo', productCount: 12 },
        { id: '4', name: 'HP', description: 'Produtos HP', productCount: 10 },
      ];
      setBrands(defaultBrands);
      localStorage.setItem('admin-brands', JSON.stringify(defaultBrands));
    }
  }, []);

  // Category CRUD operations
  const addCategory = () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const newCategory = {
      id: currentCategory?.id || Date.now().toString(),
      name: categoryForm.name,
      description: categoryForm.description,
      icon: categoryForm.icon,
      productCount: currentCategory?.productCount || 0,
    };

    if (currentCategory) {
      // Update existing category
      const updatedCategories = categories.map(cat => 
        cat.id === currentCategory.id ? newCategory : cat
      );
      setCategories(updatedCategories);
      localStorage.setItem('admin-categories', JSON.stringify(updatedCategories));
      toast({
        title: "Categoria atualizada",
        description: `A categoria ${newCategory.name} foi atualizada com sucesso`,
      });
    } else {
      // Add new category
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      localStorage.setItem('admin-categories', JSON.stringify(updatedCategories));
      toast({
        title: "Categoria adicionada",
        description: `A categoria ${newCategory.name} foi adicionada com sucesso`,
      });
    }

    setCategoryForm({ name: '', description: '', icon: 'laptop' });
    setCurrentCategory(null);
    setIsCategoryModalOpen(false);
  };

  const editCategory = (category: Category) => {
    setCurrentCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setIsCategoryModalOpen(true);
  };

  const confirmDeleteCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteCategoryDialogOpen(true);
  };

  const deleteCategory = () => {
    if (!currentCategory) return;
    
    const updatedCategories = categories.filter(cat => cat.id !== currentCategory.id);
    setCategories(updatedCategories);
    localStorage.setItem('admin-categories', JSON.stringify(updatedCategories));
    
    toast({
      title: "Categoria removida",
      description: `A categoria ${currentCategory.name} foi removida com sucesso`,
    });
    
    setIsDeleteCategoryDialogOpen(false);
    setCurrentCategory(null);
  };

  // Brand CRUD operations
  const addBrand = () => {
    if (!brandForm.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da marca é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const newBrand = {
      id: currentBrand?.id || Date.now().toString(),
      name: brandForm.name,
      description: brandForm.description,
      productCount: currentBrand?.productCount || 0,
    };

    if (currentBrand) {
      // Update existing brand
      const updatedBrands = brands.map(brand => 
        brand.id === currentBrand.id ? newBrand : brand
      );
      setBrands(updatedBrands);
      localStorage.setItem('admin-brands', JSON.stringify(updatedBrands));
      toast({
        title: "Marca atualizada",
        description: `A marca ${newBrand.name} foi atualizada com sucesso`,
      });
    } else {
      // Add new brand
      const updatedBrands = [...brands, newBrand];
      setBrands(updatedBrands);
      localStorage.setItem('admin-brands', JSON.stringify(updatedBrands));
      toast({
        title: "Marca adicionada",
        description: `A marca ${newBrand.name} foi adicionada com sucesso`,
      });
    }

    setBrandForm({ name: '', description: '' });
    setCurrentBrand(null);
    setIsBrandModalOpen(false);
  };

  const editBrand = (brand: Brand) => {
    setCurrentBrand(brand);
    setBrandForm({
      name: brand.name,
      description: brand.description,
    });
    setIsBrandModalOpen(true);
  };

  const confirmDeleteBrand = (brand: Brand) => {
    setCurrentBrand(brand);
    setIsDeleteBrandDialogOpen(true);
  };

  const deleteBrand = () => {
    if (!currentBrand) return;
    
    const updatedBrands = brands.filter(brand => brand.id !== currentBrand.id);
    setBrands(updatedBrands);
    localStorage.setItem('admin-brands', JSON.stringify(updatedBrands));
    
    toast({
      title: "Marca removida",
      description: `A marca ${currentBrand.name} foi removida com sucesso`,
    });
    
    setIsDeleteBrandDialogOpen(false);
    setCurrentBrand(null);
  };

  const handleCategoryModalOpen = () => {
    setCurrentCategory(null);
    setCategoryForm({ name: '', description: '', icon: 'laptop' });
    setIsCategoryModalOpen(true);
  };

  const handleBrandModalOpen = () => {
    setCurrentBrand(null);
    setBrandForm({ name: '', description: '' });
    setIsBrandModalOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Categories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gerenciamento de Categorias</h1>
          <Button onClick={handleCategoryModalOpen}>
            <Plus className="mr-2 h-4 w-4" /> Nova Categoria
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <Badge>{category.productCount} produtos</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-6">{category.description}</p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDeleteCategory(category)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Brands Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gerenciamento de Marcas</h1>
          <Button onClick={handleBrandModalOpen}>
            <Plus className="mr-2 h-4 w-4" /> Nova Marca
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Card key={brand.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{brand.name}</h3>
                  <Badge>{brand.productCount} produtos</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-6">{brand.description}</p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editBrand(brand)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDeleteBrand(brand)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Nome da categoria"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Descreva a categoria"
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="icon">Ícone</Label>
                <Select
                  value={categoryForm.icon}
                  onValueChange={(value) => setCategoryForm({ ...categoryForm, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                    <SelectItem value="mouse">Acessórios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addCategory}>
              {currentCategory ? 'Salvar Categoria' : 'Adicionar Categoria'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Brand Modal */}
      <Dialog open={isBrandModalOpen} onOpenChange={setIsBrandModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentBrand ? 'Editar Marca' : 'Nova Marca'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="brandName">Nome da Marca</Label>
                <Input
                  id="brandName"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  placeholder="Nome da marca"
                />
              </div>
              <div>
                <Label htmlFor="brandDescription">Descrição</Label>
                <Textarea
                  id="brandDescription"
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  placeholder="Descreva a marca"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBrandModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addBrand}>
              {currentBrand ? 'Salvar Marca' : 'Adicionar Marca'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Category Dialog */}
      <AlertDialog 
        open={isDeleteCategoryDialogOpen} 
        onOpenChange={setIsDeleteCategoryDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{currentCategory?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCategory}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Delete Brand Dialog */}
      <AlertDialog 
        open={isDeleteBrandDialogOpen} 
        onOpenChange={setIsDeleteBrandDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a marca "{currentBrand?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBrand}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;
