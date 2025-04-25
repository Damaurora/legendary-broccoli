import { useState, useEffect } from "react";

// Hook to detect if the viewport is mobile size
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Detect on initial load
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener("resize", checkMobile);
    
    // Clean up
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
  
  return isMobile;
}