import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Import components
import FilterSidebar from "@/components/filters/filter-sidebar";
import ProductGrid from "@/components/products/product-grid";

interface ProductsResponse {
  products: any[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function Catalog() {
  const params = useParams<{ categorySlug?: string }>();
  const [location, setLocation] = useLocation();
  
  // Get search parameters from URL
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialSearch = searchParams.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<{
    brands: string[];
    locations: string[];
  }>({
    brands: [],
    locations: [],
  });
  
  // Build query string
  const queryString = [
    params.categorySlug ? `category=${params.categorySlug}` : "",
    searchTerm ? `search=${encodeURIComponent(searchTerm)}` : "",
    selectedFilters.brands.length > 0 ? `brands=${selectedFilters.brands.join(",")}` : "",
    selectedFilters.locations.length > 0 ? `locations=${selectedFilters.locations.join(",")}` : "",
    `page=${currentPage}`,
  ]
    .filter(Boolean)
    .join("&");
  
  // Fetch products based on filters
  const { data: productsData, isLoading } = useQuery<ProductsResponse>({
    queryKey: [`/api/products?${queryString}`],
  });
  
  // Fetch category data if category slug is provided
  const { data: categoryData } = useQuery<any>({
    queryKey: [params.categorySlug ? `/api/categories/${params.categorySlug}` : null],
    enabled: !!params.categorySlug,
  });
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams();
    setCurrentPage(1);
  };
  
  // Update URL parameters based on filters
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    
    if (selectedFilters.brands.length > 0) {
      params.set("brands", selectedFilters.brands.join(","));
    }
    
    if (selectedFilters.locations.length > 0) {
      params.set("locations", selectedFilters.locations.join(","));
    }
    
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }
    
    const newLocation = params.toString()
      ? `${location.split("?")[0]}?${params.toString()}`
      : location.split("?")[0];
    
    setLocation(newLocation);
  };
  
  // Update filters
  const handleFilterChange = (type: 'brands' | 'locations', values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: values,
    }));
    setCurrentPage(1);
  };
  
  // Update page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Effect to update URL when filters change
  useEffect(() => {
    updateUrlParams();
  }, [selectedFilters, currentPage]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {params.categorySlug && categoryData 
            ? categoryData.name 
            : searchTerm 
              ? `Поиск: ${searchTerm}` 
              : "Каталог товаров"}
        </h1>
        
        {params.categorySlug && categoryData?.description && (
          <p className="text-muted-foreground mb-4">{categoryData.description}</p>
        )}
        
        <form onSubmit={handleSearch} className="relative max-w-lg w-full mt-4">
          <Input
            type="text"
            placeholder="Поиск товаров..."
            className="w-full bg-muted border border-border rounded-full py-2 px-4 pl-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute left-1 top-1 h-8 w-8 bg-transparent hover:bg-transparent text-muted-foreground"
          >
            <Search size={18} />
          </Button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with filters */}
        <div className="lg:col-span-1">
          <FilterSidebar 
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Product grid */}
        <div className="lg:col-span-3">
          <ProductGrid 
            products={productsData?.products || []}
            isLoading={isLoading}
            pagination={productsData?.pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}