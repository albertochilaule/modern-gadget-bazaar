
import { useState, useEffect } from 'react';
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
import { Product, determineStatus } from "@/types/product";
import { supabase } from "@/utils/supabaseClient";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        // Fetch from Supabase
        const { data: productsData, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_published', true);
          
        if (error) {
          throw error;
        }
        
        if (productsData && productsData.length > 0) {
          // Format products to match our Product interface
          const formattedProducts: Product[] = productsData.map(product => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
            image: product.image || '/placeholder.svg',
            category: product.category,
            status: determineStatus(product.stock),
            isPublished: product.is_published,
            description: product.full_description || product.short_description || '',
            processor: product.processor,
            memory: product.memory,
            storage: product.storage,
            screenSize: product.screen_size,
            operatingSystem: product.operating_system,
            graphics: product.graphics
          }));
          
          setProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
          
          // Extract unique categories and brands
          const uniqueCategories = Array.from(
            new Set(formattedProducts.map(product => product.category || '').filter(Boolean))
          ) as string[];
          setCategories(uniqueCategories);
          
          const uniqueBrands = Array.from(
            new Set(formattedProducts.map(product => product.brand))
          ) as string[];
          setBrands(uniqueBrands);
          
          // Calculate max price
          const highestPrice = Math.max(
            ...formattedProducts.map(product => {
              const numPrice = typeof product.price === 'string'
                ? parseFloat(product.price.replace(/[^\d.-]/g, ''))
                : product.price;
              return numPrice;
            })
          );
          setMaxPrice(highestPrice);
        } else {
          // Fallback to localStorage if no products in Supabase
          const storedProducts = localStorage.getItem('adminProducts');
          if (storedProducts) {
            try {
              const adminProducts = JSON.parse(storedProducts);
              
              const formattedProducts: Product[] = adminProducts
                .filter((product: any) => product.isPublished)
                .map((product: any) => ({
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  price: typeof product.price === 'string' 
                    ? parseFloat(product.price.replace(/[^\d.-]/g, '')) 
                    : product.price,
                  stock: product.stock,
                  image: product.image || '/placeholder.svg',
                  category: product.category,
                  status: determineStatus(product.stock),
                  isPublished: true,
                  description: product.description || ''
                }));
              
              setProducts(formattedProducts);
              setFilteredProducts(formattedProducts);
              
              // Extract unique categories and brands
              const uniqueCategories = Array.from(
                new Set(formattedProducts.map(product => product.category || '').filter(Boolean))
              ) as string[];
              setCategories(uniqueCategories);
              
              const uniqueBrands = Array.from(
                new Set(formattedProducts.map(product => product.brand))
              ) as string[];
              setBrands(uniqueBrands);
              
              // Calculate max price
              const highestPrice = Math.max(
                ...formattedProducts.map(product => {
                  const numPrice = typeof product.price === 'string'
                    ? parseFloat(product.price.replace(/[^\d.-]/g, ''))
                    : product.price;
                  return numPrice;
                })
              );
              setMaxPrice(highestPrice);
            } catch (e) {
              console.error("Error parsing stored products:", e);
              setProducts([]);
              setFilteredProducts([]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

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
