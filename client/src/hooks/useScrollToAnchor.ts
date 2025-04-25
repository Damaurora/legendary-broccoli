import { useEffect } from "react";
import { useLocation } from "wouter";

export const useScrollToAnchor = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.includes("#")) {
      const elementId = location.split("#")[1];
      const element = document.getElementById(elementId);
      
      if (element) {
        // Scroll to the element with a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);
};