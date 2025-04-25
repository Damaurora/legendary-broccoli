import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-white mb-2">Страница не найдена</p>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Запрашиваемая страница не существует или была перемещена.
      </p>
      
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          Назад
        </Button>
        
        <Button
          onClick={() => navigate("/")}
        >
          На главную
        </Button>
      </div>
    </div>
  );
}