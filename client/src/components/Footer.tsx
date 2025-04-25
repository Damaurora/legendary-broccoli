import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollToAnchor } from "@/hooks/useScrollToAnchor";

const collections = [
  { name: "Classical Collection", url: "#" },
  { name: "Modern Collection", url: "#" },
  { name: "Botanical Collection", url: "#" },
  { name: "Heritage Collection", url: "#" },
  { name: "Luxury Collection", url: "#" }
];

const customerCare = [
  { name: "Fabric Care Guide", url: "#" },
  { name: "Shipping Information", url: "#" },
  { name: "Returns & Exchanges", url: "#" },
  { name: "FAQs", url: "#" },
  { name: "Contact Support", url: "#" }
];

const Footer = () => {
  const { toast } = useToast();
  const scrollToAnchor = useScrollToAnchor();
  const [email, setEmail] = useState("");

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToAnchor("about");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Thank you for subscribing to our newsletter!"
    });

    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">About Damask</h3>
            <p className="text-gray-400 mb-4">
              Premium textile manufacturers since 1892. Our fabrics combine traditional craftsmanship with modern design sensibilities.
            </p>
            <a 
              href="#about" 
              className="text-white hover:text-[#FF0000] transition-colors duration-300"
              onClick={handleLearnMoreClick}
            >
              Learn More →
            </a>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Collections</h3>
            <ul className="space-y-2 text-gray-400">
              {collections.map((collection, index) => (
                <li key={index}>
                  <a href={collection.url} className="hover:text-white transition-colors duration-300">
                    {collection.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-gray-400">
              {customerCare.map((item, index) => (
                <li key={index}>
                  <a href={item.url} className="hover:text-white transition-colors duration-300">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to receive updates on new collections and exclusive offers.</p>
            <form className="flex" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-0 py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#FF0000]" 
              />
              <button 
                type="submit" 
                className="bg-[#FF0000] text-white px-4 py-2 hover:bg-red-700 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; 2023 Damask Fabrics. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
