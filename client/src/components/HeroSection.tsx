import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeroSectionProps {
  categories: any[];
}

export default function HeroSection({ categories }: HeroSectionProps) {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-background to-card">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Лучший выбор <span className="text-primary">вейп-продукции</span> в России
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Широкий ассортимент электронных сигарет, жидкостей и аксессуаров от проверенных брендов и производителей.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-lg">
              <Input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full bg-muted border border-border rounded-full py-6 px-4 pl-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute left-3 top-3 h-6 w-6 bg-transparent hover:bg-transparent text-muted-foreground"
              >
                <Search size={20} />
              </Button>
            </form>
            
            <div>
              <Button 
                onClick={() => navigate("/catalog")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 px-8"
                size="lg"
              >
                В каталог
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8 md:mt-0">
            {categories.slice(0, 4).map((category, index) => (
              <div 
                key={category.id || index}
                className={`rounded-lg p-6 flex flex-col items-center justify-center bg-card border border-border transition-transform hover:scale-105 cursor-pointer text-center ${
                  index % 2 === 0 ? 'transform translate-y-4' : ''
                }`}
                onClick={() => navigate(`/catalog/${category.slug}`)}
              >
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-16 h-16 object-contain mb-4"
                  />
                )}
                <h3 className="font-medium text-white">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {category.productCount || "0"} товаров
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}