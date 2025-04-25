import { useCallback } from "react";

export const useScrollToAnchor = () => {
  const scrollToAnchor = useCallback((id: string) => {
    const element = document.getElementById(id);
    
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjust for header height
        behavior: 'smooth'
      });
    }
  }, []);

  return scrollToAnchor;
};
