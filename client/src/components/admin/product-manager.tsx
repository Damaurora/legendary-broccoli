import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Search, Filter, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "./product-form";

export default function ProductManager() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isNewFilter, setIsNewFilter] = useState(false);
  const [isFeaturedFilter, setIsFeaturedFilter] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Загрузка категорий для фильтрации
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  // Строим запрос с учетом фильтров
  const queryString = new URLSearchParams();
  if (search) queryString.set("search", search);
  if (categoryFilter) queryString.set("category", categoryFilter);
  if (isNewFilter) queryString.set("isNew", "true");
  if (isFeaturedFilter) queryString.set("featured", "true");
  if (!isActiveFilter) queryString.set("includeInactive", "true");
  queryString.set("page", currentPage.toString());

  // Загрузка товаров
  const { data: productsData, isLoading } = useQuery<any>({
    queryKey: [`/api/products/admin?${queryString.toString()}`],
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || { totalPages: 1 };

  // Мутация для удаления товара
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/products/${id}`);
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Товар удален",
        description: "Товар был успешно удален из системы.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/products/admin`] });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка при удалении",
        description: error.message || "Не удалось удалить товар.",
        variant: "destructive",
      });
    },
  });

  // Обработчик удаления товара
  const handleDeleteProduct = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
      deleteProductMutation.mutate(id);
    }
  };

  // Обработчик редактирования товара
  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  // Обработчик создания нового товара
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  // Обработчик закрытия формы
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  // Обработчик сохранения изменений
  const handleProductSaved = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
    queryClient.invalidateQueries({ queryKey: [`/api/products/admin`] });
  };

  // Обработчик поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Обработчик смены страницы пагинации
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Отображаем форму редактирования, если она открыта
  if (isFormOpen) {
    return (
      <ProductForm 
        product={selectedProduct} 
        onClose={handleCloseForm} 
        onSave={handleProductSaved}
      />
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Выберите параметры для фильтрации товаров</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Поиск */}
            <div>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Поиск по названию или описанию..."
                  className="pr-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            {/* Фильтр по категории */}
            <div>
              <Label htmlFor="category-filter">Категория</Label>
              <Select 
                value={categoryFilter} 
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все категории</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Дополнительные фильтры */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured-filter" 
                  checked={isFeaturedFilter}
                  onCheckedChange={(checked) => setIsFeaturedFilter(!!checked)}
                />
                <Label htmlFor="featured-filter">Только хиты</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="new-filter" 
                  checked={isNewFilter}
                  onCheckedChange={(checked) => setIsNewFilter(!!checked)}
                />
                <Label htmlFor="new-filter">Только новинки</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="active-filter" 
                  checked={isActiveFilter}
                  onCheckedChange={(checked) => setIsActiveFilter(!!checked)}
                />
                <Label htmlFor="active-filter">Только активные товары</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Управление товарами</h2>
        <Button onClick={handleCreateProduct}>
          <Plus className="mr-2 h-4 w-4" /> Добавить товар
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Загрузка товаров...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 space-y-4">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <p className="text-lg text-muted-foreground">
            Товары не найдены. Измените параметры поиска или добавьте новые товары.
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена, ₽</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                    {product.googleSheetId && (
                      <div className="text-xs text-muted-foreground mt-1">
                        ID в Google Sheet: {product.googleSheetId}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.category?.name || '-'}</TableCell>
                  <TableCell>{product.price?.toLocaleString() || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {!product.isActive && (
                        <Badge variant="outline" className="text-destructive border-destructive">
                          Неактивен
                        </Badge>
                      )}
                      {product.isNew && (
                        <Badge variant="secondary">Новинка</Badge>
                      )}
                      {product.featured && (
                        <Badge variant="destructive">Хит продаж</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Пагинация */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Назад
            </Button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
            >
              Вперед
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}