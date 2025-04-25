import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  ArrowLeft, 
  ArrowRight as ArrowRightIcon, 
  ShoppingCart, 
  Flame,
  Sparkles 
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "wouter";

interface CollectionsSectionProps {
  products: any[];
}

export default function CollectionsSection({ products }: CollectionsSectionProps) {
  const [, navigate] = useLocation();
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const featuredProducts = products.filter(p => p.featured);
  
  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
  if (featuredProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Популярные товары
            </h2>
            <p className="text-muted-foreground mt-2">
              Хиты продаж и новинки нашего магазина
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => navigate("/catalog")}
            >
              <ArrowRightIcon className="h-4 w-4" />
              <span className="sr-only">Все товары</span>
            </Button>
          </div>
        </div>
        
        {/* Карусель для экранов среднего размера и больше */}
        <div className="hidden md:block">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="border-border bg-card h-full overflow-hidden hover:border-primary/50 transition-all">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
        {/* Сетка для мобильных устройств */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
          {featuredProducts.slice(0, 4).map((product) => (
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
        
        <div className="flex justify-center mt-10">
          <Button 
            onClick={() => navigate("/catalog")}
            variant="outline"
            className="gap-2"
          >
            Смотреть все товары
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}