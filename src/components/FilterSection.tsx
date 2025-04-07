
import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterSectionProps {
  brands: string[];
  categories: string[];
  maxPrice: number;
  onFilterChange: (filters: {
    priceRange: [number, number];
    selectedBrands: string[];
    selectedCategories: string[];
  }) => void;
}

const FilterSection = ({ brands, categories, maxPrice, onFilterChange }: FilterSectionProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handlePriceChange = (value: number[]) => {
    const newPriceRange: [number, number] = [value[0], value[1]];
    setPriceRange(newPriceRange);
    updateFilters(newPriceRange, selectedBrands, selectedCategories);
  };

  const handleBrandToggle = (brand: string) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    
    setSelectedBrands(updatedBrands);
    updateFilters(priceRange, updatedBrands, selectedCategories);
  };

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    updateFilters(priceRange, selectedBrands, updatedCategories);
  };

  const updateFilters = (
    price: [number, number], 
    brands: string[], 
    categories: string[]
  ) => {
    onFilterChange({
      priceRange: price,
      selectedBrands: brands,
      selectedCategories: categories
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Filtros</h3>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Preço</h4>
        <Slider 
          defaultValue={[0, maxPrice]} 
          max={maxPrice} 
          step={1000} 
          onValueChange={handlePriceChange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>MZN {priceRange[0].toLocaleString()}</span>
          <span>MZN {priceRange[1].toLocaleString()}</span>
        </div>
      </div>
      
      {/* Brand Filters */}
      {brands.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Marcas</h4>
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${brand}`} 
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm">{brand}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Category Filters */}
      {categories.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Categorias</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category}`} 
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm">{category}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
