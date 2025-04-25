import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  MapPin,
  CircleCheck,
  CircleX,
  Truck,
  Info,
  Flame,
  Battery
} from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  // Fetch product data
  const { data: product, isLoading } = useQuery<any>({
    queryKey: [`/api/products/${slug}`],
  });
  
  // Fetch availability data
  const { data: availability } = useQuery<any[]>({
    queryKey: [`/api/products/${slug}/availability`],
    enabled: !!product,
  });
  
  // Show toast when adding to cart
  const handleAddToCart = () => {
    toast({
      title: "Товар добавлен",
      description: "Товар успешно добавлен в корзину",
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-5xl">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Товар не найден</h1>
        <p className="text-muted-foreground mb-6">Запрашиваемый товар не существует или был удален.</p>
        <Link href="/catalog">
          <Button>
            Вернуться в каталог
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/catalog/${product.category.slug}`} className="hover:text-primary transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </div>
      
      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-card rounded-lg overflow-hidden p-4 border border-border">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full aspect-square object-contain"
          />
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.featured && (
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                Популярный
              </span>
            )}
            {product.isNew && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                Новинка
              </span>
            )}
            {product.brand && (
              <span className="px-3 py-1 bg-secondary/50 text-foreground rounded-full text-sm">
                {product.brand.name}
              </span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-muted-foreground">{product.description}</p>
          
          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4">
            {product.batteryCapacity && (
              <div className="flex items-center gap-2">
                <Battery size={18} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Ёмкость аккумулятора: {product.batteryCapacity}
                </span>
              </div>
            )}
            {product.liquidVolume && (
              <div className="flex items-center gap-2">
                <div className="text-primary w-[18px] h-[18px] flex justify-center items-center">💧</div>
                <span className="text-sm text-muted-foreground">
                  Объем жидкости: {product.liquidVolume}
                </span>
              </div>
            )}
            {product.power && (
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Мощность: {product.power}
                </span>
              </div>
            )}
          </div>
          
          {/* Availability */}
          <div className="space-y-3 pt-2 border-t border-border">
            <h3 className="font-medium text-white">Наличие в магазинах</h3>
            <div className="space-y-2">
              {availability?.length === 0 && (
                <p className="text-muted-foreground text-sm">Нет в наличии</p>
              )}
              
              {availability?.map(item => (
                <div key={item.location.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {item.location.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.quantity > 0 ? (
                      <>
                        <CircleCheck size={16} className="text-green-500" />
                        <span className="text-sm text-muted-foreground">В наличии</span>
                      </>
                    ) : (
                      <>
                        <CircleX size={16} className="text-destructive" />
                        <span className="text-sm text-muted-foreground">Нет в наличии</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Button */}
          <div className="pt-4">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              Заказать
            </Button>
            
            <div className="flex items-center gap-2 justify-center mt-4 text-sm text-muted-foreground">
              <Truck size={16} />
              <span>Доставка по всей России</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Specifications */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Характеристики</h2>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Specifications table */}
            {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
              <div key={index} className={`py-2 ${index < Object.entries(product.specifications).length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="text-foreground font-medium">{value as string}</span>
                </div>
              </div>
            ))}
            
            {/* Basic specs that might not be in specifications object */}
            {product.brand && (
              <div className="py-2 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Бренд</span>
                  <span className="text-foreground font-medium">{product.brand.name}</span>
                </div>
              </div>
            )}
            {product.batteryCapacity && (
              <div className="py-2 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ёмкость аккумулятора</span>
                  <span className="text-foreground font-medium">{product.batteryCapacity}</span>
                </div>
              </div>
            )}
            {product.liquidVolume && (
              <div className="py-2 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Объем жидкости</span>
                  <span className="text-foreground font-medium">{product.liquidVolume}</span>
                </div>
              </div>
            )}
            {product.power && (
              <div className="py-2 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Мощность</span>
                  <span className="text-foreground font-medium">{product.power}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Flavors section if it's a liquid */}
      {product.flavors && product.flavors.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Вкусы</h2>
          
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {product.flavors.map((flavor: string, index: number) => (
                <div key={index} className="bg-muted rounded-lg p-3 text-center">
                  <span className="text-foreground">{flavor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Related products (placeholder) */}
      <div className="border-t border-border pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Похожие товары</h2>
          <Link href="/catalog" className="text-primary hover:underline">
            Все товары
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would be populated with actual related products */}
          <div className="bg-card rounded-lg overflow-hidden border border-border h-64 flex items-center justify-center">
            <p className="text-muted-foreground text-center px-4">
              Здесь будут отображаться похожие товары
            </p>
          </div>
          <div className="bg-card rounded-lg overflow-hidden border border-border h-64 flex items-center justify-center">
            <p className="text-muted-foreground text-center px-4">
              Здесь будут отображаться похожие товары
            </p>
          </div>
          <div className="bg-card rounded-lg overflow-hidden border border-border h-64 flex items-center justify-center">
            <p className="text-muted-foreground text-center px-4">
              Здесь будут отображаться похожие товары
            </p>
          </div>
          <div className="bg-card rounded-lg overflow-hidden border border-border h-64 flex items-center justify-center">
            <p className="text-muted-foreground text-center px-4">
              Здесь будут отображаться похожие товары
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}