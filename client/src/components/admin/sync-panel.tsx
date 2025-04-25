import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Table as TableIcon,
  FileSpreadsheet,
  FileText,
  Link 
} from "lucide-react";

export default function SyncPanel() {
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncResults, setSyncResults] = useState<any[]>([]);
  const [showConfirmSyncDialog, setShowConfirmSyncDialog] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Получаем статус синхронизации
  const { data: syncStatus, isLoading: isLoadingSyncStatus } = useQuery<any>({
    queryKey: ["/api/sync/status"],
    refetchInterval: isSyncing ? 2000 : false,
  });
  
  // Мутация для запуска синхронизации
  const syncMutation = useMutation({
    mutationFn: async () => {
      setIsSyncing(true);
      setSyncProgress(0);
      setSyncResults([]);
      
      const res = await apiRequest("POST", "/api/sync", { 
        sheetUrl: googleSheetUrl 
      });
      
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Синхронизация запущена",
        description: "Синхронизация с Google Таблицей запущена успешно.",
      });
      
      // Запускаем интервал для проверки статуса синхронизации
      const interval = setInterval(() => {
        fetchSyncStatus();
      }, 2000);
      
      // Сохраняем интервал
      setTimeout(() => {
        clearInterval(interval);
        setIsSyncing(false);
      }, 60000); // Максимум 1 минута ожидания
    },
    onError: (error: any) => {
      setIsSyncing(false);
      toast({
        title: "Ошибка синхронизации",
        description: error.message || "Не удалось запустить синхронизацию.",
        variant: "destructive",
      });
    },
  });
  
  // Мутация для экспорта товаров в Google Таблицу
  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sync/export", { 
        sheetUrl: googleSheetUrl 
      });
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Экспорт выполнен",
        description: "Товары успешно экспортированы в Google Таблицу.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка экспорта",
        description: error.message || "Не удалось экспортировать товары.",
        variant: "destructive",
      });
    },
  });

  // Обновляем статус синхронизации
  const fetchSyncStatus = async () => {
    try {
      const res = await fetch("/api/sync/status");
      const data = await res.json();
      
      if (data.isRunning) {
        setSyncProgress(data.progress || 0);
      } else if (data.lastResults) {
        setSyncResults(data.lastResults);
        setIsSyncing(false);
        
        // Обновляем список товаров
        queryClient.invalidateQueries({ queryKey: [`/api/products`] });
        
        toast({
          title: "Синхронизация завершена",
          description: `Обновлено ${data.lastResults.filter((r: any) => r.success).length} из ${data.lastResults.length} товаров.`,
        });
      }
    } catch (error) {
      console.error("Ошибка при получении статуса синхронизации", error);
    }
  };

  // Запускаем синхронизацию
  const handleStartSync = () => {
    if (!googleSheetUrl) {
      toast({
        title: "Требуется URL таблицы",
        description: "Пожалуйста, укажите URL Google Таблицы для синхронизации.",
        variant: "destructive",
      });
      return;
    }
    
    setShowConfirmSyncDialog(false);
    syncMutation.mutate();
  };
  
  // Запускаем экспорт
  const handleExport = () => {
    if (!googleSheetUrl) {
      toast({
        title: "Требуется URL таблицы",
        description: "Пожалуйста, укажите URL Google Таблицы для экспорта.",
        variant: "destructive",
      });
      return;
    }
    
    exportMutation.mutate();
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Синхронизация с Google Таблицей</CardTitle>
          <CardDescription>
            Синхронизируйте товары с Google Таблицей для автоматического обновления остатков
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="google-sheet-url" className="text-sm font-medium">
                URL Google Таблицы
              </label>
              <Input
                id="google-sheet-url"
                placeholder="Вставьте URL Google Таблицы"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Укажите URL Google Таблицы. Таблица должна быть доступна для чтения.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <AlertDialog open={showConfirmSyncDialog} onOpenChange={setShowConfirmSyncDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="default" 
                    className="flex-1"
                    disabled={isSyncing || syncMutation.isPending || !googleSheetUrl}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Синхронизировать остатки
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Подтверждение синхронизации</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите запустить синхронизацию с Google Таблицей?
                      Этот процесс обновит количество товаров на складе в соответствии с данными в таблице.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleStartSync}>
                      Запустить синхронизацию
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleExport}
                disabled={exportMutation.isPending || !googleSheetUrl}
              >
                <TableIcon className="mr-2 h-4 w-4" />
                Экспортировать товары в таблицу
              </Button>
            </div>
          </div>
          
          {isSyncing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Синхронизация в процессе...</span>
                <span className="text-sm">{Math.round(syncProgress)}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
          
          {!isSyncing && syncResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Результаты последней синхронизации</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">Статус</TableHead>
                      <TableHead>Наименование</TableHead>
                      <TableHead>ID в таблице</TableHead>
                      <TableHead className="w-32">Остаток</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">
                          {result.success ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 inline-block" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 inline-block" />
                          )}
                        </TableCell>
                        <TableCell>{result.productName}</TableCell>
                        <TableCell>{result.googleSheetId}</TableCell>
                        <TableCell>
                          {result.success ? (
                            <span>{result.quantity || 0}</span>
                          ) : (
                            <span className="text-red-500">{result.error || "Ошибка"}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Инструкция по работе с Google Таблицами</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Структура таблицы
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Таблица должна содержать следующие колонки:
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название колонки</TableHead>
                    <TableHead>Описание</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Уникальный идентификатор товара в таблице</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>Название товара</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Цена</TableCell>
                    <TableCell>Цена товара в рублях</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Количество (Гагарина)</TableCell>
                    <TableCell>Остаток товара в магазине на ул. Гагарина</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Количество (Победы)</TableCell>
                    <TableCell>Остаток товара в магазине на ул. Победы</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Как подключить таблицу
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Создайте Google Таблицу и добавьте необходимые колонки</li>
                <li>Откройте доступ к таблице по ссылке (только для чтения)</li>
                <li>Скопируйте URL таблицы и вставьте в поле выше</li>
                <li>Укажите ID из таблицы в соответствующем поле при добавлении или редактировании товара</li>
                <li>Используйте кнопку синхронизации для обновления остатков товаров</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Link className="mr-2 h-5 w-5" />
                Полезные ссылки
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://docs.google.com/spreadsheets/create" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Создать новую Google Таблицу
                  </a>
                </li>
                <li>
                  <a 
                    href="https://support.google.com/docs/answer/9331169?hl=ru" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Настройка доступа к таблице
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}