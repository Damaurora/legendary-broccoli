import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManager from "@/components/admin/product-manager";
import SyncPanel from "@/components/admin/sync-panel";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("products");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Панель администратора</h1>
      
      <Tabs defaultValue="products" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="products">Управление товарами</TabsTrigger>
          <TabsTrigger value="sync">Синхронизация</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <ProductManager />
        </TabsContent>
        
        <TabsContent value="sync">
          <SyncPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}