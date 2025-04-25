import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import ProductDetail from "@/pages/product-detail";
import AdminPage from "@/pages/admin";
import AuthPage from "@/pages/auth-page";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AgeVerification from "@/components/common/age-verification";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Защищенный маршрут для админ-панели
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, navigate] = useLocation();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user || !user.isAdmin) {
    // Если пользователь не админ, перенаправляем на страницу аутентификации
    navigate("/auth");
    return null;
  }
  
  return <Component />;
}

function Router() {
  const [location] = useLocation();
  
  // Не показываем шапку и подвал на странице авторизации
  const isAuthPage = location === "/auth";
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className={`flex-grow ${isAuthPage ? '' : 'pt-0'}`}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/catalog/:categorySlug" component={Catalog} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/admin">
            <ProtectedRoute component={AdminPage} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <AgeVerification />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
