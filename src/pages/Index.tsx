
import { useState, useEffect, useCallback } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HighlightsSection from "@/components/HighlightsSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductsSection from "@/components/ProductsSection";
import FilterSection from "@/components/FilterSection";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Product } from "@/types/product";
import { fetchProducts } from "@/services/productService";
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    
    try {
      // Fetch published products only for the main store page
      const fetchedProducts = await fetchProducts(true);
      
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      
      // Extract unique categories and brands
      const uniqueCategories = Array.from(
        new Set(fetchedProducts.map(product => product.category || '').filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
      
      const uniqueBrands = Array.from(
        new Set(fetchedProducts.map(product => product.brand))
      ) as string[];
      setBrands(uniqueBrands);
      
      // Calculate max price
      const highestPrice = Math.max(
        ...fetchedProducts.map(product => {
          const numPrice = typeof product.price === 'string'
            ? parseFloat(product.price.replace(/[^\d.-]/g, ''))
            : product.price;
          return isNaN(numPrice) ? 0 : numPrice;
        }),
        0
      );
      setMaxPrice(highestPrice || 100000);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const applyFilters = (
    productsToFilter: Product[],
    query: string,
    priceRange?: [number, number],
    selectedBrands?: string[],
    selectedCategories?: string[]
  ) => {
    let result = [...productsToFilter];
    
    if (query.trim() !== '') {
      const searchLower = query.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        (product.category && product.category.toLowerCase().includes(searchLower))
      );
    }
    
    if (priceRange) {
      result = result.filter(product => {
        const numPrice = typeof product.price === 'string' 
          ? parseFloat(product.price.replace(/[^\d.-]/g, '')) 
          : product.price;
        return numPrice >= priceRange[0] && numPrice <= priceRange[1];
      });
    }
    
    if (selectedBrands && selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.brand));
    }
    
    if (selectedCategories && selectedCategories.length > 0) {
      result = result.filter(product => 
        product.category && selectedCategories.includes(product.category)
      );
    }
    
    return result;
  };

  useEffect(() => {
    setFilteredProducts(applyFilters(products, searchQuery));
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilteredProducts(applyFilters(products, searchQuery));
  };

  const handleFilterChange = (filters: {
    priceRange: [number, number];
    selectedBrands: string[];
    selectedCategories: string[];
  }) => {
    const filtered = applyFilters(
      products, 
      searchQuery, 
      filters.priceRange, 
      filters.selectedBrands, 
      filters.selectedCategories
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HighlightsSection />
        <CategoriesSection />
        
        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <FilterSection 
                brands={brands}
                categories={categories}
                maxPrice={maxPrice}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            <div className="md:col-span-3">
              <ProductsSection 
                products={filteredProducts} 
                isLoading={loading}
                title={searchQuery ? `Resultados para "${searchQuery}"` : "Produtos em Destaque"}
                onProductsChange={loadProducts}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
