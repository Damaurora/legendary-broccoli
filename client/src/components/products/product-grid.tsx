import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
}

// Pagination component
function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // If current page is more than 3, add ellipsis
    if (currentPage > 3) {
      pageNumbers.push('...');
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // If there are more pages after current + 1, add ellipsis
    if (currentPage + 1 < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-1 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ArrowLeft size={16} />
      </Button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(Number(page))}
            className="h-8 w-8"
          >
            {page}
          </Button>
        )
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}

// Product card placeholder for loading state
function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-card rounded-lg overflow-hidden product-card">
      <div className="w-full h-48 bg-muted"></div>
      <div className="p-4">
        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ 
  products, 
  isLoading,
  pagination,
  currentPage,
  onPageChange
}: ProductGridProps) {
  
  // Show loading state
  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  
  // Show empty state if no products
  if (products.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center">
        <h3 className="text-xl font-medium text-white mb-2">Нет товаров</h3>
        <p className="text-muted-foreground mb-6">
          По данному запросу не найдено товаров. Попробуйте изменить параметры поиска.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Вернуться назад
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Results count */}
      <div className="mb-6 text-muted-foreground">
        {pagination && (
          <p>
            Найдено {pagination.totalCount} товаров. 
            Показано {(pagination.page - 1) * pagination.pageSize + 1}-
            {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} из {pagination.totalCount}.
          </p>
        )}
      </div>
    
      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-lg overflow-hidden product-card">
            <Link href={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 text-white">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm space-x-2">
                    {product.featured && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">Популярный</span>
                    )}
                    {product.isNew && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 rounded text-xs">Новинка</span>
                    )}
                  </div>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    Подробнее
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {pagination && (
        <Pagination 
          totalPages={pagination.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}