import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X, Upload, Link, ArrowLeft, Save } from "lucide-react";

// Типы для отображения динамических характеристик
interface CustomAttribute {
  id: string;
  name: string;
  value: string;
  unit?: string;
}

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSave?: () => void;
}

export default function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([]);
  const [newAttribute, setNewAttribute] = useState({ name: "", value: "", unit: "" });
  const [showAttributeDialog, setShowAttributeDialog] = useState(false);
  const [imageType, setImageType] = useState<"upload" | "url">("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [flavors, setFlavors] = useState<string[]>([]);
  const [newFlavor, setNewFlavor] = useState("");

  // Загрузка категорий
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  // Загрузка брендов
  const { data: brands = [] } = useQuery<any[]>({
    queryKey: ["/api/brands"],
  });

  // Базовая схема валидации
  const formSchema = z.object({
    name: z.string().min(2, { message: "Название должно содержать минимум 2 символа" }),
    slug: z.string().min(2, { message: "Слаг должен содержать минимум 2 символа" }),
    description: z.string().optional(),
    price: z.coerce.number().min(0, { message: "Цена не может быть отрицательной" }),
    categoryId: z.coerce.number(),
    brandId: z.coerce.number().optional(),
    googleSheetId: z.string().optional(),
    isActive: z.boolean().default(true),
    isNew: z.boolean().default(false),
    featured: z.boolean().default(false),
    popular: z.boolean().default(false),
  });

  // Инициализация формы
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price || 0,
      categoryId: product?.categoryId || (categories[0]?.id || 0),
      brandId: product?.brandId || undefined,
      googleSheetId: product?.googleSheetId || "",
      isActive: product?.isActive !== false,
      isNew: product?.isNew || false,
      featured: product?.featured || false,
      popular: product?.popular || false,
    },
  });

  // После получения данных продукта, загружаем дополнительные поля
  useEffect(() => {
    if (product) {
      setImageUrl(product.imageUrl || "");
      setImagePreview(product.imageUrl || "");
      
      // Загружаем характеристики если есть
      if (product.attributes && Array.isArray(product.attributes)) {
        setCustomAttributes(product.attributes.map((attr: any, index: number) => ({
          id: String(index),
          name: attr.name,
          value: attr.value,
          unit: attr.unit || ""
        })));
      }
      
      // Загружаем вкусы если есть
      if (product.flavors && Array.isArray(product.flavors)) {
        setFlavors(product.flavors);
      }
    }
  }, [product]);

  // Мутация для создания/обновления продукта
  const productMutation = useMutation({
    mutationFn: async (data: any) => {
      // Формируем FormData для отправки файлов
      const formData = new FormData();
      
      // Добавляем JSON данные о продукте
      const productData = {
        ...data,
        attributes: customAttributes,
        flavors: flavors,
      };
      
      formData.append('data', JSON.stringify(productData));
      
      // Если есть файл изображения, добавляем его
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl) {
        productData.imageUrl = imageUrl;
      }
      
      // Отправляем запрос
      if (product && product.id) {
        if (imageFile) {
          // Если есть файл изображения, используем FormData
          const res = await fetch(`/api/products/${product.id}`, {
            method: "PATCH",
            body: formData,
          });
          return await res.json();
        } else {
          // Обычный JSON запрос
          const res = await apiRequest("PATCH", `/api/products/${product.id}`, productData);
          return await res.json();
        }
      } else {
        if (imageFile) {
          // Если есть файл изображения, используем FormData
          const res = await fetch(`/api/products`, {
            method: "POST",
            body: formData,
          });
          return await res.json();
        } else {
          // Обычный JSON запрос
          const res = await apiRequest("POST", `/api/products`, productData);
          return await res.json();
        }
      }
    },
    onSuccess: () => {
      toast({
        title: product ? "Товар обновлен" : "Товар создан",
        description: product 
          ? "Товар был успешно обновлен." 
          : "Новый товар был успешно добавлен.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/products`] });
      if (onSave) onSave();
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка сохранения",
        description: error.message || "Не удалось сохранить товар. Проверьте введенные данные.",
        variant: "destructive",
      });
    },
  });

  // Обработчик отправки формы
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    productMutation.mutate(values);
  };

  // Генерирует slug из названия
  const generateSlug = () => {
    const name = form.getValues("name");
    if (!name) return;
    
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
    
    form.setValue("slug", slug);
  };

  // Обработчик добавления новой характеристики
  const handleAddAttribute = () => {
    if (!newAttribute.name || !newAttribute.value) return;
    
    setCustomAttributes([
      ...customAttributes,
      {
        id: Date.now().toString(),
        name: newAttribute.name,
        value: newAttribute.value,
        unit: newAttribute.unit
      }
    ]);
    
    setNewAttribute({ name: "", value: "", unit: "" });
    setShowAttributeDialog(false);
  };

  // Обработчик удаления характеристики
  const handleRemoveAttribute = (id: string) => {
    setCustomAttributes(customAttributes.filter(attr => attr.id !== id));
  };

  // Обработчик добавления вкуса
  const handleAddFlavor = () => {
    if (!newFlavor.trim()) return;
    if (flavors.includes(newFlavor.trim())) return;
    
    setFlavors([...flavors, newFlavor.trim()]);
    setNewFlavor("");
  };

  // Обработчик удаления вкуса
  const handleRemoveFlavor = (index: number) => {
    setFlavors(flavors.filter((_, i) => i !== index));
  };

  // Обработчик загрузки изображения
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Создаем превью изображения
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Определяем характеристики в зависимости от категории
  const getCategoryAttributes = (categoryId?: number) => {
    if (!categoryId) return [];
    
    // Находим категорию по ID
    const category = categories.find((c: any) => c.id === categoryId);
    if (!category) return [];
    
    switch (category.slug) {
      case 'liquids':
      case 'salt-nic':
        return [
          { id: 'strength', name: 'Крепость', unit: 'мг' },
          { id: 'volume', name: 'Объем', unit: 'мл' },
        ];
      case 'pod-systems':
        return [
          { id: 'power', name: 'Мощность', unit: 'Вт' },
          { id: 'battery', name: 'Аккумулятор', unit: 'мАч' },
        ];
      case 'disposable-devices':
        return [
          { id: 'puffs', name: 'Количество затяжек', unit: '' },
          { id: 'battery', name: 'Аккумулятор', unit: 'мАч' },
        ];
      default:
        return [];
    }
  };

  // Получаем подсказки для характеристик в зависимости от категории
  const categoryAttributes = getCategoryAttributes(Number(form.watch("categoryId")));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h2 className="text-2xl font-semibold text-foreground">
            {product ? "Редактирование товара" : "Добавление нового товара"}
          </h2>
        </div>
        
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={productMutation.isPending}>
          {productMutation.isPending ? "Сохранение..." : "Сохранить"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="general">Основные параметры</TabsTrigger>
          <TabsTrigger value="attributes">Характеристики</TabsTrigger>
          <TabsTrigger value="flavors">Вкусы</TabsTrigger>
          <TabsTrigger value="image">Изображение</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Основные параметры */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                  <CardDescription>Базовые параметры товара</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Название */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название товара</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите название товара" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL-идентификатор (slug)</FormLabel>
                            <FormControl>
                              <Input placeholder="url-товара" {...field} />
                            </FormControl>
                            <FormDescription>
                              Используется в URL страницы товара
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={generateSlug}
                        className="w-full"
                      >
                        Сгенерировать автоматически
                      </Button>
                    </div>
                  </div>
                  
                  {/* Описание */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Введите описание товара" 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Цена */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Цена, ₽</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Классификация товара</CardTitle>
                  <CardDescription>Параметры категоризации</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Категория */}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Категория</FormLabel>
                        <Select 
                          value={String(field.value)}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category: any) => (
                              <SelectItem 
                                key={category.id} 
                                value={String(category.id)}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          От выбора категории зависят доступные характеристики товара
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Бренд */}
                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Бренд</FormLabel>
                        <Select 
                          value={field.value !== undefined ? String(field.value) : undefined}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите бренд" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Не указан</SelectItem>
                            {brands.map((brand: any) => (
                              <SelectItem 
                                key={brand.id} 
                                value={String(brand.id)}
                              >
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Google Sheet ID */}
                  <FormField
                    control={form.control}
                    name="googleSheetId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID в Google Таблице</FormLabel>
                        <FormControl>
                          <Input placeholder="ID товара в Google Таблице" {...field} />
                        </FormControl>
                        <FormDescription>
                          Используется для синхронизации с системой учета
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Статус товара</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Статус активности */}
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Товар активен</FormLabel>
                          <FormDescription>
                            Неактивные товары не отображаются на сайте
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {/* Метки товара */}
                  <div className="space-y-4">
                    <div className="text-sm font-medium">Метки товара</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Новинка */}
                      <FormField
                        control={form.control}
                        name="isNew"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Новинка</FormLabel>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">Новинка</Badge>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {/* Хит продаж */}
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Хит продаж</FormLabel>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="destructive">Хит продаж</Badge>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {/* Популярный товар */}
                      <FormField
                        control={form.control}
                        name="popular"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Популярный</FormLabel>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="default">Популярный</Badge>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Характеристики */}
            <TabsContent value="attributes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Характеристики товара</span>
                    <Button variant="outline" onClick={() => setShowAttributeDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить характеристику
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Технические характеристики товара
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {customAttributes.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      Характеристики товара не заданы. Добавьте их, нажав на кнопку выше.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customAttributes.map((attr) => (
                        <div key={attr.id} className="flex items-center space-x-3 border rounded-md p-3">
                          <div className="flex-1 grid grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs">Название</Label>
                              <div className="font-medium">{attr.name}</div>
                            </div>
                            <div>
                              <Label className="text-xs">Значение</Label>
                              <div className="font-medium">{attr.value}</div>
                            </div>
                            <div>
                              <Label className="text-xs">Единица измерения</Label>
                              <div className="font-medium">{attr.unit || "-"}</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAttribute(attr.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {categoryAttributes.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="text-sm font-medium mb-3">Подсказки для выбранной категории:</h3>
                        <div className="space-y-2">
                          {categoryAttributes.map((attr) => (
                            <div key={attr.id} className="text-sm text-muted-foreground">
                              • {attr.name} {attr.unit ? `(${attr.unit})` : ''}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Диалог добавления характеристики */}
              <Dialog open={showAttributeDialog} onOpenChange={setShowAttributeDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавление характеристики</DialogTitle>
                    <DialogDescription>
                      Укажите название и значение характеристики товара
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="attr-name">Название характеристики</Label>
                        <Input
                          id="attr-name"
                          placeholder="Например: Крепость, Объем, Мощность"
                          value={newAttribute.name}
                          onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="attr-value">Значение</Label>
                        <Input
                          id="attr-value"
                          placeholder="Например: 50, 100, Высокая"
                          value={newAttribute.value}
                          onChange={(e) => setNewAttribute({...newAttribute, value: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="attr-unit">Единица измерения (опционально)</Label>
                        <Input
                          id="attr-unit"
                          placeholder="Например: мг, мл, Вт"
                          value={newAttribute.unit}
                          onChange={(e) => setNewAttribute({...newAttribute, unit: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowAttributeDialog(false)}>
                      Отмена
                    </Button>
                    <Button type="button" onClick={handleAddAttribute}>
                      Добавить
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            {/* Вкусы */}
            <TabsContent value="flavors">
              <Card>
                <CardHeader>
                  <CardTitle>Вкусы</CardTitle>
                  <CardDescription>
                    Добавьте вкусы для жидкостей и одноразовых устройств
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flavors.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        Вкусы не добавлены
                      </div>
                    ) : (
                      <ScrollArea className="h-72 rounded-md border p-4">
                        <div className="space-y-2">
                          {flavors.map((flavor, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between rounded-lg border p-3"
                            >
                              <span>{flavor}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFlavor(index)}
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="Введите название вкуса"
                        value={newFlavor}
                        onChange={(e) => setNewFlavor(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddFlavor}
                      >
                        Добавить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Изображение */}
            <TabsContent value="image">
              <Card>
                <CardHeader>
                  <CardTitle>Изображение товара</CardTitle>
                  <CardDescription>
                    Загрузите изображение товара или укажите ссылку
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant={imageType === "upload" ? "default" : "outline"}
                          onClick={() => setImageType("upload")}
                          className="flex-1"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Загрузить файл
                        </Button>
                        <Button
                          type="button"
                          variant={imageType === "url" ? "default" : "outline"}
                          onClick={() => setImageType("url")}
                          className="flex-1"
                        >
                          <Link className="mr-2 h-4 w-4" />
                          Указать URL
                        </Button>
                      </div>
                      
                      {imageType === "upload" ? (
                        <div className="space-y-4">
                          <Label htmlFor="product-image">Выберите изображение</Label>
                          <Input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <FormDescription>
                            Рекомендуемый размер: 800x800 пикселей, формат: JPG, PNG
                          </FormDescription>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Label htmlFor="image-url">URL изображения</Label>
                          <Input
                            id="image-url"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => {
                              setImageUrl(e.target.value);
                              setImagePreview(e.target.value);
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    {imagePreview && (
                      <div className="space-y-2">
                        <Label>Предпросмотр</Label>
                        <div className="rounded-lg border overflow-hidden w-full max-w-md mx-auto">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="object-contain max-h-72 w-full"
                            onError={() => setImagePreview("")}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={productMutation.isPending}
        >
          {productMutation.isPending ? "Сохранение..." : "Сохранить товар"}
        </Button>
      </div>
    </div>
  );
}