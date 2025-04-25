import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ChevronLeft, ChevronRight, Sparkles, Flame } from "lucide-react";

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

function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  // Calculate range of pages to show
  const range = 2; // Show 2 pages before and after current page
  let startPage = Math.max(1, currentPage - range);
  let endPage = Math.min(totalPages, currentPage + range);
  
  // Ensure we always show at least 5 pages if available
  if (endPage - startPage < 4 && totalPages > 4) {
    if (startPage === 1) {
      endPage = Math.min(5, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 4);
    }
  }
  
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(1)}
              className="h-8 w-8 p-0"
            >
              1
            </Button>
            {startPage > 2 && <span className="text-muted-foreground">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-8 w-8 p-0"
          >
            {page}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-muted-foreground">...</span>}
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-8 w-8 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="border-border bg-card h-full">
      <div className="aspect-square w-full relative overflow-hidden rounded-t-lg">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="p-4 pb-0">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <Skeleton className="h-6 w-24 mb-3" />
        <Skeleton className="h-10 w-full mt-1" />
      </CardContent>
    </Card>
  );
}

export default function ProductGrid({ 
  products, 
  isLoading, 
  pagination, 
  currentPage,
  onPageChange
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-foreground mb-2">Товары не найдены</h3>
        <p className="text-muted-foreground">Попробуйте изменить параметры поиска или фильтры</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="border-border bg-card h-full overflow-hidden hover:border-primary/50 transition-all">
            <Link href={`/product/${product.slug}`}>
              <div className="aspect-square w-full relative overflow-hidden cursor-pointer">
                <img 
                  src={product.image || 'https://placehold.co/300x300?text=Нет+фото'} 
                  alt={product.name} 
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
                {product.isNew && (
                  <Badge className="absolute top-2 right-2 bg-blue-500">
                    <Sparkles className="h-3 w-3 mr-1" /> Новинка
                  </Badge>
                )}
                {product.featured && (
                  <Badge variant="destructive" className="absolute top-2 left-2">
                    <Flame className="h-3 w-3 mr-1" /> Хит
                  </Badge>
                )}
              </div>
            </Link>
            <CardHeader className="p-4 pb-0">
              <Link href={`/product/${product.slug}`}>
                <CardTitle className="text-md font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                  {product.name}
                </CardTitle>
              </Link>
              <div className="text-xs text-muted-foreground mt-1">
                {product.category?.name}{product.brand && ` • ${product.brand.name}`}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-lg font-bold text-foreground mt-1">
                {product.price.toLocaleString()} ₽
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/product/${product.slug}`} className="w-full">
                <Button variant="default" className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Подробнее
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <Pagination 
          totalPages={pagination.totalPages} 
          currentPage={currentPage} 
          onPageChange={onPageChange} 
        />
      )}
    </div>
  );
}