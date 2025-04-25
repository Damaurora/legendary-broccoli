import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, RefreshCw, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SyncPanel() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);
  
  // Simulate sync with external API
  const handleSync = () => {
    if (!apiKey) {
      toast({
        title: "Ошибка",
        description: "Введите API ключ для синхронизации",
        variant: "destructive",
      });
      return;
    }
    
    setSyncStatus("loading");
    
    // Simulate API call with timeout
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setSyncStatus("success");
        setLastSyncDate(new Date().toLocaleString());
        toast({
          title: "Синхронизация завершена",
          description: "Данные успешно синхронизированы с внешним API",
        });
      } else {
        setSyncStatus("error");
        toast({
          title: "Ошибка синхронизации",
          description: "Не удалось выполнить синхронизацию. Проверьте API ключ и повторите попытку.",
          variant: "destructive",
        });
      }
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSyncStatus("idle");
      }, 3000);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Синхронизация данных</CardTitle>
          <CardDescription>
            Интеграция с внешними сервисами и API для синхронизации данных о товарах и наличии.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API ключ</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Введите API ключ"
                type="password"
              />
            </div>
            
            {lastSyncDate && (
              <div className="text-sm text-muted-foreground">
                Последняя синхронизация: {lastSyncDate}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSync}
            disabled={syncStatus === "loading"}
            className="w-full"
          >
            {syncStatus === "idle" && (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Синхронизировать данные
              </>
            )}
            
            {syncStatus === "loading" && (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Синхронизация...
              </>
            )}
            
            {syncStatus === "success" && (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Синхронизировано
              </>
            )}
            
            {syncStatus === "error" && (
              <>
                <X className="mr-2 h-4 w-4 text-destructive" />
                Ошибка синхронизации
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Экспорт данных</CardTitle>
          <CardDescription>
            Выгрузка данных из системы в различных форматах.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Вы можете экспортировать данные о товарах, категориях и наличии в форматах CSV, JSON или Excel.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline">
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            JSON
          </Button>
          <Button variant="outline">
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Excel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}