import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import ProductForm from "./product-form";

export default function ProductManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Fetch products
  const { data: products, isLoading } = useQuery<any[]>({
    queryKey: ["/api/products/admin"],
  });
  
  // Filter products based on search term
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle create new product
  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };
  
  // Handle edit product
  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  
  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };
  
  // Delete product
  const handleDelete = (productId: string) => {
    // In a real app, this would make an API call
    // For now, just log the action
    console.log(`Delete product: ${productId}`);
  };
  
  if (showForm) {
    return (
      <ProductForm 
        product={editingProduct} 
        onClose={handleCloseForm} 
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Товары</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Добавить товар
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative max-w-md">
        <Input
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <div className="absolute left-3 top-2.5 text-muted-foreground">
          <Search size={16} />
        </div>
      </div>
      
      {/* Products table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Бренд</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center p-4">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground p-4">
                  {searchTerm ? "Нет товаров, соответствующих поиску" : "Нет товаров"}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-card rounded">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-10 w-10 object-cover rounded"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category?.name || "-"}</TableCell>
                  <TableCell>{product.brand?.name || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}