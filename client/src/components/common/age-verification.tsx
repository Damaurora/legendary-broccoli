import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FireLogo from "@/components/ui/fire-logo";

const AGE_VERIFICATION_KEY = "damask-age-verified";

export default function AgeVerification() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user already verified age
    const isVerified = localStorage.getItem(AGE_VERIFICATION_KEY);
    
    if (!isVerified) {
      setIsOpen(true);
    }
  }, []);

  const handleVerify = () => {
    // Save verification in localStorage
    localStorage.setItem(AGE_VERIFICATION_KEY, "true");
    setIsOpen(false);
  };

  const handleReject = () => {
    // Redirect to another site
    window.location.href = "https://www.google.com";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <FireLogo width={50} height={50} />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
            Проверка возраста
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-center text-muted-foreground mb-2">
            Вам должно быть не менее 18 лет, чтобы посетить этот сайт.
          </p>
          <p className="text-center text-muted-foreground">
            Нажимая кнопку "Мне есть 18 лет", вы подтверждаете свой возраст.
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleReject}
            className="sm:flex-1"
          >
            Мне нет 18 лет
          </Button>
          <Button
            onClick={handleVerify}
            className="bg-primary hover:bg-primary/90 sm:flex-1"
          >
            Мне есть 18 лет
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}