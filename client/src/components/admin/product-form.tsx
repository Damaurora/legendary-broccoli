import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { toast } = useToast();
  const isEditing = !!product;
  
  // Form state
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    image: product?.image || "",
    categoryId: product?.category?.id || "",
    brandId: product?.brand?.id || "",
    featured: product?.featured || false,
    isNew: product?.isNew || false,
    batteryCapacity: product?.batteryCapacity || "",
    liquidVolume: product?.liquidVolume || "",
    power: product?.power || "",
    flavors: product?.flavors || [],
    specifications: product?.specifications || {},
  });
  
  // New flavor input
  const [newFlavor, setNewFlavor] = useState("");
  
  // New specification inputs
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  
  // Fetch categories
  const { data: categories } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });
  
  // Fetch brands
  const { data: brands } = useQuery<any[]>({
    queryKey: ["/api/brands"],
  });
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };
  
  // Handle select change
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Add flavor
  const handleAddFlavor = () => {
    if (!newFlavor.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      flavors: [...prev.flavors, newFlavor.trim()]
    }));
    
    setNewFlavor("");
  };
  
  // Remove flavor
  const handleRemoveFlavor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      flavors: prev.flavors.filter((_, i) => i !== index)
    }));
  };
  
  // Add specification
  const handleAddSpecification = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newSpecKey.trim()]: newSpecValue.trim()
      }
    }));
    
    setNewSpecKey("");
    setNewSpecValue("");
  };
  
  // Remove specification
  const handleRemoveSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    
    setFormData(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // In a real app, this would make an API call to update the product
        // await apiRequest(`/api/products/${product.id}`, {
        //   method: "PATCH",
        //   data: formData,
        // });
        console.log("Update product:", formData);
      } else {
        // In a real app, this would make an API call to create a new product
        // await apiRequest("/api/products", {
        //   method: "POST",
        //   data: formData,
        // });
        console.log("Create product:", formData);
      }
      
      toast({
        title: "Успешно!",
        description: isEditing 
          ? "Товар успешно обновлен" 
          : "Товар успешно создан",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить товар",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="p-0 mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-white">
          {isEditing ? "Редактирование товара" : "Добавление товара"}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic information */}
        <div className="space-y-4 bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-white">Основная информация</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Название товара</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">URL изображения</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId">Категория</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleSelectChange("categoryId", value)}
              >
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brandId">Бренд</Label>
              <Select
                value={formData.brandId}
                onValueChange={(value) => handleSelectChange("brandId", value)}
              >
                <SelectTrigger id="brandId">
                  <SelectValue placeholder="Выберите бренд" />
                </SelectTrigger>
                <SelectContent>
                  {brands?.map(brand => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-full">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            
            <div className="flex space-x-8 col-span-full">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("featured", checked as boolean)
                  }
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Популярный товар
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNew"
                  checked={formData.isNew}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("isNew", checked as boolean)
                  }
                />
                <Label htmlFor="isNew" className="cursor-pointer">
                  Новинка
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Technical specifications */}
        <div className="space-y-4 bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-white">Технические характеристики</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="batteryCapacity">Ёмкость аккумулятора</Label>
              <Input
                id="batteryCapacity"
                name="batteryCapacity"
                value={formData.batteryCapacity}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="liquidVolume">Объем жидкости</Label>
              <Input
                id="liquidVolume"
                name="liquidVolume"
                value={formData.liquidVolume}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="power">Мощность</Label>
              <Input
                id="power"
                name="power"
                value={formData.power}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Custom specifications */}
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-white">Дополнительные характеристики</h4>
            
            <div className="space-y-4">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <Input
                      value={key}
                      disabled
                      className="bg-muted"
                    />
                    <Input
                      value={value as string}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveSpecification(key)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center space-x-3">
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <Input
                    placeholder="Название"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                  />
                  <Input
                    placeholder="Значение"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSpecification}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Flavors (for liquids) */}
        <div className="space-y-4 bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-white">Вкусы (для жидкостей)</h3>
          
          <div className="space-y-4">
            {formData.flavors.map((flavor, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Input
                  value={flavor}
                  disabled
                  className="bg-muted flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveFlavor(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center space-x-3">
              <Input
                placeholder="Название вкуса"
                value={newFlavor}
                onChange={(e) => setNewFlavor(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddFlavor}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </div>
          </div>
        </div>
        
        {/* Submit buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">
            {isEditing ? "Сохранить" : "Создать товар"}
          </Button>
        </div>
      </form>
    </div>
  );
}