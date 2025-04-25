const collections = [
  {
    image: "https://images.unsplash.com/photo-1548484352-ea579e5233a8?w=600&h=400&fit=crop",
    title: "Classical Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&h=400&fit=crop",
    title: "Modern Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=600&h=400&fit=crop",
    title: "Botanical Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1580644228275-9adf2aacf31e?w=600&h=400&fit=crop",
    title: "Heritage Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1587587393350-fea088e561ce?w=600&h=400&fit=crop",
    title: "Luxury Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600&h=400&fit=crop",
    title: "Seasonal Collection",
  }
];

const CollectionsSection = () => {
  return (
    <section id="collections" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Collections</h2>
          <div className="w-16 h-1 bg-[#FF0000] mx-auto mb-8"></div>
          <p className="text-lg text-gray-700">Discover our signature textile collections, where heritage meets contemporary style.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <div key={index} className="group relative overflow-hidden">
              <img 
                src={collection.image} 
                alt={collection.title} 
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center p-4">
                  <h3 className="text-white text-2xl font-bold mb-2">{collection.title}</h3>
                  <a href="#" className="inline-block bg-white text-black px-6 py-2 mt-2 hover:bg-[#FF0000] hover:text-white transition-colors duration-300">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
