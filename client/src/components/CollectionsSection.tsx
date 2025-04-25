import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CollectionsSectionProps {
  products: any[];
}

export default function CollectionsSection({ products }: CollectionsSectionProps) {
  const [, navigate] = useLocation();
  
  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Популярные товары
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ознакомьтесь с нашей коллекцией самых популярных товаров, выбранных на основе предпочтений наших клиентов.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, index) => (
            <div 
              key={product.id || index}
              className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => navigate(`/product/${product.slug}`)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image || 'https://placehold.co/300x300?text=No+Image'} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-white mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {product.description || "Описание отсутствует"}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {product.featured && (
                      <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                        Популярный
                      </span>
                    )}
                    {product.isNew && (
                      <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-500 rounded">
                        Новинка
                      </span>
                    )}
                  </div>
                  <span className="text-primary font-medium group-hover:underline">
                    Подробнее
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Button 
            onClick={() => navigate("/catalog")}
            variant="outline"
            className="gap-2"
          >
            Смотреть все товары
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}