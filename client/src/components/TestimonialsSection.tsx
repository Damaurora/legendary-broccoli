const testimonials = [
  {
    text: "Damask fabrics have transformed our hotel's interior. The quality and durability are unmatched, and our guests frequently compliment the elegant designs.",
    author: "Sophia Reynolds",
    position: "Luxury Hotel Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face"
  },
  {
    text: "Working with Damask for our restaurant chain has been a pleasure. The fabrics are not only beautiful but also functional, withstanding the demands of our high-traffic environment.",
    author: "Marcus Chen",
    position: "Restaurant Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
          <div className="w-16 h-1 bg-[#FF0000] mx-auto mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 shadow-sm relative">
              <div className="text-5xl text-[#FF0000] opacity-20 absolute top-4 left-4">"</div>
              <div className="relative z-10">
                <p className="text-gray-700 mb-6 italic">{testimonial.text}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={`${testimonial.author} portrait`} 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
