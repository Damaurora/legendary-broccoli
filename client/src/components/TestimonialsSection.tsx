import { useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  // Sample testimonials data
  const testimonials = [
    {
      name: "Алексей К.",
      role: "Постоянный клиент",
      content: "Отличный магазин с широким ассортиментом. Нашел именно ту модель, которую долго искал. Консультанты помогли с выбором жидкости. Рекомендую всем любителям вейпинга!",
      rating: 5,
      image: null
    },
    {
      name: "Мария С.",
      role: "Новичок в вейпинге",
      content: "Впервые решила попробовать электронную сигарету, совершенно не разбиралась в этом. В Damask Shop мне подробно объяснили все нюансы, подобрали устройство для новичка. Очень довольна покупкой и обслуживанием.",
      rating: 5,
      image: null
    },
    {
      name: "Дмитрий П.",
      role: "Опытный вейпер",
      content: "Хороший выбор жидкостей, постоянно появляются новинки. Цены адекватные. Доставка работает быстро и без проблем. Уже год закупаюсь только здесь.",
      rating: 4,
      image: null
    },
    {
      name: "Екатерина В.",
      role: "Клиент",
      content: "Заказывала pod-систему с доставкой. Привезли быстро, товар оригинальный. Приятно удивили небольшие подарки к заказу. Буду заказывать еще!",
      rating: 5,
      image: null
    },
    {
      name: "Артем Л.",
      role: "Коллекционер вейпов",
      content: "Нашел здесь редкую модель, которой не было в других магазинах. Порадовало наличие сертификатов и гарантии. Менеджеры всегда на связи и готовы помочь с любыми вопросами.",
      rating: 5,
      image: null
    }
  ];

  // Render a single star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex space-x-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={index < rating ? "text-primary fill-primary" : "text-muted-foreground"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Отзывы наших клиентов
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Мнения реальных покупателей о нашем магазине и товарах
          </p>
        </div>
        
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                <div className="bg-card rounded-lg p-6 h-full border border-border flex flex-col">
                  {renderRating(testimonial.rating)}
                  
                  <p className="text-muted-foreground flex-grow mb-4">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center mt-auto">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-white">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden md:flex justify-center mt-4">
            <CarouselPrevious className="relative mr-2" />
            <CarouselNext className="relative ml-2" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}