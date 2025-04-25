import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";

interface FilterSidebarProps {
  selectedFilters: {
    brands: string[];
    locations: string[];
  };
  onFilterChange: (type: 'brands' | 'locations', values: string[]) => void;
}

export default function FilterSidebar({ 
  selectedFilters, 
  onFilterChange 
}: FilterSidebarProps) {
  // Fetch brands
  const { data: brands } = useQuery<any[]>({
    queryKey: ['/api/brands'],
  });
  
  // Fetch locations
  const { data: locations } = useQuery<any[]>({
    queryKey: ['/api/locations'],
  });

  // Дедуплицируем локации, если есть дубликаты
  const uniqueLocations = useMemo(() => {
    if (!locations) return [];
    
    // Создаем Map для быстрого доступа по id
    const locationsMap = new Map();
    
    // Добавляем только уникальные локации по id
    locations.forEach(location => {
      if (!locationsMap.has(location.id)) {
        locationsMap.set(location.id, location);
      }
    });
    
    // Преобразуем Map в массив
    return Array.from(locationsMap.values());
  }, [locations]);

  // Handle brand filter change
  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      onFilterChange('brands', [...selectedFilters.brands, brand]);
    } else {
      onFilterChange('brands', selectedFilters.brands.filter(b => b !== brand));
    }
  };

  // Handle location filter change
  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      onFilterChange('locations', [...selectedFilters.locations, location]);
    } else {
      onFilterChange('locations', selectedFilters.locations.filter(l => l !== location));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-semibold text-foreground">
            <Filter className="mr-2 h-5 w-5" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-6">
            {/* Бренды */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground">Бренды</h3>
              <Separator className="mb-3" />
              <div className="space-y-2">
                {brands?.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand.id}`} 
                      checked={selectedFilters.brands.includes(brand.id.toString())}
                      onCheckedChange={(checked) => handleBrandChange(brand.id.toString(), checked === true)}
                    />
                    <Label htmlFor={`brand-${brand.id}`} className="text-sm font-normal cursor-pointer">
                      {brand.name}
                    </Label>
                  </div>
                ))}
                
                {!brands?.length && (
                  <div className="text-muted-foreground text-sm py-1">Загрузка брендов...</div>
                )}
              </div>
            </div>
            
            {/* Магазины */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground">Наличие в магазинах</h3>
              <Separator className="mb-3" />
              <div className="space-y-2">
                {uniqueLocations.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`location-${location.id}`} 
                      checked={selectedFilters.locations.includes(location.id.toString())}
                      onCheckedChange={(checked) => handleLocationChange(location.id.toString(), checked === true)}
                    />
                    <Label htmlFor={`location-${location.id}`} className="text-sm font-normal cursor-pointer">
                      {location.name}
                    </Label>
                  </div>
                ))}
                
                {!uniqueLocations.length && (
                  <div className="text-muted-foreground text-sm py-1">Загрузка магазинов...</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}