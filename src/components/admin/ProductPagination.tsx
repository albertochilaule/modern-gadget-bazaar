
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProductPaginationProps {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

const ProductPagination: React.FC<ProductPaginationProps> = ({ 
  totalItems, 
  currentPage = 1,
  onPageChange,
  itemsPerPage = 10
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // If there's only 1 or fewer pages, don't show pagination
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} produtos
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </Button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          
          // Logic to show pages around the current page
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <Button 
              key={pageNum} 
              variant="outline"
              className={pageNum === currentPage ? "bg-green-600 text-white" : ""}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
        
        <Button 
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </Button>
      </div>
    </div>
  );
};

export default ProductPagination;
