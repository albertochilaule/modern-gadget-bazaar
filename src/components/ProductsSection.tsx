
import React from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export interface ProductsSectionProps {
  products: Product[];
  title: string;
  isLoading?: boolean;
}

const ProductsSection = ({ products, title, isLoading = false }: ProductsSectionProps) => {
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
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;
