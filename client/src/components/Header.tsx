import { useState } from "react";
import { useScrollToAnchor } from "@/hooks/useScrollToAnchor";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollToAnchor = useScrollToAnchor();

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToAnchor(id);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold tracking-tighter">DAMASK</a>
        
        {/* Navigation for desktop */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><a href="#home" className="hover:text-[#FF0000] transition-colors duration-300" onClick={(e) => handleNavClick(e, "home")}>Home</a></li>
            <li><a href="#about" className="hover:text-[#FF0000] transition-colors duration-300" onClick={(e) => handleNavClick(e, "about")}>About</a></li>
            <li><a href="#collections" className="hover:text-[#FF0000] transition-colors duration-300" onClick={(e) => handleNavClick(e, "collections")}>Collections</a></li>
            <li><a href="#contact" className="hover:text-[#FF0000] transition-colors duration-300" onClick={(e) => handleNavClick(e, "contact")}>Contact</a></li>
          </ul>
        </nav>
        
        {/* Mobile menu button */}
        <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white w-full border-t border-gray-200`}>
        <ul className="px-4 py-2">
          <li className="py-2"><a href="#home" className="block hover:text-[#FF0000] transition-colors duration-300" onClick={(e) => handleNavClick(e, "home")}>Home</a></li>
          <li className="py-2"><a href="#about" className="block hover:text-[#FF0000] transition-colors duration-300" onClick={(e) => handleNavClick(e, "about")}>About</a></li>
          <li className="py-2"><a href="#collections" className="block hover:text-[#FF0000] transition-colors duration-300" onClick={(e) => handleNavClick(e, "collections")}>Collections</a></li>
          <li className="py-2"><a href="#contact" className="block hover:text-[#FF0000] transition-colors duration-300" onClick={(e) => handleNavClick(e, "contact")}>Contact</a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
