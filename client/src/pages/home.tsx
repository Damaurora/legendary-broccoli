import { useQuery } from "@tanstack/react-query";
import { useScrollToAnchor } from "@/hooks/useScrollToAnchor";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CollectionsSection from "@/components/CollectionsSection";
import ContactSection from "@/components/ContactSection";

interface ProductsResponse {
  products: any[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function Home() {
  // Enable scroll to anchor behavior
  useScrollToAnchor();
  
  // Fetch featured products for collections section
  const { data: productsData } = useQuery<ProductsResponse>({
    queryKey: ["/api/products?featured=true"],
  });
  
  // Fetch categories for hero section
  const { data: categories } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });
  
  return (
    <div>
      {/* Hero Section */}
      <HeroSection categories={categories || []} />
      
      {/* Featured Collections Section */}
      <CollectionsSection products={productsData?.products || []} />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}