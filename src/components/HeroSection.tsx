
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Computadores Modernos</h1>
            <p className="text-xl text-gray-600 mb-6">Melhores preços da praça, imbatíveis</p>
            <Link to="/produtos">
              <Button className="bg-century-primary hover:bg-green-600 text-white text-lg px-6 py-3">
                FAÇA JÁ A SUA ENCOMENDA →
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop" 
              alt="Computadores modernos" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
