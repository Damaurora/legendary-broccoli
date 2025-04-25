import { useScrollToAnchor } from "@/hooks/useScrollToAnchor";

const HeroSection = () => {
  const scrollToAnchor = useScrollToAnchor();

  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToAnchor("collections");
  };

  return (
    <section id="home" className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">Exquisite Fabrics for Discerning Tastes</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">Premium textiles inspired by tradition, crafted for modern living.</p>
            <a 
              href="#collections" 
              className="inline-block bg-black text-white px-8 py-3 rounded-none hover:bg-[#FF0000] transition-colors duration-300"
              onClick={handleExploreClick}
            >
              Explore Collections
            </a>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1560859268-5852f0d201a7?w=800&h=800&fit=crop&crop=center" 
              alt="Luxury fabric pattern" 
              className="w-full h-auto shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
