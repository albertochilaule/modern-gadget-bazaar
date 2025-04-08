
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  visibilityFilter: string;
  setVisibilityFilter: (visibility: string) => void;
  handleResetFilters: () => void;
  categories: string[];
  brands: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  brandFilter,
  setBrandFilter,
  statusFilter,
  setStatusFilter,
  visibilityFilter,
  setVisibilityFilter,
  handleResetFilters,
  categories,
  brands
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default ProductFilters;
