import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import ProductDetail from "@/pages/product-detail";
import AdminPage from "@/pages/admin";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AgeVerification from "@/components/common/age-verification";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/catalog/:categorySlug" component={Catalog} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
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
