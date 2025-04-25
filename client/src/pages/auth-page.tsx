import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import FireLogo from "@/components/ui/fire-logo";
import { User, Lock } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Имя пользователя обязательно"),
  password: z.string().min(1, "Пароль обязателен"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Имя пользователя должно содержать минимум 3 символа"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Проверяем, аутентифицирован ли пользователь
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
  });
  
  // Перенаправляем на главную, если пользователь уже авторизован
  useEffect(() => {
    if (userData && !isLoadingUser) {
      navigate("/");
    }
  }, [userData, isLoadingUser, navigate]);
  
  // Форма входа
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Форма регистрации
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Мутация для входа
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiRequest("POST", "/api/login", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Неверное имя пользователя или пароль");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в систему",
      });
      navigate("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Мутация для регистрации
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const { confirmPassword, ...registerData } = data;
      const res = await apiRequest("POST", "/api/register", registerData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ошибка при регистрации");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешная регистрация",
        description: "Аккаунт успешно создан",
      });
      navigate("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка регистрации",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Обработчики отправки форм
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };
  
  // Если идет проверка аутентификации, показываем заглушку
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="text-muted-foreground">Проверка авторизации...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex min-h-[80vh] flex-col md:flex-row">
        {/* Форма аутентификации */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <FireLogo className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl">Вход в панель администратора</CardTitle>
              <CardDescription>
                Damask Shop - управление товарами и заказами
              </CardDescription>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              
              {/* Вкладка входа */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 p-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя пользователя</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} placeholder="Введите имя пользователя" className="pl-10" />
                              <div className="absolute left-3 top-2.5 text-muted-foreground">
                                <User size={16} />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Пароль</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Введите пароль" 
                                className="pl-10" 
                              />
                              <div className="absolute left-3 top-2.5 text-muted-foreground">
                                <Lock size={16} />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Вход..." : "Войти"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Вкладка регистрации */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 p-6">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя пользователя</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} placeholder="Придумайте имя пользователя" className="pl-10" />
                              <div className="absolute left-3 top-2.5 text-muted-foreground">
                                <User size={16} />
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Минимум 3 символа
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Пароль</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Придумайте пароль" 
                                className="pl-10" 
                              />
                              <div className="absolute left-3 top-2.5 text-muted-foreground">
                                <Lock size={16} />
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Минимум 6 символов
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подтверждение пароля</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Повторите пароль" 
                                className="pl-10" 
                              />
                              <div className="absolute left-3 top-2.5 text-muted-foreground">
                                <Lock size={16} />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-center border-t p-6">
              <Button variant="outline" onClick={() => navigate("/")}>
                Вернуться на главную
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Информационная секция */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background hidden md:flex flex-col items-center justify-center text-center p-10 rounded-r-lg">
          <h1 className="text-4xl font-bold mb-6">Damask Shop Admin</h1>
          <div className="space-y-4 max-w-md">
            <p className="text-lg text-muted-foreground">
              Панель администратора позволяет управлять товарами, следить за 
              заказами и контролировать остатки на складе.
            </p>
            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="border rounded-lg p-4 bg-card">
                <h3 className="font-medium mb-2">Управление товарами</h3>
                <p className="text-sm text-muted-foreground">
                  Добавление, редактирование и удаление товаров с динамическими характеристиками
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-card">
                <h3 className="font-medium mb-2">Синхронизация с Google Таблицами</h3>
                <p className="text-sm text-muted-foreground">
                  Автоматическое обновление остатков товаров из Google Таблиц
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-card">
                <h3 className="font-medium mb-2">Управление категориями</h3>
                <p className="text-sm text-muted-foreground">
                  Создание и редактирование категорий товаров с уникальными характеристиками
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}