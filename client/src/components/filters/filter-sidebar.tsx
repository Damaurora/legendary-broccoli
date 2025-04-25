import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    queryKey: ["/api/brands"],
  });
  
  // Fetch store locations
  const { data: locations } = useQuery<any[]>({
    queryKey: ["/api/locations"],
  });
  
  // Handle brand selection
  const handleBrandToggle = (brandId: string) => {
    const updatedBrands = selectedFilters.brands.includes(brandId)
      ? selectedFilters.brands.filter(id => id !== brandId)
      : [...selectedFilters.brands, brandId];
    
    onFilterChange('brands', updatedBrands);
  };
  
  // Handle location selection
  const handleLocationToggle = (locationId: string) => {
    const updatedLocations = selectedFilters.locations.includes(locationId)
      ? selectedFilters.locations.filter(id => id !== locationId)
      : [...selectedFilters.locations, locationId];
    
    onFilterChange('locations', updatedLocations);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange('brands', []);
    onFilterChange('locations', []);
  };
  
  // Check if any filters are applied
  const hasFilters = selectedFilters.brands.length > 0 || selectedFilters.locations.length > 0;
  
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Фильтры</h3>
        {hasFilters && (
          <Button 
            variant="link" 
            className="text-primary p-0 h-auto"
            onClick={handleClearFilters}
          >
            Сбросить
          </Button>
        )}
      </div>
      
      <Accordion type="multiple" defaultValue={["brands", "locations"]} className="space-y-4">
        {/* Brands filter */}
        <AccordionItem value="brands" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="text-foreground">Бренды</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {brands?.map(brand => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand.id}`}
                    checked={selectedFilters.brands.includes(brand.id)}
                    onCheckedChange={() => handleBrandToggle(brand.id)}
                  />
                  <label 
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {brand.name}
                  </label>
                </div>
              ))}
              
              {(!brands || brands.length === 0) && (
                <p className="text-sm text-muted-foreground">Нет доступных брендов</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Locations filter */}
        <AccordionItem value="locations" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="text-foreground">Магазины</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {locations?.map(location => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`location-${location.id}`}
                    checked={selectedFilters.locations.includes(location.id)}
                    onCheckedChange={() => handleLocationToggle(location.id)}
                  />
                  <label 
                    htmlFor={`location-${location.id}`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {location.name}
                  </label>
                </div>
              ))}
              
              {(!locations || locations.length === 0) && (
                <p className="text-sm text-muted-foreground">Нет доступных магазинов</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}