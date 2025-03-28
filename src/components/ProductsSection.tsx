
import { Product } from './ProductCard';
import ProductCard from './ProductCard';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface ProductsSectionProps {
  products: Product[];
  title?: string;
}

const ProductsSection = ({ products, title = "Produtos em Destaque" }: ProductsSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  
  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-century-primary" : ""}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
