
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
import { Product } from "@/components/ProductCard";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);

  useEffect(() => {
    const getStoredProducts = () => {
      const stored = localStorage.getItem('adminProducts');
      if (stored) {
        try {
          const adminProducts = JSON.parse(stored);
          
          const formattedProducts = adminProducts
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
              category: product.category
            }));
          
          return formattedProducts;
        } catch (e) {
          console.error("Error parsing stored products:", e);
          return [];
        }
      }
      
      return [
        {
          id: 1,
          name: "Nav 3000",
          brand: "HP",
          price: 15000,
          stock: 5,
          image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop",
          category: "Laptops"
        },
        {
          id: 2,
          name: "Tivo 3000",
          brand: "Acer",
          price: 35000,
          stock: 3,
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop",
          category: "Laptops"
        },
        {
          id: 3,
          name: "Dell XPS",
          brand: "Dell",
          price: 45000,
          stock: 2,
          image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=300&fit=crop",
          category: "Laptops"
        },
        {
          id: 4,
          name: "Lenovo ThinkPad",
          brand: "Lenovo",
          price: 25000,
          stock: 4,
          image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=300&fit=crop",
          category: "Laptops"
        },
        {
          id: 5,
          name: "MacBook Pro",
          brand: "Apple",
          price: 85000,
          stock: 2,
          image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=300&fit=crop",
          category: "Laptops"
        },
        {
          id: 6,
          name: "ASUS ROG",
          brand: "ASUS",
          price: 65000,
          stock: 3,
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop",
          category: "PC Gamers"
        },
        {
          id: 7,
          name: "MSI Gaming",
          brand: "MSI",
          price: 75000,
          stock: 1,
          image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop",
          category: "PC Gamers"
        },
        {
          id: 8,
          name: "Razer Blade",
          brand: "Razer",
          price: 95000,
          stock: 2,
          image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=300&fit=crop",
          category: "Laptops"
        },
        {
          id: 9,
          name: "Alienware",
          brand: "Dell",
          price: 105000,
          stock: 1,
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop",
          category: "PC Gamers"
        },
        {
          id: 10,
          name: "HP Omen",
          brand: "HP",
          price: 55000,
          stock: 4,
          image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop",
          category: "PC Gamers"
        }
      ];
    };

    const loadedProducts = getStoredProducts();
    setProducts(loadedProducts);
    setFilteredProducts(loadedProducts);
    
    // Extract unique categories and brands
    const uniqueCategories: string[] = [...new Set(loadedProducts.map((product: Product) => product.category || ''))].filter(Boolean) as string[];
    setCategories(uniqueCategories);
    
    const uniqueBrands: string[] = [...new Set(loadedProducts.map((product: Product) => product.brand))];
    setBrands(uniqueBrands);
    
    // Find the maximum price for the price slider
    const highestPrice = Math.max(...loadedProducts.map((product: Product) => {
      const numPrice = typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^\d.-]/g, '')) 
        : product.price;
      return numPrice;
    }));
    setMaxPrice(highestPrice);
  }, []);

  const applyFilters = (
    productsToFilter: Product[],
    query: string,
    priceRange?: [number, number],
    selectedBrands?: string[],
    selectedCategories?: string[]
  ) => {
    let result = [...productsToFilter];
    
    // Apply search query
    if (query.trim() !== '') {
      const searchLower = query.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        (product.category && product.category.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply price range filter
    if (priceRange) {
      result = result.filter(product => {
        const numPrice = typeof product.price === 'string' 
          ? parseFloat(product.price.replace(/[^\d.-]/g, '')) 
          : product.price;
        return numPrice >= priceRange[0] && numPrice <= priceRange[1];
      });
    }
    
    // Apply brand filter
    if (selectedBrands && selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.brand));
    }
    
    // Apply category filter
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
            {/* Filters sidebar */}
            <div className="md:col-span-1">
              <FilterSection 
                brands={brands}
                categories={categories}
                maxPrice={maxPrice}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            {/* Products grid */}
            <div className="md:col-span-3">
              <ProductsSection 
                products={filteredProducts} 
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
