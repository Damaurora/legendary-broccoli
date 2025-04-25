import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import FireLogo from "@/components/ui/fire-logo";
import { Menu, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: categories } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <FireLogo className="mr-2" />
              <div>
                <span className="font-bold text-2xl text-white shop-logo-text">
                  Damask <span className="text-primary">Shop</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Search - desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full bg-muted border border-border rounded-full py-2 px-4 pl-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-muted-foreground">
                <Search size={18} />
              </div>
            </form>
          </div>

          {/* Navigation - desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Главная
            </Link>
            <Link href="/catalog" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Каталог
            </Link>
            <Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              О нас
            </Link>
            <Link href="/#contacts" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Контакты
            </Link>
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Админ
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden text-muted-foreground focus:outline-none">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-l border-border p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                      <FireLogo width={30} height={30} className="mr-2" />
                      <span className="font-bold text-xl text-white shop-logo-text">
                        Damask <span className="text-primary">Shop</span>
                      </span>
                    </Link>
                    <button onClick={() => setIsMenuOpen(false)}>
                      <X size={24} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <nav className="p-4 flex flex-col space-y-4">
                  <Link href="/" onClick={() => setIsMenuOpen(false)} 
                    className="text-muted-foreground hover:text-primary py-2 transition-colors font-medium">
                    Главная
                  </Link>
                  <Link href="/catalog" onClick={() => setIsMenuOpen(false)} 
                    className="text-muted-foreground hover:text-primary py-2 transition-colors font-medium">
                    Каталог
                  </Link>
                  <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-medium mb-2">Категории</h3>
                    {categories?.map(category => (
                      <Link
                        key={category.id}
                        href={`/catalog/${category.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4">
                    <Link href="/#about" onClick={() => setIsMenuOpen(false)} 
                      className="block py-2 text-muted-foreground hover:text-primary transition-colors font-medium">
                      О нас
                    </Link>
                    <Link href="/#contacts" onClick={() => setIsMenuOpen(false)} 
                      className="block py-2 text-muted-foreground hover:text-primary transition-colors font-medium">
                      Контакты
                    </Link>
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} 
                      className="block py-2 text-muted-foreground hover:text-primary transition-colors font-medium">
                      Админ
                    </Link>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Search (visible only on mobile) */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder="Поиск товаров..."
              className="w-full bg-muted border border-border rounded-full py-2 px-4 pl-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-muted-foreground">
              <Search size={18} />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}