
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HighlightsSection from "@/components/HighlightsSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductsSection from "@/components/ProductsSection";

// Sample product data
const products = [
  {
    id: 1,
    name: "Nav 3000",
    brand: "HP",
    price: 15000,
    stock: 5,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Tivo 3000",
    brand: "Acer",
    price: 35000,
    stock: 3,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Dell XPS",
    brand: "Dell",
    price: 45000,
    stock: 2,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Lenovo ThinkPad",
    brand: "Lenovo",
    price: 25000,
    stock: 4,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=300&fit=crop"
  },
  {
    id: 5,
    name: "MacBook Pro",
    brand: "Apple",
    price: 85000,
    stock: 2,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=300&fit=crop"
  },
  {
    id: 6,
    name: "ASUS ROG",
    brand: "ASUS",
    price: 65000,
    stock: 3,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop"
  },
  {
    id: 7,
    name: "MSI Gaming",
    brand: "MSI",
    price: 75000,
    stock: 1,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Razer Blade",
    brand: "Razer",
    price: 95000,
    stock: 2,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=300&fit=crop"
  },
  {
    id: 9,
    name: "Alienware",
    brand: "Dell",
    price: 105000,
    stock: 1,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop"
  },
  {
    id: 10,
    name: "HP Omen",
    brand: "HP",
    price: 55000,
    stock: 4,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop"
  }
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HighlightsSection />
        <CategoriesSection />
        <ProductsSection products={products} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
