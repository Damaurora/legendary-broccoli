import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock
} from "lucide-react";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов"),
  email: z.string().email("Введите корректный email"),
  subject: z.string().min(3, "Тема должна содержать не менее 3 символов"),
  message: z.string().min(10, "Сообщение должно содержать не менее 10 символов")
});

type FormData = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });
  
  // Contact info
  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "Адрес",
      content: "г. Москва, ул. Примерная, д. 123"
    },
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      title: "Телефон",
      content: "+7 (999) 123-45-67"
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: "Email",
      content: "info@damask-shop.ru"
    },
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      title: "Режим работы",
      content: "Пн-Вс: 10:00 - 22:00"
    }
  ];
  
  const onSubmit = async (data: FormData) => {
    try {
      // In a real app, this would make an API call
      console.log("Form data:", data);
      
      // Show success toast
      toast({
        title: "Сообщение отправлено",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      
      // Reset form
      reset();
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div id="contacts" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Свяжитесь с нами
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            У вас есть вопросы или предложения? Напишите нам, и мы свяжемся с вами в ближайшее время.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <div className="bg-background p-6 rounded-lg border border-border">
            <h3 className="text-xl font-medium text-white mb-4">
              Отправить сообщение
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  placeholder="Ваше имя"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Input
                  placeholder="Тема сообщения"
                  {...register("subject")}
                  className={errors.subject ? "border-destructive" : ""}
                />
                {errors.subject && (
                  <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <Textarea
                  placeholder="Ваше сообщение"
                  rows={5}
                  {...register("message")}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Отправка..." : "Отправить сообщение"}
              </Button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex space-x-4 p-4 bg-background rounded-lg border border-border">
                <div className="mt-1">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-medium text-white">{item.title}</h4>
                  <p className="text-muted-foreground">{item.content}</p>
                </div>
              </div>
            ))}
            
            {/* Map placeholder */}
            <div className="mt-6">
              <div className="bg-background h-[250px] rounded-lg border border-border flex items-center justify-center p-4">
                <p className="text-muted-foreground text-center">
                  Здесь будет карта с местоположением магазинов
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}