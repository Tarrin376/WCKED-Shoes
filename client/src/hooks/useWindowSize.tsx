import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(0);

  const updateWindowSize = () => {
    const size = window.innerWidth;
    setWindowSize(size);
  }

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize);
    updateWindowSize();
    
    return () => {
      window.removeEventListener('resize', updateWindowSize);
    }
  }, []);

  return windowSize;
};