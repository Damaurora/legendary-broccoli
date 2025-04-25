import { CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  const advantages = [
    {
      title: "Широкий ассортимент",
      description: "Более 1000 товаров от ведущих производителей электронных сигарет, жидкостей и аксессуаров."
    },
    {
      title: "Гарантия качества",
      description: "Все товары проходят строгий контроль качества и имеют необходимые сертификаты."
    },
    {
      title: "Быстрая доставка",
      description: "Доставка по всей России в кратчайшие сроки. Возможен самовывоз из наших магазинов."
    },
    {
      title: "Профессиональная консультация",
      description: "Наши специалисты всегда готовы помочь с выбором и ответить на все вопросы."
    }
  ];

  return (
    <div id="about" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            О нас
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Damask Shop — это сеть магазинов электронных сигарет и аксессуаров для вейпинга с многолетним опытом работы.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Наша компания начала свою деятельность в 2015 году и за это время зарекомендовала себя как надежный поставщик качественной вейп-продукции. Мы напрямую сотрудничаем с производителями, что позволяет нам предлагать только оригинальные товары по доступным ценам.
            </p>
            <p className="text-muted-foreground">
              В нашем ассортименте представлены электронные сигареты, под-системы, жидкости для вейпа, комплектующие и аксессуары от ведущих мировых брендов.
            </p>
            <p className="text-muted-foreground">
              Мы стремимся создать комфортные условия для каждого клиента, предлагая профессиональные консультации, удобную доставку и послепродажное обслуживание.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {advantages.map((advantage, index) => (
              <div 
                key={index} 
                className="bg-background p-4 rounded-lg border border-border"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="mt-1 text-primary flex-shrink-0" size={18} />
                  <div>
                    <h3 className="font-medium text-white mb-1">{advantage.title}</h3>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-background rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-2">5+</div>
            <div className="text-muted-foreground">Лет на рынке</div>
          </div>
          <div className="p-6 bg-background rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-2">1000+</div>
            <div className="text-muted-foreground">Товаров в каталоге</div>
          </div>
          <div className="p-6 bg-background rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-2">20+</div>
            <div className="text-muted-foreground">Точек продаж</div>
          </div>
          <div className="p-6 bg-background rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Довольных клиентов</div>
          </div>
        </div>
      </div>
    </div>
  );
}