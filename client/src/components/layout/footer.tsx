import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

import FireLogo from "@/components/ui/fire-logo";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const { data: categories } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите email",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send to an API endpoint
    toast({
      title: "Успешно!",
      description: "Вы подписались на новости и акции Damask Shop",
    });
    
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <FireLogo width={35} height={35} className="mr-2" />
              <span className="font-bold text-xl text-white shop-logo-text">
                Damask <span className="text-primary">Shop</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Лучший магазин вейп-продукции с широким ассортиментом электронных сигарет, жидкостей и аксессуаров.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="VK">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.579 6.855c.14-.465 0-.806-.662-.806h-2.193c-.558 0-.813.295-.953.619 0 0-1.115 2.719-2.695 4.482-.51.513-.741.675-1.021.675-.139 0-.341-.162-.341-.627V6.855c0-.558-.161-.806-.626-.806H9.642c-.348 0-.558.258-.558.504 0 .528.79.65.871 2.138v3.228c0 .707-.127.836-.407.836-.742 0-2.546-2.725-3.617-5.844-.209-.606-.42-.856-.98-.856H2.76c-.627 0-.752.295-.752.619 0 .582.742 3.462 3.461 7.271 1.812 2.601 4.363 4.011 6.687 4.011 1.393 0 1.565-.313 1.565-.853v-1.966c0-.626.133-.751.574-.751.324 0 .882.164 2.183 1.417 1.486 1.486 1.732 2.153 2.567 2.153h2.193c.627 0 .939-.313.759-.932-.197-.615-.907-1.51-1.849-2.569-.512-.604-1.277-1.254-1.51-1.579-.325-.419-.232-.605 0-.976.001 0 2.672-3.761 2.95-5.04z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Telegram">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.21-1.59.15-.15 2.71-2.46 2.76-2.67.01-.04 0-.12-.08-.12-.06 0-.18.05-.33.16l-3.76 2.51c-.44.28-1.11.59-1.11.59s-.47-.61-.77-.92c-.58-.58-.82-1.2-.47-1.45.16-.11.39-.24 1.65-.68 1.25-.44 2-1.04 2.46-1.22.46-.18 2.16-.86 2.4-.86.06 0 .14.01.14.12 0 .07-.01.24-.02.27z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Column 2 - Categories */}
          <div>
            <h3 className="font-medium text-white mb-4">Категории</h3>
            <ul className="space-y-2">
              {categories?.slice(0, 6).map(category => (
                <li key={category.id}>
                  <Link href={`/catalog/${category.slug}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3 - Information */}
          <div>
            <h3 className="font-medium text-white mb-4">Информация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/#contacts" className="text-muted-foreground hover:text-primary transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Админ-панель
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="font-medium text-white mb-4">Подписка на новости</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Подпишитесь на наши новости и узнавайте о новинках и акциях первыми
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Ваш email"
                className="bg-muted border border-border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Подписаться
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Damask Shop. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}